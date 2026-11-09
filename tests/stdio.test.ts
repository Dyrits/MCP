import { expect, test } from "bun:test";
import { mkdtemp, mkdir, readFile, writeFile, cp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

test("stdio protocol lists schemas, validates input, creates a fixture user and renders a prompt", async () => {
  const root = resolve(import.meta.dir, "..");
  const scratch = await mkdtemp(join(tmpdir(), "mcp-protocol-"));
  await mkdir(join(scratch, "data"));
  await writeFile(join(scratch, "data/users.json"), "[]");
  await cp(join(root, "server.ts"), join(scratch, "server.ts"));
  await Bun.$`ln -s ${join(root, "node_modules")} ${join(scratch, "node_modules")}`;
  const original = await readFile(join(root, "data/users.json"));
  const client = new Client({ name: "regression-fixture", version: "1.0.0" });
  const transport = new StdioClientTransport({ command: process.execPath, args: [join(scratch, "server.ts")], cwd: scratch });
  try {
    await client.connect(transport);
    const tools = await client.listTools();
    const tool = tools.tools.find(t => t.name === "create-user")!;
    expect(tool.inputSchema.required?.sort()).toEqual(["address", "email", "name", "phone"]);
    const invalid = await client.callTool({ name: "create-user", arguments: { name: 123 } });
    expect(invalid.isError).toBe(true);
    expect(JSON.parse(await readFile(join(scratch, "data/users.json"), "utf8"))).toEqual([]);
    const input = { name: "Fixture User", email: "fixture@example.invalid", address: "Test address", phone: "not-a-real-phone" };
    const result = await client.callTool({ name: "create-user", arguments: input });
    expect(result.isError).not.toBe(true);
    const users = JSON.parse(await readFile(join(scratch, "data/users.json"), "utf8"));
    expect(users).toHaveLength(1);
    expect(users[0]).toMatchObject(input);
    expect(users[0].id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    const prompts = await client.listPrompts();
    expect(prompts.prompts.some(p => p.name === "generate-random-user")).toBe(true);
    const prompt = await client.getPrompt({ name: "generate-random-user", arguments: { name: "Fixture User" } });
    expect(prompt.messages[0].content).toMatchObject({ type: "text", text: expect.stringContaining("Fixture User") });
    expect(await readFile(join(root, "data/users.json"))).toEqual(original);
  } finally {
    await client.close();
    await rm(scratch, { recursive: true, force: true });
  }
}, 10000);

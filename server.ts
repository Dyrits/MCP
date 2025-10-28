import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
    name: "mcp",
    version: "1.0.0",
});

type User = {
    id: string;
    address: string;
    email: string;
    name: string;
    phone: string;
};

server.registerTool(
    "create-user",
    {
        description: "Create and add a new user in the data file",
        inputSchema: {
            address: z.string(),
            email: z.string(),
            name: z.string(),
            phone: z.string(),
        },
        title: "Create a new user",
    },
    async (input) => {
        try {
            const { id } = await user.create(input as Omit<User, "id">);
            return { content: [{ text: `A new user with ${id} was created and added to the data file.`, type: "text" }] };
        } catch (_error) {
            return { content: [{ text: "Failed to create an add a new user in the data file.", type: "text" }] };
        }
    },
);

server.registerPrompt(
    "generate-random-user",
    {
        argsSchema: {
            name: z.string(),
        },
        description: "Generate a random user based on a given name",
        title: "Register a random user",
    },
    (input) => {
        return {
            messages: [
                {
                    content:
                        {
                            text: `Generate a fake user with the name ${input.name}. The user should have a realistic email, address and phone number.`,
                            type: "text",
                        },
                    role: 'user',
                },
            ],
        };
    },
);

const user = {
    async create(payload: Omit<User, "id">) {
        const users: User[] = await import("./data/users.json", { with: { type: "json" } }).then((module) => module.default);
        const user = { id: crypto.randomUUID(), ...payload };
        users.push(user);
        await Bun.write("./data/users.json", JSON.stringify(users, null, 2));
        return user;
    },
};

async function run() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
}

run().catch(console.error);

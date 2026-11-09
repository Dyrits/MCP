# MCP

A Model Context Protocol server built with the MCP TypeScript SDK, running on Bun over stdio.

## About The Project

A small MCP server exposing one tool and one prompt:

- **Tool `create-user`** - create and add a new user (name, email, address, phone) to the data file.
- **Prompt `generate-random-user`** - generate a fake user with a realistic email, address and phone number from a given name.

### Built With

- [Model Context Protocol TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk) + zod
- [Bun](https://bun.sh) 1.4.4 (runtime)
- Biome (lint and format)

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) 1.4.4
- Node.js 26 LTS for the optional Inspector developer tools

### Installation

```sh
bun install --frozen-lockfile
```

### Usage

```sh
bun run server.ts    # start the server
bun run watch        # restart on changes
bun run hot          # hot-reload on changes
bun run inspect      # open the MCP inspector
bun run check        # lint and format with Biome
bun run typecheck    # TypeScript validation
bun test             # isolated stdio protocol regression test
bun run inspect:cli  # list tools through Inspector CLI
```

### Validation and limits

Zod 4.6.6 or later is used for patched validation. A scoped override keeps the SDK on the same Zod version, avoiding incompatible duplicated schema types. Inspector 2 replaces the older Inspector development tool. The web command uses an in-memory secret store, so developer-tool auth is not saved as an unencrypted local file when no OS keychain is available. The server source and its JSON data are unchanged by this dependency update.

The stdio test starts a copy of the server with a temporary fixture data file. It checks tool discovery, generated schema, rejected invalid input, UUID creation, persisted fixture data and prompt rendering. It never changes the repository's user file or invokes an external AI service. Inspector's CLI is also checked against this server.

This is a local learning server. The file store has no concurrent-write protection, and fields are strings rather than validated email/phone formats. Prompt generation returns text; it does not create a user or prove AI-generated output quality. Inspector's blocked Bun postinstall is a no-op when installed under `node_modules`; no script-trust exception is required.

## License

No license file is present in this repository.

## Contact

Dyrits - https://github.com/Dyrits

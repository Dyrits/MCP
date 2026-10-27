# MCP

An exploratory Model Context Protocol server built with the MCP TypeScript SDK, running on Bun over stdio.

## About The Project

A small MCP server exposing one tool and one prompt:

- **Tool `create-user`** - create and add a new user (name, email, address, phone) to the data file.
- **Prompt `generate-random-user`** - generate a fake user with a realistic email, address and phone number from a given name.

### Built With

- [Model Context Protocol TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk) + zod
- [Bun](https://bun.sh) (runtime)
- Biome (lint and format)

## Getting Started

### Prerequisites

- [Bun](https://bun.sh)

### Installation

```sh
bun install
```

### Usage

```sh
bun run server.ts    # start the server
bun run watch        # restart on changes
bun run hot          # hot-reload on changes
bun run inspect      # open the MCP inspector
bun run check        # lint and format with Biome
```

## License

No license file is present in this repository.

## Contact

Dyrits - https://github.com/Dyrits

---
title: Contribution Path
sidebar_position: 1
description: Choose where to contribute to Tenon language support and find the corresponding code and contracts.
---

# Contribute SDKs and scaffolds

Help plugin authors build and run Tenon plugins in their language of choice. Contributions can improve an existing SDK or tool, or add support for another language.

If you are building a connector with an existing SDK, start with [Develop a Plugin](/tenon/docs/development/develop/overview/).

## Choose an area

| Area | Contributor goal | Start here |
| --- | --- | --- |
| SDK | Provide a clear plugin API with consistent lifecycle and delivery behavior | [SDK Development](/tenon/docs/development/contribute/implementation-contract/) |
| IPC | Make the language implementation communicate reliably with the Runner | [IPC Integration](/tenon/docs/development/contribute/ipc/) |
| Scaffolds and packaging | Generate a working project and turn it into an installable bundle | [Scaffold & Packaging Tools](/tenon/docs/development/contribute/scaffolds/) |
| Verification | Demonstrate that the change works through a real Runner | [Verify & Submit](/tenon/docs/development/contribute/verification/) |

## Add a language

1. Check the existing implementations and discuss the proposed language support with the project.
2. Establish IPC interoperability before building the higher-level SDK API.
3. Provide a scaffold and bundling path for Source, Sink, and combined plugins.
4. Verify the generated plugins through installation, data flow, failure, and shutdown.

The [Tenon repository](https://github.com/apache/bifromq-tenon/blob/21452dc53be3491567dbe9958294e34bf0fc79f5/README.md) contains the implementations. The [SDK contract](https://github.com/apache/bifromq-tenon/blob/21452dc53be3491567dbe9958294e34bf0fc79f5/sdk/SDK-impl-contract.md), [IPC contract](https://github.com/apache/bifromq-tenon/blob/21452dc53be3491567dbe9958294e34bf0fc79f5/ipc/README.md), and [contribution instructions](https://github.com/apache/bifromq-tenon/blob/21452dc53be3491567dbe9958294e34bf0fc79f5/CONTRIBUTING.md) define the detailed requirements and commands.

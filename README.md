# Apache BifroMQ (Incubating) Documentation

Apache BifroMQ is currently undergoing incubation at the Apache Software Foundation.

This repository contains the documentation and blog for [Apache BifroMQ](https://bifromq.apache.org/).
The website is built with [Docusaurus 3](https://docusaurus.io/), a modern static site generator.

## Disclaimer

Apache BifroMQ is an effort undergoing incubation at The Apache Software Foundation (ASF), sponsored by the Apache Incubator. Incubation is required of all newly accepted projects until a further review indicates that the infrastructure, communications, and decision making process have stabilized in a manner consistent with other successful ASF projects. While incubation status is not necessarily a reflection of the completeness or stability of the code, it does indicate that the project has yet to be fully endorsed by the ASF.

## Getting Started

### Installation

```bash
pnpm install
pnpm start
```

A browser window will open up, pointing to the docs. Most changes are reflected instantly without rebooting.

To verify and preview a production build:

```bash
pnpm run build
pnpm run serve
```

### Tenon documentation

Tenon documentation is a separate development-only documentation instance under `/tenon/docs/development/`. User guides, API explanations, and high-level contribution guidance are authored in this repository. Review them against Tenon's schemas and runtime behavior when those change; they are not overwritten by the importer. Detailed SDK, IPC, and contribution requirements stay in the Tenon code repository and are linked from the contribution pages.

Schemas, SDK lifecycle excerpts, and the security policy are synchronized from the pinned source commit in [`tenonSource.ts`](tenonSource.ts). The site build uses checked-in copies and does not need a Tenon checkout. The importer maps source-guide links to website pages, uses the term "Tenon Document", and omits repeated incubation introductions.

When updating the pinned source checkout, regenerate and verify the copies:

```sh
pnpm sync:tenon /absolute/path/to/bifromq-tenon
pnpm sync:tenon /absolute/path/to/bifromq-tenon --check
```

The [Awesome Tenon Plugins](src/pages/tenon/plugins.md) index is a Markdown list. Plugin authors can add an entry using the template on that page. All Tenon guidance assumes that readers build and install Tenon and its plugins from source.

### Contribution Guide

This repository welcomes contributions and suggestions through [pull request](https://github.com/apache/bifromq-sites/pulls).

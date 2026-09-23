---
title: Find, Build & Install Plugins
sidebar_position: 1
description: Build a Tenon plugin from source and install its local bundle.
---

# Find, build, and install plugins

The [Awesome Tenon Plugins](/tenon/plugins/) index helps you find source repositories. It does not host plugin binaries or install anything into a Runner. Read each plugin's compatibility statement and build instructions.

For a plugin in the Tenon checkout, build the package with its standard tool:

```sh
cargo tenon bundle --locked --manifest-path path/to/plugin/Cargo.toml
```

Install the reported local archive:

```sh
curl --fail -X POST http://127.0.0.1:18080/plugins \
  -H 'Content-Type: application/vnd.apache.tenon.plugin+tar+gzip' \
  --data-binary @/absolute/path/to/bundle.tar.gz
```

Then use the manifest's exact Program identity in a Tenon Document. An identical installation is idempotent; different bytes under the same identity conflict. The Runner rejects packages that do not declare the current platform or required interface.

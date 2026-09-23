---
title: Build & Install from Source
description: Build and install the Tenon Runner and plugin bundling tool from source.
---

Tenon provides two command-line tools: `tenon` runs pipelines, and `cargo tenon` builds and packages Rust plugins.

## Get the source

```sh
git clone https://github.com/apache/bifromq-tenon.git
cd bifromq-tenon
```

## Build and install the Runner

From the repository root:

```sh
cargo install --path . --bin tenon --locked
```

Cargo compiles an optimized binary and installs `tenon` into its installation directory, normally `$HOME/.cargo/bin`. Ensure that directory is on your `PATH`:

```sh
export PATH="$HOME/.cargo/bin:$PATH"
command -v tenon
```

The last command prints the installed executable's location.

## Build and install the plugin bundling tool

From the same repository root:

```sh
cargo install --path sdk/rust/cargo-tenon --locked
cargo tenon --help
```

`cargo tenon bundle` compiles a Rust plugin, validates its package contents, and creates an archive that can be installed into a Runner.

To configure and start the installed Runner, see [Run & Manage Tenon](/tenon/docs/development/user-guide/operations/). Platform requirements are listed in [Build Compatibility](/tenon/docs/development/reference/compatibility/).

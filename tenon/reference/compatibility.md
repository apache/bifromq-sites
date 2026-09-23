---
title: Build Compatibility
sidebar_position: 1
description: Check the operating-system and toolchain requirements for a local Tenon build.
---

# Build compatibility

Tenon is built from source with the toolchains checked into the repository. Use the platform and architecture supported by the Runner and by every plugin you install.

## Operating systems

The supported native targets are Linux and macOS on x86-64 and ARM64. On macOS, use version 14.4 or later. Plugins must be built for the same operating-system and architecture combination as the Runner that starts them.

## Toolchains

- Rust tooling comes from `rustup` and the repository's `rust-toolchain.toml`.
- Rust commands use the repository's Cargo lockfiles.
- Java plugins use the Maven wrapper and the Java version declared by the SDK build.
- Native builds require a C compiler and linker, Git, curl, and Python 3.

## Contract versions

The examples use Tenon Document `specVersion` `"1"` and identify installed Programs with `programName` plus `exactVersion`. A Tenon Document version and a Program version are separate contracts: update the Tenon Document when its schema changes, and update the plugin identity when its package contract changes.

Follow the [verification guidance](/tenon/docs/development/contribute/verification/) and the repository instructions it links to after changing an SDK, scaffold, Runner, or plugin. Record the platform and toolchain used for every compatibility result.

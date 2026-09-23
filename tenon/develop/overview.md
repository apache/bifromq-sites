---
title: Develop a Plugin
sidebar_position: 1
description: Choose an interface and build an installable Tenon plugin.
---

# Develop a plugin

Plugin authors own the external client, payload meaning, and upstream acknowledgement policy. The SDK owns the Tenon control connection, bounded queues, lifecycle handoff, and completion codes.

Choose one interface:

- **Source** brings records into a Flow.
- **Sink** receives Lua output and reports external delivery.
- **Source-and-sink** shares one process and configuration for both interfaces.

Use the [Rust](/tenon/docs/development/develop/rust/) or [Java](/tenon/docs/development/develop/java/) source-build path. Define a proto3 payload and `config.schema.json`, build the package with the standard bundler, install it into a Runner, and verify actual downstream behavior. A successful process start is only one part of the check.

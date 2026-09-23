---
title: What is Tenon?
sidebar_position: 1
description: Understand the Runner, Tenon Documents, Programs, and Flows before building a pipeline.
---

import {TenonOverviewDiagram} from '@site/src/components/TenonDiagrams';

# What is Tenon?

Tenon is a standalone runner for connecting systems with typed Source and Sink plugins. A user describes one pipeline in a Tenon Document. The Runner reads that Tenon Document, starts the requested plugin Programs, and applies the Lua processing that connects Sources to Sinks.

<TenonOverviewDiagram />

## The four pieces

- **User** — writes or updates a Tenon Document and checks the running Pipeline.
- **Tenon Document** — declares plugin Instances, Flows, Lua processing, and delivery settings as JSON.
- **Tenon Runner** — validates Tenon Documents, starts plugin processes, manages queues, and exposes the HTTP API and diagnostics.
- **Plugin Programs** — provide Source and Sink interfaces for BifroMQ, files, databases, services, or other systems. A Program can be used through one or more configured Instances.

## How a pipeline works

A Flow binds one Source Instance to Lua processing and one or more Sink Instances:

1. A Source plugin receives a record from an external system.
2. The Runner delivers the record to one Lua channel.
3. Lua can filter, transform, route, or build a new payload.
4. Sink plugins write the emitted payload to their external systems.

The Tenon Document being saved, the Pipeline being applied, and a Sink reporting successful delivery are separate events. Check the corresponding API response or diagnostic signal for the result you need.

## Choose a next step

- [Build & Install from Source](/tenon/docs/development/get-started/build/) to build the Runner and local tools.
- [Run your first pipeline](/tenon/docs/development/get-started/first-pipeline/) with the Dummy Source and Stdout Sink.
- [Connect BifroMQ](/tenon/docs/development/get-started/connect-bifromq/) through the MQTT plugin.
- [Develop a plugin](/tenon/docs/development/develop/overview/) with the Rust or Java SDK.

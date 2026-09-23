---
title: Configuration & Payloads
sidebar_position: 4
description: Keep plugin configuration, manifest metadata, and protobuf payloads aligned.
---

# Configuration and payloads

`config.schema.json` describes the complete Instance configuration. The Runner validates it before calling the SDK factory; the plugin still checks requirements that require contacting an external system.

Define Source and Sink payloads in proto3. A Source package contains a `SourceRecordPayload` root, a Sink contains a `SinkRecordPayload` root, and a combined package contains both. The descriptor, schema, manifest, executable, and README must describe the same Program.

The Program identity is the exact `programName` plus `exactVersion`. A semantic payload or behavior change needs a new exact version. Set the manifest display name and description explicitly; they are user-facing metadata and do not replace Program identity.

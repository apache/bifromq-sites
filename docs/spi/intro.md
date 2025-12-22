---
id: intro
title: "SPI Overview"
sidebar_position: 0
---

Service Provider Interfaces (SPIs) are extension points that let you customize BifroMQ’s own runtime behavior. They share the same process and execution context as BifroMQ, and are intended for shaping core behaviors rather than integrating external systems.

:::note Important

- SPIs run inside BifroMQ’s process and share its execution context; a deep understanding of internal workflows is required to avoid stability and performance regressions.
- ABI compatibility is **not guaranteed across releases**, and these interfaces are **not published to Maven**. Keep your SPI implementation version-aligned with the BifroMQ runtime you deploy.
- SPIs may change or new ones may appear as the project evolves; verify compatibility before upgrading.
  :::

## When to use SPI vs. Plugin

- **SPI**: Extend/Customize BifroMQ itself (e.g., define custom MQTT message UserProperties or add workload-specific balancing strategies) via Java’s SPI mechanism. Runs in-process and shares BifroMQ’s context.
- **Plugin**: Integrate BifroMQ with external systems (e.g., call an external authentication/authorization service). Plugins run in their own ClassLoader context and are relatively isolated.

## SPI Development Tips

Consult the official Java SPI documentation to understand how discovery and registration work; the following tips highlight BifroMQ-specific considerations:

- Fetch the BifroMQ source for the exact runtime version you will deploy; SPI interfaces are not published to Maven Central.
- Keep your SPI project and the BifroMQ source in a single IDE workspace so you can reference the SPI modules directly without relying on published artifacts.
- Some SPIs only use the first discovered implementation—deploy a single implementation for those to avoid unexpected behavior. Others can be selected explicitly via configuration, which avoids conflicts.
- Run and debug with the broker in that workspace (same version), adding logs/metrics to validate behavior.
- Rebuild and retest whenever you upgrade BifroMQ, since interfaces may change across releases.

## Available SPIs

- `base-env-provider-spi`: Provide customized thread environment/context.
- `base-kv-local-engine-spi`: Customize the local KV engine used by base-kv.
- `base-kv-split-hinter-spi`: Influence KV partitioning/splitting strategies.
- `base-kv-store-balancer-spi`: Introduce custom balancing strategies.
- `bifromq-dist-worker-spi`: Introduce custom balancers to dist worker cluster.
- `bifromq-inbox-store-spi`: Introduce custom balancers to inbox store cluster.
- `bifromq-retain-store-spi`: Introduce custom balancers to retain store cluster.
- `bifromq-mqtt-server-spi`: Extend MQTT server behaviors (e.g., customized user properties hooks).

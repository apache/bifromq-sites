---
id: intro
sidebar_position: 0
title: "API Overview"
---

BifroMQ incorporates built-in API capabilities, allowing for operations such as disconnecting client connections, querying session status, publishing messages, managing subscriptions and cluster state inspection. These features enable the integration of BifroMQ's management operations into custom management workflows.

## Deployment

By default, the API service functionality is automatically enabled on every BifroMQ service node using port 8091. For more setting options, refer to the [configuration file](../../admin_guide/configuration/config_file_manual.md). API requests can be sent to any node; high availability comes from running the API Server as an overlay cluster with front-end L7 load balancing (see [API Server load balancing](../../cluster/loadbalance/apiserver.md)).

## Swagger generation

The Swagger definition is generated automatically during build:

- `mvn -pl bifromq-apiserver -am package` produces `bifromq-apiserver/target/swagger/BifroMQ-API.yaml`.
- The build copies it to the aggregated output at `target/output/site/swagger/BifroMQ-API.yaml`.

See the [OpenAPI reference](./openapi.md) to view the generated spec inline.

---
id: intro
sidebar_position: 0
title: "API Overview"
---

BifroMQ incorporates built-in API capabilities, allowing for operations such as disconnecting client connections, querying session status, publishing messages, and managing subscriptions. These features enable the integration of BifroMQ's management operations into custom management workflows.

## Deployment

By default, the API service functionality is automatically enabled on every BifroMQ service node using port 8091, For more setting options, refer to the [configuration file](../../admin_guide/configuration/config_file_manual.md). API requests can be sent to any node, ensuring high availability of the API capabilities in a standard deployment setup.

```mermaid
graph TD

  Nginx(Nginx)

  subgraph "BifroMQ"
    BifroMQ1(BifroMQ<br>API)
  end

  subgraph "BifroMQ"
    BifroMQ2(BifroMQ<br>API)
  end

  subgraph "BifroMQ"
    BifroMQ3(BifroMQ<br>API)
  end

  Nginx --> BifroMQ1
  Nginx --> BifroMQ2
  Nginx --> BifroMQ3
```

The diagram above illustrates a common deployment scenario: distributing API requests using a front-end load balancer, such as Nginx.

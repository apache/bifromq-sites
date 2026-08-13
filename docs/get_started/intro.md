---
id: intro
sidebar_position: 0
title: "Introduction"
---

BifroMQ (Incubating) is a Java-based, high-performance, distributed MQTT broker implementation that seamlessly integrates native multi-tenancy support. It is designed to facilitate the building of large-scale IoT device connections and messaging
systems.

## Origin of the Name

`BifroMQ` derives its name from the Norse mythological <span class="bifrost-rainbow">Bifröst</span>, a rainbow bridge that connects Midgard (the realm of humans) and Asgard (the domain of gods). Like Bifröst, BifroMQ serves as a flexible and sturdy bridge, linking different
systems or applications to enable communication through message exchange. This aligns with the core function of MQTT middleware, which is to manage and accelerate message delivery in distributed systems.

The robustness of Bifröst symbolizes BifroMQ's stability and reliability, while its flexibility signifies BifroMQ's scalability and adaptability. In a nutshell, "BifroMQ" epitomizes resilient, adaptable MQTT middleware that interconnects
various systems or applications.

## Features List

- Full support for MQTT 3.1, 3.1.1 and 5.0 features over TCP, TLS, WS, WSS.
- Native support for multi-tenancy, resource sharing, and workload isolation.
- Built-in distributed storage engine optimized for MQTT workloads, with no third-party middleware dependencies.
- Extension mechanism for supporting:
  - Authentication/Authorization.
  - Tenant-level Client Balancing.
  - Tenant-level Resource Throttling.
  - Tenant-level Runtime Setting.
  - Event & Monitoring.

## Community

#### **Issue Tracker**

We use GitHub [Issues](https://github.com/apache/bifromq/issues) for tracking requests and bugs. Feel free to open an issue if you have any questions or problems.

#### **Mailing List**

Apache mailing lists are the project's public channels for asynchronous discussion, announcements, proposals, and decisions. Please choose the appropriate list for your needs:

* **`commits@bifromq.apache.org`** – Receives automated commit logs and code changes.
* **`dev@bifromq.apache.org`** – Used for general development discussions, proposals, questions, and community communication.

Follow these [steps](../../../community/#how-to-subscribe) to subscribe or unsubscribe.

#### **Discord**

[Discord](https://discord.gg/Pfs3QRadRB) is available as a supplementary real-time chat channel. Project proposals and decisions must be discussed or summarized on the public dev mailing list. Please follow the Apache Code of Conduct in every project channel.

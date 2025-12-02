---
sidebar_position: 3
title: "Frequently Asked Questions"
---

## What versions of the MQTT protocol are supported by BifroMQ?

BifroMQ provides comprehensive support for the following MQTT protocol versions: v3.1, v3.1.1, and v5.0. This versatility ensures that BifroMQ can accommodate a wide range of IoT devices and applications, adhering to different protocol standards. Additionally, BifroMQ allows for dynamic control of protocol capabilities at the tenant level during runtime, offering tailored connectivity options to meet specific tenant requirements.

## What are the Java version requirements for BifroMQ?

The Java version requirements for BifroMQ can be divided into two aspects:

- **BifroMQ runtime environment**: BifroMQ itself requires JDK 17 or higher for operation.
- **BifroMQ plugin development**: For developing BifroMQ plugins, there's no enforced requirement for a specific Java language version or JDK version. However, plugin developers need to ensure their plugins function properly in higher Java environments. To prevent compatibility issues, we suggest keeping the plugin's runtime environment consistent with BifroMQ's.

## Does BifroMQ include a built-in rule engine?

Unlike other products or projects providing MQTT protocol capabilities, BifroMQ's primary aim is to serve as a high-performance, multi-tenant, distributed middleware implementing the standard MQTT protocol. "Rule engines" are not part of the MQTT protocol specification and hence are not included in BifroMQ.  
BifroMQ focuses on standard integrations with upstream and downstream systems, while “rule engines” represent additional functionality that can be implemented externally. We welcome contributions to a community-driven side project for rule engine implementations,allowing developers to build and share rule engine integrations with BifroMQ.

## How to use BifroMQ for data integration?

Integration with downstream systems should follow a **decoupled** and **dependency-inverted** approach. We recommend leveraging MQTT 5.0’s built-in shared subscription feature, which allows downstream consumers to control routing rules directly.

To bring this capability to earlier clients, BifroMQ has **backported shared subscriptions** into the MQTT 3.1.1 protocol, ensuring a consistent, standardized integration model across versions.

Additionally, we provide an **ordered shared subscription** mode for use cases that require strict message ordering. See the documentation for details: [Ordered Shared Subscriptions](../user_guide/basic/shared_sub.md).

## What data persistence is BifroMQ's built-in storage engine primarily used for?

BifroMQ's built-in storage engine is mainly used for the persistence of SessionState required by the MQTT protocol to be persistent and Retain Topic messages. This helps prevent loss of session state during a broker restart or crash. It's noteworthy that the persistence engine is not directly related to the message's QoS in most cases. For instance, when an MQTT connection starts a persistent session, offline QoS0 subscription messages will still be persisted until the session is restored and pushing is completed.

## Why doesn't BifroMQ have a management Web interface/CLI?

BifroMQ is designed as a core middleware component to be embedded within broader business systems. Management logic is therefore exposed for integration rather than provided as a standalone Web UI or CLI. The project itself does not include built-in management consoles; instead, it offers the following APIs and plugins to enable external systems to implement management capabilities:

- **[API](../user_guide/api/intro.md)**: Broker-side control logic, such as forcing disconnection.
- **[Metrics](../admin_guide/observability/metrics/intro.md)**: Runtime metrics that can be consumed by existing monitoring systems.
- **[AuthProvider Plugin](../plugin/auth_provider)**: Enable customized authentication and authorizaiton
- **[ClientBalancer Plugin](../plugin/client_balancer)**: Implements an active client‐balancing strategy, dynamically distributing incoming client connections across broker instances to ensure even load distribution.
- **[EventCollector Plugin](../plugin/event_collector)**: Emits operational events for custom Event Sourcing logic (e.g., connection counts, online/offline).
- **[ResourceThrottler Plugin](../plugin/resource_throttler)**: Controls tenant-level resource usage.
- **[SettingProvider Plugin](../plugin/setting_provider/intro)**: Adjusts tenant-level runtime settings.

As with rule-engine support, we welcome community-driven side projects to build Web UIs, CLI tools, or other management interfaces leveraging these integration points.

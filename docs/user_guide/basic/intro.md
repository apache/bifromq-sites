---
id: intro
sidebar_position: 0
title: "MQTT Basic Features Highlights"
---

BifroMQ provides extensive MQTT protocol support for IoT applications and services, demonstrated through compatibility with different protocol versions, customized configurations for tenants, dynamic adjustment capabilities, message interchangeability across protocol versions, and support for shared subscriptions in specific protocol versions.

- **Comprehensive Protocol Support**: BifroMQ supports MQTT versions 3.1, 3.1.1, and 5.0, compatible with all third-party clients that utilize these protocol versions. This ensures users can seamlessly integrate BifroMQ into their existing systems, offering a smooth experience for developers and administrators.

- **Tenant-Specific Configurations**: BifroMQ allows for protocol-related [settings](../../plugin/setting_provider/1_tenantsetting.md) to be customized for each tenant, catering to the specific needs and application scenarios of each tenant.

- **Dynamic Adjustment via Plugins**: BifroMQ supports dynamic adjustments of protocol settings through the use of [setting provider plugins](../../plugin/setting_provider/intro.mdx), offering flexibility and adaptability in rapidly changing business operations.

- **Interoperability Between Protocol Versions**: BifroMQ supports message exchange between sessions established with different MQTT protocol versions within the same tenant, ensuring seamless communication between devices and clients on different protocol versions.

- **Shared Subscriptions Support**: BifroMQ provides [shared subscriptions](shared_sub.md) for MQTT versions 3.1 and 3.1.1, allowing multiple clients to subscribe to the same topic and balance the message load among them, improving the efficiency and reliability of message processing.

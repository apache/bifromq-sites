---
sidebar_position: 2
title: "Tenant-level Settings"
---

Tenant-level settings allow for detailed control of BifroMQ's functionality and performance characteristics. Each setting can be adjusted per tenant, enabling customized behavior according to the specific requirements and preferences of
each
tenant. This granularity ensures that BifroMQ can cater to a wide variety of use cases and operational environments.

## Initial Value Adjustment

Initial values for these settings can be adjusted through JVM startup parameters. This allows for system-wide default adjustments before runtime customization per tenant. For example, to disable MQTT version 3.1 client connections by
default, you can start the JVM with the parameter `-DMQTT3Enabled=false`. This level of control provides the flexibility to optimize the broker's behavior based on the deployment context and operational requirements.

## Customization through Setting Provider Plugins

The management responsibility of tenant settings is inverted, meaning it is implemented by the business side. Customization and runtime adjustment of these settings are achieved through the development and integration of custom Setting
Provider plugins. This approach allows businesses to dynamically adjust settings in response to changing operational conditions, regulatory requirements, or specific business logic, enhancing the adaptability and scalability of BifroMQ
deployments.

## Supported Settings

| Name                              | Type    | Initial Value       | Description                                                                                         |
|-----------------------------------|---------|---------------------|-----------------------------------------------------------------------------------------------------|
| `MQTT3Enabled`                    | Boolean | true                | Enables or disables MQTT v3.1 support.                                                              |
| `MQTT4Enabled`                    | Boolean | true                | Enables or disables MQTT v3.1.1 support.                                                            |
| `MQTT5Enabled`                    | Boolean | true                | Enables or disables MQTT v5.0 support.                                                              |
| `NoLWTWhenServerShuttingDown`     | Boolean | true                | Suppresses Last Will delivery when the server is shutting down.                                     |
| `DebugModeEnabled`                | Boolean | false               | Enables or disables debug mode.                                                                     |
| `ForceTransient`                  | Boolean | false               | Forces transient mode for connections.                                                              |
| `ByPassPermCheckError`            | Boolean | true                | Bypasses permission check errors.                                                                   |
| `PayloadFormatValidationEnabled`  | Boolean | true                | Enables or disables payload format validation.                                                      |
| `RetainEnabled`                   | Boolean | true                | Enables or disables message retain feature.                                                         |
| `WildcardSubscriptionEnabled`     | Boolean | true                | Enables or disables wildcard subscriptions.                                                         |
| `SubscriptionIdentifierEnabled`   | Boolean | true                | Enables or disables subscription identifiers.                                                       |
| `SharedSubscriptionEnabled`       | Boolean | true                | Enables or disables shared subscriptions.                                                           |
| `MaximumQoS`                      | Integer | 2                   | Maximum QoS level. Valid values: 0, 1, 2.                                                           |
| `MaxTopicLevelLength`             | Integer | 40                  | Maximum length of each topic level (> 0).                                                           |
| `MaxTopicLevels`                  | Integer | 16                  | Maximum number of topic levels (> 0).                                                               |
| `MaxTopicLength`                  | Integer | 255                 | Maximum total topic length (< 65536).                                                               |
| `MaxTopicAlias`                   | Integer | 10                  | Maximum number of topic aliases (< 65536).                                                          |
| `MaxSharedGroupMembers`           | Integer | 200                 | Maximum members in a shared subscription group (> 0).                                               |
| `MaxTopicFiltersPerInbox`         | Integer | 100                 | Maximum topic filters per inbox (> 0).                                                              |
| `MsgPubPerSec`                    | Integer | 200                 | Maximum publishes per second per connection (> 0, ≤ 1000).                                          |
| `ReceivingMaximum`                | Integer | 200                 | Maximum in-flight QoS 1/2 messages per connection (> 0, ≤ 65535).                                   |
| `InBoundBandWidth`                | Long    | 512 * 1024L         | Maximum inbound bandwidth per connection in bytes (≥ 0).                                            |
| `OutBoundBandWidth`               | Long    | 512 * 1024L         | Maximum outbound bandwidth per connection in bytes (≥ 0).                                           |
| `MaxLastWillBytes`                | Integer | 128                 | Maximum Last Will payload size in bytes (> 0, ≤ 250 * 1024 * 1024).                                 |
| `MaxUserPayloadBytes`             | Integer | 256 * 1024          | Maximum user payload size in bytes (> 0, ≤ 256 * 1024 * 1024).                                      |
| `MinSendPerSec`                   | Integer | 8                   | Minimum allowed publishes per second per connection (> 0).                                          |
| `MaxResendTimes`                  | Integer | 3                   | Maximum resend attempts for QoS 1/2 messages (≥ 0).                                                 |
| `ResendTimeoutSeconds`            | Integer | 10                  | Timeout in seconds before a message is considered for resend (> 0).                                 |
| `MaxTopicFiltersPerSub`           | Integer | 10                  | Maximum topic filters per subscription (> 0, ≤ 100).                                                |
| `MaxGroupFanout`                  | Integer | 100                 | Maximum fanout for group deliveries (> 0).                                                          |
| `MaxPersistentFanout`             | Integer | Integer.MAX_VALUE   | Maximum persistent fanout concurrency (> 0).                                                        |
| `MaxPersistentFanoutBytes`        | Long    | Long.MAX_VALUE      | Maximum bytes allowed for persistent fanout (> 0).                                                  |
| `MaxSessionExpirySeconds`         | Integer | 24 * 60 * 60        | Maximum session expiry time in seconds (> 0, ≤ 0xFFFFFFFF).                                         |
| `MinSessionExpirySeconds`         | Integer | 60                  | Minimum session expiry time in seconds (> 0, ≤ MaxSessionExpirySeconds).                            |
| `MinKeepAliveSeconds`             | Integer | 60                  | Minimum keep alive in seconds (> 0, < 65535).                                                       |
| `SessionInboxSize`                | Integer | 1000                | Maximum size of session inbox (> 0, ≤ 65535).                                                       |
| `QoS0DropOldest`                  | Boolean | false               | Whether to drop the oldest QoS 0 messages first.                                                    |
| `RetainMessageMatchLimit`         | Integer | 10                  | Limit for retained message matches (≥ 0).                                                           |

---
sidebar_position: 2
title: "System Properties"
---

Before adjusting system properties in BifroMQ, it's necessary to have a thorough understanding of its internal mechanisms, as inappropriate modifications can lead to unexpected behavior. Additionally, these system properties are closely
linked with BifroMQ's internal implementation and may not be compatible across different versions. System properties can be set via JVM startup parameters, allowing for flexible customization of BifroMQ's behavior.
For example, setting `-Dmqtt_utf8_sanity_check=false` disables the check for MQTT protocol-defined UTF8 string formats.

Below is a table listing the system properties supported by the current version:

| Property Key                               | Default Value         | Description                                                                                                                                |
| ------------------------------------------ | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `client_redirect_check_interval_seconds`   | 600                   | The client redirection check interval in seconds.                                                                                          |
| `cluster_domain_resolve_timeout_seconds`   | 120L                  | Timeout for resolving the cluster domain to discover seed nodes.                                                                           |
| `control_plane_burst_latency_ms`           | 5000L                 | The max latency in milliseconds tolerated for the control plane burst.                                                                     |
| `data_plane_burst_latency_ms`              | 5000L                 | The max latency in milliseconds tolerated for the data plane burst.                                                                        |
| `dist_server_dist_worker_call_queues`      | CPU cores             | Number of dist worker call queues.                                                                                                         |
| `dist_worker_inline_fanout_threshold`      | 1000                  | The threshold of the fanout to be executed in the calling thread.                                                                          |
| `dist_worker_fanout_parallelism`           | Max(2, CPU cores / 8) | Parallelism level for fanout operations.                                                                                                   |
| `dist_worker_cache_fanout_check_seconds`   | 5                     | Interval seconds for checking cached routes against fanout related settings.                                                               |
| `dist_worker_match_parallelism`            | Max(2, CPU cores / 2) | Parallelism level for match operations.                                                                                                    |
| `dist_worker_max_cached_subs_per_tenant`   | 200_000L              | Maximum cached subscriptions per tenant.                                                                                                   |
| `dist_worker_topic_match_expiry_seconds`   | 60                    | Expiry time in seconds for topic matches.                                                                                                  |
| `inbox_check_queues_per_range`             | 1                     | Number of check queues per range.                                                                                                          |
| `inbox_deliverers`                         | 100                   | Number of inbox deliverers.                                                                                                                |
| `inbox_fetch_queues_per_range`             | Max(1, CPU cores / 4) | Number of fetch queues per range.                                                                                                          |
| `inbox_meta_cache_expiry_second`           | 300                   | Timeout in seconds before cached inbox metadata expires.                                                                                   |
| `ingress_slowdown_direct_memory_usage`     | 0.8                   | Threshold for slowing down ingress traffic based on direct memory usage.                                                                   |
| `ingress_slowdown_heap_memory_usage`       | 0.9                   | Threshold for slowing down ingress traffic based on heap memory usage.                                                                     |
| `mqtt_utf8_sanity_check`                   | false                 | Enables/disables UTF8 sanity checks according to MQTT-1.5.3.                                                                               |
| `max_mqtt3_client_id_length`               | 65535                 | Maximum client ID length for MQTT 3 clients.                                                                                               |
| `max_mqtt5_client_id_length`               | 65535                 | Maximum client ID length for MQTT 5 clients.                                                                                               |
| `max_slowdown_timeout_seconds`             | 5                     | Maximum duration (in seconds) that the slowdown mechanism is allowed to operate before further backpressure protection measures are taken. |
| `mqtt_deliverers_per_server`               | CPU cores             | Number of MQTT deliverers per server.                                                                                                      |
| `persistent_session_detach_timeout_second` | 7200                  | The timeout seconds to consider persistent session is probably detached from mqtt client.                                                  |
| `session_register_num`                     | 10                    | Number of concurrent session registers.                                                                                                    |
| `maxActiveDedupChannels`                   | 1024                  | Maximum active deduplication channels per session.                                                                                         |
| `maxActiveDedupTopicsPerChannel`           | 10                    | Maximum active deduplication topics per channel.                                                                                           |

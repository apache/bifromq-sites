---
id: "intro"
sidebar_position: 0
title: "Metrics"
---

BifroMQ adopts [Micrometer](https://micrometer.io/) as its framework for metrics collection, analogous to its use of SLF4J and Logback for logging purposes. Micrometer acts as the "SLF4J for metrics" within BifroMQ, providing an easy way to collect metrics without binding users to a specific metrics backend. Instead, users are free to choose their preferred monitoring system and can direct metrics to it using BifroMQ's plugin mechanism.

## Prometheus Integration via DemoPlugin

BifroMQ offers out-of-the-box support for Prometheus through its bundled [DemoPlugin](https://github.com/apache/bifromq/blob/main/build/build-plugin-demo/src/main/java/org/apache/bifromq/demo/plugin/DemoPlugin.java) for **Demo and Testing Purpose Only**. By default the plubin exposes a Prometheus scraping endpoint (`http://<BIFROMQ_NODE_HOST>:9090/metrics`), enabling direct metrics collection by Prometheus.

## Tenant-Level Metrics for Multi-Tenancy

BifroMQ introduces a set of tenant-level [metrics](tenantmetrics.md). These metrics enable the real-time collection and aggregation of data reflecting the resource usage and activity of individual tenants. When used in combination with the [Resource Throttler](../../../plugin/resource_throttler) plugin, tenant-level metrics facilitate effective load isolation strategies.

## Advanced Diagnostics and Tuning

Beyond tenant-level insights, BifroMQ collects a broad array of internal metrics from its various functional modules. These metrics are indispensable for deep system tuning and runtime diagnostics. However, due to their close ties to BifroMQ's internal mechanisms and architecture, these deep metrics may vary between BifroMQ versions and are not guaranteed to remain consistent across updates. To avoid compatibility issues, these metrics have not been documented for general use.

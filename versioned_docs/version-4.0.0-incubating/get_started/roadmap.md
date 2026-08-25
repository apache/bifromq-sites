---
sidebar_position: 4
title: "Road Map"
---

This roadmap is organized into two categories:

- **Core BifroMQ Project**: Enhancements and new features within the main broker codebase, focusing on performance, resource efficiency, and protocol extensibility.
- **Satellite Projects**: Community-driven side projects that extend and complement the core broker with additional tooling, UIs, testing suites, and various plugin implementations.

The following lists are highlights of some directions (but not limited to):

## Core BifroMQ Project

1. **Runtime Efficiency**  
   Continuously improve runtime performance and optimize memory usage.
2. **Native Image Support**  
   Enable native image builds (e.g., GraalVM) to run BifroMQ in resource-constrained environments.
3. **Integration Extensibility**  
   Incorporate user feedback to expand additional integration and customization extension points.
4. **Storage Engine Optimization**  
   Continuously tune the built-in storage engine for different MQTT workload patterns.
5. **Efficient RPC Mechanism**  
   Explore more efficient internal RPC implementations to better handle varying message payload sizes across use cases.

## Satellite Projects

1. **Website Building**  
   Contributions of translations, corrections, and additional content are welcome.
2. **General Rule Engine**  
   A community-driven, generic MQTT broker rule engine for flexible message routing and processing.
3. **BifroMQ UI (Web & CLI)**  
   A side project to build web-based dashboards and command-line tools for managing and monitoring BifroMQ.
4. **MQTT Load Testing Suite**  
   A toolkit to simulate real-world MQTT workloads and stress-test BifroMQ deployments.
5. **Common Scenario Plugins**  
   Prebuilt plugins for typical use cases, such as database-backed authentication/authorization and event diagnostics tools.
6. **Deployment Utilities**  
   Various scripts/tools for deploying and operating in various environment, e.g. VM, Kubernetes

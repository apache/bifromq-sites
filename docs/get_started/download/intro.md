---
sidebar_position: 0
title: "Download"
---

# Download BifroMQ

BifroMQ releases consist of two parts:

1. **Binary Distributions** published via Apache's release process.
2. **Plugin Packages** published to Maven Central.

We **strongly recommend** using the versions released after BifroMQ entered the Apache Incubator. Pre-incubation distributions remain available via [GitHub Release](https://github.com/apache/bifromq/releases).

## Binary Distributions

### Apache Incubator Downloads

Official binary and source archives for incubating releases are available on the Apache mirror network:  
https://www.apache.org/dyn/closer.lua/incubator/bifromq/

Download the ZIP or TAR.GZ packages from your preferred mirror.

## Plugin Packages

Java plugin artifacts are published to Maven Central under the `org.apache.bifromq` group. Add your plugin dependencies:

```xml
<dependency>
  <groupId>org.apache.bifromq</groupId>
  <artifactId>bifromq-plugin-[NAME]</artifactId>
  <version>[BIFROMQ_VERSION]</version>
</dependency>
```

Browse all plugin packages on [Maven Central](https://search.maven.org/search?q=g:org.apache.bifromq%20AND%20a:bifromq-plugin-*)

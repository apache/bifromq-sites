---
sidebar_position: 1
title: "Docker"
---

## Prerequisites

* [Docker](https://www.docker.com/) is installed.
* You have permission to use port 1883, and the port is available. If you do not have permission, please change to the corresponding port.

## Docker Command

Run the following command, which will run Apache BifroMQ within a container as the Linux user `bifromq`.

```
docker run -d --name bifromq -p 1883:1883 apache/bifromq:4.0.0-incubating
```

## Memory Constraints

By default, upon Apache BifroMQ process initiation, it dynamically computes the relevant JVM parameters based on the physical memory of the hosting server. However, when launched within a containerized environment, it introspects the host
machine's physical memory, potentially causing conflicts with Docker or container-imposed memory constraints, consequently leading to the premature termination of the container.

To circumvent such challenges, it is advisable to proactively delimit the container's memory consumption and convey these limitations to the container runtime via environmental variables. During the startup of BifroMQ, priority is given to
the calculation of JVM parameters based on the `MEM_LIMIT` environmental variable. A specific illustration is provided below:

```
docker run -d -m 10G -e MEM_LIMIT='10737418240' --name bifromq -p 1883:1883 apache/bifromq:4.0.0-incubating
```

***Note: The unit of MEM_LIMIT is in bytes.***

Going a step further, it is possible to proactively configure the JVM heap memory and directly transmit it to the container runtime for utilization by BifroMQ. A specific illustration is provided below:

```
docker run -d -m 10G -e JVM_HEAP_OPTS='-Xms2G -Xmx4G -XX:MetaspaceSize=128m -XX:MaxMetaspaceSize=500m -XX:MaxDirectMemorySize=1G' --name bifromq -p 1883:1883 apache/bifromq:4.0.0-incubating
```

You can build an Apache BifroMQ cluster using Docker Compose on a single host for development and testing. Suppose you want to create a cluster with three nodes: node1,
node2, and node3. The directory structure should be as follows:
```
|- docker-compose.yml
|- node1
|- node2
|- node3
```
Each node should have a configuration file, it is defined as follows:
```yml
clusterConfig:
  env: "Test"
  host: bifromq-node1 # Change this to bifromq-node2 for node2 and bifromq-node3 for node3
  port: 8899
  seedEndpoints: "bifromq-node1:8899,bifromq-node2:8899,bifromq-node3:8899"
```
The `docker-compose.yml` file defines the services for the three nodes:
```yml
services:
  bifromq-node1:
    image: apache/bifromq:4.0.0-incubating
    container_name: bifromq-node1
    volumes:
      - ./node1/standalone.yml:/home/bifromq/conf/standalone.yml
    ports:
      - "1883:1883"
    environment:
      - MEM_LIMIT=10737418240 # Adjust the value according to the actual host configuration.
    networks:
      - bifromq-net

  bifromq-node2:
    image: apache/bifromq:4.0.0-incubating
    container_name: bifromq-node2
    volumes:
      - ./node2/standalone.yml:/home/bifromq/conf/standalone.yml
    ports:
      - "1884:1883"
    environment:
      - MEM_LIMIT=2147483648
    networks:
      - bifromq-net

  bifromq-node3:
    image: apache/bifromq:4.0.0-incubating
    container_name: bifromq-node3
    volumes:
      - ./node3/standalone.yml:/home/bifromq/conf/standalone.yml
    ports:
      - "1885:1883"
    environment:
      - MEM_LIMIT=2147483648
    networks:
      - bifromq-net

networks:
  bifromq-net:
    driver: bridge
```
To launch the cluster, run the following command:
```shell
docker compose up -d
```


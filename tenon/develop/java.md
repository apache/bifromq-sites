---
title: Java Plugin from Source
sidebar_position: 3
description: Build, install, and run a Java Tenon plugin using the source checkout.
---

# Build a Java plugin from source

Complete [Build and install from source](/tenon/docs/development/get-started/build/) first, then [configure and start the Runner](/tenon/docs/development/user-guide/operations/#configure-and-start). Keep it running in one terminal and run the following commands from the Tenon source checkout in another.

## Generate and build

Use the Maven wrapper, which selects the JDK and Maven versions in `sdk/java/.mvn/tenon-toolchain.properties`. Build the SDK, packaging tool, and archetype into your local Maven repository:

```sh
export TENON_ROOT="$PWD"
cd "$TENON_ROOT/sdk/java"
./mvnw --batch-mode --no-transfer-progress clean install
```

Generate a combined Source-and-sink project in a fresh directory, using the locally built archetype:

```sh
java_demo_root="$(mktemp -d "${TMPDIR:-/tmp}/tenon-java-plugin.XXXXXX")"
cd "$java_demo_root"
"$TENON_ROOT/sdk/java/mvnw" org.apache.maven.plugins:maven-archetype-plugin:3.4.1:generate -B \
  -DarchetypeGroupId=org.apache.bifromq.tenon \
  -DarchetypeArtifactId=tenon-plugin-archetype -DarchetypeVersion=0.1.0 \
  -DgroupId=com.example -DartifactId=hello-tenon -Dversion=1.0.0 \
  -Dpackage=com.example.hello -Dinterface=source-and-sink \
  -DprogramName=com.example.hello -DtenonVersion=0.1.0
cd hello-tenon
./mvnw --batch-mode --no-transfer-progress verify
```

The identity is `com.example.hello@1.0.0`. Its configuration requires `message`, a zero-based `queueIndex`, and an absolute `outputFile`. The Source sends once; the Sink appends messages to that file. The bundle includes its own fixed Java runtime.

## Install and run

Select the single bundle from this fresh build:

```sh
java_bundle="$(python3 - "$java_demo_root/hello-tenon/target" <<'PYTHON'
import pathlib, sys
bundles = list(pathlib.Path(sys.argv[1]).glob('*-tenon-plugin-*.tar.gz'))
assert len(bundles) == 1, f"Expected one native bundle, found {len(bundles)}"
print(bundles[0])
PYTHON
)"
curl --fail -X POST http://127.0.0.1:18080/plugins \
  -H 'Content-Type: application/vnd.apache.tenon.plugin+tar+gzip' \
  --data-binary "@$java_bundle"
```

Create a Tenon Document that binds both interfaces of the same Instance. Lua copies the Source payload into the Sink's Builder:

```sh
python3 - "$java_demo_root" <<'PYTHON'
import json, pathlib, sys
root = pathlib.Path(sys.argv[1]).resolve()
(root / "java.jsonc").write_text(json.dumps({
    "specVersion": "1",
    "id": "java-example",
    "pluginInstances": {
        "example": {
            "programName": "com.example.hello", "exactVersion": "1.0.0",
            "config": {"message": "Hello from Java", "queueIndex": 0, "outputFile": str(root / "java-messages.txt")}
        }
    },
    "flows": {
        "example": {
            "source": "example", "sinks": ["example"],
            "process": {"script": """local b = registry:getBuilder('com.example.hello@1.0.0')
function main(event)
  if event.type == 'source' then
    b:setMessage(event.payload.message)
    emit(b:build())
  end
end"""}
        }
    }
}, indent=2))
PYTHON
curl --fail -X PUT http://127.0.0.1:18080/documents/java-example \
  -H 'Content-Type: application/jsonc' -H 'If-None-Match: *' \
  --data-binary "@$java_demo_root/java.jsonc"
```

## Verify delivery

Application is asynchronous. Wait briefly for the first message, then inspect the Pipeline and file:

```sh
for attempt in 1 2 3 4 5 6 7 8 9 10; do
  test -s "$java_demo_root/java-messages.txt" && break
  sleep 1
done
curl --fail http://127.0.0.1:18080/pipelines/java-example
cat "$java_demo_root/java-messages.txt"
```

The Pipeline must be `running`, with `appliedDocumentEtag` equal to `documentEtag`. The file must contain `Hello from Java`; a running process alone does not prove delivery. If application takes longer, repeat the check. For persistent failure, inspect [plugin diagnostics](/tenon/docs/development/user-guide/troubleshooting/), the exact installed Program version, and output-directory permissions.

## Stop and continue developing

Delete only this example's Tenon Document with its current ETag:

```sh
etag="$(curl --fail -sS -D - -o /dev/null http://127.0.0.1:18080/documents/java-example | tr -d '\r' | sed -n 's/^[Ee][Tt][Aa][Gg]: //p')"
curl --fail -X DELETE http://127.0.0.1:18080/documents/java-example -H "If-Match: $etag"
```

The Runner stops its plugin processes. The installed bundle and output file remain for inspection. When finished, stop the Runner with Ctrl-C in its terminal.

Edit the generated factory, configuration schema, and payload definitions for your external system. Use `source`, `sink`, or `source-and-sink` when generating a different interface. Follow the [Java SDK lifecycle reference](/tenon/docs/development/reference/java-sdk/) and [test and package guide](/tenon/docs/development/develop/test-package/) for delivery, failure, replay, and shutdown checks. Record your tested platform and preserve license and notice files. You can keep the plugin in your own repository and [propose an Awesome Tenon Plugins entry](/tenon/plugins/#add-your-plugin).

/// <reference types="docusaurus-theme-openapi-docs" />
import React, { useEffect, useMemo } from "react";
import BrowserOnly from "@docusaurus/BrowserOnly";
import { DocProvider } from "@docusaurus/plugin-content-docs/client";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { HtmlClassNameProvider } from "@docusaurus/theme-common";
import ApiExplorer from "@theme/ApiExplorer";
import { createAuth } from "@theme/ApiExplorer/Authorization/slice";
import MethodEndpoint from "@theme/ApiExplorer/MethodEndpoint";
import ParamsDetails from "@theme/ParamsDetails";
import RequestSchema from "@theme/RequestSchema";
import SkeletonLoader from "@theme/SkeletonLoader";
import StatusCodes from "@theme/StatusCodes";
import Markdown from "@theme/Markdown";
import Heading from "@theme/Heading";
import {
  createStoreWithState,
  createStoreWithoutState,
} from "@theme/ApiItem/store";
import { Provider } from "docusaurus-theme-openapi-docs/node_modules/react-redux";
import { createPersistanceMiddleware } from "@theme/ApiExplorer/persistanceMiddleware";
import { generatedOperations } from "../../openapi/generatedOperations";

type ApiItem = Record<string, any>;
type GeneratedOperation = {
  id: string;
  title: string;
  description?: string;
  frontMatter?: Record<string, unknown>;
  api: ApiItem;
};

const operations = generatedOperations as unknown as GeneratedOperation[];

const buildDocContent = (operation: GeneratedOperation) => {
  const frontMatter = {
    hide_table_of_contents: true,
    hide_title: true,
    api: true,
    ...operation.frontMatter,
  };

  return {
    frontMatter,
    metadata: {
      id: operation.id,
      unversionedId: operation.id,
      title: operation.title,
      description: operation.description,
      source: `inline-api/${operation.id}`,
      slug: `#${operation.id}`,
      permalink: `#${operation.id}`,
      frontMatter,
    },
    assets: {},
    contentTitle: operation.title,
    toc: [],
  };
};

const buildStore = (api: ApiItem, options: unknown) => {
  const middleware = createPersistanceMiddleware(options);

  const statusRegex = new RegExp("(20[0-9]|2[1-9][0-9])");
  let acceptArray: string[] = [];
  for (const [code, content] of Object.entries(
    (api.responses as Record<string, any>) ?? {}
  )) {
    if (statusRegex.test(code)) {
      acceptArray.push(...Object.keys((content as any).content ?? {}));
    }
  }

  const contentTypeArray = Object.keys(api.requestBody?.content ?? {});
  const servers = (api.servers as any[]) ?? [];
  const params: Record<string, any[]> = {
    path: [],
    query: [],
    header: [],
    cookie: [],
  };

  (api.parameters as any[])?.forEach((param) => {
    const paramType = param.in;
    if (paramType && params[paramType]) {
      params[paramType].push(param);
    }
  });

  const auth = createAuth({
    security: api.security,
    securitySchemes: api.securitySchemes,
    options,
  });

  return createStoreWithState(
    {
      accept: {
        value: acceptArray[0],
        options: acceptArray,
      },
      contentType: {
        value: contentTypeArray[0],
        options: contentTypeArray,
      },
      server: {
        value: servers[0],
        options: servers,
      },
      response: { value: undefined },
      body: { type: "empty" },
      params,
      auth,
    },
    [middleware]
  );
};

const OperationBlock = ({
  operation,
  apiOptions,
}: {
  operation: GeneratedOperation;
  apiOptions: unknown;
}) => {
  const docContent = useMemo(
    () => buildDocContent(operation),
    [operation]
  ) as any;
  const api = operation.api;
  const store =
    typeof window !== "undefined"
      ? buildStore(api, apiOptions)
      : createStoreWithoutState({}, [
          (_storeAPI: unknown) => (next: any) => (action: any) => next(action),
        ]);

  return (
    <DocProvider content={docContent}>
      <HtmlClassNameProvider className={`docs-doc-id-${operation.id}`}>
        <Provider store={store}>
          <div className="margin-top--lg margin-bottom--lg">
            <div className="row theme-api-markdown">
              <div className="col col--7 openapi-left-panel__container">
                <Heading as="h3" id={operation.id}>
                  {operation.title}
                </Heading>
                <MethodEndpoint method={api.method} path={api.path} />
                {operation.description && (
                  <Markdown>{operation.description}</Markdown>
                )}
                <ParamsDetails parameters={api.parameters} />
                <RequestSchema title="Body" body={api.requestBody} />
                <StatusCodes
                  label="Responses"
                  id={`${operation.id}-responses`}
                  responses={api.responses}
                />
              </div>
              <div className="col col--5 openapi-right-panel__container">
                <BrowserOnly fallback={<SkeletonLoader size="lg" />}>
                  {() => (
                    <ApiExplorer
                      item={api}
                      infoPath="docs/user_guide/api/intro"
                    />
                  )}
                </BrowserOnly>
              </div>
            </div>
          </div>
        </Provider>
      </HtmlClassNameProvider>
    </DocProvider>
  );
};

const ApiDoc = () => {
  const { siteConfig } = useDocusaurusContext();
  const groupedOperations = useMemo(() => {
    const groups = new Map<string, GeneratedOperation[]>();
    operations.forEach((operation) => {
      const tag = operation.api.tags?.[0] ?? "General";
      if (!groups.has(tag)) {
        groups.set(tag, []);
      }
      groups.get(tag)!.push(operation);
    });
    return groups;
  }, []);

  const apiOptions = siteConfig?.themeConfig?.api ?? {};

  useEffect(() => {
    const isHidden = (element: HTMLElement) => {
      const style = window.getComputedStyle(element);
      return style.display === "none" || style.visibility === "hidden";
    };

    const scrollToVisibleHash = () => {
      const rawHash = window.location.hash.slice(1);
      if (!rawHash) {
        return;
      }
      const escapeId =
        (window as any).CSS?.escape ??
        ((value: string) => value.replace(/'/g, "\\'"));
      const selector = `[id='${escapeId(rawHash)}']`;
      const candidates = Array.from(
        document.querySelectorAll<HTMLElement>(selector)
      );
      if (candidates.length === 0) {
        return;
      }
      const target = candidates.find((el) => !isHidden(el)) ?? candidates[0];
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    scrollToVisibleHash();
    window.addEventListener("hashchange", scrollToVisibleHash);
    return () => window.removeEventListener("hashchange", scrollToVisibleHash);
  }, []);

  return (
    <>
      {Array.from(groupedOperations.entries()).map(([tag, operations]) => {
        const showTagTitle = tag !== "General";
        return (
          <section key={tag} className="margin-bottom--xl">
            {showTagTitle ? <Heading as="h2">{tag}</Heading> : null}
            {operations.map((operation) => (
              <OperationBlock
                key={operation.id}
                operation={operation}
                apiOptions={apiOptions}
              />
            ))}
          </section>
        );
      })}
    </>
  );
};

export default ApiDoc;

/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership. The ASF licenses this file
 * to you under the Apache License, Version 2.0.
 */

import React, { type ReactNode } from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {
  HtmlClassNameProvider,
  PageMetadata,
  ThemeClassNames,
} from '@docusaurus/theme-common';
import BlogLayout from '@theme/BlogLayout';
import BlogListPageStructuredData from '@theme/BlogListPage/StructuredData';
import BlogListPaginator from '@theme/BlogListPaginator';
import BlogPostItems from '@theme/BlogPostItems';
import Heading from '@theme/Heading';
import SearchMetadata from '@theme/SearchMetadata';
import type { Props } from '@theme/BlogListPage';

export default function BlogListPage(props: Props): ReactNode {
  const { metadata, items, sidebar } = props;
  const {
    siteConfig: { title: siteTitle },
  } = useDocusaurusContext();
  const { blogDescription, blogTitle, permalink } = metadata;
  const pageTitle = permalink === '/' ? siteTitle : blogTitle;

  return (
    <HtmlClassNameProvider
      className={clsx(
        ThemeClassNames.wrapper.blogPages,
        ThemeClassNames.page.blogListPage,
      )}
      children={
        <>
          <PageMetadata title={pageTitle} description={blogDescription} />
          <SearchMetadata tag="blog_posts_list" />
          <BlogListPageStructuredData {...props} />
          <BlogLayout sidebar={sidebar}>
            <header className="margin-bottom--xl">
              <Heading as="h1">{blogTitle}</Heading>
              <p>{blogDescription}</p>
            </header>
            <BlogPostItems items={items} />
            <BlogListPaginator metadata={metadata} />
          </BlogLayout>
        </>
      }
    />
  );
}

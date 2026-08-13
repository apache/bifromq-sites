/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership. The ASF licenses this file
 * to you under the Apache License, Version 2.0.
 */

import React, { type ReactNode } from 'react';
import Head from '@docusaurus/Head';
import OriginalBlogTagsListPage from '@theme-original/BlogTagsListPage';
import type { Props } from '@theme/BlogTagsListPage';

const description =
  'Browse Apache BifroMQ blog posts by project and technical topic.';

export default function BlogTagsListPage(props: Props): ReactNode {
  return (
    <>
      <Head
        children={
          <>
            <meta name="description" content={description} />
            <meta property="og:description" content={description} />
          </>
        }
      />
      <OriginalBlogTagsListPage {...props} />
    </>
  );
}

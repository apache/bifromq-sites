/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership. The ASF licenses this file
 * to you under the Apache License, Version 2.0.
 */

import React, { type ReactNode } from 'react';
import Head from '@docusaurus/Head';
import OriginalBlogAuthorsListPage from '@theme-original/Blog/Pages/BlogAuthorsListPage';
import type { Props } from '@theme/Blog/Pages/BlogAuthorsListPage';

const description =
  'Authors contributing project news and technical articles to the Apache BifroMQ blog.';

export default function BlogAuthorsListPage(props: Props): ReactNode {
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
      <OriginalBlogAuthorsListPage {...props} />
    </>
  );
}

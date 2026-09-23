import React, { type ReactNode } from 'react';
import { Redirect } from '@docusaurus/router';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';

const overview = '/tenon/docs/development/get-started/overview/';

export default function Tenon(): ReactNode {
  return <>
    <Head children={<meta name="robots" content="noindex, nofollow" />} />
    <Redirect to={overview} />
    <p><Link to={overview}>Tenon documentation</Link></p>
  </>;
}

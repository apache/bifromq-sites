import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  kicker: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: '100% MQTT Support',
    kicker: 'MQTT 3.1-5.0',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Supports MQTT 3.1, 3.1.1, and 5.0 over TCP, TLS, WS, and WSS with full
        protocol feature coverage.
      </>
    ),
  },
  {
    title: 'Built-in Storage Engine',
    kicker: 'Full compliance · Zero deps',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Optimized for critical load targeting, no third-party middleware
        dependencies. Deploy anywhere with confidence.
      </>
    ),
  },
  {
    title: 'Native Multi-Tenancy',
    kicker: 'Self-contained · Multi-tenant',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Built-in support for multi-tenancy resource sharing and workload
        isolation. Perfect for SaaS platforms and enterprise environments.
      </>
    ),
  },
  {
    title: 'Extensible Mechanisms',
    kicker: 'Resource isolation · Plugin-ready',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Supports extensions, including Authentication/Authorization, Event, and
        System/Tenant Monitoring. Rich plugin architecture. Highly extensible.
      </>
    ),
  },
];

function Feature({title, kicker, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--3')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <p className={styles.featureKicker}>{kicker}</p>
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.intro}>
          <Heading as="h2">What is BifroMQ?</Heading>
          <p>
            BifroMQ is a high-performance, distributed Apache MQTT broker
            implementation that seamlessly integrates native multi-tenancy
            support. It is designed to support building large-scale IoT device
            connections and messaging systems.
          </p>
        </div>
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

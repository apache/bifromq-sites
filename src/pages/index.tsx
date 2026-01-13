import React, { type ReactNode, useEffect } from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import { releaseVersion } from '../../releaseInfo';
import styles from './index.module.css';

/**
 * BifroMQ Landing Page - Bifrost Redesign
 * Inspired by the Rainbow Bridge, emphasizing connectivity and architectural elegance.
 */
export default function Home(): ReactNode {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.revealActive);
          }
        });
      },
      { threshold: 0.1 }
    );

    const reveals = document.querySelectorAll(`.${styles.reveal}`);
    reveals.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <Layout
      title="Apache BifroMQ | High-Performance Multi-tenant MQTT Broker"
      description="The definitive high-performance, multi-tenant MQTT broker for massive scale IoT. Industrial-grade reliability meets architectural precision.">
      <div className={styles.main}>

        {/* --- HERO SECTION --- */}
        <section className={styles.hero}>
          <div className={styles.heroVisual}>
            <div className={styles.bifrostRing}>
              <div style={{ fontSize: '200px', fontWeight: 900, letterSpacing: '-0.1em', opacity: 0.1 }}>
                BIFRO<span style={{ color: 'var(--color-accent)' }}>MQ</span>
              </div>
            </div>
          </div>
          <div className={styles.heroContent}>
            <div className={styles.heroBadge}>
              <div className={styles.heroBadgeDot} />
              <span>Apache Incubating Project</span>
            </div>
            <h1 className={styles.heroTitle}>
              Apache BifroMQ<span>(Incubating)</span>
            </h1>
            <p className={styles.heroDesc}>
              Java-based high-performance Apache MQTT Broker messaging middleware that adopts Multi-tenancy architecture.
            </p>
            <div className={styles.heroCta}>
              <Link to="/docs/get_started/intro" className={styles.heroCtaPrimary}>
                Get Started
              </Link>
              <Link to="https://github.com/apache/bifromq" className={styles.heroCtaSecondary}>
                View on GitHub
              </Link>
            </div>
          </div>
        </section>

        {/* --- TRUST SECTION --- */}
        <section className={styles.trust}>
          <div className={styles.trustInner}>
            <span className={styles.apacheBrand}>Supported by the Apache Software Foundation</span>
          </div>
        </section>

        {/* --- WHAT IS BIFROMQ --- */}
        <section className={`${styles.sectionContainer} ${styles.reveal}`}>
          <div className={styles.introContent}>
            <span className={styles.sectionLabel}>Overview</span>
            <h2 className={styles.sectionTitle}>What is BifroMQ?</h2>
            <p className={styles.introDesc}>
              BifroMQ is a high-performance, distributed Apache MQTT broker implementation that seamlessly integrates native multi-tenancy support. It is designed to support building large-scale IoT device connections and messaging systems.
            </p>
          </div>
        </section>

        <div className={styles.bifrostDivider} />

        {/* --- FEATURES SECTION --- */}
        <section className={`${styles.sectionContainer} ${styles.reveal}`}>
          <div className={styles.bifrostGrid}>
            <FeatureCard
              tag="Full compliance"
              title="100% MQTT Support"
              desc="Fully supports MQTT 3.1, 3.1.1 and 5.0 features over TCP, TLS, WS, WSS. Complete protocol implementation with all advanced features."
              icon="MQTT 3.1-5.0"
            />
            <FeatureCard
              tag="Self-contained"
              title="Built-in Storage Engine"
              desc="Optimized for critical load targeting, no third-party middleware dependencies. Deploy anywhere with confidence."
              icon="Zero deps"
            />
            <FeatureCard
              tag="Resource isolation"
              title="Native Multi-Tenancy"
              desc="Built-in support for multi-tenancy resource sharing and workload isolation. Perfect for SaaS platforms and enterprise environments."
              icon="Multi-tenant"
            />
            <FeatureCard
              tag="Highly extensible"
              title="Extensible Mechanisms"
              desc="Supports extensions, including Authentication/Authorization, Event, and System/Tenant Monitoring. Rich plugin architecture."
              icon="Plugin-ready"
            />
          </div>
        </section>

        <div className={styles.bifrostDivider} />

        {/* --- QUICK START SECTION --- */}
        <section className={`${styles.sectionContainer} ${styles.reveal}`}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>Deployment</span>
            <h2 className={styles.sectionTitle}>Launch in Seconds</h2>
          </div>
          <div className={styles.quickstart}>
            <div className={styles.terminalHeader}>
              <div className={styles.terminalDots}>
                <span />
                <span />
                <span />
              </div>
              <div className={styles.terminalTitle}>bash — 80×24</div>
            </div>
            <div className={styles.terminalOutput}>
              <div><span className={styles.prompt}>$</span> docker run -d --name bifromq -p 1883:1883 apache/bifromq:{releaseVersion}</div>
              <div style={{ opacity: 0.6, marginTop: '20px' }}># BifroMQ node starting up...</div>
              <div style={{ opacity: 0.6 }}># Cluster established. Ready for massive connectivity.</div>
              <div><span className={styles.prompt}>$</span> <span className={styles.cursor} /></div>
            </div>
          </div>
        </section>

        <div className={styles.bifrostDivider} />

        {/* --- FINAL CTA SECTION --- */}
        <section className={`${styles.finalCta} ${styles.reveal}`}>
          <div className={styles.finalCtaTitle}>
            Ready to Build?
          </div>
          <Link to="/docs/get_started/intro" className={styles.finalCtaPrimary}>
            Get Started Now
          </Link>
        </section>

      </div>
    </Layout>
  );
}

function FeatureCard({ tag, title, desc, icon }: { tag: string, title: string, desc: string, icon: string }) {
  return (
    <div className={styles.bifrostCard}>
      <div className={styles.bifrostCardBorder} />
      <span className={styles.sectionLabel} style={{ fontSize: '10px', color: 'var(--color-text-tertiary)', marginBottom: '8px', letterSpacing: '0.1em' }}>{tag}</span>
      <h3 className={styles.cardTitle} style={{ fontSize: '1.25rem', marginBottom: '16px' }}>{title}</h3>
      <div className={styles.cardIcon}>{icon}</div>
      <p className={styles.cardDesc} style={{ fontSize: '0.95rem' }}>{desc}</p>
    </div>
  );
}

function UseCaseCard({ tag, title, desc }: { tag: string, title: string, desc: string }) {
  return (
    <div className={styles.bifrostCard} style={{ background: 'var(--color-wash)', border: 'none' }}>
      <span className={styles.sectionLabel} style={{ fontSize: '10px', color: 'var(--color-text-tertiary)', marginBottom: '12px' }}>{tag}</span>
      <h3 className={styles.cardTitle} style={{ fontSize: '1.25rem', marginBottom: '12px' }}>{title}</h3>
      <p className={styles.cardDesc} style={{ fontSize: '0.9rem' }}>{desc}</p>
    </div>
  );
}

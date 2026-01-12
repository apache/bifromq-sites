import React, { type ReactNode, useEffect } from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
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
          <div className={styles.heroContent}>
            <div className={styles.heroText}>
              <div className={styles.heroBadge}>
                <div className={styles.heroBadgeDot} />
                <span>Now an Apache Incubator Project</span>
              </div>
              <h1 className={styles.heroTitle}>
                The Bridge to <span>Massive Scale IoT.</span>
              </h1>
              <p className={styles.heroDesc}>
                Apache BifroMQ (Incubating) is a Java-based, high-performance MQTT broker
                messaging middleware that adopts a native multi-tenant architecture.
                Built for the next generation of industrial connectivity.
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
            <div className={styles.heroVisual}>
              <div className={styles.bifrostRing}>
                <div style={{ fontSize: '120px', fontWeight: 900, letterSpacing: '-0.1em' }}>
                  BIFRO<span style={{ color: 'var(--bifrost-blue)' }}>MQ</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- TRUST SECTION --- */}
        <section className={styles.trust}>
          <div className={styles.trustInner}>
            <span className={styles.apacheBrand}>Supported by the Apache Software Foundation</span>
          </div>
        </section>

        {/* --- STATS SECTION --- */}
        <section className={`${styles.sectionContainer} ${styles.reveal}`}>
          <div className={styles.statsGrid}>
            <div className={styles.statCell}>
              <span className={styles.statVal}>10M+</span>
              <span className={styles.statLab}>Connections per Cluster</span>
            </div>
            <div className={styles.statCell}>
              <span className={styles.statVal}>&lt;1ms</span>
              <span className={styles.statLab}>Latency Precision</span>
            </div>
            <div className={styles.statCell}>
              <span className={styles.statVal}>v5.0</span>
              <span className={styles.statLab}>Full Protocol Support</span>
            </div>
          </div>
        </section>

        {/* --- FEATURES SECTION --- */}
        <section className={`${styles.sectionContainer} ${styles.reveal}`}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>Capabilities</span>
            <h2 className={styles.sectionTitle}>Engineered for the Connected Future</h2>
          </div>

          <div className={styles.bifrostGrid}>
            <FeatureCard
              icon="🏢"
              title="Multi-tenancy"
              desc="True SaaS architecture with hard resource isolation and independent governance for millions of tenants."
              color="var(--bifrost-indigo)"
            />
            <FeatureCard
              icon="⚡"
              title="Elastic Scaling"
              desc="Horizontally scalable compute and storage layers, enabling seamless growth without downtime."
              color="var(--bifrost-blue)"
            />
            <FeatureCard
              icon="🧩"
              title="Extensible Core"
              desc="Rich plugin system for auth, governance, and custom enterprise integrations."
              color="var(--bifrost-teal)"
            />
            <FeatureCard
              icon="📊"
              title="Full Telemetry"
              desc="Deep visibility into cluster health and tenant behavior with native monitoring support."
              color="var(--bifrost-violet)"
            />
          </div>
        </section>

        {/* --- QUICK START SECTION --- */}
        <section className={`${styles.sectionContainer} ${styles.reveal}`}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>Deployment</span>
            <h2 className={styles.sectionTitle}>Launch in Seconds</h2>
          </div>
          <div className={styles.quickstart}>
            <div className={styles.terminalOutput}>
              <div><span className={styles.prompt}>$</span> docker pull apache/bifromq:latest</div>
              <div><span className={styles.prompt}>$</span> docker run -d --name bifromq -p 1883:1883 apache/bifromq:latest</div>
              <div style={{ opacity: 0.6, marginTop: '20px' }}># BifroMQ node starting up...</div>
              <div style={{ opacity: 0.6 }}># Cluster established. Ready for massive connectivity.</div>
              <div><span className={styles.prompt}>$</span> <span className={styles.cursor} /></div>
            </div>
          </div>
        </section>

        {/* --- USE CASES SECTION --- */}
        <section className={`${styles.sectionContainer} ${styles.reveal}`}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>Solutions</span>
            <h2 className={styles.sectionTitle}>Bridging the Industrial Gap</h2>
          </div>
          <div className={styles.bifrostGrid}>
            <UseCaseCard
              tag="Automotive"
              title="Connected Vehicles"
              desc="Managing millions of high-frequency telemetry streams with strict latency budgets."
            />
            <UseCaseCard
              tag="Manufacturing"
              title="Smart Factories"
              desc="Reliable message bus for thousands of industrial sensors and actuators."
            />
            <UseCaseCard
              tag="Energy"
              title="Smart Grids"
              desc="Securely aggregating distributed energy data across vast geographies."
            />
            <UseCaseCard
              tag="Logistics"
              title="Asset Tracking"
              desc="Maintaining connectivity for mobile assets moving across global networks."
            />
          </div>
        </section>

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

function FeatureCard({ icon, title, desc, color }: { icon: string, title: string, desc: string, color: string }) {
  return (
    <div className={styles.bifrostCard}>
      <div className={styles.bifrostCardBorder} style={{ background: color }} />
      <div className={styles.cardIcon}>{icon}</div>
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardDesc}>{desc}</p>
    </div>
  );
}

function UseCaseCard({ tag, title, desc }: { tag: string, title: string, desc: string }) {
  return (
    <div className={styles.bifrostCard} style={{ background: 'var(--color-wash)' }}>
      <span className={styles.sectionLabel} style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>{tag}</span>
      <h3 className={styles.cardTitle} style={{ fontSize: '1.5rem' }}>{title}</h3>
      <p className={styles.cardDesc} style={{ fontSize: '1rem' }}>{desc}</p>
    </div>
  );
}

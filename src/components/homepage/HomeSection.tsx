import React, { useEffect, useRef, useState } from 'react';
import Typed from "typed.js";
import Translate, { translate as translateFn } from "@docusaurus/Translate";
import CallToAction from "./CallToAction";
import {
  UsersIcon,
  CloudArrowUpIcon,
  CpuChipIcon,
  ShieldCheckIcon,
  RocketLaunchIcon,
  CircleStackIcon,
  GlobeAltIcon,
  ChartBarIcon,
  LockClosedIcon,
  ArrowPathIcon,
  BeakerIcon,
  CommandLineIcon,
  PlayIcon,
  ArrowRightIcon,
  BuildingOfficeIcon,
  WifiIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  SparklesIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import {
  CpuChipIcon as CpuChipIconSolid,
  ShieldCheckIcon as ShieldCheckIconSolid,
  RocketLaunchIcon as RocketLaunchIconSolid,
  GlobeAltIcon as GlobeAltIconSolid,
  BoltIcon as BoltIconSolid,
  StarIcon as StarIconSolid,
  CheckCircleIcon as CheckCircleIconSolid,
  UsersIcon as UsersIconSolid,
  CircleStackIcon as CircleStackIconSolid,
  CloudArrowUpIcon as CloudArrowUpIconSolid,
  LockClosedIcon as LockClosedIconSolid,
  ChartBarIcon as ChartBarIconSolid,
  ArrowPathIcon as ArrowPathIconSolid,
  BeakerIcon as BeakerIconSolid,
  CommandLineIcon as CommandLineIconSolid,
  SparklesIcon as SparklesIconSolid
} from '@heroicons/react/24/solid';

// 动态文本内容
const textLines = [
  translateFn({ id: "High-Performance", message: "High-Performance" }),
  translateFn({ id: "Java-based", message: "Java-based" }),
  translateFn({ id: "Native Multi-Tenancy", message: "Native Multi-Tenancy" }),
  translateFn({ id: "Open-Source", message: "Open-Source" }),
  translateFn({ id: "Built-in Storage", message: "Built-in Storage" }),
  translateFn({ id: "Massive Connectivity", message: "Massive Connectivity" }),
  translateFn({ id: "Extensible", message: "Extensible" })
];

// 核心特性
const coreFeatures = [
  {
    name: <Translate>100% MQTT Support</Translate>,
    description: <Translate>Fully supports MQTT 3.1, 3.1.1 and 5.0 features over TCP, TLS, WS, WSS. Complete protocol implementation with all advanced features.</Translate>,
    icon: CpuChipIcon,
    solidIcon: CpuChipIconSolid,
    gradient: "from-blue-500 to-cyan-500",
    stats: "MQTT 3.1-5.0",
    highlight: "Full compliance"
  },
  {
    name: <Translate>Built-in Storage Engine</Translate>,
    description: <Translate>Optimized for critical load targeting, no third-party middleware dependencies. Deploy anywhere with confidence.</Translate>,
    icon: CircleStackIcon,
    solidIcon: CircleStackIconSolid,
    gradient: "from-emerald-500 to-teal-500",
    stats: "Zero deps",
    highlight: "Self-contained"
  },
  {
    name: <Translate>Native Multi-Tenancy</Translate>,
    description: <Translate>Built-in support for multi-tenancy resource sharing and workload isolation. Perfect for SaaS platforms and enterprise environments.</Translate>,
    icon: UsersIcon,
    solidIcon: UsersIconSolid,
    gradient: "from-purple-500 to-pink-500",
    stats: "Multi-tenant",
    highlight: "Resource isolation"
  },
  {
    name: <Translate>Extensible Mechanisms</Translate>,
    description: <Translate>Supports extensions, including Authentication/Authorization, Event, and System/Tenant Monitoring. Rich plugin architecture.</Translate>,
    icon: ShieldCheckIcon,
    solidIcon: ShieldCheckIconSolid,
    gradient: "from-orange-500 to-red-500",
    stats: "Plugin-ready",
    highlight: "Highly extensible"
  },
]

// 技术规格
const techSpecs = [
  {
    icon: CpuChipIcon,
    solidIcon: CpuChipIconSolid,
    title: <Translate>Performance</Translate>,
    value: "1M+",
    description: <Translate>Concurrent Connections</Translate>,
    gradient: "from-blue-500 to-cyan-500",
    detail: "High-performance messaging"
  },
  {
    icon: RocketLaunchIcon,
    solidIcon: RocketLaunchIconSolid,
    title: <Translate>Java-based</Translate>,
    value: "JVM",
    description: <Translate>Technology Stack</Translate>,
    gradient: "from-emerald-500 to-teal-500",
    detail: "Enterprise-grade platform"
  },
  {
    icon: ShieldCheckIcon,
    solidIcon: ShieldCheckIconSolid,
    title: <Translate>Open Source</Translate>,
    value: "Apache 2.0",
    description: <Translate>License</Translate>,
    gradient: "from-purple-500 to-pink-500",
    detail: "Community-driven"
  },
  {
    icon: GlobeAltIcon,
    solidIcon: GlobeAltIconSolid,
    title: <Translate>GitHub Stars</Translate>,
    value: "663+",
    description: <Translate>Community Support</Translate>,
    gradient: "from-orange-500 to-red-500",
    detail: "Growing ecosystem"
  },
]

// 附加功能
const additionalFeatures = [
  {
    icon: CloudArrowUpIcon,
    solidIcon: CloudArrowUpIconSolid,
    title: <Translate>Full MQTT Support</Translate>,
    description: <Translate>Complete MQTT 3.1, 3.1.1, and 5.0 implementation with all advanced features</Translate>,
    category: "Protocol"
  },
  {
    icon: LockClosedIcon,
    solidIcon: LockClosedIconSolid,
    title: <Translate>Advanced Security</Translate>,
    description: <Translate>TLS 1.3, OAuth 2.0, JWT authentication, and fine-grained authorization</Translate>,
    category: "Security"
  },
  {
    icon: ArrowPathIcon,
    solidIcon: ArrowPathIconSolid,
    title: <Translate>Auto-Scaling</Translate>,
    description: <Translate>Dynamic resource allocation with intelligent load balancing and failover</Translate>,
    category: "Infrastructure"
  },
  {
    icon: ChartBarIcon,
    solidIcon: ChartBarIconSolid,
    title: <Translate>Real-time Analytics</Translate>,
    description: <Translate>Built-in monitoring with Prometheus metrics and custom dashboards</Translate>,
    category: "Monitoring"
  },
  {
    icon: BeakerIcon,
    solidIcon: BeakerIconSolid,
    title: <Translate>Plugin Architecture</Translate>,
    description: <Translate>Extensible with custom authentication, event handlers, and integrations</Translate>,
    category: "Extensibility"
  },
  {
    icon: CommandLineIcon,
    solidIcon: CommandLineIconSolid,
    title: <Translate>Developer Experience</Translate>,
    description: <Translate>Rich APIs, SDKs for multiple languages, and comprehensive documentation</Translate>,
    category: "Developer Tools"
  },
]

// 使用案例
const useCases = [
  {
    icon: DevicePhoneMobileIcon,
    title: <Translate>IoT Device Management</Translate>,
    description: <Translate>Connect millions of IoT devices with real-time communication</Translate>,
    industries: ["Manufacturing", "Smart Cities", "Agriculture"]
  },
  {
    icon: ComputerDesktopIcon,
    title: <Translate>Real-time Applications</Translate>,
    description: <Translate>Build responsive applications with instant message delivery</Translate>,
    industries: ["Gaming", "Chat Apps", "Live Streaming"]
  },
  {
    icon: BuildingOfficeIcon,
    title: <Translate>Enterprise Integration</Translate>,
    description: <Translate>Integrate with existing enterprise systems and microservices</Translate>,
    industries: ["Finance", "Healthcare", "Retail", "Veclhile"]
  },
  {
    icon: WifiIcon,
    title: <Translate>Edge Computing</Translate>,
    description: <Translate>Deploy at the edge for low-latency, high-reliability messaging</Translate>,
    industries: ["Automotive", "Industrial", "Telecommunications"]
  }
]

// 客户案例
const customerLogos = [
  { name: "Baidu", logo: "./logocloud/baidu.png", description: "Powers Baidu IoT Core" },
  { name: "Apollo", logo: "./logocloud/apollo.png", description: "Autonomous vehicle platform" },
  { name: "Hisense", logo: "./logocloud/hisense.png", description: "Smart home ecosystem" },
  { name: "Skyworth", logo: "./logocloud/skyworth.png", description: "Connected TV platform" },
  { name: "China Unicom", logo: "./logocloud/chinaunicom.png", description: "Telecom infrastructure" }
]

// 性能对比数据
const performanceMetrics = [
  {
    metric: <Translate>Concurrent Connections</Translate>,
    bifromq: "1,000,000+",
    competitor: "100,000",
    improvement: "10x"
  },
  {
    metric: <Translate>Message Latency</Translate>,
    bifromq: "<1ms",
    competitor: "5-10ms",
    improvement: "10x faster"
  },
  {
    metric: <Translate>Memory Usage</Translate>,
    bifromq: "2GB",
    competitor: "8GB",
    improvement: "75% less"
  },
  {
    metric: <Translate>Setup Time</Translate>,
    bifromq: "5 minutes",
    competitor: "2+ hours",
    improvement: "24x faster"
  }
]

export default function HomeSection() {
  const typedRef = useRef(null);
  const [isVisible, setIsVisible] = useState({});
  const [activeTab, setActiveTab] = useState(0);
  const observerRef = useRef(null);

  // 初始化打字机效果
  // useEffect(() => {
  //   const options = {
  //     strings: textLines,
  //     typeSpeed: 80,
  //     backSpeed: 50,
  //     loop: true,
  //     backDelay: 2000,
  //     startDelay: 1000,
  //   };
  //   typedRef.current = new Typed('.typed-text', options);

  //   return () => {
  //     if (typedRef.current) {
  //       typedRef.current.destroy();
  //     }
  //   };
  // }, []);

  // 滚动动画观察器
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({
              ...prev,
              [entry.target.id]: true
            }));
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    // 观察所有需要动画的元素
    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach(el => observerRef.current.observe(el));

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return (
    <main className="relative overflow-hidden">
      {/* Hero Section - 全新设计 */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
        {/* 动态背景 */}
        <div className="absolute inset-0 overflow-hidden">
          {/* 网格背景 */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#374151_1px,transparent_1px),linear-gradient(to_bottom,#374151_1px,transparent_1px)] bg-[size:60px_60px] opacity-20"></div>

          {/* 浮动几何图形 */}
          <div className="absolute top-20 left-20 w-32 h-32 border-2 border-blue-200/30 dark:border-blue-800/30 rounded-3xl rotate-12 animate-float opacity-40"></div>
          <div className="absolute top-40 right-32 w-24 h-24 border border-purple-200/30 dark:border-purple-800/30 rounded-full animate-float-delayed opacity-30"></div>
          <div className="absolute bottom-32 left-40 w-28 h-28 border border-emerald-200/30 dark:border-emerald-800/30 rounded-2xl rotate-45 animate-float opacity-35"></div>
          <div className="absolute bottom-20 right-20 w-20 h-20 border-2 border-orange-200/30 dark:border-orange-800/30 rounded-xl animate-float-delayed opacity-40"></div>

          {/* 渐变光晕 */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

          {/* 粒子效果 */}
          <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-blue-400/60 rounded-full animate-ping"></div>
          <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-purple-400/60 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
          {/* <div className="absolute top-2/3 left-1/4 w-1 h-1 bg-emerald-400/60 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div> */}
        </div>

        {/* Hero 内容 */}
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 py-20">
          <div className="text-center">
            {/* Apache 孵化器徽章 */}
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border border-blue-200/50 dark:border-blue-800/50 mb-8 backdrop-blur-sm shadow-lg">
              <StarIconSolid className="w-5 h-5 text-blue-500 mr-2 animate-pulse" />
              <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                Apache Incubator Project
              </span>
            </div>

            {/* 主标题 */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6">
              <span className="block bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent">
                Apache BifroMQ
              </span>
              <span className="block text-2xl md:text-3xl lg:text-4xl font-normal text-blue-600 dark:text-blue-400">
                (Incubating)
              </span>
            </h1>

            {/* 动态副标题 */}
            {/* <div className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-600 dark:text-gray-300 mb-8 h-16 flex items-center justify-center">
              <span className="mr-3">The</span>
              <span className="typed-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent"></span>
              <span className="ml-2">MQTT Broker</span>
            </div> */}

            {/* 描述 */}
            <p className="text-xl md:text-2xl leading-relaxed text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-12">
              <Translate>Java-based high-performance MQTT Broker messaging middleware that adopts Multi-tenancy architecture.</Translate>
            </p>

            {/* 性能指标卡片 */}
            {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 max-w-6xl mx-auto">
              {techSpecs.map((spec, index) => (
                <div
                  key={index}
                  className="group relative transform hover:scale-105 transition-all duration-300"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative p-6 rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50 shadow-lg hover:shadow-2xl transition-all duration-300">
                    <div className={`absolute inset-0 bg-gradient-to-br ${spec.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}></div>
                    <div className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${spec.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg mx-auto`}>
                      <spec.solidIcon className="w-7 h-7 text-white" />
                    </div>

                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{spec.value}</div>

                    <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">{spec.title}</div>

                    <div className="text-xs text-gray-500 dark:text-gray-500">{spec.description}</div>

                    <div className="text-xs text-gray-400 dark:text-gray-600 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {spec.detail}
                    </div>
                  </div>
                </div>
              ))}
            </div> */}

            {/* hero 按钮 */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-16">
              <a
                href="./docs/get_started/intro/"
                className="group relative inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
              >
                {/* 按钮光效 */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <PlayIcon className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform relative z-10" />
                <span className="relative z-10"><Translate>Get Started</Translate></span>
                <SparklesIcon className="w-4 h-4 ml-2 group-hover:rotate-12 transition-transform relative z-10" />
              </a>

              <a
                href="https://github.com/apache/bifromq"
                target="_blank"
                className="group inline-flex items-center px-8 py-4 text-lg font-semibold text-gray-700 dark:text-gray-300 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 rounded-2xl border border-gray-300/50 dark:border-gray-600/50 shadow-lg hover:shadow-2xl transition-all duration-300 backdrop-blur-sm"
              >
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                <Translate>View on GitHub</Translate>
                <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* 快速统计 */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center group hover:text-yellow-500 transition-colors">
                <StarIconSolid className="w-4 h-4 mr-1 group-hover:animate-pulse" />
                <span>663+ GitHub Stars</span>
              </div>
              <div className="flex items-center group hover:text-green-500 transition-colors">
                <CheckCircleIconSolid className="w-4 h-4 mr-1 group-hover:animate-pulse" />
                <span>Production Ready</span>
              </div>
              <div className="flex items-center group hover:text-blue-500 transition-colors">
                <UsersIconSolid className="w-4 h-4 mr-1 group-hover:animate-pulse" />
                <span>Apache Incubator</span>
              </div>
              <div className="flex items-center group hover:text-purple-500 transition-colors">
                <BoltIconSolid className="w-4 h-4 mr-1 group-hover:animate-pulse" />
                <span>Open Source</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* 向下指引箭头 */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20">
          <div className="group relative flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border border-gray-200/60 bg-white/90 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:shadow-xl dark:border-gray-700/50 dark:bg-gray-800/90"
            onClick={() => {
              const nextSection = document.querySelector('section:nth-of-type(2)');
              nextSection?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <div className="absolute -top-[4.25rem] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-1.5 text-sm text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:bg-gray-100 dark:text-gray-900">
              <Translate>Scroll to explore</Translate>
              <div className="absolute top-full left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-gray-900 dark:bg-gray-100"></div>
            </div>

            <div className="absolute h-full w-full animate-ping rounded-full border-2 border-sky-400/50"></div>
            <div className="absolute h-full w-full animate-pulse rounded-full border border-sky-400/50"></div>

            <ChevronDownIcon className="mt-2 relative h-7 w-7 animate-bounce text-sky-600 transition-colors group-hover:text-sky-500 dark:text-sky-400 dark:group-hover:text-sky-300 translate-y-0.5" />
          </div>
        </div>

      </section>

      {/* 客户信任区域 - 重新设计 */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-30"></div>
        </div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
          <div className="text-center mb-16" data-animate id="trusted-by">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              <Translate>Trusted by Industry Leaders</Translate>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              <Translate>Powering mission-critical IoT infrastructure for enterprises worldwide</Translate>
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center">
            {customerLogos.map((customer, index) => (
              <div
                key={index}
                className="group relative p-8 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-300/50 dark:hover:border-blue-600/50 transition-all duration-300 hover:shadow-xl transform hover:scale-105"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* 悬停光效 */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300"></div>

                <div className="relative flex items-center justify-center">
                  <img
                    className="max-h-12 w-auto object-contain opacity-60 group-hover:opacity-100 transition-all duration-300 mx-auto filter grayscale group-hover:grayscale-0"
                    src={customer.logo}
                    alt={customer.name}
                    width={120}
                    height={48}
                  />

                  {/* 悬停时显示描述 */}
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 translate-y-full opacity-0 group-hover:opacity-100 transition-all duration-300 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs px-3 py-1 rounded-lg whitespace-nowrap">
                    {customer.description}
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-gray-100 rotate-45"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 核心特性区域 - 全新交互设计 */}
      <section className="py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
        {/* 动态背景 */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-40 h-40 border border-dashed border-blue-200/20 dark:border-blue-800/20 rounded-full animate-spin opacity-20" style={{ animationDuration: '30s' }}></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 border border-dashed border-purple-200/20 dark:border-purple-800/20 rounded-full animate-spin opacity-15" style={{ animationDuration: '25s', animationDirection: 'reverse' }}></div>
        </div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="mx-auto max-w-4xl text-center mb-20" data-animate id="core-features">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 border border-blue-200/50 dark:border-blue-800/50 mb-6">
              <SparklesIconSolid className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                <Translate>Enterprise-Grade Features</Translate>
              </span>
            </div>

            <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent">
                <Translate>What is BifroMQ?</Translate>
              </span>
            </h2>

            <p className="text-xl leading-relaxed text-gray-600 dark:text-gray-300">
              <Translate>BifroMQ is a high-performance, distributed MQTT broker implementation that seamlessly integrates native multi-tenancy support.</Translate>
              {' '}
              <Translate>It is designed to support building large-scale IoT device connections and messaging systems, Currently, it serves as the foundational technology for Baidu IoT Core, a public cloud serverless service.</Translate>
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {coreFeatures.map((feature, index) => (
              <div
                key={index}
                className="group relative overflow-hidden"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="relative p-8 rounded-3xl bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-800/80 dark:to-gray-900/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-1">
                  {/* 渐变背景效果 */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl`}></div>

                  <div className="flex items-start space-x-6 relative z-10">
                    {/* 图标区域 */}
                    <div className="flex-shrink-0 flex flex-col items-center">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                        <feature.icon className="w-8 h-8 text-white" />
                      </div>

                      {/* 统计徽章 */}
                      <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-semibold text-gray-600 dark:text-gray-400">
                        {feature.stats}
                      </div>
                    </div>

                    {/* 内容区域 */}
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                        {feature.name}
                      </h3>

                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
                        {feature.description}
                      </p>

                      {/* 亮点信息 */}
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                        <CheckCircleIconSolid className="w-4 h-4 mr-2" />
                        {feature.highlight}
                      </div>
                    </div>
                  </div>

                  {/* 悬停光晕效果 */}
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-xl`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 性能对比区域 - 新增 */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-950 dark:to-blue-950 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16" data-animate id="performance">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              <Translate>Performance That Matters</Translate>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              <Translate>See how BifroMQ outperforms traditional MQTT brokers</Translate>
            </p>
          </div>

          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-800/50 shadow-2xl overflow-hidden">
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                    <Translate>Metric</Translate>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">
                    BifroMQ
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                    <Translate>Traditional</Translate>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-semibold text-green-600 dark:text-green-400 mb-2">
                    <Translate>Improvement</Translate>
                  </div>
                </div>
              </div>

              {performanceMetrics.map((metric, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-6 py-4 border-t border-gray-200/50 dark:border-gray-700/50">
                  <div className="font-medium text-gray-900 dark:text-white text-center md:text-left">
                    {metric.metric}
                  </div>
                  <div className="text-blue-600 dark:text-blue-400 font-bold text-center">
                    {metric.bifromq}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400 text-center">
                    {metric.competitor}
                  </div>
                  <div className="text-green-600 dark:text-green-400 font-semibold text-center">
                    {metric.improvement}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 使用案例区域 - 新增 */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16" data-animate id="use-cases">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              <Translate>Built for Every Use Case</Translate>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              <Translate>From IoT devices to enterprise applications, BifroMQ scales to meet your needs</Translate>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="group relative">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <useCase.icon className="w-6 h-6 text-white" />
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {useCase.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                    {useCase.description}
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {useCase.industries.map((industry, idx) => (
                      <span key={idx} className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                        {industry}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 附加功能区域 - 重新设计 */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16" data-animate id="additional-features">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              <Translate>Complete Feature Set</Translate>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              <Translate>Everything you need for production-ready MQTT messaging</Translate>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {additionalFeatures.map((feature, index) => (
              <div key={index} className="group relative">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-50/80 to-white/80 dark:from-gray-800/80 dark:to-gray-900/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  {/* 分类标签 */}
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-4">
                    {feature.category}
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <feature.solidIcon className="w-6 h-6 text-white" />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                        {feature.title}
                      </h3>

                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA 区域 - 重新设计 */}
      <CallToAction />
    </main>
  )
}
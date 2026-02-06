import { Title } from "@solidjs/meta";
import { Component, For } from "solid-js";
import Layout from "~/components/Layout";
import styles from "./features.module.css";

interface Feature {
  id: number;
  icon: string;
  title: string;
  description: string;
  color: string;
}

const features: Feature[] = [
  {
    id: 1,
    icon: "◉",
    title: "Responsive Design",
    description: "Seamlessly adapts to any screen size, from mobile devices to large desktop displays. Your content looks perfect everywhere.",
    color: "var(--color-terra-cotta)"
  },
  {
    id: 2,
    icon: "◈",
    title: "Fast Performance",
    description: "Optimized for speed with code splitting and lazy loading. Experience lightning-fast page loads and smooth interactions.",
    color: "var(--color-burnt-sienna)"
  },
  {
    id: 3,
    icon: "◬",
    title: "Warm Aesthetics",
    description: "Carefully curated earth tone palette creates a welcoming and natural feel that resonates with your audience.",
    color: "var(--color-desert-clay)"
  },
  {
    id: 4,
    icon: "◆",
    title: "Modern Framework",
    description: "Built with SolidJS for reactive performance and developer experience. Enjoy the benefits of cutting-edge technology.",
    color: "var(--color-olive)"
  },
  {
    id: 5,
    icon: "◐",
    title: "Accessible",
    description: "Designed with accessibility in mind, ensuring everyone can interact with your content comfortably and efficiently.",
    color: "var(--color-burnt-sienna)"
  },
  {
    id: 6,
    icon: "◎",
    title: "SEO Optimized",
    description: "Server-side rendering and proper meta tags help your content rank better and reach more people organically.",
    color: "var(--color-terra-cotta)"
  }
];

const FeatureCard: Component<{ feature: Feature }> = (props) => {
  return (
    <div class={styles.featureCard}>
      <div class={styles.featureIcon} style={{ color: props.feature.color }}>
        {props.feature.icon}
      </div>
      <h3 class={styles.featureTitle}>{props.feature.title}</h3>
      <p class={styles.featureDescription}>{props.feature.description}</p>
    </div>
  );
};

export default function Features() {
  return (
    <Layout>
      <Title>Features - Terra</Title>
      
      <section class={styles.featuresHero}>
        <div class="container">
          <div class={styles.heroContent}>
            <h1 class={styles.heroTitle}>Features That Matter</h1>
            <p class={styles.heroSubtitle}>
              Discover the thoughtful details and powerful capabilities that make Terra exceptional.
            </p>
          </div>
        </div>
      </section>
      
      <section class={styles.featuresSection}>
        <div class="container">
          <div class={styles.featuresGrid}>
            <For each={features}>
              {(feature) => <FeatureCard feature={feature} />}
            </For>
          </div>
        </div>
      </section>
      
      <section class={styles.ctaSection}>
        <div class="container">
          <div class={styles.ctaCard}>
            <h2 class={styles.ctaTitle}>Ready to Get Started?</h2>
            <p class={styles.ctaText}>
              Experience the perfect blend of design and functionality. Let's create something beautiful together.
            </p>
            <a href="/contact" class={styles.ctaButton}>
              Contact Us Today
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}

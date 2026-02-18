import { Title, Meta } from "@solidjs/meta";
import { A } from "@solidjs/router";
import Layout from "~/components/Layout";
import styles from "./index.module.css";

export default function Home() {
  return (
    <Layout>
      <Title>Terra - Where Design Meets Nature</Title>
      <Meta name="description" content="Terra brings warmth and elegance to digital design with natural earth tones. Experience the perfect harmony of nature and modern aesthetics." />
      
      <section class={styles.hero}>
        <div class="container">
          <div class={styles.heroContent}>
            <div class={styles.heroText}>
              <h1 class={styles.heroTitle}>
                Where Design
                <span class={styles.heroTitleAccent}> Meets Nature</span>
              </h1>
              <p class={styles.heroSubtitle}>
                Experience the perfect harmony of warm earth tones and modern design. 
                Our carefully crafted solutions bring natural elegance to your digital world.
              </p>
              <div class={styles.heroActions}>
                <A href="/features" class={styles.btnPrimary}>
                  Explore Features
                </A>
                <A href="/contact" class={styles.btnSecondary}>
                  Get in Touch
                </A>
              </div>
            </div>
            <div class={styles.heroVisual}>
              <div class={styles.visualCard}>
                <div class={styles.visualCardInner}>
                  <div class={styles.visualCircle}></div>
                  <div class={styles.visualSquare}></div>
                  <div class={styles.visualTriangle}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section class={styles.values}>
        <div class="container">
          <div class={styles.valuesGrid}>
            <div class={styles.valueCard}>
              <div class={styles.valueIcon}>◬</div>
              <h3 class={styles.valueTitle}>Organic Design</h3>
              <p class={styles.valueText}>
                Inspired by nature's palette, our designs feel warm and inviting.
              </p>
            </div>
            <div class={styles.valueCard}>
              <div class={styles.valueIcon}>◉</div>
              <h3 class={styles.valueTitle}>Modern Touch</h3>
              <p class={styles.valueText}>
                Contemporary aesthetics meet timeless earth tones for lasting appeal.
              </p>
            </div>
            <div class={styles.valueCard}>
              <div class={styles.valueIcon}>◈</div>
              <h3 class={styles.valueTitle}>Crafted Quality</h3>
              <p class={styles.valueText}>
                Every detail is carefully considered and meticulously executed.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

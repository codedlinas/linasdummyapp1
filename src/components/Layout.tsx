import { A } from "@solidjs/router";
import { Component, JSX } from "solid-js";
import styles from "./Layout.module.css";

interface LayoutProps {
  children: JSX.Element;
}

const Layout: Component<LayoutProps> = (props) => {
  return (
    <div class={styles.layout}>
      <header class={styles.header}>
        <nav class={styles.nav}>
          <div class="container">
            <div class={styles.navContent}>
              <A href="/" class={styles.logo}>
                <span class={styles.logoIcon}>◉</span>
                <span class={styles.logoText}>Terra</span>
              </A>
              <ul class={styles.navLinks}>
                <li>
                  <A href="/" class={styles.navLink} activeClass={styles.active} end>
                    Home
                  </A>
                </li>
                <li>
                  <A href="/features" class={styles.navLink} activeClass={styles.active}>
                    Features
                  </A>
                </li>
                <li>
                  <A href="/contact" class={styles.navLink} activeClass={styles.active}>
                    Contact
                  </A>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
      
      <main class={styles.main}>
        {props.children}
      </main>
      
      <footer class={styles.footer}>
        <div class="container">
          <div class={styles.footerContent}>
            <p class={styles.footerText}>
              © {new Date().getFullYear()} Terra. Crafted with care.
            </p>
            <div class={styles.footerLinks}>
              <a href="#privacy" class={styles.footerLink}>Privacy</a>
              <span class={styles.footerDivider}>·</span>
              <a href="#terms" class={styles.footerLink}>Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

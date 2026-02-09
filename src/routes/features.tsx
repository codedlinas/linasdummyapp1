import { Title } from "@solidjs/meta";
import { createSignal, For } from "solid-js";

export default function Features() {
  const [features] = createSignal([
    {
      title: "Reactive Performance",
      description: "Built on SolidJS for fine-grained reactivity that only updates what needs to change.",
      icon: "⚡"
    },
    {
      title: "File-Based Routing",
      description: "Intuitive routing structure that makes navigation simple and maintainable.",
      icon: "🗂️"
    },
    {
      title: "TypeScript Support",
      description: "Full type safety throughout the application for fewer bugs and better developer experience.",
      icon: "📘"
    },
    {
      title: "Modern Styling",
      description: "Carefully chosen warm color palette with responsive design for all devices.",
      icon: "🎨"
    },
    {
      title: "Code Splitting",
      description: "Automatic code splitting ensures fast initial load times and optimal performance.",
      icon: "📦"
    },
    {
      title: "Client Validation",
      description: "Smart form validation that provides instant feedback without server round trips.",
      icon: "✅"
    }
  ]);

  return (
    <>
      <Title>Features - Professional Webapp</Title>
      <main style={{
        "max-width": "1200px",
        margin: "0 auto",
        padding: "3rem 2rem"
      }}>
        <header style={{
          "text-align": "center",
          "margin-bottom": "3rem"
        }}>
          <h1 style={{
            "font-size": "2.5rem",
            color: "#a0522d",
            "margin-bottom": "1rem",
            "font-weight": "700"
          }}>
            Powerful Features
          </h1>
          <p style={{
            "font-size": "1.125rem",
            color: "#5a5a5a",
            "max-width": "600px",
            margin: "0 auto"
          }}>
            Everything you need for a modern, performant web application
          </p>
        </header>

        <div style={{
          display: "grid",
          "grid-template-columns": "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "2rem"
        }}>
          <For each={features()}>
            {(feature) => (
              <article style={{
                background: "#f5ebe0",
                padding: "2rem",
                "border-radius": "12px",
                "box-shadow": "0 4px 12px rgba(0,0,0,0.08)",
                border: "2px solid #d4a574",
                transition: "transform 0.2s ease"
              }}>
                <div style={{
                  "font-size": "2.5rem",
                  "margin-bottom": "1rem"
                }}>
                  {feature.icon}
                </div>
                <h2 style={{
                  color: "#8b4513",
                  "margin-bottom": "0.75rem",
                  "font-size": "1.375rem"
                }}>
                  {feature.title}
                </h2>
                <p style={{
                  color: "#5a5a5a",
                  "line-height": "1.7"
                }}>
                  {feature.description}
                </p>
              </article>
            )}
          </For>
        </div>

        <section style={{
          "margin-top": "4rem",
          padding: "2.5rem",
          background: "#e8d7c3",
          "border-radius": "12px",
          border: "2px solid #b8926f"
        }}>
          <h2 style={{
            color: "#6b5d4f",
            "margin-bottom": "1rem",
            "font-size": "1.75rem"
          }}>
            Why Choose Our Platform?
          </h2>
          <ul style={{
            "list-style": "none",
            display: "grid",
            gap: "0.75rem"
          }}>
            <li style={{ color: "#5a5a5a", "padding-left": "1.5rem", position: "relative" }}>
              <span style={{ position: "absolute", left: "0", color: "#8b4513" }}>•</span>
              No unnecessary dependencies or bloated frameworks
            </li>
            <li style={{ color: "#5a5a5a", "padding-left": "1.5rem", position: "relative" }}>
              <span style={{ position: "absolute", left: "0", color: "#8b4513" }}>•</span>
              Hand-crafted with attention to every detail
            </li>
            <li style={{ color: "#5a5a5a", "padding-left": "1.5rem", position: "relative" }}>
              <span style={{ position: "absolute", left: "0", color: "#8b4513" }}>•</span>
              Optimized for real-world performance, not just benchmarks
            </li>
            <li style={{ color: "#5a5a5a", "padding-left": "1.5rem", position: "relative" }}>
              <span style={{ position: "absolute", left: "0", color: "#8b4513" }}>•</span>
              Accessible and responsive across all devices
            </li>
          </ul>
        </section>

        <div style={{
          "text-align": "center",
          "margin-top": "3rem"
        }}>
          <a href="/contact" style={{
            display: "inline-block",
            background: "linear-gradient(135deg, #c77a5a 0%, #a0522d 100%)",
            color: "#faf6f1",
            padding: "1rem 2.5rem",
            "border-radius": "8px",
            "text-decoration": "none",
            "font-weight": "600",
            "box-shadow": "0 4px 12px rgba(0,0,0,0.15)"
          }}>
            Get in Touch
          </a>
        </div>
      </main>
    </>
  );
}

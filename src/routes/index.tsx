import { A } from "@solidjs/router";

export default function Home() {
  return (
    <div style={{
      "min-height": "100vh",
      "background-color": "#1a1a2e",
      "color": "#e0e0e0",
      "display": "flex",
      "flex-direction": "column",
      "align-items": "center",
      "justify-content": "center",
      "padding": "20px",
      "font-family": "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif"
    }}>
      <h1 style={{
        "font-size": "48px",
        "margin-bottom": "20px",
        "color": "#e0e0e0"
      }}>
        Welcome
      </h1>
      <p style={{
        "font-size": "18px",
        "margin-bottom": "30px",
        "color": "#b0b0b0"
      }}>
        SolidStart Contact Form Application
      </p>
      <A
        href="/contact"
        style={{
          "padding": "14px 32px",
          "background-color": "#8b5cf6",
          "color": "#ffffff",
          "text-decoration": "none",
          "border-radius": "8px",
          "font-size": "16px",
          "font-weight": "600",
          "transition": "all 0.3s ease"
        }}
      >
        Go to Contact Form
      </A>
    </div>
  );
}

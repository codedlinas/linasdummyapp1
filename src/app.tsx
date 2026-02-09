import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "./app.css";

export default function App() {
  return (
    <Router
      root={(props) => (
        <>
          <nav style={{
            background: "linear-gradient(135deg, #c77a5a 0%, #a0522d 100%)",
            padding: "1rem 2rem",
            "box-shadow": "0 2px 8px rgba(0,0,0,0.15)"
          }}>
            <div style={{
              "max-width": "1200px",
              margin: "0 auto",
              display: "flex",
              gap: "2rem",
              "align-items": "center"
            }}>
              <a href="/" style={{
                color: "#faf6f1",
                "text-decoration": "none",
                "font-weight": "600",
                "font-size": "1.25rem"
              }}>Home</a>
              <a href="/features" style={{
                color: "#faf6f1",
                "text-decoration": "none",
                "font-weight": "500"
              }}>Features</a>
              <a href="/contact" style={{
                color: "#faf6f1",
                "text-decoration": "none",
                "font-weight": "500"
              }}>Contact</a>
            </div>
          </nav>
          <Suspense>{props.children}</Suspense>
        </>
      )}
    >
      <FileRoutes />
    </Router>
  );
}

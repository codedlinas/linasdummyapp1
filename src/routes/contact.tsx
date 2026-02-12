import { createSignal } from "solid-js";

export default function Contact() {
  const [formData, setFormData] = createSignal({
    name: "",
    email: "",
    message: ""
  });

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    // Form submission logic will be added later
    console.log("Form submitted:", formData());
  };

  return (
    <div style={{
      "min-height": "100vh",
      "background-color": "#1a1a2e",
      "color": "#e0e0e0",
      "display": "flex",
      "align-items": "center",
      "justify-content": "center",
      "padding": "20px",
      "font-family": "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif"
    }}>
      <div style={{
        "max-width": "600px",
        "width": "100%",
        "background-color": "#16213e",
        "padding": "40px",
        "border-radius": "12px",
        "box-shadow": "0 8px 32px rgba(0, 0, 0, 0.3)"
      }}>
        <h1 style={{
          "font-size": "32px",
          "margin-bottom": "10px",
          "color": "#e0e0e0",
          "font-weight": "700"
        }}>
          Get in Touch
        </h1>
        <p style={{
          "margin-bottom": "30px",
          "color": "#b0b0b0",
          "font-size": "16px"
        }}>
          We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ "margin-bottom": "24px" }}>
            <label
              for="name"
              style={{
                "display": "block",
                "margin-bottom": "8px",
                "color": "#e0e0e0",
                "font-weight": "500",
                "font-size": "14px"
              }}
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              value={formData().name}
              onInput={(e) => setFormData({ ...formData(), name: e.currentTarget.value })}
              style={{
                "width": "100%",
                "padding": "12px 16px",
                "background-color": "#1a1a2e",
                "border": "2px solid #2e3a5a",
                "border-radius": "8px",
                "color": "#e0e0e0",
                "font-size": "16px",
                "outline": "none",
                "transition": "border-color 0.3s ease",
                "box-sizing": "border-box"
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = "#8b5cf6"}
              onBlur={(e) => e.currentTarget.style.borderColor = "#2e3a5a"}
              placeholder="Enter your name"
            />
          </div>

          <div style={{ "margin-bottom": "24px" }}>
            <label
              for="email"
              style={{
                "display": "block",
                "margin-bottom": "8px",
                "color": "#e0e0e0",
                "font-weight": "500",
                "font-size": "14px"
              }}
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData().email}
              onInput={(e) => setFormData({ ...formData(), email: e.currentTarget.value })}
              style={{
                "width": "100%",
                "padding": "12px 16px",
                "background-color": "#1a1a2e",
                "border": "2px solid #2e3a5a",
                "border-radius": "8px",
                "color": "#e0e0e0",
                "font-size": "16px",
                "outline": "none",
                "transition": "border-color 0.3s ease",
                "box-sizing": "border-box"
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = "#8b5cf6"}
              onBlur={(e) => e.currentTarget.style.borderColor = "#2e3a5a"}
              placeholder="Enter your email"
            />
          </div>

          <div style={{ "margin-bottom": "32px" }}>
            <label
              for="message"
              style={{
                "display": "block",
                "margin-bottom": "8px",
                "color": "#e0e0e0",
                "font-weight": "500",
                "font-size": "14px"
              }}
            >
              Message
            </label>
            <textarea
              id="message"
              value={formData().message}
              onInput={(e) => setFormData({ ...formData(), message: e.currentTarget.value })}
              rows={6}
              style={{
                "width": "100%",
                "padding": "12px 16px",
                "background-color": "#1a1a2e",
                "border": "2px solid #2e3a5a",
                "border-radius": "8px",
                "color": "#e0e0e0",
                "font-size": "16px",
                "outline": "none",
                "transition": "border-color 0.3s ease",
                "resize": "vertical",
                "font-family": "inherit",
                "box-sizing": "border-box"
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = "#8b5cf6"}
              onBlur={(e) => e.currentTarget.style.borderColor = "#2e3a5a"}
              placeholder="Enter your message"
            />
          </div>

          <button
            type="submit"
            style={{
              "width": "100%",
              "padding": "14px 24px",
              "background-color": "#8b5cf6",
              "color": "#ffffff",
              "border": "none",
              "border-radius": "8px",
              "font-size": "16px",
              "font-weight": "600",
              "cursor": "pointer",
              "transition": "all 0.3s ease",
              "box-shadow": "0 4px 12px rgba(139, 92, 246, 0.3)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#7c3aed";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 16px rgba(139, 92, 246, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#8b5cf6";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(139, 92, 246, 0.3)";
            }}
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}

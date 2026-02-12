import { Component } from "solid-js";

const Contact: Component = () => {
  return (
    <div
      style={{
        "min-height": "100vh",
        "background-color": "#1a1a2e",
        "color": "#e0e0e0",
        "font-family": "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        "padding": "2rem",
        "display": "flex",
        "align-items": "center",
        "justify-content": "center",
      }}
    >
      <div
        style={{
          "max-width": "600px",
          "width": "100%",
          "background-color": "#16213e",
          "border-radius": "16px",
          "padding": "3rem",
          "box-shadow": "0 10px 30px rgba(0, 0, 0, 0.3)",
        }}
      >
        <h1
          style={{
            "font-size": "2.5rem",
            "font-weight": "bold",
            "margin-bottom": "0.5rem",
            "color": "#ffffff",
            "text-align": "center",
          }}
        >
          Contact Us
        </h1>
        <p
          style={{
            "text-align": "center",
            "color": "#b0b0b0",
            "margin-bottom": "2rem",
            "font-size": "1rem",
          }}
        >
          We'd love to hear from you. Send us a message!
        </p>

        <form
          style={{
            "display": "flex",
            "flex-direction": "column",
            "gap": "1.5rem",
          }}
        >
          {/* Name Field */}
          <div
            style={{
              "display": "flex",
              "flex-direction": "column",
              "gap": "0.5rem",
            }}
          >
            <label
              for="name"
              style={{
                "font-weight": "500",
                "font-size": "0.95rem",
                "color": "#e0e0e0",
              }}
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              style={{
                "padding": "0.875rem 1rem",
                "background-color": "#0f1729",
                "border": "2px solid #2a3f5f",
                "border-radius": "8px",
                "color": "#e0e0e0",
                "font-size": "1rem",
                "outline": "none",
                "transition": "border-color 0.3s ease",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#8b5cf6";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#2a3f5f";
              }}
            />
          </div>

          {/* Email Field */}
          <div
            style={{
              "display": "flex",
              "flex-direction": "column",
              "gap": "0.5rem",
            }}
          >
            <label
              for="email"
              style={{
                "font-weight": "500",
                "font-size": "0.95rem",
                "color": "#e0e0e0",
              }}
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              style={{
                "padding": "0.875rem 1rem",
                "background-color": "#0f1729",
                "border": "2px solid #2a3f5f",
                "border-radius": "8px",
                "color": "#e0e0e0",
                "font-size": "1rem",
                "outline": "none",
                "transition": "border-color 0.3s ease",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#8b5cf6";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#2a3f5f";
              }}
            />
          </div>

          {/* Message Field */}
          <div
            style={{
              "display": "flex",
              "flex-direction": "column",
              "gap": "0.5rem",
            }}
          >
            <label
              for="message"
              style={{
                "font-weight": "500",
                "font-size": "0.95rem",
                "color": "#e0e0e0",
              }}
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              placeholder="Enter your message"
              rows={6}
              style={{
                "padding": "0.875rem 1rem",
                "background-color": "#0f1729",
                "border": "2px solid #2a3f5f",
                "border-radius": "8px",
                "color": "#e0e0e0",
                "font-size": "1rem",
                "outline": "none",
                "transition": "border-color 0.3s ease",
                "resize": "vertical",
                "font-family": "inherit",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#8b5cf6";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#2a3f5f";
              }}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            style={{
              "padding": "1rem",
              "background-color": "#8b5cf6",
              "color": "#ffffff",
              "border": "none",
              "border-radius": "8px",
              "font-size": "1rem",
              "font-weight": "600",
              "cursor": "pointer",
              "transition": "all 0.3s ease",
              "margin-top": "0.5rem",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#7c3aed";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(139, 92, 246, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#8b5cf6";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;

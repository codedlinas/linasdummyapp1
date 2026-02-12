import { createSignal } from "solid-js";

export default function Contact() {
  const [name, setName] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [message, setMessage] = createSignal("");

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    // Form submission logic will be added later
    console.log({ name: name(), email: email(), message: message() });
  };

  return (
    <div
      style={{
        "min-height": "100vh",
        "background-color": "#1a1a2e",
        display: "flex",
        "justify-content": "center",
        "align-items": "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          "max-width": "600px",
          width: "100%",
          padding: "40px",
          "background-color": "#16213e",
          "border-radius": "12px",
          "box-shadow": "0 8px 32px rgba(0, 0, 0, 0.3)",
        }}
      >
        <h1
          style={{
            color: "#e0e0e0",
            "font-size": "32px",
            "margin-bottom": "8px",
            "font-weight": "700",
            "text-align": "center",
          }}
        >
          Contact Us
        </h1>
        <p
          style={{
            color: "#a0a0a0",
            "font-size": "16px",
            "margin-bottom": "32px",
            "text-align": "center",
          }}
        >
          We'd love to hear from you. Send us a message!
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ "margin-bottom": "24px" }}>
            <label
              for="name"
              style={{
                display: "block",
                color: "#e0e0e0",
                "font-size": "14px",
                "font-weight": "600",
                "margin-bottom": "8px",
              }}
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name()}
              onInput={(e) => setName(e.currentTarget.value)}
              style={{
                width: "100%",
                padding: "12px 16px",
                "background-color": "#1a1a2e",
                border: "2px solid #2d3561",
                "border-radius": "8px",
                color: "#e0e0e0",
                "font-size": "16px",
                outline: "none",
                transition: "border-color 0.3s ease",
                "box-sizing": "border-box",
              }}
              onFocus={(e) =>
                (e.currentTarget.style.borderColor = "#8b5cf6")
              }
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = "#2d3561")
              }
              placeholder="Enter your name"
            />
          </div>

          <div style={{ "margin-bottom": "24px" }}>
            <label
              for="email"
              style={{
                display: "block",
                color: "#e0e0e0",
                "font-size": "14px",
                "font-weight": "600",
                "margin-bottom": "8px",
              }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email()}
              onInput={(e) => setEmail(e.currentTarget.value)}
              style={{
                width: "100%",
                padding: "12px 16px",
                "background-color": "#1a1a2e",
                border: "2px solid #2d3561",
                "border-radius": "8px",
                color: "#e0e0e0",
                "font-size": "16px",
                outline: "none",
                transition: "border-color 0.3s ease",
                "box-sizing": "border-box",
              }}
              onFocus={(e) =>
                (e.currentTarget.style.borderColor = "#8b5cf6")
              }
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = "#2d3561")
              }
              placeholder="Enter your email"
            />
          </div>

          <div style={{ "margin-bottom": "32px" }}>
            <label
              for="message"
              style={{
                display: "block",
                color: "#e0e0e0",
                "font-size": "14px",
                "font-weight": "600",
                "margin-bottom": "8px",
              }}
            >
              Message
            </label>
            <textarea
              id="message"
              value={message()}
              onInput={(e) => setMessage(e.currentTarget.value)}
              rows={6}
              style={{
                width: "100%",
                padding: "12px 16px",
                "background-color": "#1a1a2e",
                border: "2px solid #2d3561",
                "border-radius": "8px",
                color: "#e0e0e0",
                "font-size": "16px",
                outline: "none",
                transition: "border-color 0.3s ease",
                "box-sizing": "border-box",
                resize: "vertical",
                "font-family": "inherit",
              }}
              onFocus={(e) =>
                (e.currentTarget.style.borderColor = "#8b5cf6")
              }
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = "#2d3561")
              }
              placeholder="Enter your message"
            />
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "14px 24px",
              "background-color": "#8b5cf6",
              color: "#ffffff",
              border: "none",
              "border-radius": "8px",
              "font-size": "16px",
              "font-weight": "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
              "box-shadow": "0 4px 12px rgba(139, 92, 246, 0.3)",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#7c3aed";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 6px 16px rgba(139, 92, 246, 0.4)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#8b5cf6";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(139, 92, 246, 0.3)";
            }}
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}

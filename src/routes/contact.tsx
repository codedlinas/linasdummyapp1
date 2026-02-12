import { createSignal, Show } from "solid-js";

export default function Contact() {
  const [name, setName] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [message, setMessage] = createSignal("");

  // Error state signals
  const [nameError, setNameError] = createSignal("");
  const [emailError, setEmailError] = createSignal("");
  const [messageError, setMessageError] = createSignal("");

  // Email validation helper
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate all fields and return true if valid
  const validateForm = (): boolean => {
    let isValid = true;

    // Validate name
    if (!name().trim()) {
      setNameError("Name is required");
      isValid = false;
    } else {
      setNameError("");
    }

    // Validate email
    if (!email().trim()) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!isValidEmail(email().trim())) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    } else {
      setEmailError("");
    }

    // Validate message
    if (!message().trim()) {
      setMessageError("Message is required");
      isValid = false;
    } else {
      setMessageError("");
    }

    return isValid;
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    // Form submission logic
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
              onInput={(e) => {
                setName(e.currentTarget.value);
                if (nameError()) setNameError("");
              }}
              style={{
                width: "100%",
                padding: "12px 16px",
                "background-color": "#1a1a2e",
                border: `2px solid ${nameError() ? "#ef4444" : "#2d3561"}`,
                "border-radius": "8px",
                color: "#e0e0e0",
                "font-size": "16px",
                outline: "none",
                transition: "border-color 0.3s ease",
                "box-sizing": "border-box",
              }}
              onFocus={(e) =>
                (e.currentTarget.style.borderColor = nameError() ? "#ef4444" : "#8b5cf6")
              }
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = nameError() ? "#ef4444" : "#2d3561")
              }
              placeholder="Enter your name"
            />
            <Show when={nameError()}>
              <p
                style={{
                  color: "#ef4444",
                  "font-size": "12px",
                  "margin-top": "6px",
                  "margin-bottom": "0",
                }}
              >
                {nameError()}
              </p>
            </Show>
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
              onInput={(e) => {
                setEmail(e.currentTarget.value);
                if (emailError()) setEmailError("");
              }}
              style={{
                width: "100%",
                padding: "12px 16px",
                "background-color": "#1a1a2e",
                border: `2px solid ${emailError() ? "#ef4444" : "#2d3561"}`,
                "border-radius": "8px",
                color: "#e0e0e0",
                "font-size": "16px",
                outline: "none",
                transition: "border-color 0.3s ease",
                "box-sizing": "border-box",
              }}
              onFocus={(e) =>
                (e.currentTarget.style.borderColor = emailError() ? "#ef4444" : "#8b5cf6")
              }
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = emailError() ? "#ef4444" : "#2d3561")
              }
              placeholder="Enter your email"
            />
            <Show when={emailError()}>
              <p
                style={{
                  color: "#ef4444",
                  "font-size": "12px",
                  "margin-top": "6px",
                  "margin-bottom": "0",
                }}
              >
                {emailError()}
              </p>
            </Show>
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
              onInput={(e) => {
                setMessage(e.currentTarget.value);
                if (messageError()) setMessageError("");
              }}
              rows={6}
              style={{
                width: "100%",
                padding: "12px 16px",
                "background-color": "#1a1a2e",
                border: `2px solid ${messageError() ? "#ef4444" : "#2d3561"}`,
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
                (e.currentTarget.style.borderColor = messageError() ? "#ef4444" : "#8b5cf6")
              }
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = messageError() ? "#ef4444" : "#2d3561")
              }
              placeholder="Enter your message"
            />
            <Show when={messageError()}>
              <p
                style={{
                  color: "#ef4444",
                  "font-size": "12px",
                  "margin-top": "6px",
                  "margin-bottom": "0",
                }}
              >
                {messageError()}
              </p>
            </Show>
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

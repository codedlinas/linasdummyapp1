import { Component, createSignal } from "solid-js";

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const Contact: Component = () => {
  // Form state
  const [name, setName] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [message, setMessage] = createSignal("");
  const [errors, setErrors] = createSignal<FormErrors>({});
  const [submitted, setSubmitted] = createSignal(false);

  // Email validation regex
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate form fields
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!name().trim()) {
      newErrors.name = "Name is required";
    }

    // Email validation
    if (!email().trim()) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(email())) {
      newErrors.email = "Please enter a valid email address";
    }

    // Message validation
    if (!message().trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: Event) => {
    e.preventDefault();
    
    if (validateForm()) {
      setSubmitted(true);
      // Form is valid - in a real app, you would send the data here
      console.log("Form submitted:", { name: name(), email: email(), message: message() });
    }
  };

  // Error message style
  const errorStyle = {
    "color": "#f87171",
    "font-size": "0.85rem",
    "margin-top": "0.25rem",
  };

  // Input style with error state
  const getInputStyle = (hasError: boolean) => ({
    "padding": "0.875rem 1rem",
    "background-color": "#0f1729",
    "border": `2px solid ${hasError ? "#f87171" : "#2a3f5f"}`,
    "border-radius": "8px",
    "color": "#e0e0e0",
    "font-size": "1rem",
    "outline": "none",
    "transition": "border-color 0.3s ease",
  });

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

        {submitted() ? (
          <div
            style={{
              "text-align": "center",
              "padding": "2rem",
              "background-color": "#0f1729",
              "border-radius": "8px",
              "border": "2px solid #22c55e",
            }}
          >
            <p style={{ "color": "#22c55e", "font-size": "1.25rem", "font-weight": "600" }}>
              Thank you for your message!
            </p>
            <p style={{ "color": "#b0b0b0", "margin-top": "0.5rem" }}>
              We'll get back to you soon.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
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
                Name <span style={{ "color": "#f87171" }}>*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your name"
                value={name()}
                onInput={(e) => setName(e.currentTarget.value)}
                style={getInputStyle(!!errors().name)}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#8b5cf6";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = errors().name ? "#f87171" : "#2a3f5f";
                }}
              />
              {errors().name && (
                <span style={errorStyle}>{errors().name}</span>
              )}
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
                Email <span style={{ "color": "#f87171" }}>*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={email()}
                onInput={(e) => setEmail(e.currentTarget.value)}
                style={getInputStyle(!!errors().email)}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#8b5cf6";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = errors().email ? "#f87171" : "#2a3f5f";
                }}
              />
              {errors().email && (
                <span style={errorStyle}>{errors().email}</span>
              )}
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
                Message <span style={{ "color": "#f87171" }}>*</span>
              </label>
              <textarea
                id="message"
                name="message"
                placeholder="Enter your message"
                rows={6}
                value={message()}
                onInput={(e) => setMessage(e.currentTarget.value)}
                style={{
                  ...getInputStyle(!!errors().message),
                  "resize": "vertical",
                  "font-family": "inherit",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#8b5cf6";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = errors().message ? "#f87171" : "#2a3f5f";
                }}
              />
              {errors().message && (
                <span style={errorStyle}>{errors().message}</span>
              )}
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
        )}
      </div>
    </div>
  );
};

export default Contact;

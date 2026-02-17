import { Title } from "@solidjs/meta";
import { createSignal } from "solid-js";

export default function Contact() {
  const [formData, setFormData] = createSignal({
    name: "",
    email: "",
    message: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    // Validation will be added later
    console.log("Form submitted:", formData());
  };

  const pageStyles = {
    minHeight: "100vh",
    backgroundColor: "#1a1a2e",
    color: "#e0e0e0",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  };

  const containerStyles = {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "60px 20px"
  };

  const headerStyles = {
    textAlign: "center" as const,
    marginBottom: "50px"
  };

  const titleStyles = {
    fontSize: "2.5rem",
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: "12px"
  };

  const subtitleStyles = {
    fontSize: "1.1rem",
    color: "#a0a0a0",
    maxWidth: "400px",
    margin: "0 auto",
    lineHeight: "1.6"
  };

  const formStyles = {
    backgroundColor: "#242444",
    borderRadius: "16px",
    padding: "40px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)"
  };

  const formGroupStyles = {
    marginBottom: "24px"
  };

  const labelStyles = {
    display: "block",
    fontSize: "0.9rem",
    fontWeight: "500",
    color: "#e0e0e0",
    marginBottom: "8px"
  };

  const inputStyles = {
    width: "100%",
    padding: "14px 16px",
    fontSize: "1rem",
    backgroundColor: "#1a1a2e",
    border: "2px solid #3d3d5c",
    borderRadius: "8px",
    color: "#e0e0e0",
    outline: "none",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
    boxSizing: "border-box" as const
  };

  const textareaStyles = {
    ...inputStyles,
    resize: "vertical" as const,
    minHeight: "150px"
  };

  const buttonStyles = {
    width: "100%",
    padding: "16px 24px",
    fontSize: "1rem",
    fontWeight: "600",
    backgroundColor: "#8b5cf6",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.2s ease, transform 0.1s ease",
    marginTop: "8px"
  };

  const buttonHoverStyles = {
    backgroundColor: "#7c3aed"
  };

  return (
    <div style={pageStyles}>
      <Title>Contact Us</Title>
      
      <div style={containerStyles}>
        <header style={headerStyles}>
          <h1 style={titleStyles}>Get in Touch</h1>
          <p style={subtitleStyles}>
            Have a question or want to work together? We'd love to hear from you.
          </p>
        </header>

        <form onSubmit={handleSubmit} style={formStyles}>
          <div style={formGroupStyles}>
            <label for="name" style={labelStyles}>Name</label>
            <input
              type="text"
              id="name"
              style={inputStyles}
              value={formData().name}
              onInput={(e) => handleInputChange('name', e.currentTarget.value)}
              placeholder="Your full name"
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#8b5cf6";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(139, 92, 246, 0.2)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#3d3d5c";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>

          <div style={formGroupStyles}>
            <label for="email" style={labelStyles}>Email</label>
            <input
              type="email"
              id="email"
              style={inputStyles}
              value={formData().email}
              onInput={(e) => handleInputChange('email', e.currentTarget.value)}
              placeholder="you@example.com"
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#8b5cf6";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(139, 92, 246, 0.2)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#3d3d5c";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>

          <div style={formGroupStyles}>
            <label for="message" style={labelStyles}>Message</label>
            <textarea
              id="message"
              style={textareaStyles}
              value={formData().message}
              onInput={(e) => handleInputChange('message', e.currentTarget.value)}
              placeholder="Tell us what's on your mind..."
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#8b5cf6";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(139, 92, 246, 0.2)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#3d3d5c";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>

          <button
            type="submit"
            style={buttonStyles}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = buttonHoverStyles.backgroundColor;
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = buttonStyles.backgroundColor;
              e.currentTarget.style.transform = "translateY(0)";
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}

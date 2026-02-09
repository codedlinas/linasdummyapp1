import { Title } from "@solidjs/meta";
import { createSignal, onCleanup } from "solid-js";

export default function Contact() {
  const [name, setName] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [message, setMessage] = createSignal("");
  const [errors, setErrors] = createSignal<Record<string, string>>({});
  const [submitSuccess, setSubmitSuccess] = createSignal(false);
  const [isSubmitting, setIsSubmitting] = createSignal(false);
  
  // Store timeout ID in a signal for proper cleanup
  const [timeoutId, setTimeoutId] = createSignal<number | null>(null);

  // Proper use of onCleanup at component level
  onCleanup(() => {
    const id = timeoutId();
    if (id !== null) {
      clearTimeout(id);
    }
  });

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name().trim()) {
      newErrors.name = "Name is required";
    }

    if (!email().trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email())) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!message().trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Clear form and show success
    setName("");
    setEmail("");
    setMessage("");
    setErrors({});
    setIsSubmitting(false);
    setSubmitSuccess(true);

    // Clear any existing timeout before setting a new one
    const existingId = timeoutId();
    if (existingId !== null) {
      clearTimeout(existingId);
    }

    // Set new timeout and store its ID
    const id = window.setTimeout(() => {
      setSubmitSuccess(false);
    }, 5000);
    setTimeoutId(id);
  };

  return (
    <>
      <Title>Contact - Professional Webapp</Title>
      <main style={{
        "max-width": "800px",
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
            Get in Touch
          </h1>
          <p style={{
            "font-size": "1.125rem",
            color: "#5a5a5a"
          }}>
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </header>

        {submitSuccess() && (
          <div style={{
            background: "#d4edda",
            color: "#155724",
            padding: "1rem 1.5rem",
            "border-radius": "8px",
            "margin-bottom": "2rem",
            border: "1px solid #c3e6cb"
          }}>
            Thank you! Your message has been sent successfully.
          </div>
        )}

        <form onSubmit={handleSubmit} style={{
          background: "#f5ebe0",
          padding: "2.5rem",
          "border-radius": "12px",
          "box-shadow": "0 4px 12px rgba(0,0,0,0.08)",
          border: "2px solid #d4a574"
        }}>
          <div style={{ "margin-bottom": "1.5rem" }}>
            <label for="name" style={{
              display: "block",
              "margin-bottom": "0.5rem",
              color: "#8b4513",
              "font-weight": "600"
            }}>
              Name *
            </label>
            <input
              id="name"
              type="text"
              value={name()}
              onInput={(e) => setName(e.currentTarget.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                "border-radius": "6px",
                border: errors().name ? "2px solid #dc3545" : "2px solid #d4a574",
                "font-size": "1rem",
                background: "#faf6f1"
              }}
              aria-invalid={!!errors().name}
              aria-describedby={errors().name ? "name-error" : undefined}
            />
            {errors().name && (
              <p id="name-error" style={{
                color: "#dc3545",
                "font-size": "0.875rem",
                "margin-top": "0.25rem"
              }}>
                {errors().name}
              </p>
            )}
          </div>

          <div style={{ "margin-bottom": "1.5rem" }}>
            <label for="email" style={{
              display: "block",
              "margin-bottom": "0.5rem",
              color: "#8b4513",
              "font-weight": "600"
            }}>
              Email *
            </label>
            <input
              id="email"
              type="email"
              value={email()}
              onInput={(e) => setEmail(e.currentTarget.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                "border-radius": "6px",
                border: errors().email ? "2px solid #dc3545" : "2px solid #d4a574",
                "font-size": "1rem",
                background: "#faf6f1"
              }}
              aria-invalid={!!errors().email}
              aria-describedby={errors().email ? "email-error" : undefined}
            />
            {errors().email && (
              <p id="email-error" style={{
                color: "#dc3545",
                "font-size": "0.875rem",
                "margin-top": "0.25rem"
              }}>
                {errors().email}
              </p>
            )}
          </div>

          <div style={{ "margin-bottom": "1.5rem" }}>
            <label for="message" style={{
              display: "block",
              "margin-bottom": "0.5rem",
              color: "#8b4513",
              "font-weight": "600"
            }}>
              Message *
            </label>
            <textarea
              id="message"
              value={message()}
              onInput={(e) => setMessage(e.currentTarget.value)}
              rows={6}
              style={{
                width: "100%",
                padding: "0.75rem",
                "border-radius": "6px",
                border: errors().message ? "2px solid #dc3545" : "2px solid #d4a574",
                "font-size": "1rem",
                background: "#faf6f1",
                resize: "vertical"
              }}
              aria-invalid={!!errors().message}
              aria-describedby={errors().message ? "message-error" : undefined}
            />
            {errors().message && (
              <p id="message-error" style={{
                color: "#dc3545",
                "font-size": "0.875rem",
                "margin-top": "0.25rem"
              }}>
                {errors().message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting()}
            style={{
              width: "100%",
              background: isSubmitting() 
                ? "#9a7462" 
                : "linear-gradient(135deg, #c77a5a 0%, #a0522d 100%)",
              color: "#faf6f1",
              padding: "1rem",
              "border-radius": "8px",
              border: "none",
              "font-size": "1.125rem",
              "font-weight": "600",
              "box-shadow": "0 4px 12px rgba(0,0,0,0.15)",
              opacity: isSubmitting() ? 0.7 : 1
            }}
          >
            {isSubmitting() ? "Sending..." : "Send Message"}
          </button>
        </form>

        <div style={{
          "margin-top": "3rem",
          padding: "2rem",
          background: "#e8d7c3",
          "border-radius": "12px",
          border: "2px solid #b8926f"
        }}>
          <h2 style={{
            color: "#6b5d4f",
            "margin-bottom": "1rem",
            "font-size": "1.5rem"
          }}>
            Other Ways to Reach Us
          </h2>
          <p style={{ color: "#5a5a5a", "margin-bottom": "0.5rem" }}>
            <strong>Email:</strong> hello@example.com
          </p>
          <p style={{ color: "#5a5a5a" }}>
            <strong>Phone:</strong> (555) 123-4567
          </p>
        </div>
      </main>
    </>
  );
}

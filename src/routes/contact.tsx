import { Title } from "@solidjs/meta";
import { createSignal, createEffect, Component, Show, onCleanup } from "solid-js";
import Layout from "~/components/Layout";
import styles from "./contact.module.css";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export default function Contact() {
  const [formData, setFormData] = createSignal<FormData>({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  
  const [errors, setErrors] = createSignal<FormErrors>({});
  const [touched, setTouched] = createSignal<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = createSignal(false);
  const [submitSuccess, setSubmitSuccess] = createSignal(false);
  
  // Email validation regex
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  // Validate form on data change
  createEffect(() => {
    const data = formData();
    const newErrors: FormErrors = {};
    
    // Validate name
    if (touched().has('name')) {
      if (!data.name.trim()) {
        newErrors.name = "Name is required";
      } else if (data.name.trim().length < 2) {
        newErrors.name = "Name must be at least 2 characters";
      }
    }
    
    // Validate email
    if (touched().has('email')) {
      if (!data.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!validateEmail(data.email)) {
        newErrors.email = "Please enter a valid email address";
      }
    }
    
    // Validate subject
    if (touched().has('subject')) {
      if (!data.subject.trim()) {
        newErrors.subject = "Subject is required";
      } else if (data.subject.trim().length < 3) {
        newErrors.subject = "Subject must be at least 3 characters";
      }
    }
    
    // Validate message
    if (touched().has('message')) {
      if (!data.message.trim()) {
        newErrors.message = "Message is required";
      } else if (data.message.trim().length < 10) {
        newErrors.message = "Message must be at least 10 characters";
      }
    }
    
    setErrors(newErrors);
  });
  
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleBlur = (field: string) => {
    setTouched(prev => {
      const newSet = new Set(prev);
      newSet.add(field);
      return newSet;
    });
  };
  
  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched(new Set<string>(['name', 'email', 'subject', 'message']));
    
    // Trigger validation
    const data = formData();
    const validationErrors: FormErrors = {};
    
    if (!data.name.trim()) {
      validationErrors.name = "Name is required";
    } else if (data.name.trim().length < 2) {
      validationErrors.name = "Name must be at least 2 characters";
    }
    
    if (!data.email.trim()) {
      validationErrors.email = "Email is required";
    } else if (!validateEmail(data.email)) {
      validationErrors.email = "Please enter a valid email address";
    }
    
    if (!data.subject.trim()) {
      validationErrors.subject = "Subject is required";
    } else if (data.subject.trim().length < 3) {
      validationErrors.subject = "Subject must be at least 3 characters";
    }
    
    if (!data.message.trim()) {
      validationErrors.message = "Message is required";
    } else if (data.message.trim().length < 10) {
      validationErrors.message = "Message must be at least 10 characters";
    }
    
    setErrors(validationErrors);
    
    // If there are errors, don't submit
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    
    // Simulate form submission
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success
      setSubmitSuccess(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
      setTouched(new Set<string>());
      
      // Reset success message after 5 seconds
      const timeoutId = setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
      
      onCleanup(() => clearTimeout(timeoutId));
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Layout>
      <Title>Contact Us - Terra</Title>
      
      <section class={styles.contactHero}>
        <div class="container">
          <div class={styles.heroContent}>
            <h1 class={styles.heroTitle}>Get in Touch</h1>
            <p class={styles.heroSubtitle}>
              Have a question or want to work together? We'd love to hear from you.
            </p>
          </div>
        </div>
      </section>
      
      <section class={styles.contactSection}>
        <div class="container">
          <div class={styles.contactContent}>
            <div class={styles.contactInfo}>
              <h2 class={styles.infoTitle}>Let's Connect</h2>
              <p class={styles.infoText}>
                Fill out the form and we'll get back to you as soon as possible. 
                We're here to help bring your ideas to life.
              </p>
              
              <div class={styles.infoCards}>
                <div class={styles.infoCard}>
                  <div class={styles.infoIcon}>✉</div>
                  <h3 class={styles.infoCardTitle}>Email</h3>
                  <p class={styles.infoCardText}>hello@terra.design</p>
                </div>
                
                <div class={styles.infoCard}>
                  <div class={styles.infoIcon}>◎</div>
                  <h3 class={styles.infoCardTitle}>Response Time</h3>
                  <p class={styles.infoCardText}>Within 24 hours</p>
                </div>
              </div>
            </div>
            
            <div class={styles.formContainer}>
              <Show when={submitSuccess()}>
                <div class={styles.successMessage}>
                  <div class={styles.successIcon}>✓</div>
                  <h3 class={styles.successTitle}>Message Sent!</h3>
                  <p class={styles.successText}>Thank you for reaching out. We'll get back to you soon.</p>
                </div>
              </Show>
              
              <form onSubmit={handleSubmit} class={styles.form} novalidate>
                <div class={styles.formGroup}>
                  <label for="name" class={styles.label}>
                    Name <span class={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    class={styles.input}
                    classList={{ [styles.inputError]: !!errors().name }}
                    value={formData().name}
                    onInput={(e) => handleInputChange('name', e.currentTarget.value)}
                    onBlur={() => handleBlur('name')}
                    placeholder="Your full name"
                  />
                  <Show when={errors().name}>
                    <span class={styles.errorMessage}>{errors().name}</span>
                  </Show>
                </div>
                
                <div class={styles.formGroup}>
                  <label for="email" class={styles.label}>
                    Email <span class={styles.required}>*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    class={styles.input}
                    classList={{ [styles.inputError]: !!errors().email }}
                    value={formData().email}
                    onInput={(e) => handleInputChange('email', e.currentTarget.value)}
                    onBlur={() => handleBlur('email')}
                    placeholder="your@email.com"
                  />
                  <Show when={errors().email}>
                    <span class={styles.errorMessage}>{errors().email}</span>
                  </Show>
                </div>
                
                <div class={styles.formGroup}>
                  <label for="subject" class={styles.label}>
                    Subject <span class={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    id="subject"
                    class={styles.input}
                    classList={{ [styles.inputError]: !!errors().subject }}
                    value={formData().subject}
                    onInput={(e) => handleInputChange('subject', e.currentTarget.value)}
                    onBlur={() => handleBlur('subject')}
                    placeholder="What's this about?"
                  />
                  <Show when={errors().subject}>
                    <span class={styles.errorMessage}>{errors().subject}</span>
                  </Show>
                </div>
                
                <div class={styles.formGroup}>
                  <label for="message" class={styles.label}>
                    Message <span class={styles.required}>*</span>
                  </label>
                  <textarea
                    id="message"
                    class={styles.textarea}
                    classList={{ [styles.inputError]: !!errors().message }}
                    value={formData().message}
                    onInput={(e) => handleInputChange('message', e.currentTarget.value)}
                    onBlur={() => handleBlur('message')}
                    placeholder="Tell us more about your project or question..."
                    rows="6"
                  />
                  <Show when={errors().message}>
                    <span class={styles.errorMessage}>{errors().message}</span>
                  </Show>
                </div>
                
                <button
                  type="submit"
                  class={styles.submitButton}
                  disabled={isSubmitting()}
                >
                  {isSubmitting() ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

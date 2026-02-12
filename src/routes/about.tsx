import { A } from "@solidjs/router";

export default function About() {
  const teamMembers = [
    {
      name: "Sarah Chen",
      role: "CEO & Co-Founder",
      bio: "Former AI researcher at Google with 10+ years of experience in distributed systems and machine learning orchestration.",
    },
    {
      name: "Marcus Rodriguez",
      role: "CTO & Co-Founder",
      bio: "Ex-Amazon engineer specializing in cloud architecture and autonomous systems. Built scalable AI platforms serving millions of users.",
    },
    {
      name: "Emily Watson",
      role: "Head of Product",
      bio: "Product leader with a passion for developer tools. Previously led product teams at GitHub and Atlassian.",
    },
  ];

  return (
    <div
      style={{
        "min-height": "100vh",
        "background-color": "#1a1a2e",
        color: "#e0e0e0",
        padding: "60px 20px",
      }}
    >
      <div
        style={{
          "max-width": "1200px",
          margin: "0 auto",
        }}
      >
        {/* Header Section */}
        <div
          style={{
            "text-align": "center",
            "margin-bottom": "60px",
          }}
        >
          <h1
            style={{
              color: "#e0e0e0",
              "font-size": "48px",
              "font-weight": "700",
              "margin-bottom": "16px",
            }}
          >
            About Us
          </h1>
          <div
            style={{
              width: "80px",
              height: "4px",
              "background-color": "#8b5cf6",
              margin: "0 auto",
            }}
          />
        </div>

        {/* Company Description Section */}
        <section
          style={{
            "background-color": "#16213e",
            "border-radius": "12px",
            padding: "40px",
            "margin-bottom": "60px",
            "box-shadow": "0 8px 32px rgba(0, 0, 0, 0.3)",
          }}
        >
          <h2
            style={{
              color: "#8b5cf6",
              "font-size": "32px",
              "font-weight": "700",
              "margin-bottom": "24px",
            }}
          >
            Devoku - AI Agent Orchestration
          </h2>
          <p
            style={{
              color: "#e0e0e0",
              "font-size": "18px",
              "line-height": "1.8",
              "margin-bottom": "16px",
            }}
          >
            At Devoku, we're revolutionizing the way AI agents work together. Our
            cutting-edge orchestration platform enables seamless coordination of
            multiple AI agents, allowing them to collaborate, share insights, and
            solve complex problems that would be impossible for a single agent to
            tackle alone.
          </p>
          <p
            style={{
              color: "#e0e0e0",
              "font-size": "18px",
              "line-height": "1.8",
              "margin-bottom": "16px",
            }}
          >
            We believe the future of AI lies not in isolated models, but in
            intelligent systems that can communicate, delegate, and optimize their
            collective performance. Our platform provides the infrastructure,
            monitoring, and control mechanisms needed to build reliable,
            production-grade multi-agent systems.
          </p>
          <p
            style={{
              color: "#e0e0e0",
              "font-size": "18px",
              "line-height": "1.8",
            }}
          >
            Whether you're building customer service automation, complex data
            analysis pipelines, or autonomous research assistants, Devoku gives you
            the tools to orchestrate AI agents at scale with confidence.
          </p>
        </section>

        {/* Team Members Section */}
        <section
          style={{
            "margin-bottom": "60px",
          }}
        >
          <h2
            style={{
              color: "#e0e0e0",
              "font-size": "36px",
              "font-weight": "700",
              "text-align": "center",
              "margin-bottom": "48px",
            }}
          >
            Our Team
          </h2>
          <div
            style={{
              display: "grid",
              "grid-template-columns": "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "32px",
            }}
          >
            {teamMembers.map((member) => (
              <div
                style={{
                  "background-color": "#16213e",
                  "border-radius": "12px",
                  padding: "32px",
                  "box-shadow": "0 8px 32px rgba(0, 0, 0, 0.3)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 40px rgba(139, 92, 246, 0.2)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 32px rgba(0, 0, 0, 0.3)";
                }}
              >
                <h3
                  style={{
                    color: "#e0e0e0",
                    "font-size": "24px",
                    "font-weight": "700",
                    "margin-bottom": "8px",
                  }}
                >
                  {member.name}
                </h3>
                <p
                  style={{
                    color: "#8b5cf6",
                    "font-size": "16px",
                    "font-weight": "600",
                    "margin-bottom": "16px",
                  }}
                >
                  {member.role}
                </p>
                <p
                  style={{
                    color: "#a0a0a0",
                    "font-size": "16px",
                    "line-height": "1.6",
                  }}
                >
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Us Button */}
        <div
          style={{
            "text-align": "center",
          }}
        >
          <A
            href="/contact"
            style={{
              display: "inline-block",
              padding: "16px 48px",
              "background-color": "#8b5cf6",
              color: "#ffffff",
              "border-radius": "8px",
              "font-size": "18px",
              "font-weight": "600",
              "text-decoration": "none",
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
            Contact Us
          </A>
        </div>
      </div>
    </div>
  );
}

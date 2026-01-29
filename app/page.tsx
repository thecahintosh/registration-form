"use client";

import { useState } from "react";

/* ================= TYPES ================= */
type Member = {
  name: string;
  roll: string;
  phone: string;
};

/* ================= COMPONENT ================= */
export default function Page() {
  const [type, setType] = useState<"individual" | "team">("individual");
  const [form, setForm] = useState<any>({});
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  /* ================= HANDLERS ================= */
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleMemberChange(
    index: number,
    field: keyof Member,
    value: string
  ) {
    const updated = [...members];
    updated[index][field] = value;
    setMembers(updated);
  }

  async function handleSubmit() {
    if (type === "team" && members.length < 2) {
      alert("Minimum 2 team members required");
      return;
    }

    setIsLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        ...form,
        members,
      }),
    });

    setIsLoading(false);

    if (res.ok) {
      alert("Registration successful!");
    } else {
      alert("Something went wrong");
    }
  }

  /* ================= UI ================= */
  return (
    <>
      {/* ================= GLOBAL STYLES ================= */}
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display",
            "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif;
          background: linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%);
          min-height: 100vh;
          color: #ffffff;
        }

        .input-field {
          width: 100%;
          padding: 16px 20px;
          font-size: 16px;
          color: #fff;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          outline: none;
        }

        .input-field:focus {
          border-color: rgba(59, 130, 246, 0.6);
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
        }

        .submit-button {
          width: 100%;
          padding: 18px;
          border-radius: 14px;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
          border: none;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
        }

        .submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .type-toggle {
          display: flex;
          gap: 8px;
          background: rgba(255, 255, 255, 0.05);
          padding: 4px;
          border-radius: 12px;
        }

        .type-option {
          flex: 1;
          padding: 14px;
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.6);
          cursor: pointer;
          border-radius: 10px;
        }

        .type-option.active {
          background: rgba(59, 130, 246, 0.2);
          color: #3b82f6;
        }

        .card {
          max-width: 480px;
          width: 100%;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 28px;
          padding: 40px;
        }

        .member-card {
          padding: 16px;
          background: rgba(255, 255, 255, 0.04);
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
      `}</style>

      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 24,
        }}
      >
        <div className="card">
          <h1 style={{ textAlign: "center", marginBottom: 32 }}>
            FLIGHT CLUB Registration
          </h1>

          {/* TYPE TOGGLE */}
          <div style={{ marginBottom: 32 }}>
            <div className="type-toggle">
              <button
                className={`type-option ${
                  type === "individual" ? "active" : ""
                }`}
                onClick={() => {
                  setType("individual");
                  setMembers([]);
                }}
              >
                Individual
              </button>

              <button
                className={`type-option ${type === "team" ? "active" : ""}`}
                onClick={() => {
                  setType("team");
                  if (members.length < 2) {
                    setMembers([
                      { name: "", roll: "", phone: "" },
                      { name: "", roll: "", phone: "" },
                    ]);
                  }
                }}
              >
                Team
              </button>
            </div>
          </div>

          {/* LEADER / INDIVIDUAL */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <input
              className="input-field"
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
            />
            <input
              className="input-field"
              name="roll"
              placeholder="Roll Number"
              onChange={handleChange}
            />
            <input
              className="input-field"
              name="email"
              placeholder="Email"
              onChange={handleChange}
            />
            <input
              className="input-field"
              name="phone"
              placeholder="Phone"
              onChange={handleChange}
            />
          </div>

          {/* TEAM MEMBERS */}
          {type === "team" && (
            <div style={{ marginTop: 32 }}>
              <h3 style={{ marginBottom: 16 }}>
                Team Members ({members.length}/5)
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {members.map((member, index) => (
                  <div key={index} className="member-card">
                    <p style={{ marginBottom: 12 }}>
                      Member {index + 1}
                    </p>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                      }}
                    >
                      <input
                        className="input-field"
                        placeholder="Name"
                        value={member.name}
                        onChange={(e) =>
                          handleMemberChange(index, "name", e.target.value)
                        }
                      />
                      <input
                        className="input-field"
                        placeholder="Roll Number"
                        value={member.roll}
                        onChange={(e) =>
                          handleMemberChange(index, "roll", e.target.value)
                        }
                      />
                      <input
                        className="input-field"
                        placeholder="Phone"
                        value={member.phone}
                        onChange={(e) =>
                          handleMemberChange(index, "phone", e.target.value)
                        }
                      />
                    </div>

                    {members.length > 2 && (
                      <button
                        style={{
                          marginTop: 12,
                          background: "none",
                          border: "none",
                          color: "#ef4444",
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          setMembers(members.filter((_, i) => i !== index))
                        }
                      >
                        Remove Member
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {members.length < 5 && (
                <button
                  style={{
                    marginTop: 20,
                    width: "100%",
                    padding: 14,
                    borderRadius: 12,
                    border: "1px dashed #3b82f6",
                    background: "transparent",
                    color: "#3b82f6",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    setMembers([
                      ...members,
                      { name: "", roll: "", phone: "" },
                    ])
                  }
                >
                  + Add Member
                </button>
              )}
            </div>
          )}

          {/* SUBMIT */}
          <div style={{ marginTop: 40 }}>
            <button
              className="submit-button"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Complete Registration →"}
            </button>
          </div>
        </div>
      </main>
    </>
  );
}

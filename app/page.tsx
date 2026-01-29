"use client";

import { useState } from "react";

type Member = {
  name: string;
  roll: string;
  phone: string;
};

export default function Page() {
  const [type, setType] = useState<"individual" | "team">("individual");
  const [form, setForm] = useState<any>({});
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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

  function addMember() {
    if (members.length >= 5) return;
    setMembers([...members, { name: "", roll: "", phone: "" }]);
  }

  function removeMember(index: number) {
    if (members.length <= 2) return;
    setMembers(members.filter((_, i) => i !== index));
  }

  async function handleSubmit() {
    if (type === "team" && members.length < 2) {
      alert("Minimum 2 team members required");
      return;
    }

    setIsLoading(true);

    const payload =
      type === "team"
        ? {
            type,
            ...form,
            memberNames: members.map((m) => m.name).join(", "),
            memberRolls: members.map((m) => m.roll).join(", "),
            memberPhones: members.map((m) => m.phone).join(", "),
          }
        : { type, ...form };

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setIsLoading(false);

    if (res.ok) {
      alert("Registration successful!");
      setForm({});
      setMembers([]);
      setType("individual");
    } else {
      alert("Something went wrong");
    }
  }

  return (
    <>
      <style jsx global>{`
        body {
          margin: 0;
          font-family: system-ui, sans-serif;
          background: #0a0a0a;
          color: white;
        }
        .input {
          padding: 14px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: rgba(255, 255, 255, 0.06);
          color: white;
        }
        .input:focus {
          outline: none;
          border-color: #3b82f6;
        }
        .btn {
          padding: 16px;
          border-radius: 14px;
          border: none;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
          font-weight: 600;
          cursor: pointer;
        }
      `}</style>

      <main
        style={{
          minHeight: "100vh",
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundImage: "url('/BlueFCLogo.png')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "420px",
          animation: "float 10s ease-in-out infinite",
        }}
      >
        {/* Dark overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.88)",
            zIndex: 0,
          }}
        />

        {/* Card */}
        <div
          style={{
            zIndex: 1,
            width: "100%",
            maxWidth: 480,
            padding: 40,
            borderRadius: 28,
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(40px)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <h1 style={{ textAlign: "center", marginBottom: 24 }}>
            FLIGHT CLUB Registration
          </h1>

          {/* Type Toggle */}
          <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
            <button
              className="btn"
              style={{
                flex: 1,
                opacity: type === "individual" ? 1 : 0.5,
              }}
              onClick={() => {
                setType("individual");
                setMembers([]);
              }}
            >
              Individual
            </button>
            <button
              className="btn"
              style={{ flex: 1, opacity: type === "team" ? 1 : 0.5 }}
              onClick={() => {
                setType("team");
                setMembers([
                  { name: "", roll: "", phone: "" },
                  { name: "", roll: "", phone: "" },
                ]);
              }}
            >
              Team
            </button>
          </div>

          {/* Leader / Individual */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input className="input" name="name" placeholder="Name" onChange={handleChange} />
            <input className="input" name="roll" placeholder="Roll No" onChange={handleChange} />
            <input className="input" name="email" placeholder="Email" onChange={handleChange} />
            <input className="input" name="phone" placeholder="Phone" onChange={handleChange} />
          </div>

          {/* Team Members */}
          {type === "team" && (
            <>
              <hr style={{ margin: "24px 0", opacity: 0.2 }} />

              {members.map((m, i) => (
                <div
                  key={i}
                  style={{
                    marginBottom: 16,
                    padding: 16,
                    borderRadius: 16,
                    background: "rgba(255,255,255,0.04)",
                  }}
                >
                  <strong>Member {i + 1}</strong>

                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
                    <input
                      className="input"
                      placeholder="Name"
                      value={m.name}
                      onChange={(e) =>
                        handleMemberChange(i, "name", e.target.value)
                      }
                    />
                    <input
                      className="input"
                      placeholder="Roll No"
                      value={m.roll}
                      onChange={(e) =>
                        handleMemberChange(i, "roll", e.target.value)
                      }
                    />
                    <input
                      className="input"
                      placeholder="Phone"
                      value={m.phone}
                      onChange={(e) =>
                        handleMemberChange(i, "phone", e.target.value)
                      }
                    />
                  </div>

                  {members.length > 2 && (
                    <button
                      style={{ marginTop: 10, color: "#f87171", background: "none", border: "none" }}
                      onClick={() => removeMember(i)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}

              {members.length < 5 && (
                <button className="btn" style={{ width: "100%" }} onClick={addMember}>
                  + Add Member
                </button>
              )}
            </>
          )}

          <button
            className="btn"
            style={{ width: "100%", marginTop: 24 }}
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit Registration"}
          </button>
        </div>
      </main>
    </>
  );
}

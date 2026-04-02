import { useState, useRef, useEffect } from "react"
import ReactMarkdown from 'react-markdown'

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hi! I'm **Admon** 👋 Your IILM University admissions guide!\n\nI can help you with:\n- 💰 Fees & Scholarships\n- 📚 Programmes & Courses\n- 🎓 Admissions Process\n- 🏢 Campus & Placements\n\nWhat would you like to know?"
    }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  async function sendMessage() {
    if (input.trim() === "" || isLoading) return
    const userText = input.trim()
    setMessages(prev => [...prev, { role: "user", text: userText }])
    setInput("")
    setIsLoading(true)
    try {
      const response = await fetch("http://localhost:3000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userText })
      })
      const data = await response.json()
      setMessages(prev => [...prev, { role: "bot", text: data.answer }])
    } catch {
      setMessages(prev => [...prev, {
        role: "bot",
        text: "Sorry, I'm having trouble connecting. Please try again!"
      }])
    }
    setIsLoading(false)
  }

  const suggestedQuestions = [
    "💰 BTech CSE fees?",
    "🏆 Scholarships?",
    "📋 How to apply?",
    "💼 Placements?"
  ]

  const markdownComponents = {
    p: ({children}) => (
      <p style={{margin: "4px 0", lineHeight: "1.6", textAlign: "left"}}>{children}</p>
    ),
    ul: ({children}) => (
      <ul style={{paddingLeft: "16px", margin: "6px 0", textAlign: "left"}}>{children}</ul>
    ),
    ol: ({children}) => (
      <ol style={{paddingLeft: "16px", margin: "6px 0", textAlign: "left"}}>{children}</ol>
    ),
    li: ({children}) => (
      <li style={{marginBottom: "5px", lineHeight: "1.5", textAlign: "left"}}>{children}</li>
    ),
    strong: ({children}) => (
      <strong style={{color: "#1e40af", fontWeight: "700"}}>{children}</strong>
    ),
    h1: ({children}) => (
      <h1 style={{fontSize: "15px", fontWeight: "700", margin: "8px 0 4px", color: "#1e3a8a", textAlign: "left"}}>{children}</h1>
    ),
    h2: ({children}) => (
      <h2 style={{fontSize: "14px", fontWeight: "700", margin: "8px 0 4px", color: "#1e3a8a", textAlign: "left"}}>{children}</h2>
    ),
    h3: ({children}) => (
      <h3 style={{fontSize: "13px", fontWeight: "700", margin: "6px 0 4px", color: "#1e3a8a", textAlign: "left"}}>{children}</h3>
    ),
    table: ({children}) => (
      <div style={{overflowX: "auto", margin: "8px 0"}}>
        <table style={{borderCollapse: "collapse", width: "100%", fontSize: "12px"}}>{children}</table>
      </div>
    ),
    th: ({children}) => (
      <th style={{border: "1px solid #bfdbfe", padding: "6px 8px", backgroundColor: "#eff6ff", color: "#1e40af", fontWeight: "600", textAlign: "left"}}>{children}</th>
    ),
    td: ({children}) => (
      <td style={{border: "1px solid #e5e7eb", padding: "6px 8px", textAlign: "left"}}>{children}</td>
    ),
    code: ({children}) => (
      <code style={{backgroundColor: "#f1f5f9", padding: "2px 6px", borderRadius: "4px", fontSize: "12px"}}>{children}</code>
    ),
    blockquote: ({children}) => (
      <blockquote style={{borderLeft: "3px solid #3b82f6", paddingLeft: "12px", margin: "6px 0", color: "#4b5563", textAlign: "left"}}>{children}</blockquote>
    ),
  }

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        .chat-input { color: #1f2937 !important; }
        .chat-input::placeholder { color: #9ca3af; }
        .chat-input:focus { border-color: #3b82f6 !important; box-shadow: 0 0 0 3px rgba(59,130,246,0.15) !important; }
        .msg-in { animation: msgIn 0.25s ease; }
        @keyframes msgIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .dot-typing { display: flex; gap: 5px; align-items: center; padding: 2px 0; }
        .dot-typing span {
          width: 8px; height: 8px; border-radius: 50%;
          background: linear-gradient(135deg, #1e3a8a, #3b82f6);
          animation: dotBounce 1.2s infinite;
        }
        .dot-typing span:nth-child(2) { animation-delay: 0.2s; }
        .dot-typing span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes dotBounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-6px); opacity: 1; }
        }
        .send-btn { transition: all 0.2s; }
        .send-btn:hover:not(:disabled) { transform: scale(1.08); }
        .send-btn:active:not(:disabled) { transform: scale(0.95); }
        .chip { transition: all 0.2s; }
        .chip:hover { background: #dbeafe !important; border-color: #93c5fd !important; transform: translateY(-1px); }
        .float-btn { transition: all 0.3s ease; }
        .float-btn:hover { transform: scale(1.06); box-shadow: 0 14px 36px rgba(30,58,138,0.5) !important; }
        .chat-window { animation: windowIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
        @keyframes windowIn {
          from { opacity: 0; transform: scale(0.85) translateY(20px); transform-origin: bottom right; }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .messages-scroll::-webkit-scrollbar { width: 4px; }
        .messages-scroll::-webkit-scrollbar-track { background: transparent; }
        .messages-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
      `}</style>

      <div style={{
        position: "fixed", bottom: "24px", right: "24px",
        zIndex: 9999, fontFamily: "'Segoe UI', system-ui, sans-serif"
      }}>

        {/* Chat Window */}
        {isOpen && (
          <div className="chat-window" style={{
            width: "380px", height: "560px",
            backgroundColor: "#ffffff",
            borderRadius: "24px",
            boxShadow: "0 24px 64px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06)",
            display: "flex", flexDirection: "column",
            overflow: "hidden", marginBottom: "16px"
          }}>

            {/* Header */}
            <div style={{
              background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
              padding: "16px 20px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              flexShrink: 0
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  width: "46px", height: "46px", borderRadius: "50%",
                  background: "rgba(255,255,255,0.2)",
                  border: "2px solid rgba(255,255,255,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "22px", flexShrink: 0
                }}>🎓</div>
                <div>
                  <div style={{
                    color: "white", fontWeight: "700", fontSize: "16px",
                    lineHeight: 1.2, letterSpacing: "0.3px"
                  }}>Admon</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "4px" }}>
                    <div style={{
                      width: "7px", height: "7px", borderRadius: "50%",
                      backgroundColor: "#4ade80",
                      boxShadow: "0 0 6px #4ade80"
                    }}></div>
                    <span style={{ color: "rgba(255,255,255,0.85)", fontSize: "12px" }}>
                      IILM Admissions Guide • Online
                    </span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} style={{
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "50%", width: "34px", height: "34px",
                cursor: "pointer", color: "white", fontSize: "14px",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 0.2s"
              }}>✕</button>
            </div>

            {/* Subheader */}
            <div style={{
              backgroundColor: "#eff6ff",
              padding: "8px 16px",
              borderBottom: "1px solid #dbeafe",
              flexShrink: 0
            }}>
              <p style={{
                margin: 0, fontSize: "11.5px", color: "#1e40af",
                textAlign: "center", fontWeight: "500"
              }}>
                🏫 IILM University • Gurugram & Greater Noida
              </p>
            </div>

            {/* Messages */}
            <div className="messages-scroll" style={{
              flex: 1, overflowY: "auto", padding: "16px",
              display: "flex", flexDirection: "column", gap: "14px",
              backgroundColor: "#f8fafc"
            }}>
              {messages.map((msg, i) => (
                <div key={i} className="msg-in" style={{
                  display: "flex",
                  justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                  alignItems: "flex-end", gap: "8px"
                }}>
                  {msg.role === "bot" && (
                    <div style={{
                      width: "30px", height: "30px", borderRadius: "50%",
                      background: "linear-gradient(135deg, #1e3a8a, #2563eb)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "14px", flexShrink: 0,
                      boxShadow: "0 2px 8px rgba(30,58,138,0.3)"
                    }}>🎓</div>
                  )}
                  <div style={{
                    maxWidth: "78%",
                    padding: "11px 15px",
                    borderRadius: msg.role === "user"
                      ? "20px 20px 4px 20px"
                      : "20px 20px 20px 4px",
                    backgroundColor: msg.role === "user" ? "#1e3a8a" : "#ffffff",
                    color: msg.role === "user" ? "white" : "#1f2937",
                    fontSize: "13.5px", lineHeight: "1.6",
                    boxShadow: msg.role === "user"
                      ? "0 4px 12px rgba(30,58,138,0.3)"
                      : "0 2px 8px rgba(0,0,0,0.08)",
                    textAlign: "left"
                  }}>
                    {msg.role === "user" ? (
                      <p style={{ margin: 0, textAlign: "left" }}>{msg.text}</p>
                    ) : (
                      <ReactMarkdown components={markdownComponents}>
                        {msg.text}
                      </ReactMarkdown>
                    )}
                  </div>
                  {msg.role === "user" && (
                    <div style={{
                      width: "30px", height: "30px", borderRadius: "50%",
                      background: "linear-gradient(135deg, #374151, #6b7280)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "14px", flexShrink: 0
                    }}>👤</div>
                  )}
                </div>
              ))}

              {/* Suggested chips - only at start */}
              {messages.length === 1 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "4px" }}>
                  {suggestedQuestions.map((q, i) => (
                    <button key={i} className="chip" onClick={() => setInput(q.replace(/^[^\s]+\s/, ''))} style={{
                      padding: "8px 14px", borderRadius: "20px",
                      border: "1.5px solid #bfdbfe", backgroundColor: "#eff6ff",
                      color: "#1e40af", fontSize: "12px", cursor: "pointer",
                      fontWeight: "500"
                    }}>{q}</button>
                  ))}
                </div>
              )}

              {/* Loading dots */}
              {isLoading && (
                <div className="msg-in" style={{
                  display: "flex", alignItems: "flex-end", gap: "8px"
                }}>
                  <div style={{
                    width: "30px", height: "30px", borderRadius: "50%",
                    background: "linear-gradient(135deg, #1e3a8a, #2563eb)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "14px", boxShadow: "0 2px 8px rgba(30,58,138,0.3)"
                  }}>🎓</div>
                  <div style={{
                    padding: "13px 16px", borderRadius: "20px 20px 20px 4px",
                    backgroundColor: "#ffffff", boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
                  }}>
                    <div className="dot-typing">
                      <span></span><span></span><span></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div style={{
              padding: "12px 14px", borderTop: "1px solid #e5e7eb",
              backgroundColor: "#ffffff",
              display: "flex", gap: "10px", alignItems: "center",
              flexShrink: 0
            }}>
              <input
                className="chat-input"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
                placeholder="Ask about fees, scholarships..."
                style={{
                  flex: 1, padding: "11px 16px",
                  borderRadius: "24px",
                  border: "1.5px solid #e5e7eb",
                  outline: "none", fontSize: "13.5px",
                  backgroundColor: "#f8fafc",
                  color: "#1f2937",
                  transition: "border-color 0.2s, box-shadow 0.2s"
                }}
              />
              <button
                className="send-btn"
                onClick={sendMessage}
                disabled={isLoading || input.trim() === ""}
                style={{
                  width: "44px", height: "44px", borderRadius: "50%", flexShrink: 0,
                  background: input.trim() === ""
                    ? "#e5e7eb"
                    : "linear-gradient(135deg, #1e3a8a, #2563eb)",
                  border: "none",
                  cursor: input.trim() === "" ? "default" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "17px", color: "white"
                }}>➤</button>
            </div>

            {/* Footer */}
            <div style={{
              padding: "6px", backgroundColor: "#f8fafc",
              borderTop: "1px solid #f1f5f9", flexShrink: 0
            }}>
              <p style={{
                margin: 0, fontSize: "11px", color: "#94a3b8",
                textAlign: "center"
              }}>
                Powered by IILM University • admissions@iilm.edu
              </p>
            </div>

          </div>
        )}

        {/* Floating Button */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            className="float-btn"
            onClick={() => setIsOpen(!isOpen)}
            style={{
              background: "linear-gradient(135deg, #1e3a8a, #2563eb)",
              border: "none",
              borderRadius: isOpen ? "50%" : "50px",
              padding: isOpen ? "0" : "14px 22px",
              width: isOpen ? "56px" : "auto",
              height: "56px",
              cursor: "pointer",
              display: "flex", alignItems: "center", gap: "10px",
              boxShadow: "0 8px 28px rgba(30,58,138,0.45)",
              color: "white",
              fontSize: isOpen ? "18px" : "14px",
              fontWeight: "600",
              whiteSpace: "nowrap"
            }}>
            {isOpen ? "✕" : <><span style={{ fontSize: "20px" }}>🎓</span> Ask Admon</>}
          </button>
        </div>

      </div>
    </>
  )
}
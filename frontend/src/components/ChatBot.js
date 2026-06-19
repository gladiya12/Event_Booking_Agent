import { useState } from "react";

function ChatBot() {

  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [open, setOpen] = useState(false);

  const sendMessage = async () => {

    if (!message.trim()) return;

    try {

      const response = await fetch(
        "http://127.0.0.1:5000/chat",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify({
            message
          })
        }
      );

      const data =
        await response.json();

      setChat((prev) => [
        ...prev,
        {
          user: message,
          bot: data.reply
        }
      ]);

      setMessage("");

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {/* Floating Icon */}

      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            position: "fixed",
            bottom: "25px",
            right: "25px",
            width: "70px",
            height: "70px",
            borderRadius: "50%",
            border: "none",
            background:
              "linear-gradient(135deg,#7c3aed,#a855f7)",
            color: "white",
            fontSize: "30px",
            cursor: "pointer",
            boxShadow:
              "0 10px 25px rgba(124,58,237,.4)",
            zIndex: 9999
          }}
        >
          🤖
        </button>
      )}

      {/* Chat Window */}

      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            width: "380px",
            height: "500px",
            background: "white",
            borderRadius: "20px",
            boxShadow:
              "0 15px 40px rgba(0,0,0,.15)",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden"
          }}
        >
          {/* Header */}

          <div
            style={{
              background:
                "linear-gradient(135deg,#7c3aed,#a855f7)",
              color: "white",
              padding: "18px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <strong>
              🤖 EventHub AI
            </strong>

            <button
              onClick={() =>
                setOpen(false)
              }
              style={{
                background:
                  "transparent",
                border: "none",
                color: "white",
                fontSize: "20px",
                cursor: "pointer"
              }}
            >
              ✕
            </button>
          </div>

          {/* Messages */}

          <div
            style={{
              flex: 1,
              padding: "15px",
              overflowY: "auto",
              background: "#f8fafc"
            }}
          >
            {chat.length === 0 && (
              <p
                style={{
                  color: "#64748b"
                }}
              >
                Ask me about events,
                prices, venues or
                recommendations.
              </p>
            )}

            {chat.map(
              (item, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom:
                      "15px"
                  }}
                >
                  <div
                    style={{
                      textAlign:
                        "right"
                    }}
                  >
                    <span
                      style={{
                        background:
                          "#7c3aed",
                        color:
                          "white",
                        padding:
                          "8px 12px",
                        borderRadius:
                          "12px",
                        display:
                          "inline-block"
                      }}
                    >
                      {item.user}
                    </span>
                  </div>

                  <div
                    style={{
                      marginTop:
                        "8px"
                    }}
                  >
                    <span
                      style={{
                        background:
                          "#e2e8f0",
                        padding:
                          "8px 12px",
                        borderRadius:
                          "12px",
                        display:
                          "inline-block"
                      }}
                    >
                      {item.bot}
                    </span>
                  </div>
                </div>
              )
            )}
          </div>

          {/* Input */}

          <div
            style={{
              padding: "15px",
              display: "flex",
              gap: "10px",
              borderTop:
                "1px solid #e2e8f0"
            }}
          >
            <input
              type="text"
              value={message}
              onChange={(e) =>
                setMessage(
                  e.target.value
                )
              }
              placeholder="Ask about events..."
              style={{
                flex: 1,
                padding: "12px",
                border:
                  "1px solid #cbd5e1",
                borderRadius:
                  "10px"
              }}
            />

            <button
              onClick={sendMessage}
              style={{
                border: "none",
                background:
                  "#7c3aed",
                color: "white",
                padding:
                  "12px 18px",
                borderRadius:
                  "10px",
                cursor: "pointer"
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatBot;
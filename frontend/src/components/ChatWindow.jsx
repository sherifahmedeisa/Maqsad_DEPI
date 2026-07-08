import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";

function ChatWindow({ rfpId, targetUserId }) {
  const { user } = useAuth();
  const [thread, setThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);
  const pollIntervalRef = useRef(null);

  useEffect(() => {
    fetchThreadAndMessages();
    
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [rfpId, targetUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchThreadAndMessages = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/messages/thread-by-context?rfpId=${rfpId}&targetUserId=${targetUserId}`);
      if (!res.ok) throw new Error("Failed to load conversation thread");
      const data = await res.json();
      
      setThread(data.thread);
      setMessages(data.messages);
      
      // Start polling for new messages every 4 seconds
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = setInterval(() => {
        pollNewMessages(data.thread.id);
      }, 4000);
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not synchronize negotiation chat.");
    } finally {
      setLoading(false);
    }
  };

  const pollNewMessages = async (threadId) => {
    try {
      const res = await fetch(`/api/messages/threads/${threadId}/messages`);
      if (res.ok) {
        const newMessages = await res.json();
        // Only update if count changes to avoid unnecessary re-renders
        if (newMessages.length !== messages.length) {
          setMessages(newMessages);
        }
      }
    } catch (err) {
      console.error("Message polling failed", err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    const messageText = newMessage.trim();
    setNewMessage(""); // Clear input immediately for smooth UX
    setSending(true);

    try {
      const res = await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rfpId,
          body: messageText,
          targetUserId,
        }),
      });

      if (!res.ok) throw new Error("Failed to deliver message");
      const sentMsg = await res.json();

      // Append locally immediately for instant feedback
      setMessages((prev) => [...prev, sentMsg]);
    } catch (err) {
      console.error(err);
      alert("Message delivery failed. Please try again.");
      setNewMessage(messageText); // restore text if failed
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center h-100 py-5">
        <div className="spinner-border text-dark spinner-border-sm" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <span className="small text-muted mt-2">Connecting to chat stream...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-3 text-center text-danger h-100 d-flex flex-column align-items-center justify-content-center">
        <span className="material-symbols-outlined fs-2 mb-1">wifi_off</span>
        <p className="small m-0">{error}</p>
        <button className="btn btn-sm btn-link text-danger mt-2" onClick={fetchThreadAndMessages}>
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column justify-content-between h-100 overflow-hidden" style={{ height: "100%" }}>
      {/* Messages Scroll Area */}
      <div className="flex-grow-1 p-3 overflow-y-auto bg-light d-flex flex-column" style={{ maxHeight: "calc(100% - 70px)" }}>
        {messages.length === 0 ? (
          <div className="text-center my-auto text-muted py-5">
            <span className="material-symbols-outlined display-4 mb-2">chat_bubble</span>
            <h6>Start Bidding Discussion</h6>
            <p className="small px-4">Introduce yourself and clarify scope requirements, pricing guidelines, or project deadlines.</p>
          </div>
        ) : (
          <div className="d-flex flex-column gap-2 mt-auto">
            {messages.map((msg) => {
              const isMine = msg.senderId === user.id;
              return (
                <div key={msg.id} className={`d-flex flex-column ${isMine ? "align-items-end" : "align-items-start"}`}>
                  <div className={`rounded-4 px-3 py-2 text-wrap shadow-xs max-w-75 ${
                    isMine ? "bg-dark text-white rounded-br-0" : "bg-white text-dark rounded-bl-0"
                  }`} style={{ maxWidth: "75%", fontSize: "0.95rem" }}>
                    {msg.body}
                  </div>
                  <span className="text-muted" style={{ fontSize: "0.7rem", marginTop: "2px" }}>
                    {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Message Form */}
      <form onSubmit={handleSendMessage} className="p-3 bg-white border-top d-flex gap-2">
        <input
          type="text"
          className="form-control rounded-pill px-3 py-2"
          placeholder="Type your message here..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          disabled={sending}
          maxLength={1000}
        />
        <button
          type="submit"
          className="btn btn-dark rounded-circle d-flex align-items-center justify-content-center p-2"
          style={{ width: "40px", height: "40px" }}
          disabled={!newMessage.trim() || sending}
        >
          <span className="material-symbols-outlined text-white small">send</span>
        </button>
      </form>
    </div>
  );
}

export default ChatWindow;

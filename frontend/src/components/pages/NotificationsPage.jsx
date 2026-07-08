import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/dashboard/notifications");
      if (!res.ok) throw new Error("Failed to load notifications stream");
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "An error occurred fetching notifications.");
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  if (loading) {
    return (
      <div className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-lg py-32 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mb-4"></div>
        <p className="font-body-md text-body-md text-on-surface-variant">Checking notifications stream...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-lg py-xl">
        <div className="bg-error-container text-on-error-container p-lg rounded-xl border border-error/20">
          <h4 className="font-headline-sm text-headline-sm font-semibold mb-2">Connection Error</h4>
          <p className="font-body-md text-body-md mb-4">{error}</p>
          <button className="bg-error text-white font-label-md text-label-md px-lg py-md rounded-lg hover:opacity-90 transition-opacity" onClick={fetchNotifications}>
            Retry Fetch
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow w-full max-w-3xl mx-auto px-margin-mobile md:px-lg py-xl flex flex-col gap-lg">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b border-outline-variant pb-md">
        <div>
          <h1 className="font-headline-xl text-headline-lg-mobile md:text-headline-xl text-on-surface font-bold">
            Notification Center
          </h1>
          <p className="font-body-md text-on-surface-variant">
            Platform activity alerts, proposals, and direct messages.
          </p>
        </div>
        {notifications.length > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-4 py-1.5 border border-outline-variant hover:bg-surface-container-low rounded-full font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors"
          >
            Mark All as Read
          </button>
        )}
      </div>

      {/* Main Container */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        {notifications.length === 0 ? (
          <div className="py-16 text-center flex flex-col items-center gap-md">
            <span className="material-symbols-outlined text-on-surface-variant text-5xl">notifications_off</span>
            <div className="flex flex-col gap-xs">
              <h5 className="font-headline-sm text-headline-sm text-on-surface">Your inbox is empty</h5>
              <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm">
                You will receive alerts here when vendors submit proposal bids or negotiation threads update.
              </p>
            </div>
            <Link
              to="/dashboard"
              className="bg-primary hover:bg-on-background text-on-primary font-label-md text-label-md px-lg py-2 rounded-full text-decoration-none text-white transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-outline-variant">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-lg flex items-start gap-md transition-colors ${
                  !notif.isRead ? "bg-surface-container-low/20" : "bg-transparent"
                }`}
              >
                <div className={`p-2 rounded-xl flex items-center justify-center ${
                  notif.type === "proposal" ? "bg-secondary-container text-on-secondary-container" : "bg-primary-container text-on-primary-container"
                }`}>
                  <span className="material-symbols-outlined">
                    {notif.type === "proposal" ? "rate_review" : "notifications"}
                  </span>
                </div>
                
                <div className="flex-grow flex flex-col gap-xs">
                  <div className="flex justify-between items-start gap-sm">
                    <span className="font-label-md text-label-md text-on-surface font-semibold text-capitalize">
                      {notif.title || notif.type}
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      {new Date(notif.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    {notif.message}
                  </p>
                  {notif.rfpId && (
                    <Link
                      to={`/rfp/${notif.rfpId}`}
                      className="font-label-sm text-label-sm text-secondary hover:text-on-secondary-container flex items-center gap-xs text-decoration-none transition-colors align-self-start mt-sm"
                    >
                      Open Request Details <span className="material-symbols-outlined text-xs">arrow_forward</span>
                    </Link>
                  )}
                </div>

                {!notif.isRead && (
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary shrink-0 mt-2" title="Unread"></span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationsPage;

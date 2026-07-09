function RequestItem({ request }) {
  return (
    <div className="d-flex justify-content-between align-items-center py-3 border-top">
      <div>
        <h5 className="mb-1">{request.title}</h5>

        <small className="text-secondary">
          {request.date} • {request.proposals}
        </small>
      </div>

      <div className="d-flex align-items-center">
        <span
          className={`badge rounded-pill me-3 ${
            request.status === "Open"
              ? "bg-success-subtle text-success"
              : "bg-primary-subtle text-primary"
          }`}
        >
          {request.status}
        </span>

        <button className="btn btn-sm">⋮</button>
      </div>
    </div>
  );
}

export default RequestItem;

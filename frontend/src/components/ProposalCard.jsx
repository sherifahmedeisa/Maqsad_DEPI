function ProposalCard({ proposal }) {
  return (
    <div className="card h-100">
      <div className="card-body">
        <div className="d-flex align-items-center mb-3">
          <img
            src=""
            alt=""
            className="rounded-circle"
            width="55"
            height="55"
          />

          <div className="ms-3">
            <h6 className="mb-0">{proposal.name}</h6>

            <small className="text-success">
              ★ {proposal.rating} ({proposal.jobs})
            </small>
          </div>
        </div>

        <p className="text-secondary">"{proposal.description}"</p>

        <div className="d-flex justify-content-between">
          <small>
            For: <strong>{proposal.service}</strong>
          </small>

          <strong>{proposal.price}</strong>
        </div>
      </div>
    </div>
  );
}

export default ProposalCard;

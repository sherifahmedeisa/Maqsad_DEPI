import "./BeneficiaryCard.css";

function BeneficiaryCard({ title, value, text }) {
  return (
    <div className="card beneficiary-card mb-3">
      <div className="card-body">
        <small>{title}</small>

        <div className="d-flex align-items-end mt-2">
          <h2>{value}</h2>

          <span className="ms-2 mb-2">{text}</span>
        </div>
      </div>
    </div>
  );
}

export default BeneficiaryCard;

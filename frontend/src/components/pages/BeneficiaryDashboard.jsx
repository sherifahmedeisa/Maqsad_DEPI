import "./BeneficiaryDashboard.css";
import BeneficiaryCard from "./BeneficiaryCard";
import { Link } from "react-router-dom";
import RequestItem from "../RequestItem";
import ProposalCard from "../ProposalCard";
function BeneficiaryDashboard() {
  const requests = [
    {
      id: 1,
      title: "Plumbing Repair - Kitchen Sink",
      date: "Posted 2 days ago",
      proposals: "4 proposals",
      status: "Open",
    },
    {
      id: 2,
      title: "Electrical Wiring Consultation",
      date: "Posted 5 days ago",
      proposals: "8 proposals",
      status: "Under Review",
    },
  ];
  const proposals = [
    {
      id: 1,
      name: "David Chen",
      rating: "4.9",
      jobs: "42 jobs",
      description:
        "I have 10 years of experience with residential plumbing and can fix your sink issue quickly...",
      service: "Plumbing Repair",
      price: "$120 Est.",
    },
    {
      id: 2,
      name: "Maria Rodriguez",
      rating: "5.0",
      jobs: "18 jobs",
      description:
        "Fully licensed and insured. I can review your wiring layout and provide a detailed safety report.",
      service: "Electrical Consult",
      price: "$85 / hr",
    },
  ];

  return (
    <>
      <div className="container py-4">
        <div className="beneficiary-dashboard-header d-flex justify-content-between align-items-start">
          <div>
            <h1>Welcome back, . . . </h1>

            <p>
              Here is an overview of your current service requests and
              proposals.
            </p>
          </div>

          <Link to="/create-service">
            <button className="btn btn-dark px-4">+ Post a New Request</button>
          </Link>
        </div>

        <div className="row mt-4">
          <div className="col-lg-4">
            <BeneficiaryCard
              title="ACTIVE REQUESTS"
              value="000"
              text="open currently"
            />

            <BeneficiaryCard
              title="PROPOSALS RECEIVED"
              value="000"
              text="across all requests"
            />

            <div className="card assistance-card">
              <div className="card-body">
                <h5>Need assistance?</h5>

                <p>
                  Contact our support team for guidance on selecting providers.
                </p>

                <a href="/">Get Help →</a>
              </div>
            </div>
          </div>

          <div className="col-lg-8">
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="mb-0">Active Requests</h4>

                  <a
                    href="/"
                    className="text-decoration-none "
                    style={{ color: "#20c5b5" }}
                  >
                    View All
                  </a>
                </div>

                {requests.slice(0, 2).map((request) => (
                  <RequestItem key={request.id} request={request} />
                ))}
              </div>
            </div>
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="mb-0">Recent Proposals</h4>

                  <a
                    href="/"
                    className="text-decoration-none "
                    style={{ color: "#20c5b5" }}
                  >
                    View All
                  </a>
                </div>

                <div className="row">
                  {proposals.map((proposal) => (
                    <div className="col-md-6 mb-3" key={proposal.id}>
                      <ProposalCard proposal={proposal} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default BeneficiaryDashboard;

import img1 from "../../assets/img1.jpeg";
import shield from "../../assets/shield.svg";
import person1 from "../../assets/person1.svg";
import person2 from "../../assets/person2.svg";
import person3 from "../../assets/person3.svg";
import verify from "../../assets/verify.svg";
import "./LandingPage.css";
import { Link } from "react-router-dom";
function LandingPage() {
  return (
    <>
      <section className="container py-5">
        <div className="row align-items-center g-5">
          <div className="col-lg-6">
            <span className="badge border rounded-4  px-3 py-2 mb-3 d-inline-flex align-items-center gap-2 lStayle p">
              <img src={verify} alt="" width="16" height="16" />
              Secure & Reliable Platform
            </span>

            <h1 className="fw-bold display-5 mb-4">
              Enterprise Solutions, Expertly Delivered.
            </h1>

            <p className="text-secondary mb-4">
              Maqsad connects businesses with elite service providers through a
              secure, proposal-driven marketplace designed for corporate scale.
            </p>

            <div className="d-flex flex-wrap gap-3 mb-4">
              <Link to="/beneficiary-signup" className="btn btn-dark px-4 py-2">
                I need enterprise services →
              </Link>

              <Link
                to="/provider-signup"
                className="btn btnS px-4 py-2 lStayle "
              >
                I offer corporate solutions
              </Link>
            </div>

            <div className="d-flex align-items-center gap-3">
              <div className="d-flex">
                <img
                  src={person3}
                  alt=""
                  className="rounded-circle border"
                  width="35"
                  height="35"
                />
                <img
                  src={person2}
                  alt=""
                  className="rounded-circle border "
                  style={{ marginLeft: "-12px" }}
                  width="35"
                  height="35"
                />
                <img
                  src={person1}
                  alt=""
                  style={{ marginLeft: "-12px" }}
                  className="rounded-circle border "
                  width="35"
                  height="35"
                />
              </div>

              <small className="text-secondary">
                Join 10,000+ professionals
              </small>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="position-relative">
              <img src={img1} alt="" className="img-fluid rounded-3 shadow" />

              <div className="card shadow-sm position-absolute bottom-0 end-0 m-3">
                <div className="card-body d-flex align-items-center gap-3 py-2 px-3">
                  <div
                    className="rounded-3 d-flex justify-content-center align-items-center"
                    style={{
                      width: "40px",
                      height: "40px",
                      background: "#eef5ff",
                    }}
                  >
                    <img src={shield} alt="" />
                  </div>

                  <div>
                    <h6 className="mb-0">100% Verified</h6>
                    <small className="text-secondary">
                      Enterprise Partners
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5" style={{ background: "#eef5ff" }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">How Maqsad Works</h2>

            <p className="text-secondary">
              A streamlined, transparent process designed for reliability and
              clarity.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm p-4">
                <div
                  className="rounded-3 bg-info-subtle text-info fw-bold d-flex justify-content-center align-items-center mb-3 lStayle"
                  style={{ width: "40px", height: "40px" }}
                >
                  1
                </div>

                <h5>Post a Project Requirement</h5>

                <p className="text-secondary mb-0">
                  Detail your specific needs. Our structured forms ensure
                  professionals get exactly the information required.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm p-4">
                <div
                  className="rounded-3 bg-info-subtle text-info fw-bold d-flex justify-content-center align-items-center mb-3 lStayle"
                  style={{ width: "40px", height: "40px" }}
                >
                  2
                </div>

                <h5>Review Qualified Proposals</h5>

                <p className="text-secondary mb-0">
                  Verified experts review your request and submit tailored
                  proposals outlining scope, timeline, and cost.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm p-4">
                <div
                  className="rounded-3 bg-info-subtle text-info fw-bold d-flex justify-content-center align-items-center mb-3 lStayle"
                  style={{ width: "40px", height: "40px" }}
                >
                  3
                </div>

                <h5>Engage & Execute</h5>

                <p className="text-secondary mb-0">
                  Select the best fit, communicate securely on-platform, and
                  manage the project to successful completion.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
export default LandingPage;

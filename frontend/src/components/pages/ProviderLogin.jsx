import LoginForm from "../LoginForm";
import illustration from "../../assets/illustration.png";
import "./ProviderLogin.css";

function ProviderLogin() {
  return (
    <div className="container-fluid  ">
      <div className="row h-100 ">
        <div className="col-lg-6 left-side d-flex flex-column justify-content-between d-none d-lg-flex p-5">
          <div className="d-flex align-items-center">
            {/* <div className="square footer-square me-2">
              <div className="circle footer-circle"></div>
            </div>

            <h4 className="text-white fw-bold m-0">Maqsad</h4> */}
          </div>

          <div>
            <p className="text-white  display-6 fw-bold">
              Join 10,000+ verified
              <br />
              service providers
            </p>

            <p className="text-secondary fs-4 mt-3">
              Connect with enterprise clients, manage projects, and grow your
              business on one unified platform.
            </p>

            <div className="mt-4">
              <div className="feature"> Verified business credentials</div>

              <div className="feature">Access to global enterprise clients</div>

              <div className="feature"> Performance-based visibility</div>
            </div>
          </div>
        </div>

        <div
          className="col-lg-6 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: "#f8fafc" }}
        >
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

export default ProviderLogin;

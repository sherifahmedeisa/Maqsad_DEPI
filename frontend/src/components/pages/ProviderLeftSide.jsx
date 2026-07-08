import illustration1 from "../../assets/illustration1.png";

function ProviderLeftSide() {
  return (
    <div className="col-lg-6 left-side d-flex flex-column justify-content-between d-none d-lg-flex p-5">
      <div className="d-flex align-items-center">
        {/* <div className="square footer-square me-2">
              <div className="circle footer-circle"></div>
            </div>

            <h4 className="text-white fw-bold m-0">Maqsad</h4> */}
      </div>

      <div>
        <p className="text-white  display-6 fw-bold">
          Join verified service providers
        </p>

        <p className="text-secondary fs-4 mt-3">
          Connect with enterprise clients, manage projects, and grow your
          business on one unified platform.
        </p>

        <div className="mt-4">
          <div className="feature d-flex align-items-center mb-3 ">
            <div className="icon-circle d-flex align-items-center justify-content-center me-3">
              <span className="material-symbols-outlined picon">shield</span>
            </div>
            <span text-white fs-5>
              Verified business credentials
            </span>
          </div>
          <div className="feature d-flex align-items-center mb-3 ">
            <div className="icon-circle d-flex align-items-center justify-content-center me-3">
              <span class="material-symbols-outlined picon">language</span>
            </div>
            <span text-white fs-5>
              Performance-based visibility
            </span>
          </div>
          <div className="feature d-flex align-items-center mb-3 ">
            <div className="icon-circle d-flex align-items-center justify-content-center me-3">
              <span class="material-symbols-outlined picon">star</span>
            </div>
            <span text-white fs-5>
              Access to global enterprise clients
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ProviderLeftSide;

import illustration2 from "../../assets/illustration2.png";

function BeneficiaryLeftSide() {
  return (
    <div className="col-lg-6 left-sideb d-flex flex-column justify-content-between d-none d-lg-flex p-5">
      <div className="d-flex align-items-center">
        {/* <div className="square footer-square me-2">
              <div className="circle footer-circle"></div>
            </div>

            <h4 className="text-white fw-bold m-0">Maqsad</h4> */}
      </div>

      <div>
        <p className="text-white  display-6 fw-bold">
          Find expert service providers
          <br />
          for your enterprise
        </p>

        <p className="text-secondary fs-4 mt-3">
          Post requirements, receive tailored proposals, and engage vetted
          professionals — all in one place.
        </p>

        <div className="mt-4">
          <div className="feature d-flex align-items-center mb-3 ">
            <div className="icon-circle d-flex align-items-center justify-content-center me-3">
              <span className="material-symbols-outlined picon">apartment</span>
            </div>
            <span text-white fs-5>
              Tailored to enterprise procurement
            </span>
          </div>
          <div className="feature d-flex align-items-center mb-3 ">
            <div className="icon-circle d-flex align-items-center justify-content-center me-3">
              <span class="material-symbols-outlined picon">schedule</span>
            </div>
            <span text-white fs-5>
              Fast, structured proposal flow
            </span>
          </div>
          <div className="feature d-flex align-items-center mb-3 ">
            <div className="icon-circle d-flex align-items-center justify-content-center me-3">
              <span class="material-symbols-outlined picon">check</span>
            </div>
            <span text-white fs-5>
              100% verified enterprise partners
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
export default BeneficiaryLeftSide;

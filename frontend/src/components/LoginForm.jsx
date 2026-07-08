import "./LoginForm.css";
function LoginForm() {
  return (
    <div className="login-card">
      <span className="portal-badge"> Service Provider Portal</span>
      <h1 className="mt-4 fw-bold">Welcome back</h1>
      <p className="text-secondary mb-4">
        Sign in to your provider account to manage projects.
      </p>
      <form className="border p-4 rounded-4 shadow-sm bg-white ">
        <div className="mb-3">
          <label className="form-label fw-semibold">
            Business Email <span className="text-info">*</span>
          </label>

          <input
            type="email"
            className="form-control"
            placeholder="provider@company.com"
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">
            Password <span className="text-info">*</span>
          </label>

          <input
            type="password"
            className="form-control"
            placeholder="Enter your password"
          />
        </div>

        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="form-check">
            <input className="form-check-input" type="checkbox" id="remember" />

            <label className="form-check-label" htmlFor="remember">
              Remember me
            </label>
          </div>

          <a href="#" className="text-decoration-none">
            Forgot password?
          </a>
        </div>

        <button className="btn btn-info w-100 text-white fw-semibold py-3 rounded-pill">
          Sign In to Provider Portal →
        </button>

        <div className="text-center my-4 text-secondary">New to Maqsad?</div>

        <button
          type="button"
          className="btn btn-light border w-100 py-3 rounded-pill fw-semibold"
        >
          Create a Provider Account
        </button>
      </form>
      <p className="text-center mt-4">
        Looking to hire services?
        <a href="#" className="text-decoration-none ms-1">
          Sign in as a client
        </a>
      </p>
    </div>
  );
}

export default LoginForm;

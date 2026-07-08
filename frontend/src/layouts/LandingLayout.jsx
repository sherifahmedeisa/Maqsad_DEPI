import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import LandingNav from "../components/LandingNav";
function LandingLayout() {
  return (
    <>
      <LandingNav />
      <Outlet />
      <Footer />
    </>
  );
}

export default LandingLayout;

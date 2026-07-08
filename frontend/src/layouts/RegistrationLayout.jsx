import { Outlet } from "react-router-dom";
import RegistrationNav from "../components/RegistrationNav";
import Footer from "../components/Footer";
import Page from "../components/Page";
function RegistrationLayout() {
  return (
    <>
      <RegistrationNav />
      <Page />
      <Outlet />
      <Footer />
    </>
  );
}
export default RegistrationLayout;

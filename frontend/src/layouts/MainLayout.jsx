import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import ProfileNav from "../components/ProfileNav";

function ProfileLayout() {
  return (
    <>
      <ProfileNav />
      <Outlet />
      <Footer />
    </>
  );
}

export default ProfileLayout;

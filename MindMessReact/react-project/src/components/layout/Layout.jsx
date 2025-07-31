import ScrollableBox from "../ui/ScrollableBox";
import Header from "./header/Header";
import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <>
      <Header />

      {/* wrap outlet in custom scrollebox */}
      <ScrollableBox>
        <Outlet />
      </ScrollableBox>
    </>
  );
}

export default Layout;
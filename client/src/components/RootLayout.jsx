import { Outlet } from 'react-router-dom';

import { Footer, Navbar } from '@components';

export default function RootLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

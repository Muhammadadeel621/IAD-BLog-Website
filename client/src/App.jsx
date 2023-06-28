import { createPortal } from 'react-dom';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import {
  LoginPage,
  RegisterPage,
  HomePage,
  CreatePost,
  SinglePostPage,
  EditPost,
  AllPostPage,
  Dashboard,
  NotFoundPage,
} from '@pages';
import { PersistLogin, RequireAuth, RootLayout } from '@components';
import { AuthProvider } from '@context/AuthContext';

function App() {
  return (
    <>
      <AuthProvider>
        <Routes>
          <Route element={<PersistLogin />}>
            {/* Guest Routes */}
            <Route element={<RequireAuth shouldBeAuthenticated={false} />}>
              <Route path='/register' element={<RegisterPage />} />
              <Route path='/login' element={<LoginPage />} />
            </Route>

            <Route element={<RootLayout />}>
              {/* Auth Layouts */}
              <Route element={<RequireAuth shouldBeAuthenticated={true} />}>
                <Route path='/posts/create' element={<CreatePost />} />
                <Route path='/posts/:id/edit' element={<EditPost />} />
                <Route path='/dashboard' element={<Dashboard />} />
              </Route>

              {/* Public Routes */}
              <Route path='/' element={<HomePage />} />
              <Route path='/posts' element={<AllPostPage />} />
              <Route path='/posts/:id' element={<SinglePostPage />} />

              <Route path='/users/:username/posts' element={<AllPostPage />} />

              {/* 404 */}
              <Route path='*' element={<NotFoundPage />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>

      {createPortal(<Toaster />, document.getElementById('toast-notifications'))}
    </>
  );
}

export default App;

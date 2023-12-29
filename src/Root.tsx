import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import App from './App';
import { GamePage } from './pages/GamePage';
import { HomePage } from './pages/HomePage';
import { Authentication } from './pages/Authentication';
import Profile from './pages/Profile';
import { SignUp } from './pages/SignUp';
import { UserInformation } from './pages/UserInformation';

export const Root = () => (
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />}>
        <Route path="home" element={<Navigate to="/" replace />} />
        <Route index element={<HomePage />}></Route>

        <Route path='game/:gameSlug' element={<GamePage />}></Route>

        <Route path='authentication'>
          <Route index element={<Authentication />} />
          <Route path='signup' element={<SignUp />} />
        </Route>\

        <Route path='profile' element={<Profile />}></Route>

        <Route path='user/:userId' element={<UserInformation />} />

        <Route path='*' element={<Navigate to="/" replace />} />
      </Route>


    </Routes>
  </BrowserRouter>
);
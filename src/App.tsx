
import './App.css'
import { Header } from './components/Header/Header';
import { Outlet } from 'react-router-dom';
import { SearchProvider } from './context/SearchContext';
import { AuthProvider } from './context/AuthContext';

export const App = () => {
  return (
    <>
      <SearchProvider>
        <AuthProvider>
          <div className='bg-[#191414] '>
            <div>
              <Header />
              <Outlet />
            </div>
          </div>
        </AuthProvider>
      </SearchProvider>
    </>
  )
};

export default App

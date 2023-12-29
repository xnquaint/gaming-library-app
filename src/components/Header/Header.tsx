'use client';
import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSearch } from '../../context/SearchContext';
import { useDebounce } from 'use-debounce';
import { AuthContext } from '../../context/AuthContext';
import tempAvatar from '../../assets/avatar_placeholder.png';
import logo from '../../assets/logo.svg';

const ColoredLine = ({ color }: { color: string }) => (
  <hr
    style={{
      color: color,
      backgroundColor: color,
      height: '0.5px'
    }}
  />
);

export const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 1500);
  const navigate = useNavigate();

  const { currentUser, isUpdated, avatarURL } = useContext(AuthContext);
  const { setCurrentPage, setSearch } = useSearch();

  useEffect(() => {
    setSearch(debouncedSearchTerm);
    navigate(`?search=${debouncedSearchTerm}`);
  }, [debouncedSearchTerm, setSearch, navigate]);

  useEffect(() => {
    console.log('rerendered', isUpdated);
  }, [isUpdated, avatarURL]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
    setCurrentPage(1);
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearch(searchTerm);
    setCurrentPage(1);
    navigate(`/?search=${searchTerm}`);
  };

  const getLink = currentUser ? '/profile' : '/authentication';

  return (
    <>
      <header className="flex items-center justify-between px-8 py-4 bg-[#000] text-white">
        <Link to="/" className=" w-18 h-9" onClick={
          () => {
            setCurrentPage(1);
            setSearchTerm('');
            setSearch('');
          }
        }>
          <img className="h-full w-full object-cover object-center" src={logo} alt="Logo" />
        </Link>
        <form onSubmit={handleSearchSubmit} className="flex items-center justify-center w-1/2">
          <input
            aria-label="Search for games"
            className="w-full p-2 rounded-md bg-white-800 text-black placeholder-gray-400 focus:ring-0 focus:border-0 focus:outline-none"
            placeholder="Search for games"
            type="search"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </form>
        <Link to={getLink}>
          {currentUser && (<img className="w-10 h-10 rounded-full" src={
            currentUser.photoURL
              ? `${currentUser.photoURL}?${Date.now()}`
              : tempAvatar
          } alt="Rounded avatar" />)}
          {!currentUser && (<img className="w-10 h-10 rounded-full" src={tempAvatar} alt="Rounded avatar" />)}
        </Link>
      </header >
      <ColoredLine color='gray' />
    </>


  );
}
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GameInterface } from '../types/GameInterface';
import {  Filter } from '../types/Filter';
import { ApiResponseInterface } from '../types/ApiResponseInterface';
import { SelectComponent } from '../components/SelectComponent/SelectComponent';
import { Carousel } from '../components/Carousel/Carousel';
import { GamesList } from '../components/GamesList/GamesList';
import useLocalStorageState from 'use-local-storage-state';
import { getFilters } from '../api/games';
import { useSearch } from '../context/SearchContext';
import { Pagination } from '../components/Pagination/Pagination';
import { API_KEY } from '../api/games';

export const HomePage = () => {
  const { currentPage, setCurrentPage } = useSearch();
  const [games, setGames] = useState<GameInterface[]>([]);
  const [filters, setFilters] = useState({ genres: '', tags: '', publishers: '', developers: '', search: '', page: 1 });
  const [isLoading, setIsLoading] = useState(false);
  const [isFiltersFetched, setIsFiltersFetched] = useLocalStorageState<boolean>('isFetched', { defaultValue: false });
  const [genres, setGenres] = useLocalStorageState<Filter[]>('genres', { defaultValue: [] });
  const [tags, setTags] = useLocalStorageState<Filter[]>('tags', { defaultValue: [] });
  const [publishers, setPublishers] = useLocalStorageState<Filter[]>('publishers', { defaultValue: [] });
  const [developers, setDevelopers] = useLocalStorageState<Filter[]>('developers', { defaultValue: [] });
  const [isForcedLoader, setIsForcedLoader] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { search } = useSearch();
  const isAnyGames = games.length > 0;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsForcedLoader(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    setFilters({
      genres: searchParams.get('genres') || '',
      tags: searchParams.get('tags') || '',
      publishers: searchParams.get('publishers') || '',
      developers: searchParams.get('developers') || '',
      search: searchParams.get('search') || '',
      page: currentPage,
    });
  }, [location.search, currentPage]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    setIsLoading(true);

    const activeFilters = Object.fromEntries(
      Object.entries({ ...filters, search }).filter(([, value]) => value)
    );

    axios.get(`https://api.rawg.io/api/games?key=${API_KEY}`, { params: activeFilters })
      .then(response => {
        setGames(response.data.results);
      })
      .catch(error => {
        throw error;
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [filters, search]);

  const handleApiGenres = (res: ApiResponseInterface) => {
    setGenres(res.results);
    console.log('genres', genres)
  }

  const handleApiTags = (res: ApiResponseInterface) => {
    setTags(res.results);
  }

  const handleApiPublishers = (res: ApiResponseInterface) => {
    setPublishers(res.results);

  }

  const handleApiDevelopers = (res: ApiResponseInterface) => {
    setDevelopers(res.results);
  }

  useEffect(() => {
    if (!isFiltersFetched) {
      Promise.all([
        getFilters('genres').then(handleApiGenres),
        getFilters('tags').then(handleApiTags),
        getFilters('developers').then(handleApiDevelopers),
        getFilters('publishers').then(handleApiPublishers),
      ])
        .then(() => setIsFiltersFetched(true))
        .catch((error) => {
          throw error;
        })
    }
  });

  const handleFilterChange = (filterName: string, filterValue: string) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set(filterName, filterValue);
    navigate({ search: searchParams.toString() });
  };

  return (
    <>
      <div className='bg-[#191414] h-screen'>
        {isForcedLoader && (
          <div className="text-center h-screen bg-inherit mt-4">
            <div role="status">
              <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        )}
        {!isForcedLoader && isAnyGames && games.length >= 3 && <Carousel games={games} />}
        <div className="flex flex-row justify-center py-10 bg-[#191414]">
          <div className="flex flex-col w-1/5 max-h-80 bg-[#191414] justify-between mx-auto">
            <h1 className='text-[#ff3f3f] text-5xl mb-5'>Sort By</h1>
            <SelectComponent filterName='Genres' filters={genres} setFilter={handleFilterChange} />
            <SelectComponent filterName='Tags' filters={tags} setFilter={handleFilterChange} />
            <SelectComponent filterName='Publishers' filters={publishers} setFilter={handleFilterChange} />
            <SelectComponent filterName='Developers' filters={developers} setFilter={handleFilterChange} />
          </div>
          <div className='flex flex-col'>
            <div className="m-auto w-9/10">
              {!isAnyGames && !isLoading && (
                <div>
                  <h2 className='px-8 text-7xl text-[#ff3f3f]'>There are no games matching query</h2>
                  <GamesList games={games} isLoading={true} />
                </div>
              )}
              {isAnyGames && <GamesList games={games} isLoading={isLoading} />}
            </div>
            <div className='flex justify-center items-center'>
              {isAnyGames && <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
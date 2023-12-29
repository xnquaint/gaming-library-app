import { useState, useEffect } from 'react';
import { Filter } from '../../types/Filter';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSearch } from '../../context/SearchContext';

interface Props {
  filterName: string;
  filters: Filter[];
  setFilter: (filter: string, value: string) => void;
}

export const SelectComponent: React.FC<Props> = ({ filterName, filters, setFilter }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const initialFilterValue = searchParams.get(filterName) || '';
  const [val, setVal] = useState(initialFilterValue);

  const { setCurrentPage } = useSearch();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const filterFind = filters?.find(f => f.name === event.target.value);
    if (filterFind) {
      setFilter(filterName.toLowerCase(), filterFind.slug);
    } else {
      setFilter(filterName.toLowerCase(), '');
    }

    setVal(event.target.value as string);
  };

  const handleReset = () => {
    // Reset the state
    setVal('');

    // Get the current search parameters
    const searchParams = new URLSearchParams(location.search);

    // Remove the current filter from the search parameters
    searchParams.delete(filterName.toLowerCase());

    setCurrentPage(1);

    // Update the URL with the new search parameters
    navigate({ search: searchParams.toString() });
  };

  useEffect(() => { }, [initialFilterValue]);

  return (
    <>
      <label htmlFor="large" className="block mb-2 text-base font-medium text-[#de004e] dark:text-white"></label>
      <div className='flex gap-7 items-center '>
        <select
          id="large"
          className="block rounded w-2/3 px-4 py-3 text-base text-[#de004e] border border-[#de004e] rounded-lgb bg-black focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          value={val}
          onChange={handleChange}

        >
          <option selected>{`Select ${filterName}`}</option>
          {filters?.map(f => (<option value={f.name} key={f.id}>{f.name}</option>))}
        </select>
        <div className='mb-3'>
          <button type="button" onClick={handleReset} className="w-9 h-5 mb-2 bg-black border border-[#de004e] rounded-md inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
            <span className="sr-only">Close menu</span>
            <svg className="h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

    </>
  );
}
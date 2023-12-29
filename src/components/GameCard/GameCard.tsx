import { Link } from 'react-router-dom';
import { GameInterface } from '../../types/GameInterface';
import { FavoriteGameInterface } from '../../types/FavoriteGameInterface';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { addFavoriteGame, getUser, removeFavoriteGame } from '../../utils/Firebase';

interface Props {
  game: Pick<GameInterface, 'slug' | 'name' | 'background_image'>;
  isProfile: boolean;
}

export const GameCard: React.FC<Props> = ({ game, isProfile }) => {
  const [isClicked, setIsClicked] = useState(false);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchFavoriteGames = async () => {
      if (currentUser) {
        const userData = await getUser(currentUser.uid);
        const { favoriteGames } = userData as Document & { favoriteGames: FavoriteGameInterface[] } || {};
        const isClickedFetch = favoriteGames.find((favGame: { slug: string; }) => favGame.slug === game.slug);
        setIsClicked(!!isClickedFetch);
      }
    };

    fetchFavoriteGames();
  }, [currentUser, game.slug]);


  const favoriteGame = { name: game.name, slug: game.slug, background_image: game.background_image } as FavoriteGameInterface;

  const handleClick = () => {
    setIsClicked(!isClicked);

    if (!isClicked && currentUser) {
      addFavoriteGame(currentUser, favoriteGame);
      console.log('added');
    }
    else if (isClicked && currentUser) {
      removeFavoriteGame(currentUser, favoriteGame);
    }
  }

  return (
    <div className="mb-4 max-w-md border border-[#de004e] rounded-l min-h-25">
      <Link to={`game/${game.slug}`} className='w-1/2'>
        <img className="rounded-t-lg h-[150px] w-full object-cover" src={game.background_image} alt="" />
      </Link>
      {isProfile && (
        <Link to={`game/${game.slug}`} className="p-3 flex justify-between items-start w-full">
            <h5 className="text-2xl font-bold tracking-tight text-[#de004e]"> {game.name}</h5>
        </Link>
      )}
      {!isProfile && (
        <div className="p-3 flex justify-between items-start w-full">
          <Link to={`game/${game.slug}`} >
            <h5 className="text-2xl font-bold tracking-tight text-[#de004e]"> {game.name}</h5>
          </Link>
          <div className='w-1/4 flex pt-0 justify-end'>
            <button onClick={handleClick}>
              {isClicked && currentUser && (
                <svg className="text-red-400 w-6 h-auto fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path d="M0 190.9V185.1C0 115.2 50.52 55.58 119.4 44.1C164.1 36.51 211.4 51.37 244 84.02L256 96L267.1 84.02C300.6 51.37 347 36.51 392.6 44.1C461.5 55.58 512 115.2 512 185.1V190.9C512 232.4 494.8 272.1 464.4 300.4L283.7 469.1C276.2 476.1 266.3 480 256 480C245.7 480 235.8 476.1 228.3 469.1L47.59 300.4C17.23 272.1 .0003 232.4 .0003 190.9L0 190.9z" />
                </svg>
              )}
              {!isClicked && currentUser && (
                <svg className="text-red-400 w-6 h-auto fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path d="M244 84L255.1 96L267.1 84.02C300.6 51.37 347 36.51 392.6 44.1C461.5 55.58 512 115.2 512 185.1V190.9C512 232.4 494.8 272.1 464.4 300.4L283.7 469.1C276.2 476.1 266.3 480 256 480C245.7 480 235.8 476.1 228.3 469.1L47.59 300.4C17.23 272.1 0 232.4 0 190.9V185.1C0 115.2 50.52 55.58 119.4 44.1C164.1 36.51 211.4 51.37 244 84C243.1 84 244 84.01 244 84L244 84zM255.1 163.9L210.1 117.1C188.4 96.28 157.6 86.4 127.3 91.44C81.55 99.07 48 138.7 48 185.1V190.9C48 219.1 59.71 246.1 80.34 265.3L256 429.3L431.7 265.3C452.3 246.1 464 219.1 464 190.9V185.1C464 138.7 430.4 99.07 384.7 91.44C354.4 86.4 323.6 96.28 301.9 117.1L255.1 163.9z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
};
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import tempAvatar from '../assets/avatar_placeholder.png';
import { getUser } from '../utils/Firebase';

import { FavoriteGameInterface } from '../types/FavoriteGameInterface';
import { GameCard } from '../components/GameCard/GameCard';
import { Link, useNavigate, useParams } from 'react-router-dom';

export const UserInformation = () => {
  const {
    isUpdated,
  } = useContext(AuthContext);
  const [userData, setUserData] = useState<Document | undefined>(undefined);
  const navigate = useNavigate();
  const { userId } = useParams();
  console.log(userId);

  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        const data = await getUser(userId);
        setUserData(data as Document);
      }
    };

    fetchUserData();
  }, [userId, isUpdated]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { favoriteGames, displayName, photoURL } = userData as Document & {
    displayName?: string,
    favoriteGames: FavoriteGameInterface[],
    nickname: string,
    photoURL: string,
  } || {};
  const getAvatar = userId && photoURL ? photoURL : tempAvatar;

  return (
    <div className='flex flex-col h-screen bg-[#191414] mt-5'>
      <div className='flex items-center justify-start'>
        <div className='flex ml-5'>
          <div className='flex justify-center mt-10'>
            <img className='w-40 h-30' src={getAvatar} alt="User profile" />
          </div>
          <div className='text-[#ff3f3f] ml-5 flex flex-row justify-center items-center gap-5'>
            <div className='flex flex-col gap-3'>
              <div className='flex gap-3 text-3xl'>
                <h3>
                  Nickname:
                </h3>
                <h3 className='text-white'>
                  {displayName}
                </h3>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className='flex flex-col items-center'>
        <h3 className='text-[#ff3f3f] text-3xl my-5'>Favorite Games</h3>
        <div className='grid grid-cols-4 gap-x-6 mx-5'>
          {favoriteGames && favoriteGames.map((game) => (
            <div className='max-w-1/4'>
              <Link to={`/${game.slug}`} onClick={() => navigate(`/game/${game.slug}`)}>
                <GameCard game={game} isProfile={true} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

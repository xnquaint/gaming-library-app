import { CiSettings } from "react-icons/ci";
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import tempAvatar from '../assets/avatar_placeholder.png';
import { Upload, getUser, updateDisplayName, updateUserPhoto, updateUserStorage } from '../utils/Firebase';
import { StorageReference, getDownloadURL } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { FavoriteGameInterface } from '../types/FavoriteGameInterface';
import { GameCard } from '../components/GameCard/GameCard';
import { Link, useNavigate } from 'react-router-dom';

function Profile() {
  const {
    currentUser,
    signOut,
    isUpdated,
    setIsUpdated,
    nickname,
    setNickname,
    setAvatarURL,
  } = useContext(AuthContext);
  const [photo, setPhoto] = useState<File | null>(null);
  const [userData, setUserData] = useState<Document | undefined>(undefined);
  const navigate = useNavigate();
  const avatar = currentUser?.photoURL ||  tempAvatar ;
  const [isShowControls, setIsShowControls] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhoto(e.target.files[0]);
    }
  }

  const handleUpload = () => {
    if (photo && currentUser) {
      Upload(photo, currentUser)
        .then((res) => {
          getDownloadURL(res.ref as StorageReference)
            .then((url) => {
              if (currentUser) {
                updateProfile(currentUser, {
                  photoURL: url
                })
                updateUserPhoto(currentUser, url);
                setAvatarURL(url);
                setIsUpdated(!isUpdated);
              }
            }).catch((error) => {
              console.error("Error updating user profile:", error);
            });
        })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNickname(inputValue);
    try {
      if (currentUser) {
        await updateUserStorage(currentUser, inputValue);
        await updateDisplayName(currentUser, inputValue);
        setIsUpdated(!isUpdated);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        const data = await getUser(currentUser.uid);
        setUserData(data as Document);
      }
    };

    fetchUserData();
  }, [currentUser, isUpdated, nickname]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const { favoriteGames } = userData as Document & { displayName?: string, favoriteGames: FavoriteGameInterface[] } || {};
  const isFavoriteGames = favoriteGames && favoriteGames.length > 0;

  return (
    /**
    * Extract the currrentUser from the context, if you want to
    * get the User info, like the email, display name, etc.
    */
    <div className='flex flex-col h-screen bg-[#191414] mt-5'>
      <div className='flex items-center justify-start'>
        <div className='flex ml-5'>
          <div className='flex justify-center mt-10'>
            <img className='w-40 h-30' src={`${avatar}?${Date.now()}`} alt="User profile" />
          </div>
          <div className='text-[#ff3f3f] ml-5 flex flex-row justify-center items-center gap-5'>
            <div className='flex flex-col gap-3'>
              <div className='flex gap-3 text-3xl'>
                <h3>
                  Nickname:
                </h3>
                <h3 className='text-white'>
                  {currentUser?.displayName || 'Anonymous'}
                </h3>
              </div>
              <div className='flex'>
                <button type="button" onClick={signOut} className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Sign Out</button>
              </div>
              <button className='w-1/2'>
                <CiSettings size={30} onClick={() => setIsShowControls(!isShowControls)} />
              </button>
            </div>
            {isShowControls && (
              <>
                <div className='flex flex-col items-center mx-5 w-1/2 justify-center'>
                  <h3 className='text-[#ff3f3f] text-3xl mb-3'>Upload avatar</h3>
                  <input onChange={handleChange} className="block text-xs text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="small_size" type="file" />
                  <button disabled={photo === null} onClick={handleUpload} className="w-40 h-10 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">Upload</button>
                </div>
                <div>
                  <h3 className='text-[#ff3f3f] text-xl mb-3'>Set Nickname</h3>
                  <form onSubmit={handleSubmit}>
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      id="small-input"
                      className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                    <button disabled={!inputValue} type="submit" className="w-40 h-10 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">Set New</button>
                  </form>

                </div>
              </>
            )}
          </div>
        </div>

      </div>

      <div className='flex flex-col items-center'>
        <h3 className='text-[#ff3f3f] text-3xl my-5'>{isFavoriteGames ? 'Favorite Games' : 'No favorite games'}</h3>
        <div className='grid grid-cols-4 gap-x-6 mx-5'>
          {favoriteGames && favoriteGames.map((game) => (
            <div className='max-w-1/4' key={game.slug}>
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
export default Profile
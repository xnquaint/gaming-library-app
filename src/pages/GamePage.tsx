'use client';

import { useParams, useLocation } from 'react-router-dom';
import { GameInterface } from '../types/GameInterface';
import { useCallback, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { addComment, addGame, getGameDetails } from '../utils/Firebase';
import { AuthContext } from '../context/AuthContext';
import { FaArrowCircleUp } from "react-icons/fa";
import { GameDescription } from '../components/GameDescription/GameDescription';
import { Comment } from '../components/Comment/Comment';
import { CommentInterface } from '../types/CommentInterface';
import { API_KEY } from '../api/games';
import { ScreenshotInterface } from '../types/ScreenshotInterface';



export const GamePage = () => {
  const { gameSlug } = useParams();
  const [game, setGame] = useState<GameInterface | null>(null);
  const [screenshots, setScreenshots] = useState<ScreenshotInterface[]>([]);
  const [gameData, setGameData] = useState<Document | undefined>(undefined);
  const [commentText, setCommentText] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  const {
    currentUser,
    nickname,
    avatarURL
  } = useContext(AuthContext);

  useEffect(() => {
    setIsLoading(true);
    const fetchGame = async () => {
      try {
        const response = await axios.get(`https://api.rawg.io/api/games/${gameSlug}?key=${API_KEY}`);
        setGame(response.data);
      } catch (error) {
        console.error('Failed to fetch game:', error);
      }
    };

    const fetchScreenshots = async () => {
      try {
        const response = await axios.get(`https://api.rawg.io/api/games/${gameSlug}/screenshots?key=${API_KEY}`);
        setScreenshots(response.data.results);
      } catch (error) {
        console.error('Failed to fetch screenshots:', error);
      }
    }


    Promise.all([fetchGame(), fetchScreenshots()])
      .then(() => setIsLoading(false))
      .catch((error) => console.error('Failed to fetch data:', error));
  }, [gameSlug]);



  const handleAddComment = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    const fetchAddComment = async () => {
      try {
        setIsDisabled(true);
        if (game?.slug && currentUser) {
          await addGame(game?.slug);
          await addComment(game?.slug, commentText, nickname, avatarURL, currentUser.uid);
        }
      } catch (error) {
        console.error("Error adding comment: ", error);
      } finally {
        setCommentText('');
        setIsDisabled(false);
      }
    };

    fetchAddComment();
  }, [game?.slug, commentText, nickname, avatarURL, currentUser]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    const fetchGamesData = async () => {
      if (gameSlug) {
        const data = await getGameDetails(gameSlug);
        setGameData(data as Document)
      }

    };

    fetchGamesData();
  }, [handleAddComment, gameSlug]);



  const { comments } = gameData as Document & { comments?: CommentInterface[] } || {};

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentText(e.target.value);
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <div className='flex flex-col items-center mt-4'>
      {isLoading && (
        <div className="text-center h-screen bg-inherit">
          <div role="status">
            <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}
      {!isLoading && (
        <>
          <GameDescription game={game} screenshots={screenshots} />
          <div className='w-1/4'>
            {currentUser && (
              <form onSubmit={handleAddComment}>
                <div className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                  <div className="px-4 py-2 bg-white rounded-t-lg dark:bg-gray-800">
                    <label htmlFor="comment" className="sr-only">Your comment</label>
                    <textarea id="comment" rows={4} value={commentText} onChange={handleCommentChange} className="w-full px-0 text-sm text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 focus:border-0 focus:outline-none dark:text-white dark:placeholder-gray-400" placeholder="Write a comment..." required></textarea>
                  </div>
                  <div className="flex items-center justify-between px-3 py-2 border-t dark:border-gray-600">
                    <button type="submit" disabled={isDisabled} className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800">
                      Post comment
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
          <div className='bg-white w-1/2 mb-10 rounded'>
            <h3 className='text-center font-bold my-4 text-3xl text-[#000000]'>Comments: </h3>
            {comments?.slice().reverse()?.map((comment, index) => (
              <Comment key={index} comment={comment} />
            ))}
          </div>
          <button id="back-to-top" className="fixed bottom-10 right-20 w-30 h30 bg-[#ff3f3f] text-white p-2 rounded-full" onClick={scrollToTop}>
            <FaArrowCircleUp size={30} />
          </button></>
      )}
    </div>
  );

}
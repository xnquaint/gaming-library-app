import { GameInterface } from '../../types/GameInterface';
import parse from 'html-react-parser';
import placeholder from '../../assets/avatar_placeholder.png';
import { ScreenshotInterface } from '../../types/ScreenshotInterface';

interface Props {
  game: GameInterface | null;
  screenshots: ScreenshotInterface[];
}


export const GameDescription: React.FC<Props> = ({ game, screenshots }) => {
  const descriptionText = parse((game?.description || ''));

  const gameName = game?.name || 'No game name';
  const gameBackgroundImage = game?.background_image || placeholder;


  return (
    <>
      <div className='flex flex-col items-center justify-center w-1/2'>
        <img src={gameBackgroundImage} alt="GameImage" />
        <h1 className='text-[#ff3f3f] font-bold text-7xl mt-10'>{gameName}</h1>
      </div>
      <div className='w-1/2 mt-10 flex justify-center items-center'>
        <p className='text-white text-xl'>
          {descriptionText}
        </p>
      </div>
      <div className='w-1/2 flex items-center mt-5'>
        <div>
          <h3 className='text-[#ff3f3f] text-xl'>Released: </h3>
        </div>
        <div className='text-xl text-white ml-4'>
          {game?.released.split('-')[0]}
        </div>
      </div>
      <div className='w-1/2 flex items-center'>
        <div>
          <h3 className='text-[#ff3f3f] text-xl'>Rating: </h3>
        </div>
        <div className='text-xl text-white ml-4'>
          {game?.rating ? game.rating : 'No rating'}
        </div>
      </div>
      <div className='w-1/2 flex items-center'>
        <div>
          <h3 className='text-[#ff3f3f] text-xl'>Metacritic: </h3>
        </div>
        <div className='text-xl text-white ml-4'>
          {game?.metacritic ? game.metacritic : 'No Metacrictic score'}
        </div>
      </div>
      <div className='w-1/2 flex items-center'>
        <div>
          <h3 className='text-[#ff3f3f] text-xl'>Platforms: </h3>
        </div>
        <div className='text-xl text-white ml-4'>
          {game?.platforms.map(p => p.platform.name).join(', ')}
        </div>
      </div>
      <div className="w-1/2 mt-5">
        <div className="grid grid-cols-2 gap-2 mb-10">
          {screenshots.map((screenshot, index) => (
            <div key={index}>
              <img src={screenshot.image} alt={`Screenshot ${index + 1}`} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
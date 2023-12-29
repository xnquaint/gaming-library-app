import { GameInterface } from '../../types/GameInterface';
import { GameCard } from '../GameCard/GameCard';
import { SkeletonComponent } from '../Skeleton/Skeleton';

interface Props {
  games: GameInterface[];
  isLoading: boolean;
}

export const GamesList: React.FC<Props> = ({ games, isLoading }) => {
  return (
    <div className='bg-[#191414]'>
      <div className="ml-auto max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        {isLoading && (
          <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-5 xl:gap-x-8">
            {Array.from({ length: 20 }).map((_, index) => (
              <SkeletonComponent key={index} />
            ))}
          </div>
        )}
        <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-5 xl:gap-x-8">
          {!isLoading && (games.map((game) => <GameCard game={game} key={game.id} isProfile={false} />))}
        </div>
      </div>
    </div>
  );
}
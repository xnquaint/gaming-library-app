import { useEffect, useState } from 'react';
import { GameInterface } from '../../types/GameInterface';
import { Link } from 'react-router-dom';
import placeholder from '../../assets/avatar_placeholder.png';

interface Props {
  games: GameInterface[];
}

export const Carousel: React.FC<Props> = ({ games }) => {

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  let slide1, slide2, slide3;

  if (games && games.length > 0) {
    slide1 = games[0]?.background_image || placeholder;
    slide2 = games[1]?.background_image || placeholder;
    slide3 = games[2]?.background_image || placeholder;
  }

  const images = [slide1, slide2, slide3];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((index) => (index + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="overflow-hidden mt-4 relative">
      <div className="flex justify-between items-center">
        {images.map((image, index) => (
          <Link to={`game/${games[index]?.slug}`} key={index}
            className={`w-1/3 ${index === currentImageIndex ? 'blur-none' : 'blur'
              } transition-blur duration-500 ease-in-out`}
          >
            <div>
              <img
                src={image}
                alt={`Slide ${index + 1}`}
                className="object-contain h-96 w-full"
              />
            </div>
          </Link>
        ))}
      </div>
      <div className="w-full absolute bottom-4 flex justify-center">
        {images.map((_, index) => (
          <span
            key={index}
            className={`bg-gray-200 cursor-pointer transition-all duration-500 ease-in-out ${currentImageIndex === index ? 'opacity-100' : 'opacity-50'
              }`}
          ></span>
        ))}
      </div>
    </div>
  );
};




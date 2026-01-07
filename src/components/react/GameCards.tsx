import { useState, useEffect } from 'react';
import type { Game } from '../../types';

interface Props {
  initialGames: Game[];
}

export default function GameCards({ initialGames }: Props) {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga asíncrona
    const timer = setTimeout(() => {
      setGames(initialGames);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [initialGames]);

  if (loading || games.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full justify-items-center">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="glass-effect rounded-md overflow-hidden border border-purple-neon/20 w-full">
            {/* Skeleton Image */}
            <div className="skeleton h-64 w-full"></div>
            {/* Skeleton Title */}
            <div className="p-4">
              <div className="skeleton h-6 w-3/4 mb-2"></div>
              <div className="skeleton h-4 w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full justify-items-center">
      {games.map((game) => (
        <a
          key={game.id}
          href={`/game/${game.id}`}
          className="glass-effect rounded-md overflow-hidden border border-purple-neon/20 card-hover group cursor-pointer w-full"
        >
          {/* Game Image */}
          <div className="relative h-64 w-full overflow-hidden bg-linear-to-br from-purple-neon/20 to-blue-neon/20">
            <div className="skeleton h-full w-full group-hover:scale-110 transition-transform duration-300"></div>
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-linear-to-t from-purple-dark via-transparent to-transparent opacity-60"></div>
          </div>
          
          {/* Game Title */}
          <div className="p-5">
            <h3 className="text-xl font-bold text-cyber-white mb-2 group-hover:text-pink-neon transition-colors">
              {game.title}
            </h3>
            <p className="text-base text-blue-neon">{game.category}</p>
          </div>
        </a>
      ))}
    </div>
  );
}

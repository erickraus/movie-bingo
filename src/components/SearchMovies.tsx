import { useState, useEffect } from 'react';

interface Movie {
  id: string;
  title: string;
  difficulty: string;
}

interface SearchMoviesProps {
  movies: Movie[];
}

export default function SearchMovies({ movies }: SearchMoviesProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredMovies([]);
      setShowResults(false);
      return;
    }

    const filtered = movies.filter((movie) =>
      movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredMovies(filtered);
    setShowResults(true);
  }, [searchTerm, movies]);

  const handleMovieClick = () => {
    setSearchTerm('');
    setShowResults(false);
  };

  return (
    <div className="relative w-full max-w-2xl">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for a movie..."
          className="w-full px-4 py-3 text-lg border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <svg
          className="absolute right-4 top-4 w-6 h-6 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Search Results */}
      {showResults && (
        <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {filteredMovies.length === 0 ? (
            <div className="p-4 text-center text-gray-600 dark:text-gray-400">
              No movies found matching "{searchTerm}"
            </div>
          ) : (
            <ul>
              {filteredMovies.map((movie) => (
                <li key={movie.id}>
                  <a
                    href={`/movies/${movie.id}`}
                    onClick={handleMovieClick}
                    className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="font-semibold text-gray-900 dark:text-gray-100">
                      {movie.title}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                      Difficulty: {movie.difficulty}
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from "react";

interface BingoCardGeneratorProps {
  title?: string;
  keywords?: string[];
}

interface BingoCard {
  id: number;
  keywords: string[];
}

export default function BingoCardGenerator({
  title = "",
  keywords = [],
}: BingoCardGeneratorProps) {
  const [movieTitle, setMovieTitle] = useState(title);
  const [keywordsText, setKeywordsText] = useState(keywords.join("\n"));
  const [numberOfCards, setNumberOfCards] = useState(4);
  const [generatedCards, setGeneratedCards] = useState<BingoCard[]>([]);
  const [errors, setErrors] = useState<{ title?: string; keywords?: string }>(
    {},
  );

  // Update form when props change
  useEffect(() => {
    if (title) setMovieTitle(title);
    if (keywords.length > 0) setKeywordsText(keywords.join("\n"));
  }, [title, keywords]);

  const validateInputs = (): boolean => {
    const newErrors: { title?: string; keywords?: string } = {};

    if (!movieTitle.trim()) {
      newErrors.title = "Title is required";
    } else if (movieTitle.length > 125) {
      newErrors.title = "Title must be 125 characters or less";
    }

    const keywordsList = keywordsText
      .split("\n")
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    if (keywordsList.length === 0) {
      newErrors.keywords = "At least one keyword is required";
    }

    const tooLongKeywords = keywordsList.filter((k) => k.length > 28);
    if (tooLongKeywords.length > 0) {
      newErrors.keywords = `Keywords must be 28 characters or less. Found ${tooLongKeywords.length} that are too long.`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const generateCards = () => {
    if (!validateInputs()) return;

    const keywordsList = keywordsText
      .split("\n")
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    const cards: BingoCard[] = [];
    const shuffledKeywords = shuffleArray(keywordsList);
    let keywordIndex = 0;

    for (let cardNum = 0; cardNum < numberOfCards; cardNum++) {
      const cardKeywords: string[] = [];

      // Need 24 keywords per card (25 squares - 1 FREE space)
      for (let i = 0; i < 24; i++) {
        cardKeywords.push(
          shuffledKeywords[keywordIndex % shuffledKeywords.length],
        );
        keywordIndex++;
      }

      cards.push({
        id: cardNum + 1,
        keywords: cardKeywords,
      });
    }

    setGeneratedCards(cards);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full">
      {/* Input Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 print:hidden">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Bingo Card Generator
        </h2>

        <div className="space-y-4">
          {/* Title Input */}
          <div>
            <label
              htmlFor="movie-title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Title of the movie
            </label>
            <input
              id="movie-title"
              type="text"
              maxLength={125}
              value={movieTitle}
              onChange={(e) => setMovieTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter movie title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.title}
              </p>
            )}
          </div>

          {/* Keywords Input */}
          <div>
            <label
              htmlFor="keywords"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Phrase, event, or thing that occurs in the movie (one per line,
              max 28 characters each)
            </label>
            <textarea
              id="keywords"
              value={keywordsText}
              onChange={(e) => setKeywordsText(e.target.value)}
              rows={10}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              placeholder="Enter keywords, one per line&#10;Example:&#10;Ruby slippers&#10;Yellow brick road&#10;Tornado"
            />
            {errors.keywords && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.keywords}
              </p>
            )}
          </div>

          {/* Number of Cards */}
          <div>
            <label
              htmlFor="num-cards"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Number of cards to generate
            </label>
            <select
              id="num-cards"
              value={numberOfCards}
              onChange={(e) => setNumberOfCards(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {Array.from({ length: 16 }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          {/* Generate Button */}
          <button
            onClick={generateCards}
            className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Generate Bingo Cards
          </button>
        </div>
      </div>

      {/* Generated Cards */}
      {generatedCards.length > 0 && (
        <div>
          {/* Print Button */}
          <div className="mb-6 print:hidden">
            <button
              onClick={handlePrint}
              className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Print Cards
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:grid-cols-2 print:gap-4">
            {generatedCards.map((card, index) => (
              <BingoCard
                key={card.id}
                card={card}
                title={movieTitle}
                shouldBreakAfter={(index + 1) % 4 === 0}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface BingoCardProps {
  card: BingoCard;
  title: string;
  shouldBreakAfter?: boolean;
}

function BingoCard({ card, title, shouldBreakAfter = false }: BingoCardProps) {
  // Insert FREE in the middle (index 12)
  const squares = [...card.keywords];
  squares.splice(12, 0, "FREE");

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 print:shadow-none print:border print:border-gray-300 print:break-inside-avoid print:p-3 print:mb-2 ${shouldBreakAfter ? "print:break-after-page" : ""}`}
    >
      {/* Card Header */}
      <div className="text-center mb-4 print:mb-1">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 print:text-black print:text-base">
          {title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 print:text-gray-700 print:text-xs">
          Card #{card.id}
        </p>
      </div>

      {/* Bingo Grid */}
      <div className="grid grid-cols-5 gap-1 border-2 border-gray-800 dark:border-gray-200 print:border-black print:gap-0 print:border">
        {squares.map((keyword, index) => {
          const isFree = keyword === "FREE";
          return (
            <div
              key={index}
              className={`
                aspect-square flex items-center justify-center p-2 text-center
                border border-gray-400 dark:border-gray-600 print:border-black
                ${
                  isFree
                    ? "bg-blue-100 dark:bg-blue-900 print:bg-gray-200 font-bold text-lg print:text-sm"
                    : "bg-white dark:bg-gray-700 print:bg-white"
                }
                text-gray-900 dark:text-gray-100 print:text-black
                text-xs sm:text-sm print:text-[0.65rem] print:p-1
              `}
            >
              <span className="break-words leading-tight print:leading-none">
                {keyword}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

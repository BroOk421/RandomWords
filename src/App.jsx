import { useState, useEffect } from "react";

export default function App() {
  const [inputWords, setInputWords] = useState("");
  const [words, setWords] = useState("");
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(60);
  const [isOver, setIsOver] = useState(false);
  const [isPop, setIsPop] = useState(false);
  const [city, setCity] = useState([]);

  const apiKey = "1946a218ae4be5eb7bd6e4ab3572249e";
  const url = "https://api.openweathermap.org/data/2.5/weather?units=metric";

  const getRandomCoordinate = (min, max) => {
    return Math.random() * (max - min) + min;
  };

  const cities = async () => {
    const randomLat = getRandomCoordinate(-90, 90).toFixed(2);
    const randomLon = getRandomCoordinate(-180, 180).toFixed(2); 

    try {
      const response = await fetch(
        `${url}&lat=${randomLat}&lon=${randomLon}&appid=${apiKey}`
      );
      if (!response.ok) {
        throw new Error("Error fetching");
      }
      const data = await response.json();

      if (data.name && /^[a-zA-Z ]+$/.test(data.name)) {
        setCity([data]); // Update city data
        setWords(data.name.toLowerCase()); // Use the city name as the word
      } else {
        cities(); // Retry fetching if the city name contains special characters or is invalid
      }
    } catch (error) {
      console.log("Error:", error.message);
    }
  };

  useEffect(() => {
    cities();
  }, []);

  useEffect(() => {
    if (city.length === 0) {
      setWords("loading...");
    }
  }, [city]);

 useEffect(() => {
  const timer = setInterval(() => {
    if(!isOver && isPop) {
      setTime(prev => {
        if(prev <= 0) {
          clearInterval(timer);
          setIsOver(true);
          setIsPop(false);
          setTime(60);
        }
        return prev -1;
      });
        return () => clearInterval(timer);
    }
  }, 1000);
 }, [isOver, isPop]);

 const handlerReset = () => {
  setIsOver(true);
  setIsPop(false);
  setTime(0);
 }

  const handlerStart = () => {
    setIsPop(true);
    setIsOver(false);
    setTime(60);
    setScore(0);
    setInputWords("");
  };

  const handlerAgain = () => {
    setIsOver(false);
    setIsPop(false);
    setTime(60);
  };

  const handlerKeyChange = (e) => {
    setInputWords(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (inputWords.toLowerCase() === words.toLowerCase()) {
        setScore((prev) => prev + 5);
        setTime((prev) => prev + 2);
        cities();
        setInputWords("");
      } else {
        setScore((prev) => Math.max(prev - 6, 0));
        setTime((prev) => Math.max(prev - 5, 0));
        setInputWords("");
      }
    }
  };

  const renderWordWithColors = () => {
    if (!words) return null;

    return (
      <span>
        {words.split("").map((letter, index) => {
          const isTyped = index < inputWords.length;
          const typedCorrectly =
            isTyped && letter.toLowerCase() === inputWords[index]?.toLowerCase();
          return (
            <span
              key={index}
              className={typedCorrectly ? "text-black" : "text-white"}
            >
              {words ? letter : 'Loading...'}
            </span>
          );
        })}
      </span>
    );
  };

  return (
    <div className="flex flex-col justify-center items-center h-[100vh] w-full">
      {!isPop && !isOver && (
        <div className="h-[250px] w-[250px] flex flex-col justify-center items-center gap-[20px] border rounded-md bg-orange-500">
          <h1 className="text-[24px] text-white leading-7 text-center ">
            Guessing Random Words
          </h1>
          <button
            className="text-[16px] text-white uppercase px-[50px] py-[10px] mt-[20px] border rounded-md"
            onClick={handlerStart}
          >
            Start
          </button>
        </div>
      )}

      {isPop && !isOver && (
        <div className="h-auto w-[350px] flex flex-col justify-start items-center gap-[20px] p-[20px] border rounded-md bg-orange-400">
          <div className="h-auto w-full flex justify-between ">
            <h1 className="text-[18px] text-white leading-7 text-center">
              Score: {score}
            </h1>
            <h1 className="text-[18px] text-white leading-7 text-center">
              Timer: {time}
            </h1>
          </div>
          <div className="h-auto w-full flex justify-center pt-[50px] pb-[20px]">
            <p className="text-[24px] text-center text-wrap">
              {renderWordWithColors()}
            </p>
          </div>
          <div className="h-auto w-full flex justify-center pb-[20px]">
            <input
              className="text-center p-[10px] rounded-md"
              type="text"
              value={inputWords}
              onChange={handlerKeyChange}
              onKeyDown={handleKeyDown}
              placeholder="Type the Words"
            />
          </div>
          <div className="flex flex-row w-full justify-center items-center">
            <button onClick={handlerReset} className="text-white bg-red-600 rounded-md px-[20px] py-[10px]">Reset</button>
          </div>
        </div>
      )}

      {isOver && (
        <div className="h-[250px] w-[250px] flex flex-col justify-center items-center gap-[20px] border rounded-md bg-orange-500">
          <h1 className="text-[24px] text-white leading-7 text-center ">
            Your Score
          </h1>
          <h1 className="text-[24px] text-white leading-7 text-center ">
            {score}
          </h1>
          <button
            className="text-[16px] text-white px-[20px] py-[10px] mt-[20px] border rounded-md"
            onClick={handlerAgain}
          >
            Play Again?
          </button>
        </div>
      )}
    </div>
  );
}

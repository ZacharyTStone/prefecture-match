import React, { useEffect, useState, useMemo, FC } from "react";
import "./App.css";
import CardComponent from "./Components/Card/Card";
import { useWindowSize } from "@react-hook/window-size";
import Confetti from "react-confetti";
// @ts-ignore
import correctSound from "../src/audio/correct.m4a";
// @ts-ignore
import errorSound from "../src/audio/error.m4a";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { cardImages } from "./utils/prefectures";

const API = "https://en.wikipedia.org/api/rest_v1/page/summary/";

interface CardType {
  src: string;
  alt: string;
  id: number;
  matched?: boolean;
}

interface PrefectureData {
  extract?: string;
}

const getPrefectureSummary = async (prefecture: string): Promise<void> => {
  const response = await fetch(`${API}${prefecture}`);
  const data: PrefectureData = await response.json();
  toast.success(data.extract || "", {
    position: "top-right",
    autoClose: 10000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    toastId: prefecture,
    style: { fontSize: "0.8rem" },
  });
};

const App: FC = () => {
  const [width, height] = useWindowSize();
  const [cards, setCards] = useState<CardType[]>([]);
  const [choices, setChoices] = useState<CardType[]>([]);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [runConfetti, setRunConfetti] = useState<boolean>(false);

  const correct = useMemo(() => new Audio(correctSound), []);
  const error = useMemo(() => new Audio(errorSound), []);

  const shuffleCards = (): void => {
    const fiveRandomCards = cardImages
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);

    const shuffledCards = [...fiveRandomCards, ...fiveRandomCards]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }));

    setCards(shuffledCards);
    setChoices([]);
    setDisabled(false);
    setRunConfetti(false);
  };

  const handleChoice = (card: CardType): void => {
    if (choices.length === 1) {
      setChoices([choices[0], card]);
      setDisabled(true);
    } else {
      setChoices([card]);
    }
  };

  useEffect(() => {
    if (choices.length === 2) {
      setDisabled(true);
      const [choice1, choice2] = choices;

      if (choice1.src === choice2.src) {
        setCards((prevCards: CardType[]) =>
          prevCards.map((card: CardType) =>
            card.src === choice1.src ? { ...card, matched: true } : card
          )
        );
        correct.play();
        getPrefectureSummary(choice1.alt);
        setTimeout(() => {
          setDisabled(false);
          setChoices([]);
        }, 1000);
      } else {
        error.play();
        setTimeout(() => {
          setDisabled(false);
          setChoices([]);
        }, 1500);
      }
    }
  }, [choices, correct, error]);

  useEffect(() => {
    if (cards.length && cards.every((card) => card.matched)) {
      setRunConfetti(true);
    }
  }, [cards]);

  return (
    <>
      <div className="App">
        <ToastContainer />
        <h1>Prefecture Match</h1>
        <button onClick={shuffleCards}>New Game</button>
        <div className="board">
          {cards.map((card) => (
            <CardComponent
              key={card.id}
              card={card}
              handleChoice={handleChoice}
              flipped={
                card === choices[0] || card === choices[1] || card.matched
              }
              disabled={disabled}
            />
          ))}
        </div>
      </div>
      {runConfetti && (
        <Confetti width={width} height={height} numberOfPieces={250} />
      )}
    </>
  );
};

export default App;

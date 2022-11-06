import "./App.css";
import React, { useEffect, useState } from "react";
import Card from "./Components/Card/Card";
import { useWindowSize } from "@react-hook/window-size";
import Confetti from "react-confetti";
import correctSound from "../src/audio/correct.m4a";
import errorSound from "../src/audio/error.m4a";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';


// outside of function so
const cardImages = [
  { src: "/images/aomori.jpg", matched: false, alt: "Aomori_Prefecture" },
  { src: "/images/aichi.jpg", matched: false, alt: "Aichi_Prefecture" },
  { src: "/images/akita.jpg", matched: false, alt: "Akita_Prefecture" },
  { src: "/images/aomori.jpg", matched: false, alt: "Aomori_Prefecture" },
  { src: "/images/chiba.jpg", matched: false, alt: "Chiba_Prefecture" },
  { src: "/images/Ehime.jpg", matched: false, alt: "Ehime_Prefecture" },
  { src: "/images/fukui.jpg", matched: false, alt: "Fukui_Prefecture" },
  { src: "/images/fukuoka.jpg", matched: false, alt: "Fukuoka_Prefecture" },
  { src: "/images/fukushima.jpg", matched: false, alt: "Fukushima_Prefecture" },
  { src: "/images/gifu.jpg", matched: false, alt: "Gifu_Prefecture" },
  { src: "/images/gunma.jpg", matched: false, alt: "Gunma_Prefecture" },
  { src: "/images/hiroshima.png", matched: false, alt: "Hiroshima_Prefecture" },
  { src: "/images/hokkaido.jpg", matched: false, alt: "Hokkaido_Prefecture" },
  { src: "/images/hyogo.jpg", matched: false, alt: "Hyogo_Prefecture" },
  { src: "/images/ibaraki.jpg", matched: false, alt: "Ibaraki_Prefecture" },
  { src: "/images/ishikawa.jpg", matched: false, alt: "Ishikawa_Prefecture" },
  { src: "/images/iwate.jpg", matched: false, alt: "Iwate_Prefecture" },
  { src: "/images/kagawa.jpg", matched: false, alt: "Kagawa_Prefecture" },
  { src: "/images/kagoshima.jpg", matched: false, alt: "Kagoshima_Prefecture" },
  { src: "/images/kanagawa.jpg", matched: false, alt: "Kanagawa_Prefecture" },
  { src: "/images/kochi.jpg", matched: false, alt: "Kochi_Prefecture" },
  { src: "/images/kumamoto.jpg", matched: false, alt: "Kumamoto_Prefecture" },
  { src: "/images/kyoto.jpg", matched: false, alt: "Kyoto_Prefecture" },
  { src: "/images/miyagi.jpg", matched: false, alt: "Miyagi_Prefecture" },
  { src: "/images/mie.jpg", matched: false, alt: "Mie_Prefecture" },
  { src: "/images/miyazaki.jpg", matched: false, alt: "Miyazaki_Prefecture" },
  { src: "/images/nagano.jpg", matched: false, alt: "Nagano_Prefecture" },
  { src: "/images/nagasaki.jpg", matched: false, alt: "Nagasaki_Prefecture" },
  { src: "/images/nara.jpg", matched: false, alt: "Nara_Prefecture" },
  { src: "/images/niigata.jpg", matched: false, alt: "Niigata_Prefecture" },
  { src: "/images/oita.jpg", matched: false, alt: "Oita_Prefecture" },
  { src: "/images/okayama.jpg", matched: false, alt: "Okayama_Prefecture" },
  { src: "/images/okinawa.jpg", matched: false, alt: "Okinawa_Prefecture" },
  { src: "/images/osaka.jpg", matched: false, alt: "Osaka_Prefecture" },
  { src: "/images/saga.jpg", matched: false, alt: "Saga_Prefecture" },
  { src: "/images/saitama.jpg", matched: false, alt: "Saitama_Prefecture" },
  { src: "/images/shiga.jpg", matched: false, alt: "Shiga_Prefecture" },
  { src: "/images/shimane.jpg", matched: false, alt: "Shimane_Prefecture" },
  { src: "/images/shizuoka.jpg", matched: false, alt: "Shizuoka_Prefecture" },
  { src: "/images/tochigi.jpg", matched: false, alt: "Tochigi_Prefecture" },
  { src: "/images/tokushima.jpg", matched: false, alt: "Tokushima_Prefecture" },
  { src: "/images/tokyo.jpg", matched: false, alt: "Tokyo_Prefecture" },
  { src: "/images/tottori.jpg", matched: false, alt: "Tottori_Prefecture" },
  { src: "/images/toyama.jpg", matched: false, alt: "Toyama_Prefecture" },
  { src: "/images/wakayama.jpg", matched: false, alt: "Wakayama_Prefecture" },
  { src: "/images/yamagata.jpg", matched: false, alt: "Yamagata_Prefecture"},
  { src: "/images/yamaguchi.jpg", matched: false, alt: "Yamaguchi_Prefecture" },
  { src: "/images/yamanashi.jpg", matched: false, alt: "Yamanashi_Prefecture" },
];

// wikipedia api
const API = "https://en.wikipedia.org/api/rest_v1/page/summary/";

const getPrefectureSummary = async (prefecture) => {
  const response = await fetch(`${API}${prefecture}`);
  const data = await response.json();
  toast.success(data?.extract, {
    position: "top-right",
    autoClose: 10000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
   toastId: prefecture,
    style: {
     // small font size
      fontSize: "0.8rem",
    },
  } );
};



function App() {
  const { width, height } = useWindowSize();
  const [cards, setCards] = useState([]);
  const [choice1, setChoice1] = useState(null);
  const [choice2, setChoice2] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [runConfetti, setRunConfetti] = useState(false);
  let [matchedCount, setMatchedCount] = useState(0);
  let [started, setStarted] = useState(false);

  const shuffleCards = () => {
    setStarted(false);
    setRunConfetti(false);
    setMatchedCount(0);
    //get 5 random cards from the array
    const tenRandomCards = cardImages
      .sort(() => 0.5 - Math.random())
      .slice(0, 5);
    // double the cards
    const shuffledCards = [...tenRandomCards, ...tenRandomCards]
      // less then 0 = same order for the two items, positive = different order
      .sort(() => Math.random() - 0.5)
      // random id for each object
      .map((card) => ({ ...card, id: Math.random() }));
    // set the state
    setCards(shuffledCards);
    console.log(shuffledCards);
  };

  // passed down to EACH card through props
  const handleChoice = (card) => {
    console.log(card);
    choice1 ? setChoice2(card) : setChoice1(card);
  };

  // fires when the component mounts and whenver the dependencies change (choice1, choice2)
  useEffect(() => {
    checkConfeti();
    // disable the cards till the checks are made
    if (choice1 && choice2) {
      if (!started) {
        setStarted(true);
      }
      setDisabled(true);
      if (choice1.src === choice2.src) {
        // remap all of the cards with the choice1 and choice2 as matched
        setCards((prevCards) => {
          return prevCards.map((card) => {
            //check for each card
            if (card.src === choice1.src) {
              correct.play();
              // if it one of the cards we return it with the matched property set to true
              setMatchedCount((matchedCount += 1));
              
              // log the alt text of the matched cards
              console.log(card.alt);
              getPrefectureSummary(card.alt);
              return { ...card, matched: true };
            } else {
              return card;
            }
          });
        });

        resetTurn();
      } else {
        setTimeout(() => {
          error.play();
          resetTurn();
        }, 1500);
      }
    }
  }, [choice1, choice2]);

  const checkConfeti = () => {
    if (matchedCount === cards.length * 2 && started) {
      // correct.play();
      setRunConfetti(true);
    }
  };

  const resetTurn = () => {
    setChoice1(null);
    setChoice2(null);
    setDisabled(false);
  };

  // audio

  // Get audio file in a variable
  let correct = new Audio(correctSound);
  let error = new Audio(errorSound);

  return (
    <>
      <div className="App">
        <ToastContainer 
        width={"100vw"}
        />
        <h1>Prefecture Match</h1>
        <button onClick={shuffleCards}>New Game</button>
        <div className="board">
          {cards.map((card) => (
            <Card
              key={card.id}
              card={card}
              alt={card.alt}
              handleChoice={handleChoice}
              // three situations when you want to see the front img
              flipped={card === choice1 || card === choice2 || card.matched}
              disabled={disabled}
            />
          ))}
        </div>
      </div>
      {runConfetti ? (
        <Confetti
          width={width}
          height={height}
          run={runConfetti}
          colors={["#f44336", "#FFFFFF"]}
          numberOfPieces={250}
        />
      ) : null}
    </>
  );
}

export default App;

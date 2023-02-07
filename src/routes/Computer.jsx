import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store";
import { getResults, ICONS } from "../utils";

const Computer = () => {
  const navigate = useNavigate();
  const [{ self, opponent }, dispatch] = useStore();
  const [timer, setTimer] = useState(15);
  const [isLock, setLock] = useState(false);
  const [isNext, setNext] = useState(false);
  const [isShow, setShow] = useState(false);
  const [choice, setChoice] = useState("rock");
  const [selfChoices, setSelfChoices] = useState("xxxxxxxxxxxxxxx");
  const [opponentChoices, setOpponentChoices] = useState("xxxxxxxxxxxxxxx");
  const [message, setMessage] = useState();
  const [messages, setMessages] = useState([]);

  const { nextTurn, turnResult, first, second, final, result, lastChoice } = useMemo(() => {
    return getResults(selfChoices, opponentChoices);
  }, [selfChoices, opponentChoices]);

  const timerText = useMemo(() => {
    const seconds = timer % 60;
    const minutes = (timer - seconds) / 60;
    return `${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  }, [timer]);

  useEffect(() => {
    const timeoutId = !isShow && handleWaitingLock();
    return () => {
      clearTimeout(timeoutId);
    };
  }, [timer]);

  const handleChoice = (choice) => {
    if (!isLock) setChoice(choice);
  };

  const randomComputerChoice = () => {
    const choices = ["r", "p", "s"];
    const index = Math.floor(Math.random() * choices.length);
    const newChoices =
      opponentChoices.substring(0, nextTurn) + choices[index] + opponentChoices.substring(nextTurn + 1);
    setOpponentChoices(newChoices);
    setShow(true);
  };

  const handleLock = () => {
    setLock(true);
    const newChoices = selfChoices.substring(0, nextTurn) + choice.charAt(0) + selfChoices.substring(nextTurn + 1);
    setSelfChoices(newChoices);
    randomComputerChoice();
  };

  const handleNext = () => {
    setTimer(15);
    setShow(false);
    setLock(false);
    setNext(false);
  };

  const handleWaitingLock = () => {
    return setTimeout(() => {
      if (timer > 0) setTimer((prev) => prev - 1);
      else handleLock();
    }, 1000);
  };

  const handleLeave = () => {
    navigate("/queue");
    dispatch({ type: "CHANGE_OPPONENT", payload: {} });
  };

  const handleKeyDown = ({ key }) => {
    if (key === "Enter") handleSend();
  };

  const handleReply = () => {
    const messages = [
      "Hello!",
      "¡Hola!",
      "Bonjour!",
      "Hallo!",
      "Ciao!",
      "Olá!",
      "你好!",
      "こんにちは!",
      "안녕하세요!",
      "Xin chào!",
    ];
    const index = Math.floor(Math.random() * messages.length);
    const message = messages[index];
    setMessages((prev) => [{ isSelf: false, message }, ...prev]);
  };

  const handleSend = () => {
    const newMessage = message.trim();
    if (newMessage.trim().length < 1) return;
    setMessages((prev) => [{ isSelf: true, message }, ...prev]);
    setMessage("");
    handleReply();
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center select-none p-20 text-slate-700 font-semibold">
      <div className="shadow-2xl w-full grid grid-cols-[1fr_2fr_1fr] flex-grow">
        <div className="border-r flex flex-col justify-around items-center p-8 uppercase">
          <div className="flex flex-col justify-center items-center">
            <div className={`tracking-widest ${first.result === "none" ? "text-2xl" : null}`}>First round</div>
            <div className={`${first.result === "none" ? "text-9xl" : "text-7xl"}`}>
              {first.result !== "none" ? first.result : "Bo5"}
            </div>
            <div className="text-4xl mt-2 flex items-center">
              {first.scores.map((result, index) => (
                <div key={index} className={`flex items-center ${ICONS[result].color}`}>
                  <ion-icon name={ICONS[result].name}></ion-icon>
                </div>
              ))}
            </div>
          </div>
          <div className={`flex-col justify-center items-center ${first.result === "none" ? "hidden" : "flex"}`}>
            <div
              className={`tracking-widest ${second.result === "none" && first.result !== "none" ? "text-2xl" : null}`}
            >
              Second round
            </div>
            <div className={`${second.result === "none" && first.result !== "none" ? "text-9xl" : "text-7xl"}`}>
              {second.result !== "none" ? second.result : "Bo3"}
            </div>
            {first.result !== "none" && (
              <div className="text-4xl mt-2 flex items-center">
                {second.scores.map((result, index) => (
                  <div key={index} className={`flex items-center ${ICONS[result].color}`}>
                    <ion-icon name={ICONS[result].name}></ion-icon>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className={`flex-col justify-center items-center ${second.result === "none" ? "hidden" : "flex"}`}>
            <div
              className={`tracking-widest ${final.result === "none" && second.result !== "none" ? "text-2xl" : null}`}
            >
              Final round
            </div>
            <div className={`${final.result === "none" && second.result !== "none" ? "text-9xl" : "text-7xl"}`}>
              {final.result !== "none" ? final.result : "Bo7"}
            </div>
            {second.result !== "none" && (
              <div className="text-4xl mt-2 flex items-center">
                {final.scores.map((result, index) => (
                  <div key={index} className={`flex items-center ${ICONS[result].color}`}>
                    <ion-icon name={ICONS[result].name}></ion-icon>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {result !== "none" ? (
          <div className="grid grid-rows-[10rem_auto_10rem]">
            <div className="border-b flex items-center justify-center">
              <div
                className={`flex items-center ${
                  result === "win" ? ICONS.lose.color : result === "lose" ? ICONS.win.color : ICONS.draw.color
                }`}
              >
                <div className="mr-1 text-4xl font-bold">{opponent.name}</div>
                <div className="flex justify-center items-center text-6xl">
                  <ion-icon
                    name={result === "win" ? ICONS.lose.name : result === "lose" ? ICONS.win.name : ICONS.draw.name}
                  ></ion-icon>
                </div>
              </div>
            </div>
            <div className="flex justify-evenly items-center flex-col">
              <div className="text-9xl uppercase">{result === "draw" ? "Draw" : "You " + result}</div>
              <div onClick={handleLeave} className="button">
                Leave match
              </div>
            </div>
            <div className="border-t flex items-center justify-center">
              <div className={`flex items-center ${ICONS[result].color}`}>
                <div className="flex justify-center items-center text-6xl">
                  <ion-icon name={ICONS[result].name}></ion-icon>
                </div>
                <div className="ml-1 text-4xl font-bold">{self.name}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-rows-[10rem_auto_10rem]">
            <div className="border-b flex items-center justify-between p-8">
              <div className="flex">
                <div className="vertical-text text-sm uppercase text-[#ccc] text-center mr-1">Last choice</div>
                <div className="w-32 aspect-square rounded-full border border-[#ccc] overflow-hidden">
                  {lastChoice !== "none" ? (
                    <img className="w-28 h-full object-contain" src={`./src/assets/${lastChoice}.png`} />
                  ) : (
                    <div className="flex h-full justify-center items-center text-6xl text-[#ccc]">
                      <ion-icon name="ban"></ion-icon>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center">
                <div className="mr-1 text-4xl font-bold">{opponent.name}</div>
                <div className="flex justify-center items-center text-6xl">
                  <ion-icon name="person-circle"></ion-icon>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 relative">
              <div className="p-2 text-4xl whitespace-nowrap bg-white uppercase absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                {isLock
                  ? isShow
                    ? turnResult === "draw"
                      ? "Draw"
                      : "You " + turnResult
                    : "Waiting for the result"
                  : "Lock your choice"}
              </div>
              {isShow ? (
                <div
                  onClick={handleNext}
                  className={`button absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 ${
                    isNext ? "disabled" : null
                  }`}
                >
                  Next
                </div>
              ) : (
                <>
                  <div className="p-2 text-4xl whitespace-nowrap bg-white uppercase absolute top-8 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="timer countdown">
                      <div className="timer-text">{timerText}</div>
                    </div>
                  </div>
                  <div
                    onClick={handleLock}
                    className={`button absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 ${
                      isLock ? "disabled" : null
                    }`}
                  >
                    {isLock ? "Locked" : "Lock"}
                  </div>
                </>
              )}
              <div className="h-full border-r border-[#ccc] flex items-center">
                <div className="h-40 overflow-hidden">
                  <img className="h-full" src={`./src/assets/${choice}.png`} />
                </div>
              </div>
              <div className="h-full flex items-center justify-center flip-image">
                {isShow ? (
                  <div className="h-40 flex justify-start w-full">
                    <img className="h-full" src={`./src/assets/${lastChoice}.png`} />
                  </div>
                ) : (
                  <div className="text-9xl text-[#ccc]">
                    <ion-icon name="lock-open"></ion-icon>
                  </div>
                )}
              </div>
            </div>
            <div className="border-t flex items-center justify-between p-8">
              <div className="flex items-center">
                <div className="flex justify-center items-center text-6xl">
                  <ion-icon name="person-circle"></ion-icon>
                </div>
                <div className="ml-1 text-4xl font-bold">{self.name}</div>
              </div>
              <div className="flex gap-8">
                {["rock", "paper", "scissors"].map((name) => (
                  <div
                    key={name}
                    onClick={() => handleChoice(name)}
                    className={`w-32 aspect-square rounded-full border border-[#ccc] overflow-hidden ${
                      name !== choice
                        ? !isLock
                          ? "opacity-50 hover:opacity-100 cursor-pointer border-dashed hover:border-solid"
                          : "opacity-50 grayscale border-dashed"
                        : null
                    }`}
                  >
                    <img className="w-28 h-full object-contain" src={`./src/assets/${name}.png`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        <div className="border-l p-8 flex flex-col">
          <div className="border border-[#ccc] h-[calc(100vh-19rem)] p-4 overflow-auto">
            <div className="flex flex-col-reverse gap-1">
              {messages.map((item, index) => (
                <div
                  key={index}
                  className={`px-4 py-2 border max-w-[15rem] w-fit text-ellipsis overflow-auto ${
                    item.isSelf ? "self-end border-slate-700" : "bg-slate-700 text-white"
                  }`}
                >
                  {item.message}
                </div>
              ))}
            </div>
          </div>
          <div className="flex mt-4">
            <input
              type="text"
              className="w-full px-8 py-4 border border-[#ccc] focus:outline-none mr-4"
              placeholder="Message..."
              value={message}
              onKeyDown={handleKeyDown}
              onChange={(event) => setMessage(event.target.value)}
            />
            <div onClick={handleSend} className="button">
              Send
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Computer;

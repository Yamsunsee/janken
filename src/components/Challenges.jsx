import { useState } from "react";

const Challenges = () => {
  const [challenges, setChallenges] = useState([]);

  const handleAcceptChallenges = () => {};

  const handleDeclineChallenges = () => {};

  return (
    <div className="flex flex-col gap-2 max-h-36 overflow-auto">
      {challenges.map((name) => (
        <div key={name} className="ticket" onAnimationEnd={() => handleDeclineChallenges(name)}>
          <div className="flex items-center gap-2">
            <div className="flex items-center text-4xl">
              <ion-icon name="ticket"></ion-icon>
            </div>
            <div className="text-2xl font-bold">{name}</div>
          </div>
          <div className="flex items-center gap-2 text-2xl">
            <div
              onClick={() => handleAcceptChallenges(name)}
              className="flex items-center hover:text-green-400 cursor-pointer"
            >
              <ion-icon name="checkmark-circle"></ion-icon>
            </div>
            <div
              onClick={() => handleDeclineChallenges(name)}
              className="flex items-center hover:text-red-400 cursor-pointer"
            >
              <ion-icon name="close-circle"></ion-icon>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Challenges;
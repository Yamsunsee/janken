import axios from "axios";
import { SIGN_UP, SIGN_IN, INVITATIONS, FRIENDS, CHOICES } from "./constants.js";

const delay = (duration) => {
  return new Promise((resolve) => setTimeout(resolve, duration));
};

const getTimerText = (timer) => {
  const seconds = timer % 60;
  const minutes = (timer - seconds) / 60;
  return `${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
};

const isValidData = (...params) => {
  const regex = /^[a-zA-Z0-9]{3,}$/;
  return params.every((param) => regex.test(param));
};

const getScores = (self, opponent) => {
  const scores = [...Array(15).keys()].map((index) => {
    const choices = self[index] + opponent[index];
    if (choices.includes("x")) return "none";
    if ("rspr".includes(choices)) return "win";
    if ("rpsr".includes(choices)) return "lose";
    return "draw";
  });
  const turnResult = scores.findLast((score) => score !== "none");
  const first = scores.splice(0, 5);
  const second = scores.splice(0, 3);
  const final = scores;
  return [turnResult, first, second, final];
};

const getResult = (scores) => {
  const length = scores.length;
  const halfLength = Math.ceil(length / 2);
  let wins = 0;
  let loses = 0;
  let draws = 0;
  for (const score of scores) {
    if (score === "win") wins++;
    else if (score === "lose") loses++;
    else if (score === "draw") draws++;
  }
  const turn = wins + loses + draws;
  const result = wins > loses ? "win" : wins < loses ? "lose" : "draw";

  if (wins >= halfLength || loses >= halfLength) return { turn, result };
  return { turn, result: turn === length ? result : "none" };
};

const getLastChoice = (opponent) => {
  let lastChoice = "x";
  for (const choice of opponent) {
    if (choice !== "x") lastChoice = choice;
  }
  return CHOICES[lastChoice];
};

const getResults = (self, opponent) => {
  const lastChoice = getLastChoice(opponent);
  const [turnResult, ...scores] = getScores(self, opponent);
  const results = scores.map(getResult);
  const result = getResult(results.map(({ result }) => result)).result;
  const [first, second, final] = [...Array(3).keys()].map((index) => ({
    scores: scores[index],
    result: results[index].result,
  }));
  let nextTurn = results[0].turn;
  if (results[0].result !== "none") nextTurn = 5 + results[1].turn;
  if (results[1].result !== "none") nextTurn = 8 + results[2].turn;
  if (results[2].result !== "none") nextTurn = 15;
  return {
    nextTurn,
    turnResult,
    first,
    second,
    final,
    result,
    lastChoice,
  };
};

const signUp = async (formData) => {
  const { data } = await axios.post(SIGN_UP, formData);
  return data;
};

const signIn = async (formData) => {
  const { data } = await axios.post(SIGN_IN, formData);
  return data;
};

const getInvitations = async (userId) => {
  const { data } = await axios.get(INVITATIONS(userId));
  return data;
};

const addInvitations = async (userId, name) => {
  const { data } = await axios.patch(INVITATIONS(userId), { name });
  return data;
};

const removeInvitations = async (userId, recipientId) => {
  const { data } = await axios.delete(INVITATIONS(userId, recipientId));
  return data;
};

const getFriends = async (userId) => {
  const { data } = await axios.get(FRIENDS(userId));
  return data;
};

const addFriends = async (userId, recipientId) => {
  const { data } = await axios.patch(FRIENDS(userId), { recipientId });
  return data;
};

const removeFriends = async (userId, recipientId) => {
  const { data } = await axios.delete(FRIENDS(userId, recipientId));
  return data;
};

export {
  delay,
  getTimerText,
  isValidData,
  getResults,
  signUp,
  signIn,
  getInvitations,
  addInvitations,
  removeInvitations,
  getFriends,
  addFriends,
  removeFriends,
};

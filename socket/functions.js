let users = {};
let queue = [];
let matched = [];

//@ USERS
const usersGet = () => Object.keys(users);
const usersGetSockedId = (name) => users[name];
const usersAdd = (name, socketId) => {
  if (name in users) return true;
  users[name] = socketId;
  return false;
};
const usersRemove = (name) => {
  for (const user in users) {
    if (user === name) {
      delete users[name];
      break;
    }
  }
};
const usersDisconnect = (socketId) => {
  for (const name in users) {
    if (users[name] === socketId) {
      delete users[name];
      break;
    }
  }
};

//@ QUEUE
const queueAdd = (name) => {
  if (!queue.includes(name)) queue.push(name);
};
const queueRemove = (name) => {
  if (queue.includes(name)) queue = queue.filter((item) => item !== name);
};

//@ MATCHED
const matchedAdd = (first, second) => matched.push({ [first]: false, [second]: false });
const matchedRemove = (name) => (matched = matched.filter((pair) => !(name in pair)));
const matchedAccept = (name) => {
  let isStart = false;
  let opponentName;
  for (let pair of matched) {
    if (name in pair) {
      const [first, second] = Object.keys(pair);
      if (name === first) {
        opponentName = second;
        if (pair[second]) isStart = true;
        else pair[first] = true;
      } else {
        opponentName = first;
        if (pair[first]) isStart = true;
        else pair[second] = true;
      }
    }
  }
  const opponentSocketId = usersGetSockedId(opponentName);
  if (isStart) matchedRemove(name);
  return { isStart, opponentSocketId };
};
const matchedDecline = (name) => {
  const pair = matched.find((item) => name in item);
  const [first, second] = Object.keys(pair);
  const opponentName = name === first ? second : first;
  const opponentSocketId = usersGetSockedId(opponentName);
  matchedRemove(name);
  return { opponentName, opponentSocketId };
};

const tryToMatch = () => {
  if (queue.length >= 2) {
    const [first, second, ...rest] = queue;
    queue = rest;
    matchedAdd(first, second);
    const firstSocketId = usersGetSockedId(first);
    const secondSocketId = usersGetSockedId(second);
    return [
      { name: first, socketId: firstSocketId },
      { name: second, socketId: secondSocketId },
    ];
  }
};

export {
  usersGet,
  usersGetSockedId,
  usersAdd,
  usersRemove,
  usersDisconnect,
  queueAdd,
  queueRemove,
  matchedAccept,
  matchedDecline,
  tryToMatch,
};

let users = {};
let queue = [];

const state = {
  users: {
    get: () => Object.keys(users),
    getSocketId: (name) => users[name],
    add: (name, socketId) => {
      if (name in users) return false;
      users[name] = socketId;
      return true;
    },
    remove: (name) => delete users[name],
    disconnect: (socketId) => {
      for (const name in users) {
        if (users[name] === socketId) {
          delete users[name];
        }
      }
    },
  },
  queue: {
    add: (name, socketId) => {
      const data = { name, socketId, isReady: false };
      const waitingUser = queue.find((user) => user.length === 1);
      if (waitingUser) {
        waitingUser.push(data);
        return waitingUser;
      } else {
        queue.push([data]);
      }
    },
    remove: (name) => {
      queue = queue.filter((pair) => pair[0].name !== name && pair[1]?.name !== name);
    },
    accept: (name) => {
      let socketId;
      let isStart = false;
      queue = queue
        .map((pair) => {
          if (pair.length === 2) {
            const [first, second] = pair;
            if (first.name === name) {
              socketId = second.socketId;
              if (second.isReady) {
                isStart = true;
                return [];
              }
              return [{ ...first, isReady: true }, { ...second }];
            } else if (second.name === name) {
              socketId = first.socketId;
              if (first.isReady) {
                isStart = true;
                return [];
              }
              return [{ ...first }, { ...second, isReady: true }];
            }
          }
        })
        .filter((pair) => pair.length !== 0);
      return { isStart, socketId };
    },
    decline: (name) => {
      let socketId;
      queue = queue.map((pair) => {
        if (pair.length === 2) {
          const [first, second] = pair;
          if (first.name === name) {
            socketId = second.socketId;
            return [{ ...second, isReady: false }];
          } else if (second.name === name) {
            socketId = first.socketId;
            return [{ ...first, isReady: false }];
          }
        }
      });
      return socketId;
    },
  },
};

export default state;

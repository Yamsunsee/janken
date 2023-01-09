const reducer = (state, action) => {
  switch (action.type) {
    case "CHANGE_SELF":
      return {
        ...state,
        self: action.payload,
      };

    case "CHANGE_OPPONENT":
      return {
        ...state,
        opponent: action.payload,
      };

    case "CHANGE_FRIENDS":
      return {
        ...state,
        friends: action.payload,
      };

    case "CHANGE_STATUS":
      return {
        ...state,
        status: action.payload,
      };

    default:
      return state;
  }
};

export default reducer;

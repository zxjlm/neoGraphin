const noteReducer = (state = [], action) => {
  if (action.type === "NEW_NOTE") {
    // state.push(action.data);
    return [...state, action.data];
  }

  return state;
};

export default noteReducer;

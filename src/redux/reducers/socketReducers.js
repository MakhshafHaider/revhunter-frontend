// reducers.js

const initialState = {
    socketURL: '',
  };
  
  const socketReducers = (state = initialState, action) => {
    switch (action.type) {
      case "ADD_SOCKET_URL":
        return {
          ...state,
          socketURL: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default socketReducers;
  
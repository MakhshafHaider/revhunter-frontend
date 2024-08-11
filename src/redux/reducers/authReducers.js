
const initialState = {
    id: null,
  };
  
  const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_LOGGED_IN":
          console.log("action.type", action.payload)
        return {
          ...state,
          id: action.payload,
        };

        case "USER_LOGGED_OUT":
          return {
            ...state,
            id: null
          }

      default:
        return state;
    }
  };
  
  export default authReducer;
  
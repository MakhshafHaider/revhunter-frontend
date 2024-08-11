// reducers.js

const initialState = {
    selectedClients: null,
  };
  
  const clientReducer = (state = initialState, action) => {
    switch (action.type) {
      case "UPDATE_SELECTED_CLIENTS":
        return {
          ...state,
          selectedClients: action.payload,
        };

        case 'REMOVE_SELECTED_CLIENTS':
          console.log('action called')
          return {
            ...state,
            selectedClients: null
          } 
      default:
        return state;
    }
  };
  
  export default clientReducer;
  
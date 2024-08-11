// reducers.js

const initialState = {
    selectedCampaigns: null,
  };
  
  const campaignsReducer = (state = initialState, action) => {
    switch (action.type) {
      case "UPDATE_SELECTED_CAMPAIGNS":
        return {
          ...state,
          selectedCampaigns: action.payload,
        };

        case "REMOVE_SELECTED_CAMPAIGNS":
          return {
            ...state,
            selectedCampaigns: ''
          }
      default:
        return state;
    }
  };
  
  export default campaignsReducer;
  
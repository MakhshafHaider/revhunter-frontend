// reducers.js

const initialState = {
    records: [],
  };
  
  const enrichmentRecordsReducer = (state = initialState, action) => {
    switch (action.type) {
 

      case "ADD_ENRICHMENT_RECORDS_DB":
        return {
          ...state,
          records: [...action.payload],
        };
      
      default:
        return state;
    }
  };
  
  export default enrichmentRecordsReducer;
  
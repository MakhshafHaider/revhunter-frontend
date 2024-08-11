// reducers.js

const initialState = {
  records: [],
};

const enrichmentRecordsReduxReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_ENRICHMENT_RECORDS":
      return {
        ...state,
        records: [...state.records, ...action.payload],
      };

    case "UPDATE_ENRICHMENT_RECORDS":
      return {
        ...state,
        records: state.records.map((item, index) => {
          // console.log(
          //   "===============================================================item",
          //   item,
          //   action.payload
          // );
          if (index === action.payload.index) {
            return {
              ...item,
              stats: {
                ...item.stats,
                ...action.payload.stats,
              },
            };
          } else {
            return item;
          }
        }),
      };

    case "CLEAR_ENRICHMENT_RECORDS":

      const indexToClear = action.payload;
      console.log("action.payload", action.payload)
          console.log("index to clear", indexToClear);
      const updatedRecords = state.records.filter(
        (_, index) => index !== indexToClear
      );

      return {
        ...state,
        records: updatedRecords,
      };

    default:
      return state;
  }
};

export default enrichmentRecordsReduxReducer;

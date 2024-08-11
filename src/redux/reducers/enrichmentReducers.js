const initialState = {
    enrichmentArray: [
      {
        enrichmentData: {
          selectedClient: "",
          campaign: "",
        },
        progressCount: '',
        totalCount:"",
        // progressCount: [],
        stats: {
          enrichedNumber: "",
          totalNumber: "",
          faultyUploads: "",
        },
        percentageStats: [],
        statsSE: 
          {
            enrichedNumber: "",
            totalNumber: "",
            faultyUploads: "",
          },
        percentageStatsENG: [],
        statsTitle: 
          {
            enrichedNumber: "",
            totalNumber: "",
            faultyUploads: "",
          },
        
        percentageStatsSE: [],
      }
    ],
    dumy:{},
    dummyIndex:""
  
  };
  
  const enrichmentReducer = (state = initialState, action) => {
    switch (action.type) {      
      case "ADD_ENRICHMENT_ARRAY":
        return {
          ...state,
          enrichmentArray: [
            ...state.enrichmentArray,
            {
              enrichmentData: {
                selectedClient: "",
                campaign: "",
              },
              progressCount: '',
              totalCount:"",
              
              stats: {
                enrichedNumber: "",
                totalNumber: "",
                faultyUploads: "",
              },
              percentageStats: [],
              statsSE: 
                {
           
                  enrichedNumber: "",
                  totalNumber: "",
                  faultyUploads: "",
                },
              
              percentageStatsENG: [],
              statsTitle: 
                {
                  enrichedNumber: "",
                  totalNumber: "",
                  faultyUploads: "",
                },
              
              percentageStatsSE: [],
            },
            
          ],
          // dumy:{},
          // dummyIndex:""
        };
        
        case "ADD_ENRICHMENT_STATS":
          return {
            ...state,
            enrichmentArray: state.enrichmentArray.map((enrichmentItem, index) => {
              if (index === action.payload.index) {
                return {
                  ...enrichmentItem,
                  stats: {
                    ...enrichmentItem.stats,
                    totalNumber: action.payload.stat.totalNumber,
                    enrichedNumber: action.payload.stat.enrichedNumber,
                    faultyUploads: action.payload.stat.faultyUploads,
                  },
                };
              }
              return enrichmentItem;
            }),
          }
  
          case "ADD_PROGRESS_COUNT":
            return {
              ...state,
              enrichmentArray: state.enrichmentArray.map((enrichmentItem, index) => {
                console.log("index================,action.payload.getStatsValues.index=============", action.payload)
                if (index === action.payload.index) {
                  return {
                    ...enrichmentItem,
                    progressCount: {
                      ...enrichmentItem.progressCount,
                      progressCount:action.payload?.newCount?.progress
                    },
                  };
                }
                return enrichmentItem;
              }),
            }
  
            case "ADD_TOTAL_COUNT":
            return {
              ...state,
              enrichmentArray: state.enrichmentArray.map((enrichmentItem, index) => {
                console.log('action.payload', action.payload);
                if (index === action.payload.index) {
                  return {
                    ...enrichmentItem,
                    totalCount: {
                      ...enrichmentItem.totalCount,
                      totalCount:action.payload
                    },
                  };
                }
                return enrichmentItem;
              }),
            }
    
  
        case "ADD_ENRICHMENT_STATS_TITLE":
          return {
            ...state,
            enrichmentArray: state.enrichmentArray.map((enrichmentItem, index) => {
              if (index === action.payload.index) {
                return {
                  ...enrichmentItem,
                  statsTitle: {
                    ...enrichmentItem.statsTitle,
                    totalNumber: action.payload.stat.totalNumber,
                    enrichedNumber: action.payload.stat.enrichedNumber,
                    faultyUploads: action.payload.stat.faultyUploads,
                  },
                };
              }
              return enrichmentItem;
            }),
          }
  
        case "ADD_ENRICHMENT_STATS_SE":
          return {
            ...state,
            enrichmentArray: state.enrichmentArray.map((enrichmentItem, index) => {
              if (index === action.payload.index) {
                return {
                  ...enrichmentItem,
                  statsSE: {
                    ...enrichmentItem.statsSE,
                    totalNumber: action.payload.stat.totalNumber,
                    enrichedNumber: action.payload.stat.enrichedNumber,
                    faultyUploads: action.payload.stat.faultyUploads,
                  },
                };
              }
              return enrichmentItem;
            }),
          }
  
          case "UPDATE_ENRICHMENT_DATA":
            return {
              ...state,
              enrichmentArray: state.enrichmentArray?.map((enrichmentItem, index) => {
                if (index === action.payload.index) {
                  return {
                    ...enrichmentItem,
                    enrichmentData: {
                      ...enrichmentItem.enrichmentData, 
                                 selectedClient: action.payload.stat.selectedClient, 
                            campaign: action.payload.stat.option?.name,
                    },
                  };
                }
                return enrichmentItem;
              }),
            }
          case "ADD_CLIENT_DATA":
            return {
              ...state,
              enrichmentArray: state.enrichmentArray.map((enrichment, index) =>
              index === action.payload.index
                ? {
                    ...enrichment,
                    enrichmentData: {
                      ...enrichment.enrichmentData,
                      selectedClient: action.payload.option.name,
                      campaign:""
                    },
                  }
                : enrichment
              ),
            }
  
            
          case "ADD_HANDLE_FILE":
            return {
              ...state,
              dumy: action.payload
                       }
          case "ADD_INDEX":
            return {
              ...state,
              dummyIndex: action.payload
                       }
  
        // case "ADD_ENRICHMENT_STATS":   
        // return {
        //   ...state,
        //    stats: {
        //   ...state.stats,
        //   totalNumber: action.payload.totalNumber,
        //   enrichedNumber: action.payload.enrichedNumber,
        //   faultyUploads: action.payload.faultyUploads,
        // },};
      
        // case "UPDATE_ENRICHMENT_DATA":
        //   return {
        //     ...state,
        //     enrichmentData: {
        //       ...state.enrichmentData,
        //       selectedClient: action.payload.selectedClient, 
        //       campaign: action.payload.option?.name,
        //     },
        //   };
  
      default:
        return state;
    }
  };
  
  export default enrichmentReducer;
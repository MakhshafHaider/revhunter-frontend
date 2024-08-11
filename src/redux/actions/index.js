export const updateSelectedClients = (newSelectedClients) => ({
    type: "UPDATE_SELECTED_CLIENTS",
    payload: newSelectedClients,
  });
  
  export const updateSelectedCampaigns = (newSelectedClients) => ({
    type: "UPDATE_SELECTED_CAMPAIGNS",
    payload: newSelectedClients,
  });// In your actions file
  
  export const removeSelectedCampaigns = () => {
    return {
      type: "REMOVE_SELECTED_CAMPAIGNS",
    }
  };
  
  export const removeSelectedClients = () => {
    console.log('called!!!!!!')
    return {
      type: "REMOVE_SELECTED_CLIENTS",
    }
  };
  
  export function addEnrichmentObject(enrichmentData) {
    return {
      type: "ADD_ENRICHMENT_Object",
      payload: enrichmentData,
    };
  }
  
  export const updateEnrichment = (newEnrichment) => {
    return {
      type: "ADD_ENRICHMENT",
      payload: newEnrichment,
    };
  };
  
  export const addEnrichmentStats = (newEnrichment) => {
    // console.log("newEnrichment", newEnrichment);
    return {
      type: "ADD_ENRICHMENT_STATS",
      payload: newEnrichment,
    };
  };
  
  export const addEnrichmentStatsTitle = (newEnrichment) => {
    // console.log("newEnrichment", newEnrichment);
    return {
      type: "ADD_ENRICHMENT_STATS_TITLE",
      payload: newEnrichment,
    };
  };
  
  
  export const addEnrichmentStatsSE = (newEnrichment) => {
    // console.log("newEnrichment", newEnrichment);
    return {
      type: "ADD_ENRICHMENT_STATS_SE",
      payload: newEnrichment,
    };
  };
  
  
  export const ProgressCount = (newEnrichment) => {
    console.log("progress count", newEnrichment);
    return {
      type: "ADD_PROGRESS_COUNT",
      payload: newEnrichment,
    };
  };
  
  export const TotalCount = (newEnrichment) => {
    // console.log("total count", newEnrichment);
    return {
      type: "ADD_TOTAL_COUNT",
      payload: newEnrichment,
    };
  };
  
  
  export const updateEnrich = (enrichmentData) => ({
    type: "UPDATE_ENRICH",
    payload: enrichmentData,
  });
  
  export const updateEnrichmentData = (newEnrichment) => {
    return {
      type: "UPDATE_ENRICHMENT_DATA",
      payload: newEnrichment,
    };
  };
  export const addEnrichmentArray = (newEnrichment) => {
    return {
      type: "ADD_ENRICHMENT_ARRAY",
      payload: newEnrichment,
    };
  };
  
  export const addHandleFile = (newEnrichment) => {
    // console.log('newEnrichment in add file', newEnrichment)
    return {
      type: "ADD_HANDLE_FILE",
      payload: newEnrichment,
    };
  };
  
  export const addClientData = (newEnrichment) => {
    // console.log(' in add file', newEnrichment)
    return {
      type: "ADD_CLIENT_DATA",
      payload: newEnrichment,
    };
  };

  export const addIndex = (newEnrichment) => {
    // console.log(' in add file', newEnrichment)
    return {
      type: "ADD_INDEX",
      payload: newEnrichment,
    };
  };
  
  export const addEnrichmentDataToDb = (newEnrichment) => {
    // console.log("called", newEnrichment)
    return {
      type: "ADD_ENRICHMENT_RECORDS",
      payload: newEnrichment,
    };
  };
  export const addEnrichmentDataFromDb = (newEnrichment) => {
    return {
      type: "ADD_ENRICHMENT_RECORDS_DB",
      payload: newEnrichment,
    };
  };

  export const updateEnrichmentDataToRedux = (newEnrichment) => {
    console.log("update in redux", newEnrichment);
    return {
      type: "UPDATE_ENRICHMENT_RECORDS",
      payload: newEnrichment,
    };
  };
  export const socketURL = (newEnrichment) => {
    // console.log("update", newEnrichment);
    return {
      type: "ADD_SOCKET_URL",
      payload: newEnrichment,
    };
  };

  export const clearEnrichment = (index) => {
    console.log("update clear index", index);
    return {
      type: "CLEAR_ENRICHMENT_RECORDS",
      payload: index
    };
  };
  


export const setLoggedInAction = (isLoggedIn) => {
  console.log("isLoggedIn", isLoggedIn)
  return {
    type: "SET_LOGGED_IN",
    payload: isLoggedIn,
  };
};
export const Logout = (isLoggedIn) => {
  console.log("isLoggedIn", isLoggedIn)
  return {
    type: "USER_LOGGED_OUT",
  };
};

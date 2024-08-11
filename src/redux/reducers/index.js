import { combineReducers } from 'redux';
import clientReducer from './clientReducers';
import campaignsReducer from './campaignReducers';
import enrichmentReducer from './enrichmentReducers';
import enrichmentRecordsReducer from './enrichmentRecords';
import enrichmentRecordsReduxReducer from './enrichmentRecordsRedux';
import socketReducers from './socketReducers';
import authReducer from './authReducers';
const rootReducer = combineReducers({
  clients:clientReducer,
  campaign: campaignsReducer,
  enrichment: enrichmentReducer,
  record:enrichmentRecordsReducer,
  recordRedux:enrichmentRecordsReduxReducer,
  socket: socketReducers,
  authReducer
});

export default rootReducer;
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import clientReducer from "../src/redux/reducers/clientReducers";
import campaignsReducer from "../src/redux/reducers/campaignReducers";
import enrichmentReducer from "../src/redux/reducers/enrichmentReducers";
import enrichmentRecordsReducer from "../src/redux/reducers/enrichmentRecords";
import enrichmentRecordsReduxReducer from "../src/redux/reducers/enrichmentRecordsRedux";
import socketReducers from "../src/redux/reducers/socketReducers";
import authReducer from "../src/redux/reducers/authReducers";

const nonPersistedReducer = combineReducers({
 
});

const persistConfig = {
  key: "root",
  storage,
};
const persistedAuthReducer = persistReducer(persistConfig, authReducer);
const rootReducer = combineReducers({
  auth: persistedAuthReducer,
  clients: clientReducer,
  campaign: campaignsReducer,
  enrichment: enrichmentReducer,
  record: enrichmentRecordsReducer,
  recordRedux: enrichmentRecordsReduxReducer,
  socket: socketReducers,
});


console.log("root reducer", rootReducer);
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);
const persistor = persistStore(store);

export { store, persistor };

import { configureStore } from '@reduxjs/toolkit';
import { queryAPI } from '../queryAPI/queryAPI';

const store = configureStore(
  {
    reducer: {
      [queryAPI.reducerPath]: queryAPI.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(queryAPI.middleware),
  },
);

export default store;

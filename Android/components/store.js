// src/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { name, reducer } from './slice';

const store = configureStore({
  reducer: {
    [name]: reducer,
  },
});

export default store;
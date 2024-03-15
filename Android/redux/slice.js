// src/slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';


const slice = createSlice({
  name: 'user',
  initialState: {
    isUser: false,
    data: null,
    findUser: false,
    friends:[],
    chats:[]
  },
  // The `reducers` field allows us define reducers and generate associated actions
  reducers: {
    setFalse: (state) => {
      state.findUser = false;
    },
    setTrue: (state) => {
      state.findUser = true;
    },
    setIsUserTrue:(state) => {
      state.isUser = true;
    },
    setIsUserFalse:(state) => {
      state.isUser = false;
    },
    // The `PayloadAction` type allows us to declare the contents of `action.payload`
    setUserData: (state, action) => {
      state.data = action.payload;
    },
    addChat:(state, action) => {
      state.chats.push(action.payload);
    },
    Addfriend:(state, action) => {
      state.friends.push(action.payload);
    }
  },
});

export const { name,actions, reducer } = slice;
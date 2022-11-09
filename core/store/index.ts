import {configureStore} from "@reduxjs/toolkit";
import WeatherSlice from './weather';

export const store = configureStore({
  reducer: {
    weather: WeatherSlice,
  }
})

export type TAppState = ReturnType<typeof store.getState>;
export type TAppDispatch = typeof store.dispatch;
export type TGetState = typeof store.getState;

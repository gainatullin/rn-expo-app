import {createSlice} from "@reduxjs/toolkit";
import {TMode, TWeather } from "../types";

export interface TInitialState {
  weather: TWeather | null;
  isLoading: boolean;
  mode: TMode;
  city: string;
}

const initialState: TInitialState = {
  weather: null,
  isLoading: false,
  mode: "celsius",
  city: "",
}

const WeatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    setWeather: (state, action) => {
      state.weather = action.payload;
    },
    setIsWeatherLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setMode: (state, action) => {
      state.mode = action.payload;
    },
    setCity: (state, action) => {
      state.city = action.payload;
    }
  }
})

export const { setWeather, setIsWeatherLoading, setMode, setCity } = WeatherSlice.actions;

export default WeatherSlice.reducer

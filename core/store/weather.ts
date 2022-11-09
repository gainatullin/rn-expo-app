import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  weather: null
}

const WeatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    setWeather: (state, action) => {
      state.weather = action.payload;
    }
  }
})

export const { setWeather } = WeatherSlice.actions;

export default WeatherSlice.reducer

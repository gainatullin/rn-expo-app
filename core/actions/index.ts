import axios from 'axios';
import {TAppDispatch, TGetState} from "../store";
import {setCity, setIsWeatherLoading, setWeather} from "../store/weather";
import {API_KEY, API_URL } from '../constants/constants';

export const getWeatherByName = (cityName: string) => async (dispatch: TAppDispatch) => {
  try {
    dispatch(setIsWeatherLoading(true));
    const cityInfo = await axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${API_KEY}`);
    dispatch(getWeatherByCoords({lat: cityInfo.data[0].lat, lon: cityInfo.data[0].lon}))
  } catch (error) {
    dispatch(setIsWeatherLoading(false));
    throw error;
  }
}

interface IProps {
  lat: number;
  lon: number;
}

export const getWeatherByCoords = ({ lat, lon }: IProps) => async (dispatch: TAppDispatch, getState: TGetState) => {
  try {
    dispatch(setIsWeatherLoading(true));
    const currentMode = getState().weather.mode;
    const modeCondition = currentMode === "fahrenheit" ? "imperial" : "metric";
    const weather = await axios.get(`${API_URL}/weather?lat=${lat}&lon=${lon}&units=${modeCondition}&appid=${API_KEY}&lang=ru`);
    dispatch(setWeather(weather.data));
    dispatch(setCity(weather.data.name))
  } catch (error) {
    throw error;
  } finally {
    dispatch(setIsWeatherLoading(false));
  }
}

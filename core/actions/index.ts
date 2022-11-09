import axios from 'axios';
import {TAppDispatch} from "../store";
import {setWeather} from "../store/weather";

export const getWeatherByName = (cityName: string) => async (dispatch: TAppDispatch) => {
  try {
    const cityInfo = await axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=c3a3b0d2effaeb27addca773ee906000`);
    dispatch(getWeatherByCoords({lat: cityInfo.data[0].lat, lon: cityInfo.data[0].lon}))
  } catch (error) {
    throw error;
  }
}

interface IProps {
  lat: number;
  lon: number;
}

export const getWeatherByCoords = ({ lat, lon }: IProps) => async (dispatch: TAppDispatch) => {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=c3a3b0d2effaeb27addca773ee906000&lang=ru`
    const weather = await axios.get(url);
    dispatch(setWeather(weather.data));
  } catch (error) {
    console.log('err', error);
    throw error;
  }
}

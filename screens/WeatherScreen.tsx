import {StyleSheet, TouchableOpacity, Text, View, TextInput} from 'react-native';
import {useDispatch, useSelector} from "react-redux";
import * as Location from 'expo-location';

import Weather from "../components/Weather";
import Form from '../components/Form';

import {setMode} from "../core/store/weather";
import {TAppDispatch, TAppState} from "../core/store";
import {getWeatherByCoords, getWeatherByName} from "../core/actions";
import {Containers, Flexs, Titles} from "../styles";
import {useState} from "react";
import {useForm, Controller} from "react-hook-form";
import { TMode } from '../core/types';
import { useAppSelector } from '../core/hooks';

type TFormValues = { city: string };

export default function WeatherScreen() {
  const { weather, city, mode } = useAppSelector((state: TAppState) => state.weather)
  const dispatch = useDispatch<TAppDispatch>();
  const [isShowForm, setIsShowForm] = useState<boolean>(false);

  const handleGetMyLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    console.log("location", location);
    dispatch(getWeatherByCoords({ lat: location.coords.latitude, lon: location.coords.longitude }));
  }

  const handleChangeMode = (mode: TMode) => {
    dispatch(setMode(mode));
    dispatch(getWeatherByName(city));
  }

  const isHaveWeather = Boolean(weather);
  const isCelsiusMode = mode === "celsius";

  return (
    <View style={Containers.default}>
      {isShowForm ? (
        <Form handleCloseModal={() => setIsShowForm(false)} />
      ) : (
        <>
          <View style={{ ...Flexs.row, alignItems: "center" }}>
            {isHaveWeather && <Text style={Titles.city}>{weather?.name}</Text>}
            <View style={styles.mode}>
              <TouchableOpacity
                onPress={() => handleChangeMode("celsius")}
                style={[styles.btn, isCelsiusMode ? styles.activeModeBtn : styles.inactiveModeBtn ]}
              >
                <Text style={isCelsiusMode ? styles.activeModeTitle : styles.inactiveModeTitle}>C</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleChangeMode("fahrenheit")}
                style={[styles.btn, !isCelsiusMode ? styles.activeModeBtn : styles.inactiveModeBtn ]}
              >
                <Text style={!isCelsiusMode ? styles.activeModeTitle : styles.inactiveModeTitle}>F</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.nav}>
            <TouchableOpacity onPress={() => setIsShowForm(true)}>
              <Text style={Titles.description}>Сменить город</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleGetMyLocation}>
              <Text style={Titles.description}>Моё местоположение</Text>
            </TouchableOpacity>
          </View>
          <Weather weather={weather} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    ...Flexs.row,
    marginVertical: 20
  },
  mode: {
    flexDirection: "row",
    width: 80,
    height: 32,
    borderRadius: 8,
    borderColor: "#fff",
    borderWidth: 1
  },
  btn: {
    flex: 1,
    ...Flexs.center,
    borderRadius: 8,
  },
  activeModeBtn: {
    backgroundColor: "rgba(255, 255, 255, 0.6)",
  },
  inactiveModeBtn: {
    backgroundColor: "transparent",
  },
  activeModeTitle: {
    color: "#fff",
    zIndex: 1,
    fontSize: 18
  },
  inactiveModeTitle: {
    color: "#fff",
    fontSize: 18,
    opacity: .4
  }
});

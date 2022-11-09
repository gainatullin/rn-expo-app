import {StyleSheet, TouchableOpacity, Text, View, TextInput} from 'react-native';
import {useDispatch, useSelector} from "react-redux";
import * as Location from 'expo-location';

import Weather from "../components/Weather";

import {TAppDispatch, TAppState} from "../core/store";
import {getWeatherByCoords, getWeatherByName} from "../core/actions";
import {Containers, Flexs, Titles} from "../styles";
import {useState} from "react";
import {useForm, Controller} from "react-hook-form";

type TFormValues = { city: string };

export default function WeatherScreen() {
  const weather: any = useSelector((state: TAppState) => state.weather.weather);
  const dispatch = useDispatch<TAppDispatch>();
  const [mode, setMode] = useState<'celsius' | 'fahrenheit'>('celsius');
  const [isShowForm, setIsShowForm] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    clearErrors,
    reset,
  } = useForm<TFormValues>({ mode: 'onSubmit', reValidateMode: "onSubmit" });

  const handleGetMyLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    console.log("location", location.coords.latitude, location.coords.longitude);
    dispatch(getWeatherByCoords({ lat: location.coords.latitude, lon: location.coords.longitude }));
  }

  const handleGetWeather = (values: TFormValues) => {
    dispatch(getWeatherByName(values.city));
    setIsShowForm(false);
    reset();
  }


  const isHaveWeather = Boolean(weather);
  const isCelsiusMode = mode === "celsius";

  return (
    <View style={Containers.default}>
      {isShowForm ? (
        <>
          <Controller
            name={"city"}
            control={control}
            rules={{
              required: {
                value: true,
                message: "Введите название города"
              },
              onChange: () => clearErrors("city"),
            }}
            render={({field: { value, onChange }}) => (
              <View>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  style={styles.input}
                  placeholder={'Введите название города'}
                  placeholderTextColor={'#D7D7D7'}
                  returnKeyType={"done"}
                />
                <TouchableOpacity onPress={handleSubmit(handleGetWeather)} style={styles.submitBtn}>
                  <Text style={styles.submitBtnTitle}>OK</Text>
                </TouchableOpacity>
                {Boolean(errors?.city?.message) && (
                  <Text style={styles.errorMessage}>{errors?.city?.message}</Text>
                )}
                <TouchableOpacity onPress={() => setIsShowForm(false)}>
                  <Text style={[Titles.description, { textAlign: "center", marginVertical: 12 }]}>Вернуться</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </>
      ) : (
        <>
          <View style={{ ...Flexs.row, alignItems: "center" }}>
            {isHaveWeather && <Text style={Titles.city}>{weather.name}</Text>}
            <View style={styles.mode}>
              <TouchableOpacity
                onPress={() => setMode("celsius")}
                style={[styles.btn, isCelsiusMode ? styles.activeModeBtn : styles.inactiveModeBtn ]}
              >
                <Text style={isCelsiusMode ? styles.activeModeTitle : styles.inactiveModeTitle}>C</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setMode("fahrenheit")}
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
          {isHaveWeather && <Weather weather={weather} />}
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
  submitBtn: {
    position: "absolute",
    right: 20,
    top: 16
  },
  submitBtnTitle: {
    color: "#1086FF",
    fontSize: 15
  },
  input: {
    paddingLeft: 12,
    backgroundColor: "#fff",
    height: 52,
    borderRadius: 4
  },
  errorMessage: {
    marginVertical: 8,
    color: "red",
    textAlign: "center"
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

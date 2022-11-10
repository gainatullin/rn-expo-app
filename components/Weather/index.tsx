import React, {FC} from 'react';
import {Image, StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { useSelector } from 'react-redux';

import {Flexs, Titles} from "../../styles";
import {wordFormatted} from "../../core/helpers";
import { TAppState } from '../../core/store';
import { TWeather } from '../../core/types';

interface IProps {
  weather: TWeather | null;
}

type TImages = { Clouds: { uri: string }, Clear: { uri: string }, Tornado: { uri: string }, Rain: { uri: string } };

const Weather:FC<IProps> = ({ weather }) => {
  const isLoading = useSelector((state: TAppState) => state.weather.isLoading);
  const images: any = {
    "Clouds": {
      uri: require("../../assets/images/cloud.png")
    },
    "Clear": {
      uri: require("../../assets/images/sun.png")
    },
    "Tornado": {
      uri: require("../../assets/images/strom.png")
    },
    "Rain": {
      uri: require("../../assets/images/rain.png")
    }
  }

  // console.log(weather.rain)

  if (!weather) {
    return <View style={styles.tempView}>
      <Text style={Titles.city}>Please, choose city</Text>
      {isLoading && <ActivityIndicator color="#0000ff" />}
    </View>
  }


  return (
    <>
      <View style={styles.tempView}>
        <View style={{ flexDirection: "row", alignItems: "center"}}>
          <Image source={images[weather.weather[0].main].uri} style={styles.icon} />
          <Text style={Titles.temp}>{Math.ceil(weather?.main?.temp)}</Text>
          <View style={styles.degree} />
        </View>
        <Text style={Titles.white}>{wordFormatted(weather.weather[0].description)}</Text>
      </View>
      <View style={styles.nav}>
        <View style={styles.flex}>
          <Text style={Titles.description}>Ветер</Text>
          <Text style={Titles.white}>{weather.wind.speed} м/с</Text>
        </View>
        <View style={styles.space} />
        <View style={styles.flex}>
          <Text style={Titles.description}>Давление</Text>
          <Text style={Titles.white}>{weather.main.pressure} мм рт.ст</Text>
        </View>
      </View>
      <View style={styles.nav}>
        <View style={styles.flex}>
          <Text style={Titles.description}>Влажность</Text>
          <Text style={Titles.white}>{weather.main.humidity} %</Text>
        </View>
        <View style={styles.space} />
        <View style={styles.flex}>
          <Text style={Titles.description}>Вероятнось дождя</Text>
          {/* No in weather object, just mocked rain */}
          <Text style={Titles.white}>20 %</Text>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  tempView: {
    flex: 1,
    ...Flexs.center,
    height: 500,
    flexDirection: "column"
  },
  nav: {
    ...Flexs.row,
    marginVertical: 20
  },
  icon: {
    width: 120,
    height: 120
  },
  degree: {
    position: "absolute",
    top: 28,
    right: -32,
    borderRadius: 50,
    borderColor: "#fff",
    borderWidth: 2,
    width: 32,
    height: 32
  },
  flex: {
    flex: 1
  },
  space: {
    flex: .3
  }
});


export default Weather;

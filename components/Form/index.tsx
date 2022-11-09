import React, { FC } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {TextInput, TouchableOpacity, View, StyleSheet, Text } from 'react-native';
import { useDispatch } from 'react-redux';

import {setCity} from '../../core/store/weather';
import { getWeatherByName } from '../../core/actions';
import { TAppDispatch } from '../../core/store';
import { Titles } from '../../styles';

type TFormValues = { city: string };

interface IProps {
  handleCloseModal: () => void;
}

const Form:FC<IProps> = ({ handleCloseModal }) => {
  const dispatch = useDispatch<TAppDispatch>();

  const {
    control,
    handleSubmit,
    formState: { errors },
    clearErrors,
    reset,
  } = useForm<TFormValues>({ mode: 'onSubmit', reValidateMode: "onSubmit" });

  const handleGetWeather = (values: TFormValues) => {
    dispatch(getWeatherByName(values.city));
    dispatch(setCity(values.city))
    handleCloseModal();
    reset();
  }

  return (
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
            <TouchableOpacity onPress={handleCloseModal}>
              <Text style={[Titles.description, { textAlign: "center", marginVertical: 12 }]}>Вернуться</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </>
  );
};

const styles = StyleSheet.create({
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
})

export default Form;

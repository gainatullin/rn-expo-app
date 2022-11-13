import React, {FC, useState} from 'react';
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
  const [errorMessage, setErrorMessage] = useState<string>('')
  const dispatch = useDispatch<TAppDispatch>();

  const {
    control,
    handleSubmit,
    formState: { errors },
    clearErrors,
    reset,
  } = useForm<TFormValues>({ mode: 'onSubmit', reValidateMode: "onSubmit" });

  const handleGetWeather = async (values: TFormValues) => {
    const cityInfo: any = await dispatch(getWeatherByName(values.city));
    if (cityInfo?.data) {
      dispatch(setCity(values.city))
      handleCloseModal();
      return;
    }

    setErrorMessage("City is not found");
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
          onChange: () => {
            errors?.city && clearErrors("city");
            errorMessage.length && setErrorMessage("")
          },
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
            {Boolean(errorMessage) && (
              <Text style={styles.errorMessage}>{errorMessage}</Text>
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

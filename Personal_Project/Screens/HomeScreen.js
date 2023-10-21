import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';

const HomeScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const [cash, setCash] = useState('');
  const [inputCash, setInputCash] = useState(cash.toString()); // 사용자 입력을 위한 상태


  return (
    <View style={styles.container}>
      <Text style={styles.loginText}>Welcome, {id}!</Text>
      <Text style={styles.loginText}>
        현금: {cash.toLocaleString('ko-KR')}₩
      </Text>
      <TextInput
        style={styles.input}
        value={inputCash}
        onChangeText={setInputCash}
        keyboardType="numeric"
        returnKeyType="done"
        placeholder="가상투자 할 자산(원화)입력"
        onSubmitEditing={() => setCash(parseFloat(inputCash))}
      />
      <TouchableOpacity
        onPress={() => navigation.navigate('Trade', { cash })}
        style={{ marginVertical: 20 }}
      >
        <Text style={styles.loginText}>가상투자하러가기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#CC99FF",
  },
  loginText: {
    color: "black",
    fontWeight: "bold",
  },
  input: {
    width: "80%",
    backgroundColor: "white",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    textAlign: 'center',
  },
});

export default HomeScreen;

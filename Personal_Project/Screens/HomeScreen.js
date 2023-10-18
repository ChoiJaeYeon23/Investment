import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';

const HomeScreen = ({ route, navigation }) => {
  const { name } = route.params;
  const [cryptoPrices, setCryptoPrices] = useState({});
  const [cash, setCash] = useState(10000);
  const [ownedCryptos, setOwnedCryptos] = useState([]);

  const fetchCryptoPrices = async () => {
    try {
      const response = await fetch('https://api.bithumb.com/public/ticker/ALL_KRW', {
        method: 'GET',
        headers: { accept: 'application/json' },
      });
      const data = await response.json();
      setCryptoPrices(data.data);  // 모든 가상화폐의 현재가 정보 저장
    } catch (error) {
      console.error('Error fetching crypto prices:', error.message);
    }
  };

  useEffect(() => {
    fetchCryptoPrices();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.loginText}>Welcome, {name}!</Text>
      <Text style={styles.loginText}>
        현금: ${cash.toFixed(2)}
      </Text>
      {/* TODO: 여기에 구매한 가상화폐의 수익율을 표시하는 코드 추가 */}
      <TouchableOpacity onPress={() => navigation.navigate('Trade', {
        cryptoPrices,
        cash,
        ownedCryptos,
        onTradeSuccess: (newCash, newOwnedCryptos) => {
          setCash(newCash);
          setOwnedCryptos(newOwnedCryptos);
        }
      })} style={{ marginVertical: 20 }}>
        <Text style={styles.loginText}>Trade</Text>
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
});

export default HomeScreen;
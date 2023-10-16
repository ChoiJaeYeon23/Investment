import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, Alert } from 'react-native';
import axios from 'axios';

const HomeScreen = ({ route, navigation }) => {
  const { name } = route.params;
  const [stockPrice, setStockPrice] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [cash, setCash] = useState(10000);
  const [buyAmount, setBuyAmount] = useState('');
  const [sellAmount, setSellAmount] = useState('');

  const fetchStockPrice = async () => {
    try {
      // Alpha Vantage API를 활용한 주식 가격 정보 받아오기
      const response = await axios.get(
        'https://www.alphavantage.co/query',
        {
          params: {
            function: 'GLOBAL_QUOTE',
            symbol: 'AAPL', // AAPL은 Apple 주식을 나타냅니다. 원하는 주식으로 변경하세요.
            apikey: '9PY57S50VLAJS8EB', // 여기에 발급받은 Alpha Vantage API 키를 넣어주세요.
          },
        }
      );

      // 주식 가격 정보 추출
      const stockPriceData = response.data['Global Quote']['05. price'];
      setStockPrice(parseFloat(stockPriceData));
    } catch (error) {
      console.error('Error fetching stock price:', error.message);
    }
  };

  const fetchExchangeRate = async () => {
    try {
      // Open Exchange Rates API를 활용한 환율 정보 받아오기
      const response = await axios.get(
        'https://open.er-api.com/v6/latest/USD' // 여기를 USD로 변경
      );
  
      // KRW 대비 USD의 환율을 가져옴
      const usdExchangeRate = response.data.rates.KRW; // 여기도 KRW로 변경
      setExchangeRate(usdExchangeRate.toFixed(2));
    } catch (error) {
      console.error('Error fetching exchange rate:', error.message);
    }
  };

  const handleBuy = () => {
    const amount = parseFloat(buyAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount to buy.');
      return;
    }

    const totalCost = amount * stockPrice;
    if (totalCost > cash) {
      Alert.alert('Insufficient Funds', 'You do not have enough cash to buy this amount of stock.');
      return;
    }

    // 가상 포트폴리오에 주식 추가
    setCash(cash - totalCost);
    // 여기에 주식을 사는 로직을 추가할 수 있습니다.
  };

  const handleSell = () => {
    const amount = parseFloat(sellAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount to sell.');
      return;
    }

    const totalValue = amount * stockPrice;
    if (totalValue > cash) {
      Alert.alert('Insufficient Stocks', 'You do not have enough stocks to sell this amount.');
      return;
    }

    // 가상 포트폴리오에서 주식 차감
    setCash(cash + totalValue);
    // 여기에 주식을 팔기 로직을 추가할 수 있습니다.
  };
  useEffect(() => {
    fetchStockPrice();
    fetchExchangeRate();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Welcome, {name}!</Text>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>
        Stock Price: {stockPrice !== null ? `$${stockPrice}` : 'Loading...'}
      </Text>
      <Text style={{ fontSize: 18, marginBottom: 20 }}>
        Exchange Rate: {exchangeRate !== null ? `USD ${exchangeRate}` : 'Loading...'}
      </Text>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>
        Cash: ${cash.toFixed(2)}
      </Text>
      <TextInput
        placeholder="Amount to Buy"
        keyboardType="numeric"
        value={buyAmount}
        onChangeText={text => setBuyAmount(text)}
        style={{ marginVertical: 10, padding: 10, borderColor: 'gray', borderWidth: 1 }}
      />
      <Button title="Buy" onPress={handleBuy} />
      <TextInput
        placeholder="Amount to Sell"
        keyboardType="numeric"
        value={sellAmount}
        onChangeText={text => setSellAmount(text)}
        style={{ marginVertical: 10, padding: 10, borderColor: 'gray', borderWidth: 1 }}
      />
      <Button title="Sell" onPress={handleSell} style={{ marginTop: 10 }} />
      <Button
        title="View Profile"
        onPress={() => {
          // 여기에 프로필 화면으로 이동하는 코드를 추가할 수 있습니다.
        }}
        style={{ marginTop: 20 }}
      />
      <Button
        title="Logout"
        onPress={() => {
          // 여기에 로그아웃 로직을 추가하고 로그인 화면으로 이동하는 코드를 작성할 수 있습니다.
          navigation.navigate('Login');
        }}
        style={{ marginTop: 20 }}
      />
    </View>
  );
};

export default HomeScreen;
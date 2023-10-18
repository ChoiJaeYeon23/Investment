import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Picker, StyleSheet } from 'react-native';

const TradeScreen = ({ route, navigation }) => {
  const [cryptoPrices, setCryptoPrices] = useState(null);
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');
  const [tradeQuantity, setTradeQuantity] = useState('');

  const { cash } = route.params;  // cash 값을 route.params에서 받아옵니다.

  useEffect(() => {
    const fetchCryptoPrices = async () => {
      try {
        const response = await fetch('https://api.bithumb.com/public/ticker/ALL_KRW');
        const data = await response.json();
        setCryptoPrices(data.data);
      } catch (error) {
        console.error("Failed to fetch crypto prices:", error);
      }
    };

    fetchCryptoPrices();
  }, []);

  const getCurrentPrice = () => {
    if (cryptoPrices && cryptoPrices[selectedCrypto]) {
      return parseFloat(cryptoPrices[selectedCrypto].closing_price);
    }
    return 0;  // 항상 숫자 값을 반환합니다.
  };

  const handleTrade = (type) => {
    // TODO: 여기에 거래 로직 추가
  };

  const handleCryptoChange = (value) => {
    setSelectedCrypto(value);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.loginText}>Trade Screen</Text>
      <Text style={styles.loginText}>
        Available Cash: ${cash.toFixed(2)}
      </Text>
      <Picker
        selectedValue={selectedCrypto}
        onValueChange={(itemValue) => handleCryptoChange(itemValue)}
        style={{ height: 50, width: 150 }}
      >
        {
          cryptoPrices && Object.keys(cryptoPrices).map((cryptoKey) => (
            <Picker.Item key={cryptoKey} label={cryptoKey} value={cryptoKey} />
          ))
        }
      </Picker>
      <Text style={styles.loginText}>
        Current Price of {selectedCrypto}: ${getCurrentPrice().toFixed(2)}
      </Text>
      <TextInput
        placeholder="Trade Quantity"
        keyboardType="numeric"
        value={tradeQuantity}
        onChangeText={text => setTradeQuantity(text)}
        style={styles.inputTT}
      />
      <TouchableOpacity style={styles.loginBtn} onPress={() => handleTrade('buy')}>
        <Text style={styles.loginText}>Buy</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.loginBtn} onPress={() => handleTrade('sell')}>
        <Text style={styles.loginText}>Sell</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.loginBtn}>
        <Text style={styles.loginText}>Go back to Home Screen</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFC0CB",
  },
  loginText: {
    color: "black",
    fontWeight: "bold",
  },
  inputTT: {
    width: "80%",
    backgroundColor: "white",
    padding: 15,
    marginBottom: 10,
  },
  loginBtn: {
    width: "80%",
    backgroundColor: "#00BFFF",
    padding: 15,
    alignItems: "center",
  },
});

export default TradeScreen;

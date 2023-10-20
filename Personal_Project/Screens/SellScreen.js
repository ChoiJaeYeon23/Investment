import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import CustomDropdown from '../DropDown/CustomDropdown';

const SellScreen = ({ route, navigation }) => {
  const [cryptoPrices, setCryptoPrices] = useState({});
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');
  const [sellQuantity, setSellQuantity] = useState('');
  const [cryptoPriceHistory, setCryptoPriceHistory] = useState([]);
  const { cash, ownedCryptos } = route.params;

  useEffect(() => {
    const fetchCryptoPrices = async () => {
      try {
        const response = await fetch('https://api.bithumb.com/public/ticker/ALL_KRW');
        const data = await response.json();
        setCryptoPrices(data.data);
      } catch (error) {
        console.error('Error fetching crypto prices:', error.message);
      }
    };

    fetchCryptoPrices();
    const interval = setInterval(fetchCryptoPrices, 500);
    return () => clearInterval(interval);
  }, [selectedCrypto]);

  const handleSell = () => {
    if (selectedCrypto in ownedCryptos && ownedCryptos[selectedCrypto].quantity >= parseFloat(sellQuantity)) {
      const sellingPrice = parseFloat(cryptoPrices[selectedCrypto].closing_price) * parseFloat(sellQuantity);
      const newCash = cash + sellingPrice;

      const newOwnedCryptos = { ...ownedCryptos };
      newOwnedCryptos[selectedCrypto].quantity -= parseFloat(sellQuantity);
      if (newOwnedCryptos[selectedCrypto].quantity <= 0) {
        delete newOwnedCryptos[selectedCrypto];
      }

      navigation.navigate('Home', {
        newCash,
        newOwnedCryptos
      });
    } else {
      alert('Insufficient quantity to sell!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.loginText}>Available Cash: ${cash.toFixed(2)}</Text>

      <CustomDropdown 
        data={Object.keys(cryptoPrices)} 
        selectedValue={selectedCrypto} 
        onValueChange={(value) => setSelectedCrypto(value)}
      />

      <Text style={styles.cryptoText}>
        {selectedCrypto} Current Price: ${cryptoPrices[selectedCrypto]?.closing_price || 'Fetching...'}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Quantity to sell"
        keyboardType="numeric"
        value={sellQuantity}
        onChangeText={setSellQuantity}
      />

      <TouchableOpacity style={styles.sellBtn} onPress={handleSell}>
        <Text style={styles.loginText}>Sell</Text>
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
      overflow: 'visible',
    },
    loginText: {
      color: "black",
      fontWeight: "bold",
      marginBottom: 10,
    },
    inputTT: {
      width: "90%",
      backgroundColor: "white",
      padding: 15,
      marginBottom: 10,
      borderRadius: 8,
    },
    loginBtn: {
      width: "90%",
      backgroundColor: "#00BFFF",
      padding: 15,
      alignItems: "center",
      borderRadius: 8,
      marginBottom: 10,
    },
    dropdown: {
      width: '50%',
      height: 40, // 높이를 40으로 조정
      backgroundColor: 'white',
      borderRadius: 8,
      marginBottom: 10,
      justifyContent: 'center', // 내부 내용을 세로 방향으로 가운데 정렬
      alignSelf: 'center',
    },
  
    chartContainer: {
      width: Dimensions.get("window").width * 0.9,
      marginBottom: 10,
    },
    tradeBtn: {
      flex: 1,
      backgroundColor: "#00BFFF",
      padding: 15,
      alignItems: "center",
      borderRadius: 8,
      margin: 5,
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '90%',
    },
})  

export default SellScreen;

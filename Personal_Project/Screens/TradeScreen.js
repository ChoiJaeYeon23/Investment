import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import CustomDropdown from '../DropDown/CustomDropdown' // 경로는 실제 파일 위치에 따라 조절하세요.

const TradeScreen = ({ route, navigation }) => {
  const [cryptoPrices, setCryptoPrices] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');
  const [tradeQuantity, setTradeQuantity] = useState('');
  const [cryptoPriceHistory, setCryptoPriceHistory] = useState([]);
  const [cryptoHoldings, setCryptoHoldings] = useState({});

  const { cash } = route.params;

  useEffect(() => {
    const fetchCryptoPrices = async () => {
      try {
        const response = await fetch('https://api.bithumb.com/public/ticker/ALL_KRW');
        const data = await response.json();
        if (data.data && data.data.date) {
          delete data.data.date;
        } // date 라는 가상화폐명은 가상화폐가 아님 그래서 제외시킴.
        setCryptoPrices(data.data);

        const newPrice = parseFloat(data.data[selectedCrypto].closing_price);
        setCryptoPriceHistory(prev => [...prev, newPrice].slice(-15));
      } catch (error) {
        console.error("Failed to fetch crypto prices:", error);
      }
    };

    const interval = setInterval(fetchCryptoPrices, 500);
    return () => clearInterval(interval);
  }, [selectedCrypto]);

  const handleCryptoChange = (value) => {
    setSelectedCrypto(value);
    setCryptoPriceHistory([]);
  };

  const getCurrentPrice = () => {
    if (cryptoPrices && cryptoPrices[selectedCrypto]) {
      return parseFloat(cryptoPrices[selectedCrypto].closing_price);
    }
    return 0;
  };

  const handleTrade = (type) => {
    const amount = parseFloat(tradeQuantity); // 사용자가 입력한 금액
    const currentPrice = getCurrentPrice(); // 현재 가상화폐 가격

    if (isNaN(amount) || amount <= 0) {
      alert("올바른 금액을 입력하세요.");
      return;
    }

    if (type === 'buy') {
      const requiredCash = amount;
      if (cash < requiredCash) {
        alert("잔고 부족!");
        return;
      }

      const purchasedQuantity = amount / currentPrice;
      setCryptoHoldings(prevHoldings => ({
        ...prevHoldings,
        [selectedCrypto]: (prevHoldings[selectedCrypto] || 0) + purchasedQuantity
      }));

      // 현금 잔고 감소
      route.params.cash -= requiredCash;
    } else if (type === 'sell') {
      const sellingQuantity = amount / currentPrice;
      const userHolding = cryptoHoldings[selectedCrypto] || 0;

      if (userHolding < sellingQuantity) {
        alert("보유량 부족!");
        return;
      }

      setCryptoHoldings(prevHoldings => ({
        ...prevHoldings,
        [selectedCrypto]: prevHoldings[selectedCrypto] - sellingQuantity
      }));

      // 현금 잔고 증가
      route.params.cash += amount;
    }
  };

  const getTotalCryptoValue = () => {
    return Object.entries(cryptoHoldings).reduce((total, [crypto, quantity]) => {
      const cryptoPrice = cryptoPrices[crypto] ? parseFloat(cryptoPrices[crypto].closing_price) : 0;
      return total + (cryptoPrice * quantity);
    }, 0);
  };

  return (
    <View style={styles.container}>
      <CustomDropdown
        options={cryptoPrices ? Object.keys(cryptoPrices) : []}
        defaultValue={selectedCrypto}
        onSelect={(value) => handleCryptoChange(value)}
        style={styles.dropdown}
      />


      <Text style={styles.loginText}>
        {selectedCrypto} 가격: {getCurrentPrice().toFixed(2)}원
      </Text>
      {
        cryptoPriceHistory.length > 0 &&
        <LineChart
          data={{
            labels: Array.from({ length: cryptoPriceHistory.length }, (_, i) => i.toString()),
            datasets: [{ data: cryptoPriceHistory }]
          }}
          width={Dimensions.get("window").width}
          height={220}
          yAxisLabel="$"
          yAxisSuffix="K"
          yAxisInterval={1}
          segments={5}
          withInnerLines={true}
          chartConfig={{
            backgroundColor: "#FFC0CB",
            backgroundGradientFrom: "#FFC0CB",
            backgroundGradientTo: "#FFC0CB",
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
            style: {
              borderRadius: 16
            }
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16
          }}
        />
      }

      <Text style={styles.loginText}>현재 잔고: {cash.toFixed(2)}원</Text>
      <TextInput
        placeholder="구매 할 금액 입력"
        keyboardType="numeric"
        value={tradeQuantity}
        onChangeText={text => setTradeQuantity(text)}
        style={styles.inputTT}
        returnKeyType="done"
        onSubmitEditing={() => {
          // 여기에 버튼을 눌렀을 때 실행할 코드를 추가하면 됩니다.
        }}
      />
      <Text style={styles.loginText}>
        내가 보유한 가상화폐 목록 : {Object.entries(cryptoHoldings).map(([crypto, quantity]) => (
          `${crypto} ${quantity.toFixed(2)}개`
        )).join(', ')}
      </Text>

      <Text style={styles.loginText}>현 자산 : </Text>
      <Text style={styles.loginText}>현금 : {cash.toFixed(2)}원</Text>
      <Text style={styles.loginText}>가상화폐 : {getTotalCryptoValue().toFixed(2)}원</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.tradeBtn} onPress={() => handleTrade('buy')}>
          <Text style={styles.loginText}>매수</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tradeBtn} onPress={() => handleTrade('sell')}>
          <Text style={styles.loginText}>매도</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
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

});

export default TradeScreen;

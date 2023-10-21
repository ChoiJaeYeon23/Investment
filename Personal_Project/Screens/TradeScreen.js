import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import CustomDropdown from '../DropDown/CustomDropdown' // 경로는 실제 파일 위치에 따라 조절하세요.

const TradeScreen = ({ route, navigation }) => {
  const [cryptoPrices, setCryptoPrices] = useState(0);
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');
  const [tradeQuantity, setTradeQuantity] = useState('');
  const [cryptoPriceHistory, setCryptoPriceHistory] = useState([]);
  const [cryptoHoldings, setCryptoHoldings] = useState({});
  const [initialCash, setInitialCash] = useState(parseFloat(cash));

  const { cash } = route.params;


  useEffect(() => {
    setInitialCash(parseFloat(cash));
  }, []);

  useEffect(() => { // 가상화폐 목록 가져오기 (API)
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

  const getProfitPercentage = () => {
    const totalValueNow = parseFloat(cash) + getTotalCryptoValue();
    const totalValueInitial = parseFloat(initialCash);

    if (!totalValueNow || !totalValueInitial) return 0; // NaN 값 방지

    return ((totalValueNow - totalValueInitial) / totalValueInitial) * 100;
  };

  const getProfitAmount = () => {
    const totalValueNow = parseFloat(cash) + getTotalCryptoValue();
    const totalValueInitial = parseFloat(initialCash);
    return totalValueNow - totalValueInitial;
  };

  const getProfitTextColor = () => { // 수익률에서 +면 빨간색, -면 파란색
    const percentage = getProfitPercentage();
    return percentage > 0 ? 'red' : 'blue';
  };


  const handleFullBuy = () => {
    const currentPrice = getCurrentPrice();
    if (currentPrice <= 0) {
      alert("유효한 가상화폐 가격이 아닙니다.");
      return;
    }

    const possibleQuantity = cash / currentPrice;

    setCryptoHoldings(prevHoldings => ({
      ...prevHoldings,
      [selectedCrypto]: (prevHoldings[selectedCrypto] || 0) + possibleQuantity
    }));

    route.params.cash = 0; // 전체 현금 사용
  };
  const handleTrade = (type) => {
    const currentPrice = getCurrentPrice();

    if (type === 'buy') {
      const amount = type === 'allIn' ? parseFloat(cash) : parseFloat(tradeQuantity);

      if (isNaN(amount) || amount <= 0) {
        alert("올바른 금액을 입력하세요.");
        return;
      }

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

      route.params.cash -= requiredCash;

    } else if (type === 'sell') {
      const userHolding = cryptoHoldings[selectedCrypto] || 0;

      if (userHolding <= 0) {
        alert("보유한 가상화폐가 없습니다!");
        return;
      }

      const amountFromSell = userHolding * currentPrice;

      setCryptoHoldings(prevHoldings => {
        const updatedHoldings = { ...prevHoldings };
        delete updatedHoldings[selectedCrypto];
        return updatedHoldings;
      });

      route.params.cash += amountFromSell;

      // 매도시 초기화
      setInitialCash(route.params.cash);
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
      <Text style={styles.Text}>
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
          yAxisSuffix="원"
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

      <TextInput
        placeholder="구매 할 금액 입력"
        keyboardType="numeric"
        value={tradeQuantity}
        onChangeText={text => setTradeQuantity(text)}
        style={styles.inputTT}
        returnKeyType="done"
      />

      <Text style={styles.Text}>
        총 자산 : {(cash + getTotalCryptoValue()).toLocaleString('ko-KR')}₩
      </Text>

      <Text style={styles.Text}>
        보유한 현금 : {cash.toLocaleString('ko-KR')}₩
      </Text>

      <Text style={styles.Text}>
        내가 보유한 가상화폐 목록 : {Object.entries(cryptoHoldings).map(([crypto, quantity]) => (
          `${crypto} ${quantity.toFixed(2)}개`
        )).join(', ')}
      </Text>

      <Text style={[styles.Text, { color: getProfitTextColor() }]}>
        수익률: {getProfitPercentage().toFixed(2)}%
      </Text>

      <Text style={[styles.Text, { color: getProfitTextColor() }]}>
        수익/손실 금액: {getProfitAmount().toFixed(2)}원
      </Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.tradeBtnBuy} onPress={() => handleTrade('buy')}>
          <Text style={styles.Text}>매수</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tradeBtnSell} onPress={() => handleTrade('sell')}>
          <Text style={styles.Text}>전체 매도</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.tradeBtnFullBuy} onPress={handleFullBuy}>
        <Text style={styles.Text}>전체 매수</Text>
      </TouchableOpacity>
    </View >
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFC0CB",
  },
  Text: {
    color: "black",
    fontWeight: "bold",
    marginBottom: 10,
  },
  inputTT: {
    width: "90%",
    backgroundColor: "white",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8
  },
  dropdown: {
    width: '50%',
    height: 40,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 10,
    justifyContent: 'center',
    alignSelf: 'center'
  },
  tradeBtnSell: {
    flex: 1,
    backgroundColor: "#00BFFF",
    padding: 15,
    alignItems: "center",
    borderRadius: 8,
    margin: 5
  },
  tradeBtnBuy: {
    flex: 1,
    backgroundColor: "#FF0000",
    padding: 15,
    alignItems: "center",
    borderRadius: 8,
    margin: 5
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%'
  },
  tradeBtnFullBuy: {
    width: "90%",
    backgroundColor: "#b36ee8",
    padding: 15,
    alignItems: "center",
    borderRadius: 8,
    margin: 5
  }
});

export default TradeScreen;
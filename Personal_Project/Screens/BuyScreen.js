import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import CustomDropdown from '../DropDown/CustomDropdown';

const BuyScreen = ({ route, navigation }) => {
    const [cryptoPrices, setCryptoPrices] = useState({});
    const [selectedCrypto, setSelectedCrypto] = useState('BTC');
    const [buyQuantity, setBuyQuantity] = useState('');
    const [cryptoPriceHistory, setCryptoPriceHistory] = useState([]);

    const { cash, ownedCryptos } = route.params;


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


    const handleBuy = () => {
        const buyingPrice = parseFloat(cryptoPrices[selectedCrypto].closing_price) * parseFloat(buyQuantity);

        if (cash >= buyingPrice) {
            const newCash = cash - buyingPrice;

            const newOwnedCryptos = { ...ownedCryptos };
            if (selectedCrypto in newOwnedCryptos) {
                newOwnedCryptos[selectedCrypto].quantity += parseFloat(buyQuantity);
            } else {
                newOwnedCryptos[selectedCrypto] = { quantity: parseFloat(buyQuantity) };
            }

            navigation.navigate('Home', {
                newCash,
                newOwnedCryptos
            });
        } else {
            alert('Insufficient funds!');
        }
        navigation.navigate("Trade")
    };
    const handleCryptoChange = (value) => {
        setSelectedCrypto(value);
        setCryptoPriceHistory([]);
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
                {selectedCrypto} 현재가격: {cryptoPrices[selectedCrypto]?.closing_price || 'Fetching...'}원
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
            <Text style={styles.loginText}>보유현금: {cash.toFixed(2)}원</Text>
            <TextInput
                style={styles.inputTT}
                placeholder="구입하고싶은 양의 금액 입력"
                keyboardType="numeric"
                value={buyQuantity}
                onChangeText={setBuyQuantity}
                returnKeyType="done"

            />
            <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.loginBtn} onPress={handleBuy}>
                    <Text style={styles.loginText}>매수!!!!</Text>
                </TouchableOpacity>
            </View>
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

export default BuyScreen;

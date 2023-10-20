import React from 'react';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import LoginScreen from './Screens/LoginScreen';
import SingUpScreen from './Screens/SingUpScreen';
import HomeScreen from './Screens/HomeScreen'
import TradeScreen from './Screens/TradeScreen'

import BuyScreen from './Screens/BuyScreen'
import SellScreen from './Screens/SellScreen'

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SingUpScreen}/>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Trade" component={TradeScreen} />
        <Stack.Screen name="Buy" component={BuyScreen} />
        <Stack.Screen name="Sell" component={SellScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
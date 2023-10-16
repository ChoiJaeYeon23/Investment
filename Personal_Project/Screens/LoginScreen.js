import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';

const LoginScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleLogin = () => {
    // 로그인 로직 추가
    if (name && email) {
      // 성공적으로 로그인한 경우
      navigation.navigate('Home', { name });
    } else {
      Alert.alert('Login Failed', 'Please enter both name and email.');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>Login Screen</Text>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={text => setName(text)}
        style={{ marginVertical: 10, padding: 10, borderColor: 'gray', borderWidth: 1 }}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={text => setEmail(text)}
        style={{ marginVertical: 10, padding: 10, borderColor: 'gray', borderWidth: 1 }}
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

export default LoginScreen;
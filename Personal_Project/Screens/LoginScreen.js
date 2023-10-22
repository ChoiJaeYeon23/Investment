import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../DB/FireBase";
import { useNavigation } from "@react-navigation/native";

const LoginScreen = () => {
  const [id, setID] = useState("");
  const [pw, setPW] = useState("");
  const navigation = useNavigation();

  const resetInputs = () => { // 초기화 함수
    setID("");
    setPW("");
  };

  const Login = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Login"));
      const users = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const user = users.find((u) => u.ID === id && u.PW === pw);

      if (user) {
        alert("로그인 성공");
        resetInputs()
        navigation.navigate("Home", { id });
      } else {
        alert("ID 또는 비밀번호가 잘못되었습니다.");
        resetInputs()
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.inputTT}
        placeholder="아이디"
        value={id}
        onChangeText={setID}
      />
      <TextInput
        style={styles.inputTT}
        placeholder="비밀번호"
        secureTextEntry
        value={pw}
        onChangeText={setPW}
      />
      <TouchableOpacity style={styles.loginBtn} onPress={Login}>
        <Text style={styles.loginText}>로그인</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.navigate("SignUp")}>
        <Text style={styles.loginText}>회원가입</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#9acd32",
  },
  inputTT: {
    alignItems: "center",
    justifyContent: "center",
    width: "75%",
    height: 45,
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 7,
  },
  loginBtn: {
    width: "75%",
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 7,
    backgroundColor: "white",
    borderWidth: 2,
    marginBottom: 10,
  },
  loginText: {
    color: "black",
    fontWeight: "bold",
  },
});

export default LoginScreen;

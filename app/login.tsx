import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { getAPIUrl } from '../utils/apiConfig';
import { saveToken } from "../utils/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const API_URL = getAPIUrl();

export default function Login() {
  const router = useRouter();
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
 const navigation = useNavigation();
  const handleLogin = async () => {
    if (!mobile) {
      //alert("Please enter your registered mobile number")
      Alert.alert("Error", "Please enter your registered mobile number");
      return;
    }

    setLoading(true);

    try {
      // Example API call (replace URL with your actual API)
      const response = await fetch(`${API_URL}/user-login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "mobilenumber": mobile }),
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.clear();
        await AsyncStorage.setItem("loginStatus", "success");
        await AsyncStorage.setItem("mobilenumber", mobile);
        navigation.navigate("index" as never);
      } else {
        Alert.alert("Login Failed", data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.biGtitle}>QueryMe AI Assistant</Text>
      <Text style={styles.title}>Enter your registered mobile number to login</Text>

      <TextInput
        placeholder="Mobile number"
        style={styles.input}
        value={mobile}
        onChangeText={setMobile}
        keyboardType="phone-pad"
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Logging in..." : "Login"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 18, fontWeight: "medium", marginBottom: 25, textAlign: "center" },
  biGtitle: { fontSize: 24, fontWeight: "bold", marginBottom: 30, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 10, marginBottom: 15 },
  button: { backgroundColor: "#007AFF", padding: 15, borderRadius: 10 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  link: { color: "#007AFF", textAlign: "center", marginTop: 10 },
});
import { useMutation } from "@apollo/client/react";
import { useState, useContext } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { REGISTER_MUTATION, LOGIN_MUTATION } from "../queries/auth";
import Toast from "react-native-toast-message";
import * as SecureStore from "expo-secure-store";
import { AuthContext } from "../contexts/auth";

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [register, { loading }] = useMutation(REGISTER_MUTATION);
  const [login] = useMutation(LOGIN_MUTATION);
  const { login: loginContext } = useContext(AuthContext);

  const handleRegister = async () => {
    try {
      const { data } = await register({
        variables: { body: { username, name, email, password } },
      });

      console.log("Register success:", data);

      const { data: loginData } = await login({
        variables: { body: { email, password } },
      });

      const token = loginData?.login?.token;
      const user = loginData?.login?.user;

      if (token) {
        await SecureStore.setItemAsync("token", token);
        await SecureStore.setItemAsync("user", JSON.stringify(user));

        loginContext(user);

        Toast.show({
          type: "success",
          text1: "Welcome!",
          text2: `Hi ${user.username}!`,
        });
      }
    } catch (error) {
      console.log("Register error:", error);
      Toast.show({
        type: "error",
        text1: "Register Failed",
        text2: error.message,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Register</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        keyboardType="email-address"
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button
        title={loading ? "Registering..." : "Register"}
        onPress={handleRegister}
      />

      <Text
        style={{ marginTop: 12, color: "gray" }}
        onPress={() => navigation.navigate("Login")}
      >
        Already have an account? <Text style={{ color: "#007AFF" }}>Login</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    width: "80%",
    marginBottom: 12,
    padding: 10,
    borderRadius: 10,
  },
});

import { useMutation } from "@apollo/client/react";
import { useNavigation } from "@react-navigation/native";
import { useContext, useState, useEffect } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import Toast from "react-native-toast-message";
import * as SecureStore from "expo-secure-store";
import { AuthContext } from "../contexts/auth";
import { LOGIN_MUTATION } from "../queries/auth";

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const authContext = useContext(AuthContext);

  const [login, { loading }] = useMutation(LOGIN_MUTATION);

  useEffect(() => {
    console.log("LoginScreen mounted");
    SecureStore.getItemAsync("token").then((token) => {
      console.log("Token:", token);
      console.log(error);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Login</Text>

      <TextInput
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        placeholder="Password"
        secureTextEntry
      />

      <Button
        title={loading ? "Logging in..." : "Login"}
        onPress={async () => {
          try {
            console.log("Login pressed!");
            const response = await login({
              variables: {
                body: {
                  email,
                  password,
                },
              },
            });

            console.log(response, "<<< login response");

            await SecureStore.setItemAsync(
              "token",
              response.data.login.token
            );
            await SecureStore.setItemAsync(
              "user",
              JSON.stringify(response.data.login.user)
            );

            authContext.login(response.data.login.user);

            Toast.show({
              type: "success",
              text1: "Login Successful",
              text2: `Welcome back, ${response.data.login.user.username}!`,
            });

          } catch (error) {
            Toast.show({
              type: "error",
              text1: "Login Failed",
              text2: error.message,
            });
          }
        }}
      />

      <Text
        style={{ marginTop: 12, color: "gray" }}
        onPress={() => navigation.navigate("Register")}
      >
        Don't have an account?{" "}
        <Text style={{ color: "#007AFF" }}>Sign Up</Text>
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

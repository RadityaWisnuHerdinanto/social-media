import React, { useState } from "react";
import { View, TextInput, StyleSheet, FlatList, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SEARCH_USER } from "../queries/users";
import { useLazyQuery } from "@apollo/client/react";
export default function Search() {
  const [query, setQuery] = useState("");
  const navigation = useNavigation();

  const [searchUser, { data }] = useLazyQuery(SEARCH_USER, {
    fetchPolicy: "network-only",
  });

  const handleChange = (text) => {
    setQuery(text);
    if (text.trim() !== "") {
      searchUser({ variables: { username: text } });
    }
  };

  const users = data?.searchUser || [];

  const goToProfile = (userId) => {
    navigation.navigate("ProfileById", { userId });
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Cari pengguna..."
        value={query}
        onChangeText={handleChange}
        style={styles.input}
      />

      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => goToProfile(item._id)}>
            <Text style={styles.result}>@{item.username}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 20, backgroundColor: "#fff" },
  input: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  result: { padding: 10, fontSize: 16, borderBottomWidth: 0.5, borderColor: "#ddd" },
});

import React from "react";
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@apollo/client/react";
import { GET_POSTS } from "../queries/posts";

export default function Home() {
  const navigation = useNavigation();
  const { loading, error, data } = useQuery(GET_POSTS);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
        <Text>Loading posts...</Text>
      </View>
    );
  }

  if (error) {
    console.log(error);
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Error loading posts 😭</Text>
      </View>
    );
  }

  const posts = data?.getPosts || [];

  const renderItem = ({ item }) => (
    <View style={styles.post}>
      <View style={styles.postHeader}>
        <Text style={styles.username}>{item.author.username}</Text>
      </View>

      <Image source={{ uri: item.imgUrl }} style={styles.postImage} />

      <TouchableOpacity
        style={styles.detailBtn}
        onPress={() => navigation.navigate("PostDetail", { post: item })}
      >
        <Text style={styles.detailText}>Lihat Detail</Text>
      </TouchableOpacity>

      <Text style={styles.caption}>
        <Text style={styles.username}>{item.author.username} </Text>
        {item.content}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>Instadar</Text>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#fff",
  },
  logo: { fontSize: 22, fontWeight: "bold", color: "#111" },
  post: { marginBottom: 25, backgroundColor: "#fff" },
  postHeader: { flexDirection: "row", alignItems: "center", paddingHorizontal: 15, marginBottom: 8 },
  username: { fontWeight: "bold", color: "#111", fontSize: 15 },
  postImage: { width: "100%", height: 350, resizeMode: "cover", borderRadius: 6 },
  detailBtn: {
    marginTop: 10,
    backgroundColor: "#007AFF",
    alignSelf: "flex-start",
    marginLeft: 15,
    borderRadius: 6,
    paddingHorizontal: 15,
    paddingVertical: 6,
  },
  detailText: { color: "#fff", fontWeight: "600" },
  caption: { paddingHorizontal: 15, paddingVertical: 10, fontSize: 14, color: "#111" },
});

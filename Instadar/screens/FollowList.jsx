import { View, Text, StyleSheet, FlatList } from "react-native";

export default function FollowList({ route }) {
  const { title, users } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{title}</Text>

      {users.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 20, color: "#999" }}>
          Belum ada {title.toLowerCase()} 
        </Text>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.userItem}>
              <Text style={styles.username}>@{item.username}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, paddingHorizontal: 15, backgroundColor: "#fff" },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  userItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  username: { fontSize: 16 },
});

import React, { useContext } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import { AuthContext } from "../contexts/auth";
import { useNavigation } from "@react-navigation/native";

const AVATAR_COLORS = [
  "#FF6B6B", 
  "#FFD93D", 
  "#6BCB77", 
  "#4D96FF", 
  "#9D4EDD", 
  "#FF922B", 
  "#00C1D4", 
  "#F15BB5", 
];

function getColorForUsername(username) {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colorIndex = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[colorIndex];
}

export default function Profile({ allPosts }) {
  const { user, logout } = useContext(AuthContext);

  const navigation = useNavigation();

  const username = user?.username || "Guest";
  const initial = username.charAt(0).toUpperCase();
  const bgColor = getColorForUsername(username);

  const followersCount = user?.followers?.length || 0;
  const followingCount = user?.followings?.length || 0;

  const userPosts = allPosts?.filter(post => post.authorId === user._id) || [];
  const postsCount = userPosts.length;

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.username}>@{username}</Text>
          <TouchableOpacity onPress={logout}>
            <Text style={styles.logout}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.profileInfo}>
          <View style={[styles.avatarCircle, { backgroundColor: bgColor }]}>
            <Text style={styles.avatarInitial}>{initial}</Text>
          </View>

          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={styles.statNum}>{postsCount}</Text>
              <Text>Posts</Text>
            </View>
             <TouchableOpacity
              style={styles.stat}
              onPress={() =>
                navigation.navigate("FollowList", {
                  title: "Followers",
                  users: user.followers || [],
                })
              }
            >
              <Text style={styles.statNum}>{followersCount}</Text>
              <Text>Followers</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.stat}
              onPress={() =>
                navigation.navigate("FollowList", {
                  title: "Following",
                  users: user.followings || [],
                })
              }
            >
              <Text style={styles.statNum}>{followingCount}</Text>
              <Text>Following</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.bio}>hai aku {username}</Text>

        <View style={styles.postsGrid}>
          {[...Array(9)].map((_, i) => (
            <Image
              key={i}
              source={{ uri: `https://picsum.photos/seed/${username}-${i}/200/200` }}
              style={styles.post}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 60, paddingHorizontal: 15 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  username: { fontSize: 20, fontWeight: "bold" },
  logout: { color: "#FF3B30", fontWeight: "600" },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 25,
  },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 25,
  },
  avatarInitial: { fontSize: 36, color: "#fff", fontWeight: "bold" },
  stats: { flexDirection: "row", flex: 1, justifyContent: "space-around" },
  stat: { alignItems: "center" },
  statNum: { fontWeight: "bold", fontSize: 16 },
  bio: { marginTop: 20, marginBottom: 15 },
  postsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  post: { width: "32%", height: 120, borderRadius: 8, marginBottom: 5 },
});

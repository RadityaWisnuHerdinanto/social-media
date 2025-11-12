import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { GET_USER_BY_ID, FOLLOW_USER } from "../queries/users";
import { useMutation, useQuery } from "@apollo/client/react";
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

export default function ProfileById({ route }) {
  const { userId } = route.params;
  const { user: loggedInUser } = useContext(AuthContext);
  const navigation = useNavigation();

  const { data, loading, refetch } = useQuery(GET_USER_BY_ID, {
    variables: { id: userId },
  });

  const [followUser] = useMutation(FOLLOW_USER);
  const [isFollowing, setIsFollowing] = useState(false);

  const user = data?.user;

  useEffect(() => {
    if (!user) return;
    const followingIds = user.followers.map((f) => f._id);
    setIsFollowing(followingIds.includes(loggedInUser._id));
  }, [user]);

  const handleFollow = async () => {
    try {
      await followUser({ variables: { followingId: user._id } });
      setIsFollowing((prev) => !prev);
      refetch();
    } catch (error) {
      console.log("Follow error:", error.message);
    }
  };

  if (loading) return <Text>Loading...</Text>;
  if (!user) return <Text>User not found</Text>;

  const initial = user.username.charAt(0).toUpperCase();
  const bgColor = getColorForUsername(user.username);

  const followersCount = user.followers?.length || 0;
  const followingCount = user.followings?.length || 0;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.headerRow}>
        <Text style={styles.username}>@{user.username}</Text>
      </View>

      <View style={styles.profileInfo}>
        <View style={[styles.avatarCircle, { backgroundColor: bgColor }]}>
          <Text style={styles.avatarInitial}>{initial}</Text>
        </View>

        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statNum}>{(user.posts || []).length}</Text>
            <Text>Posts</Text>
          </View>

          {/* Followers */}
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

          {/* Following */}
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

      {/* Follow Button */}
      {loggedInUser._id !== user._id && (
        <TouchableOpacity
          style={[
            styles.followBtn,
            { backgroundColor: isFollowing ? "#ccc" : "#007AFF" },
          ]}
          onPress={handleFollow}
        >
          <Text style={styles.followBtnText}>
            {isFollowing ? "Following" : "Follow"}
          </Text>
        </TouchableOpacity>
      )}

      <Text style={styles.bio}>hai aku {user.name}</Text>

      <View style={styles.postsGrid}>
        {[...Array(9)].map((_, i) => (
          <Image
            key={i}
            source={{
              uri: `https://picsum.photos/seed/${user.username}-${i}/200/200`,
            }}
            style={styles.post}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingHorizontal: 15,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  username: { fontSize: 20, fontWeight: "bold" },
  profileInfo: { flexDirection: "row", alignItems: "center", marginTop: 25 },
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
  followBtn: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  followBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  bio: { marginTop: 5, fontSize: 16 },
  postsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 10,
  },
  post: { width: "32%", height: 120, borderRadius: 8, marginBottom: 5 },
});

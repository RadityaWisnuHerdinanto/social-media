import React, { useState } from "react";
import { View, Text, Image, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { LIKE_POST, COMMENT_POST } from "../queries/posts";
import { useMutation } from "@apollo/client/react";

export default function PostDetail({ route }) {
  const { post } = route.params;

  const [comments, setComments] = useState(post.comments || []);
  const [likes, setLikes] = useState(post.likes?.length || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [newComment, setNewComment] = useState("");

  const [likePost] = useMutation(LIKE_POST);
  const [commentPost] = useMutation(COMMENT_POST);

  const handleLike = async () => {
    if (isLiked) return;
    try {
      const { data } = await likePost({ variables: { id: post._id } });
      console.log("Like success:", data.likePost.message);
      setLikes((prev) => prev + 1);
      setIsLiked(true);
    } catch (err) {
      console.error("Like error:", err.message);
    }
  };

  const handleAddComment = async () => {
    if (newComment.trim() === "") return;
    try {
      const { data } = await commentPost({
        variables: {
          id: post._id,
          body: { content: newComment },
        },
      });

      const updatedComments = data.commentPost.comments;
      setComments(updatedComments);
      setNewComment("");
    } catch (err) {
      console.error("Comment error:", err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: post.imgUrl }} style={styles.image} />
      <Text style={styles.username}>{post.author?.username}</Text>
      <Text style={styles.content}>{post.content}</Text>
      <Text style={styles.caption}>{post.caption}</Text>

      {post.tags && post.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {post.tags.map((tag, i) => (
            <Text key={i} style={styles.tag}>
              #{tag}
            </Text>
          ))}
        </View>
      )}

      <View style={styles.actions}>
        <TouchableOpacity onPress={handleLike} disabled={isLiked}>
          <Text style={[styles.icon, isLiked && { opacity: 0.5 }]}>
            ❤️ {likes}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.commentSection}>
        <Text style={styles.commentTitle}>Komentar:</Text>

        <FlatList
          data={comments}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <Text style={styles.comment}>
              <Text style={styles.commentUser}>{item.username}</Text>: {item.content}
            </Text>
          )}

        />

        <View style={styles.commentInputContainer}>
          <TextInput
            placeholder="Tulis komentar..."
            value={newComment}
            onChangeText={setNewComment}
            style={styles.commentInput}
          />
          <TouchableOpacity
            onPress={handleAddComment}
            style={styles.commentBtn}
          >
            <Text style={styles.commentBtnText}>Kirim</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    flex: 1,
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 10,
  },
  username: {
    marginTop: 10,
    fontWeight: "bold",
    fontSize: 16,
  },
  content: {
    marginTop: 6,
    fontSize: 14,
    color: "#333",
  },
  caption: {
    fontStyle: "italic",
    color: "#555",
    marginBottom: 10,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  tag: {
    marginRight: 8,
    color: "#007AFF",
  },
  actions: {
    flexDirection: "row",
    marginVertical: 10,
  },
  icon: {
    fontSize: 18,
  },
  commentSection: {
    marginTop: 20,
  },
  commentTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 6,
  },
  comment: {
    fontSize: 14,
    marginVertical: 3,
  },
  commentUser: {
    fontWeight: "bold",
    color: "#007AFF",
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  commentInput: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 40,
  },
  commentBtn: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    marginLeft: 6,
  },
  commentBtnText: {
    color: "#fff",
    fontWeight: "bold",
  },
  commentUser: {
  fontWeight: "bold",
  color: "#007AFF",
},
});

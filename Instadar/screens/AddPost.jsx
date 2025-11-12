import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useMutation } from "@apollo/client/react";
import { ADD_POST, GET_POSTS } from "../queries/posts";

export default function AddPost() {
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [tags, setTags] = useState("");
  const navigation = useNavigation();

  const [addPost, { loading }] = useMutation(ADD_POST, {
    refetchQueries: [GET_POSTS],
  });

  const handlePost = async () => {
    if (!imageUrl.trim() || !caption.trim()) {
      Alert.alert("Warning", "Please fill in all fields.");
      return;
    }

    try {
      const tagArray = tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const { data } = await addPost({
        variables: {
          body: {
            imgUrl: imageUrl,
            content: caption,
            tags: tagArray,
          },
        },
      });

      console.log("Post added:", data);

      Alert.alert("Success", "Your post has been added!");

      setImageUrl("");
      setCaption("");
      setTags("");

      navigation.navigate("Home");
    } catch (error) {
      console.error("Error adding post:", error);
      Alert.alert("Error", error.message || "Failed to add post.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Create New Post</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter image URL..."
          value={imageUrl}
          onChangeText={setImageUrl}
        />

        <TextInput
          style={[styles.input, styles.captionInput]}
          placeholder="Enter caption..."
          value={caption}
          onChangeText={setCaption}
          multiline
        />

        <TextInput
          style={styles.input}
          placeholder="Enter tags (comma separated, e.g. nature, sunset, happy)"
          value={tags}
          onChangeText={setTags}
        />

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handlePost}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Posting..." : "Post"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 40,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  captionInput: {
    height: 100,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 40,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});

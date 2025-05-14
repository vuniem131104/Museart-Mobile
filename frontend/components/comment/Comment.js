import {
  FlatList,
  Modal,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
  Alert,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { FontFamily, FontSize } from "../../GlobalStyles";
import CommentFrame from "./CommentFrame";
import { backendUrl } from "../../services/api";
import axios from "axios";
import { useTheme } from "@react-navigation/native";
import { Path, Svg } from "react-native-svg";
import { AuthContext } from "../../context/authContext";
import { useNavigation } from "@react-navigation/native";

const Comment = ({
  modalVisible,
  id,
  comments,
  setComments,
  refreshComments,
  type,
}) => {
  const navigation = useNavigation();
  const [isLoading, setLoading] = useState(false);
  const [openInput, setOpenInput] = useState(false);
  const [input, setInput] = useState("");
  const { userInfo } = useContext(AuthContext);
  const { colors } = useTheme();

  // if (type !== "artwork" && type !== "exhibition") {
  //   return null;
  // }

  const createComments = async () => {
    if (!input.trim()) return; // Don't submit empty comments

    setLoading(true);
    if (userInfo != null) {
      try {
        const response = await axios.post(
          `${backendUrl}/${type}/${id}/comments`,
          {
            content: input,
          }
        );

        if (response.data && response.data.User) {
          setComments([...comments, response.data]);
        } else if (response.data && response.data.message) {
          await refreshComments();
        } else {
          console.error("Invalid response format:", response.data);
          Alert.alert("Error", "Failed to create comment. Please try again.");
        }

        setInput(""); // Clear input after successful submission
        setOpenInput(false);
      } catch (error) {
        console.error("Error creating comment:", error);
        Alert.alert(
          "Error",
          error.response?.data?.message ||
            "Failed to create comment. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const handleComment = () => {
    if (userInfo != null) {
      setOpenInput(true);
    } else {
      navigation.navigate("Login");
    }
  };

  const handleLoading = () => {
    setLoading(true);
    refreshComments();
    setTimeout(() => setLoading(false), 1000); // TODO: i dont know
  };

  const renderItem = ({ item }) => {
    return (
      <CommentFrame
        key={item.id}
        id={item.id}
        username={item.User.username || "Unknown User"}
        date={item.created_at ? item.created_at.slice(0, 10) : ""}
        text={item.content}
      />
    );
  };

  return (
    <SafeAreaView
      style={[
        styles.frameParent,
        { backgroundColor: colors.surfaceContainerHigh },
      ]}
    >
      <View style={[styles.headerContainer, { backgroundColor: colors.surfaceContainerHighest }]}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={modalVisible}
          activeOpacity={0.7}
        >
          <Svg width={22} height={22} viewBox="0 0 25 25" fill="none">
            <Path
              d="M2.9887 5.96607C2.44266 5.42003 2.44265 4.53473 2.98869 3.98869C3.53473 3.44265 4.42003 3.44265 4.96607 3.98868L21.0113 20.0338C21.5573 20.5799 21.5573 21.4652 21.0113 22.0112C20.4653 22.5572 19.58 22.5572 19.0339 22.0112L2.9887 5.96607Z"
              fill={colors.onSurface}
            />
            <Path
              d="M2.98872 22.0113C2.44267 21.4653 2.44266 20.58 2.98869 20.0339L19.0339 3.98874C19.5799 3.44268 20.4653 3.44269 21.0113 3.98877C21.5574 4.53482 21.5573 5.42013 21.0113 5.96617L4.96602 22.0113C4.42001 22.5573 3.53475 22.5573 2.98872 22.0113Z"
              fill={colors.onSurface}
            />
          </Svg>
        </TouchableOpacity>
        <Text style={[styles.commentTypo, { color: colors.onSurface }]}>
          Comments
        </Text>
        <View style={styles.commentCountContainer}>
          <Text style={[styles.commentCount, { color: colors.onSurface }]}>
            {comments.length}
          </Text>
        </View>
      </View>
      <Modal visible={openInput} transparent={true}>
        <TouchableOpacity
          onPressOut={() => {
            setOpenInput(false);
          }}
          style={styles.modalOverlay}
        >
          <View style={[styles.commentInputContainer, { backgroundColor: colors.surfaceContainerHighest }]}>
            <TextInput
              placeholderTextColor="rgba(128, 128, 128, 0.7)"
              style={[styles.commentInput, {
                color: colors.onSurface,
                borderColor: 'rgba(128, 128, 128, 0.3)',
              }]}
              placeholder="Write your comment here"
              onChangeText={(text) => {
                setInput(text);
              }}
              multiline={true}
              numberOfLines={1}
              maxLength={500}
              value={input}
            />
            <TouchableOpacity
              style={[styles.sendButton, { backgroundColor: colors.primary }]}
              onPress={() => {
                createComments();
              }}
              activeOpacity={0.7}
            >
              <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M22 2L11 13"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <Path
                  d="M22 2L15 22L11 13L2 9L22 2Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
      <FlatList
        data={comments}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.commentsList}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleLoading} />
        }
      />

      {/* Fixed Comment Input Button */}
      <TouchableOpacity
        style={[styles.fixedCommentButton, { backgroundColor: colors.primary }]}
        onPress={handleComment}
        activeOpacity={0.8}
      >
        <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
          <Path
            d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  frameGroupFlexBox: {
    margin: 10,
    justifyContent: "space-between",
    flexDirection: "row",
    alignSelf: "stretch",
    alignItems: "center",
  },
  commentTypo: {
    fontFamily: FontFamily.labelMediumBold,
    fontSize: FontSize.bodyXlargeBold_size,
    fontWeight: "700",
    textAlign: "left",
  },
  frameChild: {
    width: 25,
    height: 25,
    overflow: "hidden",
  },
  frameParent: {
    padding: 10,
    height: "100%",
    width: "100%",
    alignSelf: "center",
    justifyContent: "center",
  },
  modalOverlay: {
    justifyContent: "flex-end",
    alignSelf: "stretch",
    alignItems: "center",
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  commentInputContainer: {
    padding: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: "row",
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    width: '100%',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  commentInput: {
    flex: 1,
    minHeight: 45,
    maxHeight: 100,
    borderRadius: 20,
    borderWidth: 1,
    padding: 12,
    paddingHorizontal: 15,
    fontSize: FontSize.labelLargeBold_size,
    fontFamily: FontFamily.typographyLabelLarge,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  commentsList: {
    paddingBottom: 80, // Add padding at the bottom for the fixed button
  },
  fixedCommentButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
    marginBottom: 5,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentCountContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  commentCount: {
    fontFamily: FontFamily.labelMediumBold,
    fontSize: FontSize.labelMediumBold_size,
    fontWeight: '600',
  },
});

export default Comment;

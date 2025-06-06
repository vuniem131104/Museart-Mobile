import React, { useState, useEffect, useContext } from "react";
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import {
  Color,
  FontSize,
  FontFamily,
  Border,
  Padding,
} from "../../../GlobalStyles";
import { useNavigation } from "@react-navigation/native";
import Comment from "../../comment/Comment";
import axios from "axios";
import { backendUrl } from "../../../services/api";
import { AuthContext } from "../../../context/authContext";

const BoardExtraInfo = ({ date, id, type }) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const { userInfo } = useContext(AuthContext);
  const [likeAmount, setLikeAmount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [isLoading, setLoading] = useState(true);

  if (type !== "artwork" && type !== "exhibition") {
    return null;
  }

  const getReactions = async () => {
    try {
      const response = await axios.get(`${backendUrl}/${type}/${id}/reactions`);
      const reactions = response.data.count;
      setLikeAmount(reactions);

      if (userInfo) {
        const checkReaction = await axios.get(
          `${backendUrl}/${type}/${id}/check-reaction`
        );
        setIsLiked(checkReaction.data.hasReacted);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getComments = async () => {
    try {
      const response = await axios.get(`${backendUrl}/${type}/${id}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLike = async () => {
    if (!userInfo) {
      navigation.navigate("Login");
      return;
    }
    // console.log(userInfo);

    setIsLiked(!isLiked);
    setLikeAmount((prev) => (isLiked ? prev - 1 : prev + 1));

    try {
      await axios.post(`${backendUrl}/${type}/${id}/reactions`, {
        type: "like",
      });
    } catch (error) {
      console.error("Error handling like:", error);
      setIsLiked(!isLiked);
      setLikeAmount((prev) => (isLiked ? prev + 1 : prev - 1));
    }
  };

  const handleCommentAdded = (newComment) => {
    setComments((prevComments) => [newComment, ...prevComments]);
  };

  useEffect(() => {
    getReactions();
    getComments();
    setLoading(false);
  }, []);

  if (isLoading) {
    return (
      <View style={[styles.boardExtraInfoArtwork, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={Color.primaryPrimaryFixed} />
      </View>
    );
  }

  return (
    <View style={[styles.boardExtraInfoArtwork]}>
      <View style={styles.frameParent}>
        <View style={styles.commentParent}>
          {/* <Text style={[styles.comment, styles.textTypo]}>Comment</Text> */}
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => setModalVisible(true)}
          >
            <View style={styles.iconWrapper}>
              <Image
                style={styles.frameChild}
                contentFit="cover"
                source={require("../../../assets/group-17.png")}
              />
            </View>
            <Text style={[styles.text, styles.textTypo]}>
              {comments.length}
            </Text>
          </TouchableOpacity>
          <Modal
            visible={modalVisible}
            animationType="slide"
            transparent={true}
          >
            <View style={styles.modalContainer}>
              <Comment
                modalVisible={() => setModalVisible(!modalVisible)}
                id={id}
                comments={comments}
                setComments={setComments}
                onCommentAdded={handleCommentAdded}
                refreshComments={getComments}
                type={type}
              />
            </View>
          </Modal>
        </View>

        <View style={styles.commentParent}>
          {/* <Text style={[styles.comment, styles.textTypo]}>
            {isLiked ? "Liked" : "Like"}
          </Text> */}
          <TouchableOpacity style={styles.iconContainer} onPress={handleLike}>
            <View
              style={[styles.iconWrapper, isLiked && styles.likedIconWrapper]}
            >
              <Image
                style={[styles.frameChild, isLiked && styles.likedIcon]}
                contentFit="cover"
                source={require("../../../assets/group-192.png")}
              />
            </View>
            <Text
              style={[
                styles.text,
                styles.textTypo,
                isLiked && styles.likedText,
              ]}
            >
              {likeAmount}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.commentParent}>
          {/* <Text style={[styles.comment, styles.textTypo]}>Last Updated</Text> */}
          <View style={styles.iconContainer}>
            <View style={styles.iconWrapper}>
              <Image
                style={styles.frameChild}
                contentFit="cover"
                source={require("../../../assets/group-15.png")}
              />
            </View>
            <Text style={[styles.text, styles.textTypo]}>
              {date != null ? date.slice(0, 10) : ""}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textTypo: {
    textAlign: "left",
    color: Color.colorWhite, // White text for better contrast on dark background
    fontSize: FontSize.labelLargeBold_size,
  },
  comment: {
    fontFamily: FontFamily.typographyLabelLarge,
  },
  frameChild: {
    width: 20,
    height: 20,
  },
  text: {
    fontWeight: "700",
    fontFamily: FontFamily.labelLargeMedium,
    marginLeft: 10,
    minWidth: 30, // Ensure consistent width for numbers
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 40, // Fixed height for all icon containers
  },
  iconWrapper: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Border.br_3xs,
  },
  likedIconWrapper: {
    backgroundColor: Color.primaryPrimary + "40",
  },
  commentParent: {
    alignItems: "center",
  },
  frameParent: {
    alignSelf: "stretch",
    justifyContent: "space-around",
    flexDirection: "row",
  },
  boardExtraInfoArtwork: {
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowRadius: 4,
    elevation: 4,
    shadowOpacity: 1,
    borderRadius: Border.br_3xs,
    backgroundColor: Color.colorGray_300, // Darker background for better contrast
    overflow: "hidden",
    paddingHorizontal: Padding.p_mini,
    paddingVertical: Padding.p_mini,
    alignItems: "center",
    alignSelf: "stretch",
    marginTop: Padding.p_3xs, // Add a small gap between image and info box
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    minHeight: 100,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  // Removed likedContainer as we're now using likedIconWrapper
  likedIcon: {
    tintColor: Color.primaryPrimary, // Match the liked text color
  },
  likedText: {
    color: Color.primaryPrimary, // Use primary color for liked state
  },
});

export default BoardExtraInfo;

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
          // { headers: { Authorization: `${userInfo.token}` } }
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
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLike = async () => {
    if (!userInfo) {
      navigation.navigate("Login");
      return;
    }
    console.log(userInfo);
    try {
      await axios.post(`${backendUrl}/${type}/${id}/reactions`, {
        type: "like",
      });
      if (isLiked) {
        setLikeAmount((prev) => prev - 1);
      } else {
        setLikeAmount((prev) => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Error handling like:", error);
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
        <TouchableOpacity
          style={styles.commentParent}
          onPress={() => setModalVisible(true)}
        >
          <Text style={[styles.comment, styles.textTypo]}>Comment</Text>
          <View style={styles.groupParent}>
            <Image
              style={styles.frameChild}
              contentFit="cover"
              source={require("../../../assets/group-17.png")}
            />
            <Text style={[styles.text, styles.textTypo]}>
              {comments.length}
            </Text>
          </View>
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
        </TouchableOpacity>

        <View style={styles.commentParent}>
          <Text style={[styles.comment, styles.textTypo]}>
            {isLiked ? "Liked" : "Like"}
          </Text>
          <TouchableOpacity
            style={[styles.groupParent, isLiked && styles.likedContainer]}
            onPress={handleLike}
          >
            <Image
              style={[styles.frameChild, isLiked && styles.likedIcon]}
              contentFit="cover"
              source={require("../../../assets/group-192.png")}
            />
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
          <View style={styles.commentParent}>
            <Text style={[styles.comment, styles.textTypo]}>Last Updated</Text>
            <View style={styles.groupParent}>
              <Image
                style={styles.frameChild}
                contentFit="cover"
                source={require("../../../assets/group-15.png")}
              />
              <Text style={[styles.text, styles.textTypo]}>
                {date != null ? date.slice(0, 10) : ""}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textTypo: {
    textAlign: "left",
    color: Color.primaryPrimaryFixed,
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
  },
  groupParent: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  commentParent: {
    alignItems: "center",
  },
  frameParent: {
    alignSelf: "stretch",
    justifyContent: "space-between",
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
    borderRadius: Border.br_6xl,
    backgroundColor: Color.colorGray_400,
    overflow: "hidden",
    paddingHorizontal: Padding.p_3xs,
    paddingVertical: Padding.p_mini,
    alignItems: "center",
    alignSelf: "stretch",
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
  likedContainer: {
    backgroundColor: Color.primaryPrimaryFixed + "20",
    borderRadius: Border.br_3xs,
    padding: Padding.p_3xs,
  },
  likedIcon: {
    tintColor: Color.primaryPrimaryFixed,
  },
  likedText: {
    color: Color.primaryPrimaryFixed,
  },
});

export default BoardExtraInfo;

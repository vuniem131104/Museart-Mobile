import * as React from "react";
import { useState, useContext } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Padding, FontFamily, Border, FontSize } from "../../GlobalStyles";
import { useTheme } from "@react-navigation/native";
import axios from "axios";
import { localhost } from "../../services/api";
import { AuthContext } from "../../context/authContext";

const CommentFrame = ({ id, username, date, text }) => {
  const { colors } = useTheme();
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const { userInfo } = useContext(AuthContext);

  // const getUserById = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await axios.get(`${localhost}/auth/${id}`);
  //     setData(response.data.username);
  //     console.log(data);
  //     setLoading(false);
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // React.useEffect(() => {
  //   getUserById();
  // }, [])

  // Format date if it's in YYYY-MM-DD format
  const formatDate = (dateString) => {
    if (!dateString) return "";

    try {
      const [year, month, day] = dateString.split('-');
      if (year && month && day) {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return `${day} ${months[parseInt(month) - 1]} ${year}`;
      }
      return dateString;
    } catch (error) {
      return dateString;
    }
  };

  return (
    <View
      key={id}
      style={[
        styles.frameParent,
        {
          backgroundColor: colors.surfaceContainerHighest,
          shadowColor: colors.primaryShadow,
        },
      ]}
    >
      <View style={styles.usernameParent}>
        <Text
          style={[
            styles.username,
            styles.usernameTypo,
            { color: colors.onSurface },
          ]}
        >
          {username}
        </Text>
        <Text
          style={[
            styles.ddmmyyyy,
            { color: 'rgba(128, 128, 128, 0.8)' },
          ]}
        >
          {formatDate(date)}
        </Text>
      </View>
      <Text style={[styles.text, { color: colors.onSurface }]}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  usernameTypo: {
    fontFamily: FontFamily.labelMediumBold,
    fontWeight: "700",
    textAlign: "left",
  },
  username: {
    fontSize: FontSize.labelLargeBold_size,
  },
  ddmmyyyy: {
    fontSize: FontSize.labelSmallRegular_size,
    fontFamily: FontFamily.typographyLabelLarge,
    opacity: 0.8,
  },
  usernameParent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  text: {
    fontFamily: FontFamily.typographyLabelLarge,
    fontSize: FontSize.labelLargeBold_size,
    alignSelf: "stretch",
    textAlign: "left",
    marginTop: 10,
    lineHeight: 22,
  },
  frameParent: {
    borderRadius: Border.br_3xs,
    marginTop: 15,
    marginHorizontal: 10,
    padding: Padding.p_3xs,
    paddingVertical: 15,
    alignSelf: "stretch",
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowRadius: 6,
    elevation: 4,
    shadowOpacity: 0.25,
  },
});

export default CommentFrame;

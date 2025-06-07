import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import React from "react";
import {
  FontSize,
  FontFamily,
  Color,
  Padding,
  Border,
} from "../../GlobalStyles";
import AboutTitle from "../../components/detail/content/AboutTitle";
import BoardExtraInfo from "../../components/detail/picture/BoardExtraInfo";
import NavbarTop from "../../components/header/NavbarTop";
import { useRoute, useTheme } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { baseUrl, API_URL } from "../../services/api";
import axios from "axios";
import ButtonPrimary from "../../components/button/ButtonPrimary";

const ArticleDetail = () => {
  const route = useRoute();
  const { ID } = route.params;

  const [article, setArticle] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [summary, setSummary] = useState("");
  const [isSummarizing, setSummarizing] = useState(false);
  const { colors } = useTheme();

  const getArticle = async () => {
    try {
      const response = await axios.get(`${baseUrl}/articles/${ID}`);
      setArticle(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getArticle();
  }, []);

  const handleSummary = async () => {
    setSummarizing(true);
    setSummary("");
    try {
      const response = await axios.post(`${API_URL}/summary`, {
        title: article.title,
        content: article.copy,
      });
      setSummary(response.data.summary);
    } catch (error) {
      console.error("Summary failed:", error);
      Alert.alert("Error", "Could not summarize the article.");
    } finally {
      setSummarizing(false);
    }
  };

  return (
    <View
      className={`w-screen flex-1`}
      style={[{ backgroundColor: colors.surfaceContainer }]}
    >
      <NavbarTop />
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <ScrollView style={styles.body}>
          <AboutTitle
            title={article.title}
            tagRoute="Article"
            tagDetail="Document"
            isPrice={false}
          />
          <View style={{ height: 15 }} />
          <BoardExtraInfo
            commentAmount={""}
            likeAmount={""}
            date={article.timestamp}
          />

          <Text
            style={[
              styles.thereAreMany,
              styles.thereAreManySpaceBlock,
              { color: colors.onSurface },
            ]}
          >
            {article.copy.trim()}
          </Text>
          <ButtonPrimary
            text="Summarize"
            textSize={16}
            textMargin={8}
            buttonPrimaryFlex={1}
            onPressButton={handleSummary}
            buttonPrimaryMarginTop={30}
          />

          {isSummarizing ? (
            <ActivityIndicator style={{ marginTop: 20 }} size="large" />
          ) : (
            summary && (
              <View
                style={[
                  styles.summaryContainer,
                  { backgroundColor: colors.surfaceContainerLow },
                ]}
              >
                <Text
                  style={[styles.summaryTitle, { color: colors.onSurface }]}
                >
                  Summary
                </Text>
                <Text style={[styles.summaryText, { color: colors.onSurface }]}>
                  {summary}
                </Text>
              </View>
            )
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  articleContainer: {
    paddingHorizontal: Padding.p_3xs,
    borderStyle: "solid",
    borderColor: Color.colorBlack,
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
  },
  body: {
    flexDirection: "column",
    gap: 15,
    alignSelf: "stretch",
    marginBottom: 140,
    paddingHorizontal: Padding.p_3xs,
    paddingBottom: 20,
  },
  thereAreManySpaceBlock: {
    marginTop: 15,
    marginHorizontal: 5,
    alignSelf: "stretch",
  },
  thereAreMany: {
    fontSize: FontSize.labelLargeBold_size,
    fontFamily: FontFamily.typographyLabelLarge,
    color: Color.surfaceOnSurface,
    textAlign: "justify",
  },
  summaryContainer: {
    marginTop: 20,
    borderRadius: Border.br_3xs,
    padding: Padding.p_mini,
    marginBottom: 50,
  },
  summaryTitle: {
    fontSize: FontSize.titleMediumBold_size,
    fontFamily: FontFamily.labelMediumBold,
    marginBottom: Padding.p_3xs,
  },
  summaryText: {
    fontSize: FontSize.labelLargeBold_size,
    fontFamily: FontFamily.typographyLabelLarge,
    textAlign: "justify",
    lineHeight: 22,
  },
});

export default ArticleDetail;

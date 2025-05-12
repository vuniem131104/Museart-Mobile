import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Color, FontFamily, FontSize, Padding } from "../../GlobalStyles";
import { useNavigation, useRoute, useTheme } from "@react-navigation/native";
import axios from "axios";
import { baseUrl } from "../../services/api";
import Picture from "../../components/detail/picture/Picture";
import AboutTitle from "../../components/detail/content/AboutTitle";
import AboutArtist from "../../components/detail/content/AboutArtist";
import FrameButton from "../../components/detail/content/FrameButton";
import Button from "../../components/detail/content/Button";
import NavbarTop from "../../components/header/NavbarTop";

const ExhibitionDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { ID } = route.params;

  const [exhibition, setExhibition] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const { colors } = useTheme();

  const getExhibition = async () => {
    try {
      const response = await axios.get(`${baseUrl}/exhibitions/${ID}`);
      setExhibition(response.data.data);
      console.log(ID);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  useEffect(() => {
    getExhibition();
  }, []);

  return (
    <View
      style={[
        styles.exhibitionContainer,
        { backgroundColor: colors.surfaceContainer },
      ]}
    >
      <NavbarTop />
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <ScrollView style={styles.body}>
          <Picture
            altText={exhibition.title}
            imagePath={exhibition.image_url}
            date={exhibition.timestamp}
            id={exhibition.id}
            type="exhibition"
          />
          <AboutTitle
            title={exhibition.title}
            tagRoute={"Exhibition"}
            tagDetail={"Exhibition"}
            isPrice={false}
          />
          <AboutArtist />
          <View>
            <FrameButton
              field="AIC start time"
              value={exhibition.aic_start_at}
            />
            <FrameButton field="AIC end time" value={exhibition.aic_end_at} />
            <FrameButton field="Status" value={exhibition.status} />
            <FrameButton field="Gallery" value={exhibition.gallery_title} />
            <FrameButton
              field="Source Updated At"
              value={exhibition.source_updated_at.slice(0, 10)}
            />
          </View>
          <Button />
          {exhibition.short_description != null && (
            <View style={styles.descriptioncontainerFlexBox}>
              <Text style={[styles.description, { color: colors.onSurface }]}>
                Description
              </Text>
              <Text
                style={[styles.loremIpsumIsSimply, { color: colors.onSurface }]}
              >
                {exhibition.short_description}
              </Text>
            </View>
          )}
          {exhibition.artwork_ids && exhibition.artwork_ids.length > 0 && (
            <View style={styles.descriptioncontainerFlexBox}>
              <Text style={[styles.description, { color: colors.onSurface }]}>
                Artworks
              </Text>
              <View>
                {exhibition.artwork_ids.map((item, index) => {
                  const isLastItem =
                    index === exhibition.artwork_ids.length - 1;
                  return (
                    <View key={item}>
                      <TouchableHighlight
                        underlayColor={"#e0e0e0"}
                        onPress={() => {
                          navigation.navigate("ArtworkDetail", { ID: item });
                        }}
                        style={{
                          borderRadius: 8,
                          overflow: "hidden",
                          marginBottom: isLastItem ? 0 : 8,
                          marginTop: 8,
                        }}
                      >
                        <View
                          style={{
                            backgroundColor: colors.surfaceContainer,
                            borderRadius: 8,
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.1,
                            shadowRadius: 2,
                            elevation: 2,
                          }}
                        >
                          <Text
                            style={{ color: colors.onSurface, fontSize: 16 }}
                          >
                            {exhibition.artwork_titles[index]}
                          </Text>
                        </View>
                      </TouchableHighlight>
                      {!isLastItem && (
                        <View
                          style={{
                            height: 1,
                            backgroundColor: "#ccc",
                          }}
                        />
                      )}
                    </View>
                  );
                })}
              </View>
            </View>
          )}
          <View style={{ paddingBottom: 70 }} />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  descriptioncontainerFlexBox: {
    justifyContent: "center",
    marginTop: 15,
    alignSelf: "stretch",
    paddingBottom: 20,
  },
  descriptionFlexBox: {},
  description: {
    textAlign: "left",
    fontSize: FontSize.titleMediumBold_size,
    fontFamily: FontFamily.labelMediumBold,
  },
  loremIpsumIsSimply: {
    fontSize: FontSize.labelLargeBold_size,
    fontFamily: FontFamily.typographyLabelLarge,
    alignSelf: "stretch",
  },
  exhibitionContainer: {
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
  },
});

export default ExhibitionDetail;

import * as React from "react";
import { Text, StyleSheet, View, Pressable, Image } from "react-native";
import { useTheme } from "@react-navigation/native";

const FrameComponent = ({
  onFramePressablePress,
  frameImage,
  title,
  text = null,
}) => {
  const { colors } = useTheme();
  const [isValidImage, setIsValidImage] = React.useState(false);

  // Check image URL validity
  React.useEffect(() => {
    const checkImage = async () => {
      try {
        await Image.prefetch(frameImage);
        setIsValidImage(true);
      } catch (error) {
        console.log("Invalid image URL:", frameImage);
        setIsValidImage(false);
      }
    };

    if (frameImage) {
      checkImage();
    }
  }, [frameImage]);

  return (
    <Pressable
      className="w-screen flex flex-col gap-4 items-center justify-center p-2.5"
      onPress={onFramePressablePress}
      style={{
        marginBottom: 10,
      }}
    >
      <Image
        source={{
          uri: isValidImage
            ? frameImage
            : "https://www.artic.edu/iiif/2/cb76f25a-8727-135b-ce1a-f4423cb3021c/full/843,/0/default.jpg",
        }}
        style={{
          width: "100%",
          height: "auto",
          aspectRatio: 1,
          borderRadius: 16,
        }}
      />
      <View style={styles.textContainer}>
        <Text
          numberOfLines={2}
          ellipsizeMode="tail"
          style={[styles.title, { color: colors.onSurface }]}
        >
          {title}
        </Text>
        {text !== null ? (
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={[styles.subtitle, { color: colors.onSurface }]}
          >
            {text}
          </Text>
        ) : (
          <Text></Text>
        )}
      </View>
      {/* <View
            style={{
                width: "100%",
                height: 1,
                backgroundColor: colors.outline,
                marginTop: 10,
            }}
        /> */}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  textContainer: {
    paddingHorizontal: 10,
    marginTop: 4,
    width: "100%",
    alignItems: "flex-start",
  },
  title: {
    fontFamily: "Inter-Bold",
    fontSize: 15,
    // textAlign: "center",
  },
  subtitle: {
    fontFamily: "Inter-Regular",
    fontSize: 15,
    // textAlign: "center",
    marginTop: 4,
  },
});

export default FrameComponent;

import * as React from "react";
import { Text, StyleSheet, View, Pressable, Image } from "react-native";
import { useTheme } from "@react-navigation/native";

const FrameComponent = ({
    onFramePressablePress,
    frameImage,
    title,
    text,
}) => {
    const { colors } = useTheme();

    return (
        <Pressable
            className="w-screen flex flex-col gap-4 items-center justify-center p-2.5"
            onPress={onFramePressablePress}
            style={{
                marginBottom: 10,
            }}
        >
            <Image
                source={{ uri: frameImage }}
                style={{ width: "100%", height: "auto", aspectRatio: 1, borderRadius: 16 }}
            />
            <View style={styles.textContainer}>
                <Text
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    style={[styles.title, { color: colors.onSurface }]}
                >
                    {title}
                </Text>
                <Text
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    style={[styles.subtitle, { color: colors.onSurface }]}
                >
                    {text}
                </Text>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    textContainer: {
        paddingHorizontal: 10,
        marginTop: 4,
        width: "100%",
        alignItems: "center",
    },
    title: {
        fontFamily: "PlayfairDisplay-Bold",
        fontSize: 15,
        textAlign: "center",
    },
    subtitle: {
        fontFamily: "PlayfairDisplay-Regular",
        fontSize: 15,
        // fontStyle: "italic",
        textAlign: "center",
        marginTop: 4,
    },
});

export default FrameComponent;

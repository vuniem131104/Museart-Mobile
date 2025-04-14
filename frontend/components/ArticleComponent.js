import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { FontFamily, FontSize } from "../GlobalStyles";
import { useNavigation, useTheme } from "@react-navigation/native";

const ArticleComponent = ({
    article,
    date,
    text,
    id
}) => {
    const navigation = useNavigation();
    const { colors } = useTheme();

    return (
        <View style={{ paddingHorizontal: 10 }}>
            <Text style={[styles.username, styles.usernameTypo, { color: colors.onSurfaceVarient }]}>{article}</Text>
            <Text style={[styles.ddmmyyyy, styles.usernameTypoo, { color: colors.onSurfaceVarient }]}>{date}</Text>
            <Text numberOfLines={3} style={[styles.text, { color: colors.onSurface }]}>{text}</Text>
            <TouchableOpacity onPress={() =>
                navigation.navigate('ArticleDetail', { ID: id })} style={{ marginTop: 5 }}>
                <Text style={[styles.readMore, { color: colors.primary }]}>Read more</Text>
            </TouchableOpacity>
            <View
                style={{
                    borderBottomColor: colors.outline,
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    marginTop: 10,
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    usernameTypo: {
        fontFamily: FontFamily.labelMediumBold,
        textAlign: "left",
    },
    usernameTypoo: {
        fontWeight: "600",
    },
    username: {
        fontSize: FontSize.labelLargeBold_size,
    },
    ddmmyyyy: {
        fontSize: FontSize.labelSmallRegular_size,
    },
    text: {
        fontFamily: FontFamily.typographyLabelLarge,
        fontSize: FontSize.labelLargeBold_size,
        alignSelf: "stretch",
        textAlign: "left",
    },
    readMore: {
        fontSize: FontSize.labelMediumBold_size,
        fontFamily: FontFamily.labelLargeMedium,
    },

});

export default ArticleComponent;
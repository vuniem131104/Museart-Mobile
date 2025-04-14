import * as React from "react";
import { Text, StyleSheet, View, SafeAreaView } from "react-native";
import NavbarTop from "./NavbarTop";
import DashboardSearchEngine from "./DashboardSearchEngine";
import { useTheme } from "@react-navigation/native";

const Dashboard = ({
    namePage,
    children,

}) => {
    const { colors } = useTheme();
    return (
        <View className={`w-screen flex-1`} style={{ backgroundColor: colors.surfaceContainer }}>
            <NavbarTop />
            <View style={styles.body}>
                <View style={styles.dashboardtitleFlexBox}>
                    <Text className={'text-xl font-playfairBold'} style={{ color: colors.onSurface, fontFamily: "PlayfairDisplay-Bold", fontSize: 23 }}>{namePage}</Text>
                </View>
                <DashboardSearchEngine />
            </View>
            <SafeAreaView className={'w-full flex-1 justify-center items-center'}>
                {children}
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    dashboardtitleFlexBox: {
        flexDirection: "row",
        alignSelf: "flex-start",
        paddingLeft: 10,
    },
    body: {
        zIndex: 99,
        alignSelf: "stretch",
        alignItems: "center",
    },
});

export default Dashboard;
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import NavbarBottom from "../components/footer/NavbarBottom";
import ArtworkStackScreen from "./ArtworkStack";
import ExhibitionStackScreen from "./ExhibitionStack";
import ArticleStackScreen from "./ArticleStack";
import ShoppingStackScreen from "./ShoppingStack";
import ProfileStackScreen from "./ProfileStack";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";

const Tab = createBottomTabNavigator();
export default function HomeTabs() {
    const { userToken, isGuest } = useContext(AuthContext);

    // Only show Profile tab if user is authenticated (not in guest mode)
    const showProfileTab = userToken && !isGuest;

    return (
        <Tab.Navigator tabBar={props => <NavbarBottom  {...props} />} screenOptions={{ headerShown: false }}>
            <Tab.Screen
                name="Artworks"
                component={ArtworkStackScreen}
            />
            <Tab.Screen
                name="Exhibitions"
                component={ExhibitionStackScreen}
            />
            <Tab.Screen
                name="Articles"
                component={ArticleStackScreen}
            />
            <Tab.Screen
                name="Shopping"
                component={ShoppingStackScreen}
            />
            {/* {showProfileTab && (
                <Tab.Screen
                    name="Profile"
                    component={ProfileStackScreen}
                />
            )} */}
        </Tab.Navigator>
    );
}
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ExhibitionDetail from "../screens/exhibitions/ExhibitionDetail";
import Exhibitions from "../screens/exhibitions/Exhibitions";
import ArtworkDetail from "../screens/artworks/ArtworkDetail";

const ExhibitionStack = createNativeStackNavigator();
export default function ExhibitionStackScreen() {
    return (
        <ExhibitionStack.Navigator screenOptions={{ headerShown: false }}>
            <ExhibitionStack.Screen
                name="ExhibitionScreen"
                component={Exhibitions} />
            <ExhibitionStack.Screen name="ExhibitionDetail" component={ExhibitionDetail} />
            <ExhibitionStack.Screen name="ArtworkDetail" component={ArtworkDetail} />
        </ExhibitionStack.Navigator>
    );
}
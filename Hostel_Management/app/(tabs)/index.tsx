import { Text, View, TouchableOpacity } from "react-native";
import { Route } from "expo-router/build/Route";
import {Link} from "expo-router";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Link href="/login/create_account"> go to account page.</Link>
    </View>
  );
}

import { icons } from "@/constants/icons";
import { Tabs } from "expo-router";
import React from "react";
import { Image, View } from "react-native";

interface TabIconProps {
  focused: boolean;
  text: string;
  icon: any;
}


const TabIcon = ({ focused, text, icon }: TabIconProps) => {
  return (
    <View>
        <Image
            source={icon}
            resizeMode="contain"
            style={{
            width: 20,
            height: 20,
            tintColor: focused ? "#2e64e5" : "#00000",
            }}
        />
        
    </View>
  );
}

const _Layout = () => {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarItemStyle: {
                    width: "100%",
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                },
                tabBarStyle: {
                    backgroundColor: "#BCC1CA",
                    position: "absolute",
                    borderWidth: 1,
                    borderColor: "#0f0d23",
                    height: 76,
                },
            }}
        >            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} text={"Home"} icon={icons.home} />
                    ),
                }}
            />
            <Tabs.Screen
                name="rooms"
                options={{
                    title: "Rooms",
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} text={"Beds"} icon={icons.room} />
                    ),
                }}
            />
            <Tabs.Screen
                name="add-guest"
                options={{
                    title: "Add Guest",
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} text={"Add"} icon={icons.add_guest} />
                    ),
                }}
            />
            <Tabs.Screen
                name="guest-book"
                options={{
                    title: "Guest Book",
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} text={"Guests"} icon={icons.guests} />
                    ),
                }}
            />
            <Tabs.Screen
                name="wallet"
                options={{
                    title: "Wallet",
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} text={"Wallet"} icon={icons.wallet} />
                    ),
                }}
            />
        </Tabs>
    );
}

export default _Layout;
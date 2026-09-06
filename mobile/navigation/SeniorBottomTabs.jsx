import React from "react";

import {
    Text,
} from "react-native";

import {
    createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";

import {
    useSafeAreaInsets,
} from "react-native-safe-area-context";

// =====================================================
// SENIOR SCREENS
// =====================================================

import HomeScreen from "../screens/senior/HomeScreen";
import CommunitiesScreen from "../screens/senior/CommunitiesScreen";
import MyCommunitiesScreen from "../screens/senior/MyCommunitiesScreen";
import ProfileScreen from "../screens/senior/ProfileScreen";

// =====================================================
// TAB NAVIGATOR
// =====================================================

const Tab = createBottomTabNavigator();

const SeniorBottomTabs = () => {

    const insets = useSafeAreaInsets();

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,

                // Active tab color
                tabBarActiveTintColor: "#164E63",

                // Inactive tab color
                tabBarInactiveTintColor: "#6B7280",

                // Bottom navigation
                tabBarStyle: {
                    height: 65 + insets.bottom,

                    paddingTop: 5,

                    paddingBottom: insets.bottom + 5,

                    backgroundColor: "#FFFFFF",

                    borderTopWidth: 1,

                    borderTopColor: "#E5E7EB",

                    elevation: 8,

                    shadowColor: "#000",

                    shadowOffset: {
                        width: 0,
                        height: -2,
                    },

                    shadowOpacity: 0.08,

                    shadowRadius: 4,
                },

                // Tab text
                tabBarLabelStyle: {
                    fontSize: 12,

                    fontWeight: "600",
                },
            }}
        >

            {/* ================================================= */}
            {/* HOME */}
            {/* ================================================= */}

            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarLabel: "Home",

                    tabBarIcon: ({ focused }) => (
                        <Text
                            style={{
                                fontSize: focused ? 24 : 22,
                            }}
                        >
                            🏠
                        </Text>
                    ),
                }}
            />

            {/* ================================================= */}
            {/* COMMUNITIES */}
            {/* ================================================= */}

            <Tab.Screen
                name="Communities"
                component={CommunitiesScreen}
                options={{
                    tabBarLabel: "Communities",

                    tabBarIcon: ({ focused }) => (
                        <Text
                            style={{
                                fontSize: focused ? 24 : 22,
                            }}
                        >
                            👥
                        </Text>
                    ),
                }}
            />

            {/* ================================================= */}
            {/* MY COMMUNITIES */}
            {/* ================================================= */}

            <Tab.Screen
                name="MyCommunities"
                component={MyCommunitiesScreen}
                options={{
                    tabBarLabel: "My Communities",

                    tabBarIcon: ({ focused }) => (
                        <Text
                            style={{
                                fontSize: focused ? 24 : 22,
                            }}
                        >
                            ❤️
                        </Text>
                    ),
                }}
            />

            {/* ================================================= */}
            {/* PROFILE */}
            {/* ================================================= */}

            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarLabel: "Profile",

                    tabBarIcon: ({ focused }) => (
                        <Text
                            style={{
                                fontSize: focused ? 24 : 22,
                            }}
                        >
                            👤
                        </Text>
                    ),
                }}
            />

        </Tab.Navigator>
    );
};

export default SeniorBottomTabs;
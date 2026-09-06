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

import OwnerDashboardScreen from "../screens/owner/OwnerDashboardScreen";
import OwnerMyCommunitiesScreen from "../screens/owner/OwnerMyCommunitiesScreen";
import AnnouncementsScreen from "../screens/owner/AnnouncementsScreen";
import OwnerProfileScreen from "../screens/owner/OwnerProfileScreen";

const Tab = createBottomTabNavigator();

const OwnerBottomTabs = () => {

    const insets = useSafeAreaInsets();

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,

                tabBarActiveTintColor: "#7C3AED",

                tabBarInactiveTintColor: "#6B7280",

                tabBarStyle: {
                    height: 65 + insets.bottom,

                    paddingTop: 5,

                    paddingBottom:
                        insets.bottom + 5,

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

                tabBarLabelStyle: {
                    fontSize: 12,

                    fontWeight: "600",
                },
            }}
        >

            {/* ========================================= */}
            {/* DASHBOARD */}
            {/* ========================================= */}

            <Tab.Screen
                name="OwnerDashboard"
                component={OwnerDashboardScreen}
                options={{
                    tabBarLabel: "Dashboard",

                    tabBarIcon: ({ focused }) => (
                        <Text
                            style={{
                                fontSize:
                                    focused
                                        ? 24
                                        : 22,
                            }}
                        >
                            🏠
                        </Text>
                    ),
                }}
            />

            {/* ========================================= */}
            {/* MY COMMUNITIES */}
            {/* ========================================= */}

            <Tab.Screen
                name="OwnerMyCommunities"
                component={
                    OwnerMyCommunitiesScreen
                }
                options={{
                    tabBarLabel: "Communities",

                    tabBarIcon: ({ focused }) => (
                        <Text
                            style={{
                                fontSize:
                                    focused
                                        ? 24
                                        : 22,
                            }}
                        >
                            👥
                        </Text>
                    ),
                }}
            />

            {/* ========================================= */}
            {/* ANNOUNCEMENTS */}
            {/* ========================================= */}

            <Tab.Screen
                name="Announcements"
                component={
                    AnnouncementsScreen
                }
                options={{
                    tabBarLabel: "Announcements",

                    tabBarIcon: ({ focused }) => (
                        <Text
                            style={{
                                fontSize:
                                    focused
                                        ? 24
                                        : 22,
                            }}
                        >
                            📢
                        </Text>
                    ),
                }}
            />

            {/* ========================================= */}
            {/* PROFILE */}
            {/* ========================================= */}

            <Tab.Screen
                name="OwnerProfile"
                component={
                    OwnerProfileScreen
                }
                options={{
                    tabBarLabel: "Profile",

                    tabBarIcon: ({ focused }) => (
                        <Text
                            style={{
                                fontSize:
                                    focused
                                        ? 24
                                        : 22,
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

export default OwnerBottomTabs;
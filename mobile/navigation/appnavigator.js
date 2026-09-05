import React from "react";

import {
    NavigationContainer,
} from "@react-navigation/native";

import {
    createNativeStackNavigator,
} from "@react-navigation/native-stack";

import { useAuth } from "../context/authcontext";

// ==================== AUTH ====================

import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";

// ==================== SENIOR ====================

import HomeScreen from "../screens/senior/HomeScreen";
import CommunitiesScreen from "../screens/senior/CommunitiesScreen";
import MyCommunitiesScreen from "../screens/senior/MyCommunitiesScreen";
import CommunityDetailsScreen from "../screens/senior/CommunityDetailsScreen";
import ProfileScreen from "../screens/senior/ProfileScreen";
import DiscussionScreen from "../screens/senior/DiscussionScreen";
import CommunityAnnouncementsScreen from "../screens/senior/CommunityAnnouncementsScreen";

// ==================== OWNER ====================

import OwnerDashboardScreen from "../screens/owner/OwnerDashboardScreen";
import OwnerMyCommunitiesScreen from "../screens/owner/OwnerMyCommunitiesScreen";
import CreateCommunityScreen from "../screens/owner/CreateCommunityScreen";
import ManageCommunityScreen from "../screens/owner/ManageCommunityScreen";
import EditCommunityScreen from "../screens/owner/EditCommunityScreen";
import ManageMembersScreen from "../screens/owner/ManageMembersScreen";

import CreateAnnouncementScreen from "../screens/owner/CreateAnnouncementScreen";
import AnnouncementsScreen from "../screens/owner/AnnouncementsScreen";
import EditAnnouncementScreen from "../screens/owner/EditAnnounceMentScreen";

// ==================== STACK ====================

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
    const { user, loading } = useAuth();

    // Wait until authentication state is loaded
    if (loading) {
        return null;
    }

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerTitleAlign: "center",
                }}
            >

                {/* ================================================= */}
                {/* AUTHENTICATION */}
                {/* ================================================= */}

                {!user ? (
                    <>
                        <Stack.Screen
                            name="Login"
                            component={LoginScreen}
                            options={{
                                headerShown: false,
                            }}
                        />

                        <Stack.Screen
                            name="Register"
                            component={RegisterScreen}
                            options={{
                                title: "Create Account",
                            }}
                        />
                    </>

                ) : user.role === "OWNER" ? (

                    /* ================================================= */
                    /* COMMUNITY OWNER */
                    /* ================================================= */

                    <>
                        {/* Owner Dashboard */}

                        <Stack.Screen
                            name="OwnerDashboard"
                            component={OwnerDashboardScreen}
                            options={{
                                title: "Owner Dashboard",
                            }}
                        />

                        {/* My Communities */}

                        <Stack.Screen
                            name="OwnerMyCommunities"
                            component={OwnerMyCommunitiesScreen}
                            options={{
                                title: "My Communities",
                            }}
                        />

                        {/* Create Community */}

                        <Stack.Screen
                            name="CreateCommunity"
                            component={CreateCommunityScreen}
                            options={{
                                title: "Create Community",
                            }}
                        />

                        {/* Manage Community */}

                        <Stack.Screen
                            name="ManageCommunity"
                            component={ManageCommunityScreen}
                            options={{
                                title: "Manage Community",
                            }}
                        />

                        {/* Edit Community */}

                        <Stack.Screen
                            name="EditCommunity"
                            component={EditCommunityScreen}
                            options={{
                                title: "Edit Community",
                            }}
                        />

                        {/* Manage Members */}

                        <Stack.Screen
                            name="ManageMembers"
                            component={ManageMembersScreen}
                            options={{
                                title: "Manage Members",
                            }}
                        />

                        {/* Announcements */}

                        <Stack.Screen
                            name="Announcements"
                            component={AnnouncementsScreen}
                            options={{
                                title: "Announcements",
                            }}
                        />

                        {/* Create Announcement */}

                        <Stack.Screen
                            name="CreateAnnouncement"
                            component={CreateAnnouncementScreen}
                            options={{
                                title: "Create Announcement",
                            }}
                        />

                        {/* Edit Announcement */}

                        <Stack.Screen
                            name="EditAnnouncement"
                            component={EditAnnouncementScreen}
                            options={{
                                title: "Edit Announcement"
                            }}
                        />
                    </>

                ) : (

                    /* ================================================= */
                    /* SENIOR CITIZEN */
                    /* ================================================= */

                    <>
                        {/* Home */}

                        <Stack.Screen
                            name="Home"
                            component={HomeScreen}
                            options={{
                                title: "Senior Community",
                            }}
                        />

                        {/* Communities */}

                        <Stack.Screen
                            name="Communities"
                            component={CommunitiesScreen}
                            options={{
                                title: "Communities",
                            }}
                        />

                        {/* My Communities */}

                        <Stack.Screen
                            name="MyCommunities"
                            component={MyCommunitiesScreen}
                            options={{
                                title: "My Communities",
                            }}
                        />

                        {/* Community Details */}

                        <Stack.Screen
                            name="CommunityDetails"
                            component={CommunityDetailsScreen}
                            options={{
                                title: "Community",
                            }}
                        />

                        {/* Discussion */}

                        <Stack.Screen
                            name="Discussion"
                            component={DiscussionScreen}
                            options={{
                                title: "Community Discussion",
                            }}
                        />

                        {/* Community Announcements */}

                        <Stack.Screen
                            name="CommunityAnnouncements"
                            component={CommunityAnnouncementsScreen}
                            options={{
                                title: "Announcements",
                            }}
                        />
                        {/* Profile */}

                        <Stack.Screen
                            name="Profile"
                            component={ProfileScreen}
                            options={{
                                title: "My Profile",
                            }}
                        />
                    </>
                )}

            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
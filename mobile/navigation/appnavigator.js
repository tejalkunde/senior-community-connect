import React from "react";

import {
    NavigationContainer,
} from "@react-navigation/native";

import {
    createNativeStackNavigator,
} from "@react-navigation/native-stack";

import { useAuth } from "../context/authcontext";

// =====================================================
// AUTH
// =====================================================

import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";

// =====================================================
// SENIOR BOTTOM NAVIGATION
// =====================================================

import SeniorBottomTabs from "./SeniorBottomTabs";

// =====================================================
// SENIOR STACK SCREENS
// =====================================================

import CommunityDetailsScreen from "../screens/senior/CommunityDetailsScreen";
import DiscussionScreen from "../screens/senior/DiscussionScreen";
import CommunityAnnouncementsScreen from "../screens/senior/CommunityAnnouncementsScreen";

// =====================================================
// OWNER BOTTOM NAVIGATION
// =====================================================

import OwnerBottomTabs from "./OwnerBottomTabs.js";

// =====================================================
// OWNER STACK SCREENS
// =====================================================

import CreateCommunityScreen from "../screens/owner/CreateCommunityScreen";
import ManageCommunityScreen from "../screens/owner/ManageCommunityScreen";
import EditCommunityScreen from "../screens/owner/EditCommunityScreen";
import ManageMembersScreen from "../screens/owner/ManageMembersScreen";

import CreateAnnouncementScreen from "../screens/owner/CreateAnnouncementScreen";
import EditAnnouncementScreen from "../screens/owner/EditAnnounceMentScreen";

// =====================================================
// STACK
// =====================================================

const Stack = createNativeStackNavigator();

const AppNavigator = () => {

    const {
        user,
        loading,
    } = useAuth();

    // =====================================================
    // WAIT FOR AUTHENTICATION
    // =====================================================

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

                        {/* ============================================= */}
                        {/* OWNER BOTTOM TABS */}
                        {/* ============================================= */}

                        <Stack.Screen
                            name="OwnerTabs"
                            component={OwnerBottomTabs}
                            options={{
                                headerShown: false,
                            }}
                        />

                        {/* ============================================= */}
                        {/* CREATE COMMUNITY */}
                        {/* ============================================= */}

                        <Stack.Screen
                            name="CreateCommunity"
                            component={
                                CreateCommunityScreen
                            }
                            options={{
                                title: "Create Community",
                            }}
                        />

                        {/* ============================================= */}
                        {/* MANAGE COMMUNITY */}
                        {/* ============================================= */}

                        <Stack.Screen
                            name="ManageCommunity"
                            component={
                                ManageCommunityScreen
                            }
                            options={{
                                title: "Manage Community",
                            }}
                        />

                        {/* ============================================= */}
                        {/* EDIT COMMUNITY */}
                        {/* ============================================= */}

                        <Stack.Screen
                            name="EditCommunity"
                            component={
                                EditCommunityScreen
                            }
                            options={{
                                title: "Edit Community",
                            }}
                        />

                        {/* ============================================= */}
                        {/* MANAGE MEMBERS */}
                        {/* ============================================= */}

                        <Stack.Screen
                            name="ManageMembers"
                            component={
                                ManageMembersScreen
                            }
                            options={{
                                title: "Manage Members",
                            }}
                        />

                        {/* ============================================= */}
                        {/* CREATE ANNOUNCEMENT */}
                        {/* ============================================= */}

                        <Stack.Screen
                            name="CreateAnnouncement"
                            component={
                                CreateAnnouncementScreen
                            }
                            options={{
                                title: "Create Announcement",
                            }}
                        />

                        {/* ============================================= */}
                        {/* EDIT ANNOUNCEMENT */}
                        {/* ============================================= */}

                        <Stack.Screen
                            name="EditAnnouncement"
                            component={
                                EditAnnouncementScreen
                            }
                            options={{
                                title: "Edit Announcement",
                            }}
                        />

                    </>

                ) : (

                    /* ================================================= */
                    /* SENIOR CITIZEN */
                    /* ================================================= */

                    <>

                        {/* ============================================= */}
                        {/* SENIOR BOTTOM TABS */}
                        {/* ============================================= */}

                        <Stack.Screen
                            name="SeniorTabs"
                            component={
                                SeniorBottomTabs
                            }
                            options={{
                                headerShown: false,
                            }}
                        />

                        {/* ============================================= */}
                        {/* COMMUNITY DETAILS */}
                        {/* ============================================= */}

                        <Stack.Screen
                            name="CommunityDetails"
                            component={
                                CommunityDetailsScreen
                            }
                            options={{
                                title: "Community",
                            }}
                        />

                        {/* ============================================= */}
                        {/* DISCUSSION */}
                        {/* ============================================= */}

                        <Stack.Screen
                            name="Discussion"
                            component={
                                DiscussionScreen
                            }
                            options={{
                                title:
                                    "Community Discussion",
                            }}
                        />

                        {/* ============================================= */}
                        {/* COMMUNITY ANNOUNCEMENTS */}
                        {/* ============================================= */}

                        <Stack.Screen
                            name="CommunityAnnouncements"
                            component={
                                CommunityAnnouncementsScreen
                            }
                            options={{
                                title: "Announcements",
                            }}
                        />

                    </>

                )}

            </Stack.Navigator>

        </NavigationContainer>
    );
};

export default AppNavigator;
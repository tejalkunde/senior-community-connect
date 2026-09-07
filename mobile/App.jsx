import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AuthProvider } from "./context/authcontext";
import AppNavigator from "./navigation/appnavigator";

export default function App() {
    return (
       
        <SafeAreaProvider>
            <AuthProvider>
                <AppNavigator />
            </AuthProvider>
        </SafeAreaProvider>
        
    );
}
import React from "react";
import { AuthProvider } from "./context/authcontext";
import AppNavigator from "./navigation/appnavigator";

export default function App() {
    return (
        <AuthProvider>
            <AppNavigator />
        </AuthProvider>
    );
}
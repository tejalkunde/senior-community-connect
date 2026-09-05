import React, {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import API from "../services/api";

import {
    saveToken,
    getToken,
    removeToken,
    saveUser,
    getUser,
    removeUser,
} from "../utils/storage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const token = await getToken();
            const storedUser = await getUser();

            if (token && storedUser) {
                setUser(storedUser);
            }
        } catch (error) {
            console.log("Load user error:", error);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const response = await API.post("/auth/login", {
            email,
            password,
        });

        const { token, user } = response.data;

        await saveToken(token);
        await saveUser(user);

        setUser(user);

        return user;
    };

    const register = async (name, email, password, role) => {
        const response = await API.post("/auth/register", {
            name,
            email,
            password,
            role,
        });

        return response.data;
    };

    const logout = async () => {
        await removeToken();
        await removeUser();

        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
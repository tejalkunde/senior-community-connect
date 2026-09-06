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

        const { token, user } = response.data.data;

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



/*import React, {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import API from "../services/api";

import {
    saveToken,
    saveUser,
    getToken,
    getUser,
    removeToken,
    removeUser,
} from "../utils/storage";

import {
    mockUsers,
} from "../utils/mockData";

import {
    MOCK_MODE,
} from "../utils/config";

const AuthContext = createContext();

export const AuthProvider = ({
    children,
}) => {
    const [user, setUser] = useState(null);

    const [loading, setLoading] =
        useState(true);

    

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const token =
                await getToken();

            const savedUser =
                await getUser();

            if (
                token &&
                savedUser
            ) {
                setUser(savedUser);
            }
        } catch (error) {
            console.log(
                "Load user error:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    

    const login = async (
        email,
        password
    ) => {
        

        if (MOCK_MODE) {
            const normalizedEmail =
                email
                    .trim()
                    .toLowerCase();

            const normalizedPassword =
                password.trim();

            

            if (
                normalizedEmail ===
                    "ramesh@example.com" &&
                normalizedPassword ===
                    "123456"
            ) {
                const mockUser = {
                    ...mockUsers.senior,
                    email: normalizedEmail,
                };

                await saveToken(
                    "mock-token-123"
                );

                await saveUser(
                    mockUser
                );

                setUser(mockUser);

                return mockUser;
            }

            

            if (
                normalizedEmail ===
                    "owner@example.com" &&
                normalizedPassword ===
                    "123456"
            ) {
                const mockUser = {
                    ...mockUsers.owner,
                    email: normalizedEmail,
                };

                await saveToken(
                    "mock-token-123"
                );

                await saveUser(
                    mockUser
                );

                setUser(mockUser);

                return mockUser;
            }

            throw new Error(
                "Invalid mock login. Use ramesh@example.com / 123456 or owner@example.com / 123456."
            );
        }


        const response =
            await API.post(
                "/auth/login",
                {
                    email,
                    password,
                }
            );

        const {
            token,
            user,
        } = response.data;

        await saveToken(token);

        await saveUser(user);

        setUser(user);

        return user;
    };

    

    const register = async (
        name,
        email,
        password,
        role
    ) => {
       

        if (MOCK_MODE) {
            const normalizedEmail =
                email
                    .trim()
                    .toLowerCase();

            const mockUser = {
                _id:
                    role === "OWNER"
                        ? `mock-owner-${Date.now()}`
                        : `mock-senior-${Date.now()}`,

                name:
                    name.trim(),

                email:
                    normalizedEmail,

                role,
            };

            

            await saveToken(
                "mock-token-123"
            );

            await saveUser(
                mockUser
            );

           

            setUser(mockUser);

            return {
                message:
                    "Mock registration successful.",
                user: mockUser,
                token:
                    "mock-token-123",
            };
        }

        

        const response =
            await API.post(
                "/auth/register",
                {
                    name,
                    email,
                    password,
                    role,
                }
            );

        return response.data;
    };

  

    const logout = async () => {
        try {
            await removeToken();

            await removeUser();

            setUser(null);
        } catch (error) {
            console.log(
                "Logout error:",
                error
            );
        }
    };

    

    const value = {
        user,
        loading,
        login,
        register,
        logout,
    };

    return (
        <AuthContext.Provider
            value={value}
        >
            {children}
        </AuthContext.Provider>
    );
};



export const useAuth = () => {
    const context =
        useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
};*/
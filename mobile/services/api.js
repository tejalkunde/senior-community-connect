/*import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API = axios.create({
    baseURL: "http://10.1.26.110:5000/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Add JWT automatically
API.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default API;*/
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { MOCK_MODE } from "../utils/config";
import mockAPI from "../utils/mockAPI";

/*
=====================================================
REAL API
=====================================================
*/

const realAPI = axios.create({
    baseURL:
        "http://10.1.26.110:5000/api",

    headers: {
        "Content-Type":
            "application/json",
    },
});

/*
=====================================================
JWT
=====================================================
*/

realAPI.interceptors.request.use(
    async (config) => {
        const token =
            await AsyncStorage.getItem(
                "token"
            );

        if (token) {
            config.headers.Authorization =
                `Bearer ${token}`;
        }

        return config;
    },

    (error) =>
        Promise.reject(error)
);

/*
=====================================================
SELECT API
=====================================================

MOCK_MODE = true
    ↓
mockAPI

MOCK_MODE = false
    ↓
real backend
=====================================================
*/

const API = MOCK_MODE
    ? mockAPI
    : realAPI;

export default API;
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import reactotronZustand from "reactotron-plugin-zustand";
import Reactotron from "reactotron-react-native";
import { useAuthStore } from "./src/features/auth/store/useAuthStore";

Reactotron.setAsyncStorageHandler(AsyncStorage)
  .configure({
    name: "My Project",
    host: "10.0.2.2",
  })
  .useReactNative({
    asyncStorage: true,
    networking: true,
  })
  .use(
    reactotronZustand({
      stores: [{ name: "authStore", store: useAuthStore }],
    }),
  )
  .connect();

axios.interceptors.response.use(
  (response) => {
    Reactotron.display({
      name: "AXIOS SUCCESS",
      preview: `[${response.status}] ${response.config.url}`,
      value: response.data,
    });
    return response;
  },
  (error) => {
    Reactotron.display({
      name: "AXIOS ERROR",
      preview: `[${error.response?.status}] ${error.config?.url}`,
      value: error.response?.data || error.message,
      important: true,
    });
    return Promise.reject(error);
  },
);

console.tron = Reactotron;

export default Reactotron;

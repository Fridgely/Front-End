import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import reactotronZustand from "reactotron-plugin-zustand";
import Reactotron from "reactotron-react-native";
import { NativeModules, Platform } from "react-native";
import { useAuthStore } from "./src/features/auth/store/useAuthStore";

const getReactotronHost = () => {
  // Android 실기기 USB 연결은 `adb reverse tcp:9090 tcp:9090` 기준으로 localhost 사용
  if (Platform.OS === "android") return "localhost";

  // iOS(실기기/시뮬레이터)는 보통 같은 네트워크에서 PC IP로 붙어야 함.
  // Metro 주소에서 호스트를 추출해 자동으로 맞춤.
  const scriptURL = NativeModules.SourceCode?.scriptURL;
  if (typeof scriptURL === "string") {
    const match = scriptURL.match(/^https?:\/\/([^:/]+)(?::\d+)?\//);
    if (match?.[1]) return match[1];
  }

  return "localhost";
};

Reactotron.setAsyncStorageHandler(AsyncStorage)
  .configure({
    name: "My Project",
    host: getReactotronHost(),
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

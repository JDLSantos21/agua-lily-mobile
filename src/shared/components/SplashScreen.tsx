import { SafeAreaView } from "react-native-safe-area-context";
import LottieView from "lottie-react-native";
import splash from "../../../assets/lotties/splash.json";

export default function SplashScreen() {
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <LottieView
        source={splash}
        autoPlay
        loop
        resizeMode="center"
        style={{ flex: 1, width: "50%" }}
      />
    </SafeAreaView>
  );
}

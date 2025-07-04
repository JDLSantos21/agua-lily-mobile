import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export const HomeIcon = (props: any) => (
  <Ionicons name="home" size={24} color="blue" {...props} />
);

export const SettingsIcon = (props: any) => (
  <MaterialIcons name="settings" size={24} color="#000" {...props} />
);

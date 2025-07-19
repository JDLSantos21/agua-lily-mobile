import { History, Home, Settings, ScanBarcode } from "lucide-react-native";

export const icon = {
  index: (props: any) => <Home size="24" {...props} />,
  history: (props: any) => <History size="24" {...props} />,
  settings: (props: any) => <Settings size="24" {...props} />,
  equipments: (props: any) => <ScanBarcode size="24" {...props} />,
};

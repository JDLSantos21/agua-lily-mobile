import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";

export interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: "default" | "cancel" | "destructive";
}

export interface AlertOptions {
  title: string;
  message?: string;
  buttons?: AlertButton[];
  type?: "info" | "success" | "warning" | "error" | "confirm";
  cancelable?: boolean;
}

interface AlertState extends AlertOptions {
  visible: boolean;
}

interface AlertContextType {
  showAlert: (options: AlertOptions) => void;
  hideAlert: () => void;
  alert: AlertState;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};

interface AlertProviderProps {
  children: ReactNode;
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [alert, setAlert] = useState<AlertState>({
    visible: false,
    title: "",
    message: "",
    buttons: [],
    type: "info",
    cancelable: true,
  });

  const hideAlert = useCallback(() => {
    setAlert((prev) => ({ ...prev, visible: false }));
  }, []);

  const showAlert = useCallback(
    (options: AlertOptions) => {
      const defaultButtons: AlertButton[] = [
        {
          text: "OK",
          style: "default",
          onPress: hideAlert,
        },
      ];

      setAlert({
        ...options,
        visible: true,
        buttons: options.buttons || defaultButtons,
        type: options.type || "info",
        cancelable: options.cancelable !== false,
      });
    },
    [hideAlert]
  );

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert, alert }}>
      {children}
    </AlertContext.Provider>
  );
};

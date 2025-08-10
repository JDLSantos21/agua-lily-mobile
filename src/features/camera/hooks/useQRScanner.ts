import { useState, useCallback } from "react";

export type QRScannerAction = "delivery" | "save-location";

interface UseQRScannerProps {
  onQRScanned: (data: string, action: QRScannerAction) => void;
}

export const useQRScanner = ({ onQRScanned }: UseQRScannerProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentAction, setCurrentAction] = useState<QRScannerAction | null>(
    null
  );

  const openScanner = useCallback((action: QRScannerAction) => {
    setCurrentAction(action);
    setIsVisible(true);
  }, []);

  const closeScanner = useCallback(() => {
    setIsVisible(false);
    setCurrentAction(null);
  }, []);

  const handleCodeScanned = useCallback(
    (data: string) => {
      if (currentAction) {
        onQRScanned(data, currentAction);
      }
      closeScanner();
    },
    [currentAction, onQRScanned, closeScanner]
  );

  return {
    isVisible,
    currentAction,
    openScanner,
    closeScanner,
    handleCodeScanned,
  };
};

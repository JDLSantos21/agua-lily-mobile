import { useState, useEffect } from "react";
import { KeyboardAvoidingView, View } from "react-native";

import RNModal, { ModalProps } from "react-native-modal";

type PROPS = Partial<ModalProps> & {
  isOpen: boolean;
  withInput?: boolean;
  noOverlay?: boolean;
  onBackdropPress?: () => void;
  children: React.ReactNode;
};
export const Modal = ({
  isOpen,
  withInput,
  children,
  onBackdropPress,
  noOverlay,
  ...rest
}: PROPS) => {
  const [visible, setVisible] = useState(isOpen);

  useEffect(() => {
    setVisible(isOpen);
  }, [isOpen]);

  function handleBackdropPress() {
    if (onBackdropPress) {
      onBackdropPress();
    }
    setVisible(false);
  }

  const content = withInput ? (
    <KeyboardAvoidingView
      className={`items-center justify-center flex-1 px-3 `}
      behavior="padding"
    >
      {children}
    </KeyboardAvoidingView>
  ) : (
    <View className={`items-center justify-center flex-1`}>{children}</View>
  );

  return (
    <RNModal
      className="p-0"
      onBackdropPress={handleBackdropPress}
      isVisible={visible}
      statusBarTranslucent
      backdropTransitionOutTiming={-1}
      {...rest}
    >
      {content}
    </RNModal>
  );
};

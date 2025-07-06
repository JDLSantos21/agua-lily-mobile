// hooks/useDrawer.ts
import { useRef, useCallback } from "react";
import { DrawerMenuRef } from "@/components/DrawerMenu";

export const useDrawer = () => {
  const drawerRef = useRef<DrawerMenuRef>(null);

  const openDrawer = useCallback(() => {
    drawerRef.current?.open();
  }, []);

  const closeDrawer = useCallback(() => {
    drawerRef.current?.close();
  }, []);

  const toggleDrawer = useCallback(() => {
    drawerRef.current?.toggle();
  }, []);

  return {
    drawerRef,
    openDrawer,
    closeDrawer,
    toggleDrawer,
  };
};

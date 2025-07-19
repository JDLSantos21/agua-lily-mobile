import { Linking } from "react-native";

export const openInMaps = (
  address: string,
  coordinates?: { lat: number; lng: number } | null
) => {
  let url;
  if (coordinates?.lat && coordinates?.lng) {
    url = `https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}`;
  } else {
    url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  }

  return Linking.openURL(url);
};

import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { Text } from "react-native";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    // Correct the font name and ensure the file path is accurate
    "Outfit-Bold": require("../assets/fonts/Outfit-Bold.ttf"),
  });

  if (!fontsLoaded) {
    // Return a loading screen while fonts are being loaded
    return <Text>Loading...</Text>;
  }

  return (
    <Stack screenOptions={{ 
      headerShown: false 
    }}>
      {/* Your app content */}
    </Stack>
  );
}
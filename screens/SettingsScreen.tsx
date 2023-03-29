import { View } from "react-native";
import { Switch, Text } from "react-native-paper";
import { useContext } from "react";
import { PreferencesContext } from "../store/preferences-context";

function SettingsScreen() {
  const { toggleTheme, isThemeDark } = useContext(PreferencesContext);

  return (
    <View
      style={{
        justifyContent: "space-between",
        flex: 1,
        flexDirection: "row",
        paddingHorizontal: 16,
        paddingTop: 24,
      }}
    >
      <Text>Dark Mode</Text>
      <Switch color={"red"} value={isThemeDark} onValueChange={toggleTheme} />
    </View>
  );
}

export default SettingsScreen;

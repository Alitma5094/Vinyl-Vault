import { StatusBar } from "expo-status-bar";
import Navigation from "./Navigation";
import { Provider as PaperProvider } from "react-native-paper";
import { PreferencesContext, useTheme } from "./store/preferences-context";
import { useMemo } from "react";


export default function App() {

  const { theme, toggleTheme } = useTheme();

  const preferences = useMemo(
    () => ({
      toggleTheme,
      isThemeDark: theme.dark,
    }),
    [toggleTheme, theme.dark]
  );

  return (
    <>
      <StatusBar style="auto" />
      <PreferencesContext.Provider value={preferences}>
        <PaperProvider theme={theme}>
          <Navigation theme={theme} />
        </PaperProvider>
      </PreferencesContext.Provider>
    </>
  );
}

import {
  createContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";
import {
  MD3DarkTheme,
  MD3LightTheme,
  adaptNavigationTheme,
} from "react-native-paper";
import { Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const PreferencesContext = createContext();

const THEME_STORAGE_KEY = "THEME";

export const useTheme = () => {
  const [isThemeDark, setIsThemeDark] = useState(
    Appearance.getColorScheme() === "dark"
  );

  const { LightTheme, DarkTheme } = useMemo(
    () =>
      adaptNavigationTheme({
        reactNavigationLight: NavigationDefaultTheme,
        reactNavigationDark: NavigationDarkTheme,
      }),
    []
  );

  const CombinedDefaultTheme = useMemo(() => {
    return {
      ...MD3LightTheme,
      ...LightTheme,
      colors: {
        ...MD3LightTheme.colors,
        ...LightTheme.colors,
      },
    };
  }, [LightTheme]);

  const CombinedDarkTheme = useMemo(() => {
    return {
      ...MD3DarkTheme,
      ...DarkTheme,
      colors: {
        ...MD3DarkTheme.colors,
        ...DarkTheme.colors,
      },
    };
  }, [DarkTheme]);

  const toggleTheme = useCallback(() => {
    const newTheme = !isThemeDark;
    setIsThemeDark(newTheme);
    AsyncStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(newTheme));
  }, [isThemeDark]);

  useEffect(() => {
    const getSavedTheme = async () => {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      setIsThemeDark(savedTheme ? JSON.parse(savedTheme) : false);
    };
    getSavedTheme();
  }, []);

  const theme = useMemo(() => {
    return isThemeDark ? CombinedDarkTheme : CombinedDefaultTheme;
  }, [isThemeDark, CombinedDarkTheme, CombinedDefaultTheme]);

  return { theme, toggleTheme, isThemeDark };
};

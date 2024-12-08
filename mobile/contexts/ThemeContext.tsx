import { createContext, useContext, useState, useEffect } from 'react';
import { TextStyle } from 'react-native';
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_400Regular_Italic,
  Montserrat_600SemiBold,
  Montserrat_900Black,
} from "@expo-google-fonts/dev";
import * as SplashScreen from 'expo-splash-screen';

type ThemeContextType = {
  textStyle: TextStyle;
};

const ThemeContext = createContext<ThemeContextType>({
  textStyle: { fontFamily: 'Montserrat_900Black' },
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [appIsReady, setAppIsReady] = useState(false);
  
  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_400Regular_Italic,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_900Black,
  });

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
      } catch (e) {
        console.warn(e);
      } finally {
        if (fontsLoaded) {
          setAppIsReady(true);
        }
      }
    }
    prepare();
  }, [fontsLoaded]);

  useEffect(() => {
    if (appIsReady) {
      const hideSplashScreen = async () => {
        await SplashScreen.hideAsync();
      };
      hideSplashScreen();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  const theme = {
    textStyle: { fontFamily: 'Montserrat_600SemiBold' },
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};
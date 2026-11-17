
import React, {
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';

export type ThemeColors = {
  background: string;
  card: string;
  cardSecondary: string;
  text: string;
  subText: string;
  primary: string;
  accent: string;
  border: string;
  hero: string;
  heroInner: string;
  buttonText: string;
};

type ThemeContextType = {
  colors: ThemeColors;
  isDark: boolean;
  toggleTheme: () => void;
  setDarkMode: (value: boolean) => void;
};

const darkColors: ThemeColors = {
  background: '#100D21',
  card: '#211936',
  cardSecondary: '#2D2247',
  text: '#FAF7FF',
  subText: '#B7A9D2',
  primary: '#A78BFA',
  accent: '#D9B8FF',
  border: '#3D315C',
  hero: '#553A99',
  heroInner: '#6A4AA9',
  buttonText: '#100D21',
};

const lightColors: ThemeColors = {
  background: '#F7F4FF',
  card: '#FFFFFF',
  cardSecondary: '#EEE8FC',
  text: '#292044',
  subText: '#766A96',
  primary: '#7548CC',
  accent: '#8754D9',
  border: '#E2D9F6',
  hero: '#8864D9',
  heroInner: '#9C7BE2',
  buttonText: '#FFFFFF',
};

const ThemeContext = createContext<
  ThemeContextType | undefined
>(undefined);

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDark, setIsDark] = useState(true);

  const colors = useMemo(
    () => (isDark ? darkColors : lightColors),
    [isDark]
  );

  const toggleTheme = () => {
    setIsDark((previous) => !previous);
  };

  const setDarkMode = (value: boolean) => {
    setIsDark(value);
  };

  return (
    <ThemeContext.Provider
      value={{
        colors,
        isDark,
        toggleTheme,
        setDarkMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      'useAppTheme must be used inside ThemeProvider'
    );
  }

  return context;
}

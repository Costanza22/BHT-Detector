import { StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 18,
    lineHeight: 26,
  },
  defaultSemiBold: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: 'bold',
    lineHeight: 28,
  },
  link: {
    lineHeight: 30,
    fontSize: 18,
    color: '#0a7ea4',
  },
});

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'camera.fill': 'camera-alt',
  'info.circle.fill': 'info',
  'photo.fill': 'photo',
  'camera.rotate.fill': 'flip-camera-ios',
  'exclamationmark.triangle.fill': 'warning',
  'checkmark.circle.fill': 'check-circle',
  'speaker.wave.2.fill': 'volume-up',
  'chevron.left': 'chevron-left',
  'person.fill': 'person',
  'link': 'link',
  'globe': 'language',
  'code.fill': 'code',
  'book.fill': 'menu-book',
  'square.and.arrow.up': 'share',
  'moon.fill': 'dark-mode',
  'sun.fill': 'light-mode',
  'xmark.circle.fill': 'cancel',
} as IconMapping;

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}

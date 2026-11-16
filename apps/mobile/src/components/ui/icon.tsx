import React from 'react';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

export type IconName =
  | 'home'
  | 'workouts'
  | 'nutrition'
  | 'progress'
  | 'profile'
  | 'spark'
  | 'bell'
  | 'chevron'
  | 'play'
  | 'clock'
  | 'fire'
  | 'drop'
  | 'steps'
  | 'plus'
  | 'search'
  | 'check'
  | 'send'
  | 'back'
  | 'more'
  | 'scale'
  | 'ruler'
  | 'trophy'
  | 'settings'
  | 'target'
  | 'calendar'
  | 'edit'
  | 'heart'
  | 'moon'
  | 'zap'
  | 'camera'
  | 'lock'
  | 'help'
  | 'logout';

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function Icon({
  name,
  size = 20,
  color = 'currentColor',
  strokeWidth = 1.8,
}: IconProps) {
  const renderPaths = () => {
    switch (name) {
      case 'home':
        return (
          <>
            <Path d="m3 11 9-8 9 8" />
            <Path d="M5.5 9.5V21h13V9.5M9 21v-6h6v6" />
          </>
        );
      case 'workouts':
        return <Path d="M6.5 7v10M17.5 7v10M3.5 9.5v5M20.5 9.5v5M6.5 12h11" />;
      case 'nutrition':
        return (
          <>
            <Path d="M12 21v-9" />
            <Path d="M12 12C6 12 4 8 4 3c5 0 8 2 8 7" />
            <Path d="M12 15c1-5 4-7 8-7 0 5-3 8-8 8" />
          </>
        );
      case 'progress':
        return (
          <>
            <Path d="M4 19V9M10 19V5M16 19v-7M22 19V3" />
            <Path d="M2 19h21" />
          </>
        );
      case 'profile':
        return (
          <>
            <Circle cx="12" cy="8" r="4" />
            <Path d="M4 21c.7-5 3.3-7 8-7s7.3 2 8 7" />
          </>
        );
      case 'spark':
        return (
          <>
            <Path d="m12 2 1.7 5.2L19 9l-5.3 1.8L12 16l-1.7-5.2L5 9l5.3-1.8L12 2Z" />
            <Path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" />
          </>
        );
      case 'bell':
        return (
          <>
            <Path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
            <Path d="M10 21h4" />
          </>
        );
      case 'chevron':
        return <Path d="m9 18 6-6-6-6" />;
      case 'play':
        return <Path d="m8 5 11 7-11 7V5Z" fill={color} />;
      case 'clock':
        return (
          <>
            <Circle cx="12" cy="12" r="9" />
            <Path d="M12 7v5l3 2" />
          </>
        );
      case 'fire':
        return (
          <Path d="M12 22c4 0 7-3 7-7 0-6-5-9-7-13 0 5-7 6-7 13 0 4 3 7 7 7Zm0-3c-2 0-3-1.3-3-3 0-2.5 2-3.5 3-5.5 0 2.5 3 3.3 3 5.5 0 1.7-1 3-3 3Z" />
        );
      case 'drop':
        return <Path d="M12 2S5 10 5 15a7 7 0 0 0 14 0c0-5-7-13-7-13Z" />;
      case 'steps':
        return (
          <>
            <Path d="M8 13c-2.5.8-4 2.4-3.4 4.2.7 2.1 3.4 2.5 5.2 1.2 2.1-1.4 1.3-6.1-1.8-5.4Z" />
            <Path d="M15 4c-2.5.8-4 2.4-3.4 4.2.7 2.1 3.4 2.5 5.2 1.2C19 8 18.1 3.3 15 4Z" />
          </>
        );
      case 'plus':
        return <Path d="M12 5v14M5 12h14" />;
      case 'search':
        return (
          <>
            <Circle cx="11" cy="11" r="7" />
            <Path d="m20 20-4-4" />
          </>
        );
      case 'check':
        return <Path d="m5 12 4 4L19 6" />;
      case 'send':
        return (
          <>
            <Path d="m3 3 18 9-18 9 3-9-3-9Z" />
            <Path d="M6 12h15" />
          </>
        );
      case 'back':
        return <Path d="m15 18-6-6 6-6" />;
      case 'more':
        return (
          <>
            <Circle cx="5" cy="12" r="1" fill={color} />
            <Circle cx="12" cy="12" r="1" fill={color} />
            <Circle cx="19" cy="12" r="1" fill={color} />
          </>
        );
      case 'scale':
        return (
          <>
            <Path d="M5 5h14l2 16H3L5 5Z" />
            <Path d="M9 9a3 3 0 0 1 6 0" />
          </>
        );
      case 'ruler':
        return (
          <>
            <Path d="m4 17 13-13 3 3L7 20l-3-3Z" />
            <Path d="m14 7 3 3M11 10l2 2M8 13l3 3" />
          </>
        );
      case 'trophy':
        return (
          <>
            <Path d="M8 4h8v5c0 3-1.5 5-4 5s-4-2-4-5V4Z" />
            <Path d="M8 6H4c0 4 1 6 5 6M16 6h4c0 4-1 6-5 6M12 14v4M8 21h8M9 18h6" />
          </>
        );
      case 'settings':
        return (
          <>
            <Circle cx="12" cy="12" r="3" />
            <Path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.6v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" />
          </>
        );
      case 'target':
        return (
          <>
            <Circle cx="12" cy="12" r="9" />
            <Circle cx="12" cy="12" r="5" />
            <Circle cx="12" cy="12" r="1" />
          </>
        );
      case 'calendar':
        return (
          <>
            <Rect x="3" y="5" width="18" height="16" rx="2" />
            <Path d="M7 3v4M17 3v4M3 10h18" />
          </>
        );
      case 'edit':
        return (
          <>
            <Path d="m14 5 5 5L8 21H3v-5L14 5Z" />
            <Path d="m12 7 5 5" />
          </>
        );
      case 'heart':
        return (
          <Path d="M20.8 5.6a5.5 5.5 0 0 0-7.8 0L12 6.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 22l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />
        );
      case 'moon':
        return <Path d="M20 15.5A8.5 8.5 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z" />;
      case 'zap':
        return <Path d="m13 2-9 12h8l-1 8 9-12h-8l1-8Z" />;
      case 'camera':
        return (
          <>
            <Path d="M4 7h4l1.5-2h5L16 7h4v13H4V7Z" />
            <Circle cx="12" cy="13" r="4" />
          </>
        );
      case 'lock':
        return (
          <>
            <Rect x="4" y="10" width="16" height="11" rx="2" />
            <Path d="M8 10V7a4 4 0 0 1 8 0v3" />
          </>
        );
      case 'help':
        return (
          <>
            <Circle cx="12" cy="12" r="9" />
            <Path d="M9.5 9a2.6 2.6 0 1 1 4 2.2c-1 .6-1.5 1.3-1.5 2.3M12 17h.01" />
          </>
        );
      case 'logout':
        return (
          <>
            <Path d="M10 4H4v16h6M14 8l4 4-4 4M8 12h10" />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {renderPaths()}
    </Svg>
  );
}

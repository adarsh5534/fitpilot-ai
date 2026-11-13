// Type declarations for CSS modules used by Expo web components
declare module '*.module.css' {
  const styles: { [className: string]: string };
  export default styles;
}

// Type declarations for global CSS imports
declare module '*.css' {
  const content: undefined;
  export default content;
}

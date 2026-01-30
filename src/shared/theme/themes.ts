import { tokens } from "./tokens";

export const lightTheme = {
  background: tokens.color.background,
  color: tokens.color.mainText,

  primary: tokens.color.primary,
  primaryText: tokens.color.mainText,
  secondary: tokens.color.secondary,

  active: tokens.color.primary,
  inactive: tokens.color.gray,

  borderColor: tokens.color.gray3,
};

export const darkTheme = {
  background: tokens.color.backgroundDark,
  color: tokens.color.mainTextDark,

  primary: tokens.color.primaryDark,
  primaryText: tokens.color.mainTextDark,
  secondary: tokens.color.secondaryDark,

  active: tokens.color.primaryDark,
  inactive: tokens.color.grayDark,

  borderColor: tokens.color.grayDark,
};

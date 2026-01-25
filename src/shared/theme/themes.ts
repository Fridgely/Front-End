import { tokens } from "./tokens";

export const lightTheme = {
  background: tokens.color.white,
  color: tokens.color.mainText,

  primary: tokens.color.primary,
  primaryText: tokens.color.white,

  active: tokens.color.primary,
  inactive: tokens.color.gray10,

  borderColor: tokens.color.gray3,
};

export const darkTheme = {
  background: tokens.color.mainText,
  color: tokens.color.gray1,

  primary: tokens.color.primary,
  primaryText: tokens.color.white,

  active: tokens.color.primary,
  inactive: tokens.color.gray10,

  borderColor: tokens.color.outline,
};

import { createTamagui } from "tamagui";
import { darkTheme, lightTheme } from "./src/theme/themes";
import { tokens } from "./src/theme/tokens";

export const tamaguiConfig = createTamagui({
  tokens,
  themes: {
    light: lightTheme,
    dark: darkTheme,
  },
});

export default tamaguiConfig;

export type Conf = typeof tamaguiConfig;

declare module "tamagui" {
  interface TamaguiCustomConfig extends Conf {}
}

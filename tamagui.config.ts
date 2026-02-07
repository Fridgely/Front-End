import { shorthands } from "@tamagui/shorthands";
import { createTamagui } from "tamagui";
import { baeminFont, gyeonggiFont } from "./src/shared/theme/fonts";
import { darkTheme, lightTheme } from "./src/shared/theme/themes";
import { tokens } from "./src/shared/theme/tokens";

export const tamaguiConfig = createTamagui({
  tokens,
  shorthands,
  themes: {
    light: lightTheme,
    dark: darkTheme,
  },
  fonts: {
    body: gyeonggiFont,
    heading: gyeonggiFont,
    baemin: baeminFont,
  },
});

export default tamaguiConfig;

export type Conf = typeof tamaguiConfig;

declare module "tamagui" {
  interface TamaguiCustomConfig extends Conf {}
}

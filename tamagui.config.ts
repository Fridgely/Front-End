import { createAnimations } from "@tamagui/animations-react-native";
import { shorthands } from "@tamagui/shorthands";
import { createTamagui } from "tamagui";
import { baeminFont, gyeonggiFont } from "./src/shared/theme/fonts";
import { darkTheme, lightTheme } from "./src/shared/theme/themes";
import { tokens } from "./src/shared/theme/tokens";

export const tamaguiConfig = createTamagui({
  tokens,
  shorthands,
  animations: createAnimations({
    bouncy: {
      type: "spring",
      damping: 10,
      mass: 1,
      stiffness: 100,
    },
    lazy: {
      type: "spring",
      damping: 20,
      mass: 1,
      stiffness: 60,
    },
    quick: {
      type: "spring",
      damping: 20,
      mass: 1,
      stiffness: 250,
    },
  }),
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

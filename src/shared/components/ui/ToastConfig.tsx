import { ToastConfig } from "react-native-toast-message";
import { Text, XStack, YStack } from "tamagui";

export const toastConfig: ToastConfig = {
  success: ({ text1, text2 }) => (
    <XStack
      width="92%"
      backgroundColor="$surface"
      px="$4"
      py="$3"
      borderRadius="$3"
      borderLeftWidth={6}
      borderLeftColor="$success"
      alignItems="center"
      elevation={10}
      shadowColor="$black"
      shadowOffset={{ width: 0, height: 4 }}
      shadowOpacity={0.1}
      shadowRadius={8}
    >
      <YStack flex={1} gap="$1">
        <Text color="$gray12" fontWeight="700" fontSize="$4">
          {text1}
        </Text>
        {text2 && (
          <Text color="$gray10" fontSize="$2">
            {text2}
          </Text>
        )}
      </YStack>
    </XStack>
  ),

  error: ({ text1, text2 }) => (
    <XStack
      width="92%"
      backgroundColor="$surface"
      px="$4"
      py="$3"
      borderRadius="$3"
      borderLeftWidth={6}
      borderLeftColor="$warning"
      alignItems="center"
      elevation={10}
    >
      <YStack flex={1} gap="$1">
        <Text color="$gray12" fontWeight="700" fontSize="$4">
          {text1}
        </Text>
        {text2 && (
          <Text color="$gray10" fontSize="$2">
            {text2}
          </Text>
        )}
      </YStack>
    </XStack>
  ),
};

import { AlertTriangle } from "@tamagui/lucide-icons";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Modal, Pressable, StyleSheet } from "react-native";
import { Button, Paragraph, Text, View, YStack } from "tamagui";
import { ConfirmModalProps } from "./ConfirmModal.types";

export const ConfirmModal = ({
  open,
  onOpenChange,
  title,
  description,
  confirmText,
  onConfirm,
  confirmColor = "$warning",
  closeOnConfirm = true,
  confirmDisabled = false,
}: ConfirmModalProps) => {
  const [rendered, setRendered] = useState(open);
  const progress = useRef(new Animated.Value(open ? 1 : 0)).current;

  useEffect(() => {
    if (open) {
      setRendered(true);
      Animated.timing(progress, {
        toValue: 1,
        duration: 170,
        useNativeDriver: true,
      }).start();
      return;
    }

    Animated.timing(progress, {
      toValue: 0,
      duration: 110,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) setRendered(false);
    });
  }, [open, progress]);

  const overlayStyle = useMemo(
    () => ({
      opacity: progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
    }),
    [progress],
  );

  const contentStyle = useMemo(
    () => ({
      opacity: progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
      transform: [
        {
          translateY: progress.interpolate({
            inputRange: [0, 1],
            outputRange: [8, 0],
          }),
        },
        {
          scale: progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0.98, 1],
          }),
        },
      ],
    }),
    [progress],
  );

  return (
    <Modal
      visible={rendered}
      transparent
      animationType="none"
      onRequestClose={() => onOpenChange(false)}
      statusBarTranslucent
    >
      <YStack f={1} jc="center" ai="center">
        <Pressable style={styles.backdrop} onPress={() => onOpenChange(false)}>
          <Animated.View style={[styles.overlay, overlayStyle]} />
        </Pressable>

        <Animated.View style={contentStyle}>
          <YStack
            key="confirm-modal"
            width="80%"
            maxWidth={360}
            borderRadius="$5"
            padding="$5"
            backgroundColor="$background"
            // 기존 Dialog의 bordered/elevate 느낌만 아주 약하게 유지
            shadowColor="$black"
            shadowOpacity={0.12}
            shadowRadius={10}
            shadowOffset={{ width: 0, height: 6 }}
          >
            <YStack ai="center" gap="$3">
              <View backgroundColor="$warningBackground" p="$4" br={100}>
                <AlertTriangle size={40} color="$warning" />
              </View>

              <YStack ai="center" gap="$2">
                <Text
                  fontSize="$6"
                  fontWeight="700"
                  textAlign="center"
                  color="$mainText"
                  fontFamily="$baemin"
                >
                  {title}
                </Text>
                <Paragraph
                  textAlign="center"
                  color="$gray10"
                  fontSize="$4"
                  lineHeight={22}
                  fontFamily="$baemin"
                >
                  {description}
                </Paragraph>
              </YStack>

              <YStack w="100%" gap="$2" mt="$2">
                <Button
                  size="$5"
                  backgroundColor={confirmColor}
                  disabled={confirmDisabled}
                  onPress={() => {
                    onConfirm();
                    if (closeOnConfirm) {
                      onOpenChange(false);
                    }
                  }}
                  pressStyle={{ opacity: 0.8, scale: 0.98 }}
                  br="$2"
                >
                  <Text color="$white" fontWeight="700" fontSize="$5">
                    {confirmText}
                  </Text>
                </Button>

                <Button
                  size="$5"
                  backgroundColor="$gray3"
                  chromeless
                  br="$2"
                  onPress={() => onOpenChange(false)}
                >
                  <Text color="$mainText" fontWeight="700" fontSize="$5">
                    취소
                  </Text>
                </Button>
              </YStack>
            </YStack>
          </YStack>
        </Animated.View>
      </YStack>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});

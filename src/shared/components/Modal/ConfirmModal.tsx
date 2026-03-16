import { AlertTriangle } from "@tamagui/lucide-icons";
import React from "react";
import { Button, Dialog, Paragraph, Text, View, YStack } from "tamagui";
import { ConfirmModalProps } from "./ConfirmModal.types";

export const ConfirmModal = ({
  open,
  onOpenChange,
  title,
  description,
  confirmText,
  onConfirm,
  confirmColor = "$warning",
}: ConfirmModalProps) => {
  return (
    <Dialog modal open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          animation="quick"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
          backgroundColor="black"
        />
        <Dialog.Content
          bordered
          elevate
          key="content"
          animation={[
            "quick",
            {
              opacity: { overshootClamping: true },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          x={0}
          scale={1}
          opacity={1}
          width="85%"
          maxWidth={400}
          borderRadius="$5"
          padding="$5"
          backgroundColor="$background"
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
                onPress={() => {
                  onConfirm();
                  onOpenChange(false);
                }}
                pressStyle={{ opacity: 0.8, scale: 0.98 }}
                br="$2"
              >
                <Text color="white" fontWeight="700" fontSize="$5">
                  {confirmText}
                </Text>
              </Button>

              <Dialog.Close asChild>
                <Button size="$5" backgroundColor="$gray3" chromeless br="$2">
                  <Text color="$mainText" fontWeight="700" fontSize="$5">
                    취소
                  </Text>
                </Button>
              </Dialog.Close>
            </YStack>
          </YStack>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
};

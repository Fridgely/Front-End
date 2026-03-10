import { Copy, MessageCircle, X } from "@tamagui/lucide-icons";
import React from "react";
import { Modal } from "react-native";
import { Button, Text, View, XStack, YStack } from "tamagui";
import { InviteModalProps } from "../types";

export const InviteModal = ({
  visible,
  onClose,
  inviteCode,
  onCopy,
  expirationAt,
  onShareKakao,
}: InviteModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View f={1} jc="center" ai="center" bg="rgba(0,0,0,0.5)" px="$6">
        <YStack
          bg="$background"
          w="100%"
          br="$4"
          p="$6"
          ai="center"
          gap="$5"
          elevation={10}
        >
          <XStack w="100%" jc="flex-end">
            <X size={24} color="$gray10" onPress={onClose} />
          </XStack>

          <YStack ai="center" gap="$2">
            <Text fontSize="$6" fontWeight="900" fontFamily="$baemin">
              멤버 초대하기
            </Text>
            <Text
              color="$gray10"
              textAlign="center"
              fontSize="$4"
              lineHeight={20}
            >
              이 코드를 멤버에게 공유하여 함께{"\n"}냉장고를 관리하세요.
            </Text>
          </YStack>

          <YStack
            w="100%"
            py="$6"
            px="$4"
            bg="$blue1"
            br="$5"
            bw={1}
            bc="$blue5"
            borderStyle="dashed"
            ai="center"
            gap="$2"
          >
            <Text color="$blue10" fontSize={12} fontWeight="700" ls={1}>
              INVITATION CODE
            </Text>
            <Text fontSize={32} fontWeight="900" fontFamily="$baemin" ls={2}>
              {inviteCode}
            </Text>
          </YStack>

          <Text color="$gray9" fontSize={12}>
            이 코드는 발급 후 24시간 동안 유효합니다.
          </Text>

          <YStack w="100%" gap="$3">
            <Button
              bg="#FEE500"
              h={56}
              br="$4"
              pressStyle={{ opacity: 0.8 }}
              onPress={onShareKakao}
              icon={<MessageCircle size={20} color="black" fill="black" />}
            >
              <Text fontWeight="700" color="black">
                카카오톡으로 공유
              </Text>
            </Button>

            <Button
              bg="$primary"
              h={56}
              br="$4"
              pressStyle={{ opacity: 0.8 }}
              onPress={onCopy}
              icon={<Copy size={20} color="white" />}
            >
              <Text color="white" fontWeight="700">
                코드 복사하기
              </Text>
            </Button>

            <Button chromeless onPress={onClose} mt="$1">
              <Text color="$gray">나중에 하기</Text>
            </Button>
          </YStack>
        </YStack>
      </View>
    </Modal>
  );
};

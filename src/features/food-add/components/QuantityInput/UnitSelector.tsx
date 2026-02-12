import { ChevronDown } from "@tamagui/lucide-icons";
import React, { useState } from "react";
import { Modal } from "react-native";
import {
  AnimatePresence,
  Button,
  Text,
  View,
  XStack,
  YStack,
  styled,
} from "tamagui";

// 배경 오버레이
const Overlay = styled(View, {
  name: "Overlay",
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  animation: "quick", // 부드럽고 빠른 전환
  enterStyle: { opacity: 0 },
  exitStyle: { opacity: 0 },
});

export const UnitSelector = ({ value, onChange }: any) => {
  const [show, setShow] = useState(false);
  const units = ["개", "팩", "병", "봉지", "g", "kg", "ml", "L"];

  return (
    <>
      <Button
        h={52}
        minWidth={90}
        bg="$gray3"
        br="$4"
        onPress={() => setShow(true)}
        iconAfter={<ChevronDown size={16} color="$gray9" />}
      >
        <Text fontSize="$4" color="$mainText" fontFamily="$baemin">
          {value}
        </Text>
      </Button>

      <Modal
        visible={show}
        transparent
        animationType="none"
        onRequestClose={() => setShow(false)}
      >
        <YStack f={1} jc="flex-end">
          <AnimatePresence>
            {show && (
              <>
                <Overlay key="overlay" onPress={() => setShow(false)} />

                <YStack
                  key="unit-sheet"
                  bg="$background"
                  p="$5"
                  pb="$10"
                  gap="$4"
                  br="$6"
                  borderBottomLeftRadius={0}
                  borderBottomRightRadius={0}
                  zIndex={100}
                  animation="quick"
                  enterStyle={{ y: 50, opacity: 0 }}
                  exitStyle={{ y: 50, opacity: 0 }}
                  y={0}
                  opacity={1}
                >
                  <View
                    w={40}
                    h={5}
                    bg="$gray4"
                    br="$4"
                    alignSelf="center"
                    mb="$2"
                  />
                  <Text fontSize="$5" fontWeight="700" fontFamily="$baemin">
                    단위 선택
                  </Text>

                  <XStack flexWrap="wrap" gap="$2">
                    {units.map((unit) => (
                      <Button
                        key={unit}
                        onPress={() => {
                          onChange(unit);
                          setShow(false);
                        }}
                        bg={value === unit ? "$primary" : "$gray3"}
                        br="$4"
                        px="$4"
                        h={45}
                        pressStyle={{ scale: 0.95 }}
                      >
                        <Text color="$mainText" fontWeight="700">
                          {unit}
                        </Text>
                      </Button>
                    ))}
                  </XStack>
                </YStack>
              </>
            )}
          </AnimatePresence>
        </YStack>
      </Modal>
    </>
  );
};

import DateTimePicker from "@react-native-community/datetimepicker";
import React from "react";
import { Modal, Platform } from "react-native";
import {
  AnimatePresence,
  Button,
  Text,
  View,
  XStack,
  YStack,
  styled,
} from "tamagui";
import { DateSelectSheetProps } from "../../types";

const Overlay = styled(View, {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  animation: "quick",
  enterStyle: { opacity: 0 },
  exitStyle: { opacity: 0 },
});

export const DateSelectSheet = ({
  show,
  onClose,
  value,
  onChange,
}: DateSelectSheetProps) => {
  const safeDate = React.useMemo(() => {
    const date = new Date(value);
    return isNaN(date.getTime()) ? new Date() : date;
  }, [value]);

  // 2. 서버 포맷 변환 함수
  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      // 안드로이드는 사용자가 날짜를 선택하거나 취소하면 바로 종료
      onClose();
      if (event.type === "set" && selectedDate) {
        onChange(selectedDate);
      }
    } else {
      // iOS는 '확인' 버튼을 누를 때 처리
      if (selectedDate) onChange(selectedDate);
    }
  };

  if (Platform.OS === "android") {
    return show ? (
      <DateTimePicker
        value={safeDate}
        mode="date"
        display="default" // 안드로이드 표준 달력
        onChange={handleDateChange}
      />
    ) : null;
  }

  return (
    <Modal
      visible={show}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <YStack f={1} jc="flex-end">
        <AnimatePresence>
          {show && (
            <>
              <Overlay key="date-overlay" onPress={onClose} />
              <YStack
                key="date-sheet"
                bg="$background"
                pb="$8"
                br="$6"
                borderBottomLeftRadius={0}
                borderBottomRightRadius={0}
                animation="quick"
                enterStyle={{ y: 500, opacity: 0 }}
                exitStyle={{ y: 500, opacity: 0 }}
                y={0}
                opacity={1}
              >
                <View
                  w={40}
                  h={5}
                  bg="$gray5"
                  br="$4"
                  alignSelf="center"
                  mt="$3"
                  mb="$1"
                />
                <XStack jc="space-between" ai="center" p="$4">
                  <Button chromeless onPress={onClose}>
                    <Text color="$gray10">취소</Text>
                  </Button>
                  <Text fontWeight="800" fontSize="$5">
                    날짜 선택
                  </Text>
                  <Button chromeless onPress={onClose}>
                    <Text color="$primary" fontWeight="800">
                      확인
                    </Text>
                  </Button>
                </XStack>
                <View px="$4" py="$2">
                  <DateTimePicker
                    value={safeDate}
                    mode="date"
                    display="spinner"
                    locale="ko-KR"
                    onChange={handleDateChange}
                  />
                </View>
              </YStack>
            </>
          )}
        </AnimatePresence>
      </YStack>
    </Modal>
  );
};

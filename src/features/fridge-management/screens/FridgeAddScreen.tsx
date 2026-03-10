import { Header } from "@/shared/components/Header/Header";
import { useState } from "react";
import { Button, Input, Text, YStack } from "tamagui";
import { useJoinFridgeByInviteCodeMutation } from "../hooks/mutations/useJoinFridgeByInviteCodeMutation";

export function FridgeAddScreen() {
  const [inviteCode, setInviteCode] = useState("");
  const { mutate: joinFridge, isPending } = useJoinFridgeByInviteCodeMutation();

  const handleTextChange = (text: string) => {
    // 입력되는 즉시 대문자로 변환
    setInviteCode(text.toUpperCase());
  };

  const handleJoin = () => {
    if (inviteCode.length !== 8) return;

    joinFridge({ code: inviteCode });
  };

  return (
    <YStack f={1} bg="$background">
      <Header title="냉장고 추가" showBackButton />
      <YStack p="$5" gap="$5">
        <YStack gap="$2">
          <Text fontSize="$6" fontWeight="700" fontFamily="$baemin">
            초대코드를 입력해주세요
          </Text>
          <Text color="$gray10">
            전달받은 코드를 입력하면 냉장고에 참여할 수 있어요.
          </Text>
        </YStack>

        <Input
          fontFamily="$baemin"
          h={60}
          br="$4"
          fontSize="$5"
          placeholder="초대코드 입력"
          value={inviteCode}
          onChangeText={handleTextChange}
          autoCapitalize="characters" // 대문자 자동 전환
          maxLength={8}
        />

        <Button
          bc="$primary"
          color="white"
          h={56}
          br="$4"
          fontWeight="700"
          fontSize="$4"
          onPress={handleJoin}
        >
          참여하기
        </Button>
      </YStack>
    </YStack>
  );
}

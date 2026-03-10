import { Header } from "@/shared/components/Header/Header";
import { ChevronDown, Refrigerator } from "@tamagui/lucide-icons";
import * as Clipboard from "expo-clipboard";
import * as Linking from "expo-linking";
import { useEffect, useMemo, useState } from "react";
import Toast from "react-native-toast-message";
import {
  Button,
  ScrollView,
  Spinner,
  Text,
  View,
  XStack,
  YStack,
} from "tamagui";
import { FridgeNameEditSheet } from "../components/FridgeNameEditSheet";
import { FridgeSelectionSheet } from "../components/FridgeSelectionSheet";
import { InviteModal } from "../components/InviteModal";
import { MemberItem } from "../components/MemberItem";
import { useGenerateInviteCodeMutation } from "../hooks/mutations/useGenerateInviteCodeMutation";
import { useUpdateFridgeNameMutation } from "../hooks/mutations/useUpdateFridgeNameMutation";
import { useFridgeDetailQuery } from "../hooks/queries/useFridgeDetailQuery";
import { useFridgeListQuery } from "../hooks/queries/useFridgeListQuery";
import { useFridgeMembersQuery } from "../hooks/queries/useFridgeMembersQuery";

// NOTE: 카카오톡 공유 기능은 후에 고도화 예정

export function FridgeManagementScreen() {
  const [isSheetOpen, setSheetOpen] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { data: fridgeList } = useFridgeListQuery();
  const fridges = useMemo(() => fridgeList?.data || [], [fridgeList]);
  const { data: fridgeInfo, isLoading: isDetailLoading } = useFridgeDetailQuery(
    selectedId ?? 0,
  );
  const { mutate: updateName } = useUpdateFridgeNameMutation(selectedId ?? 0);
  const [isEditSheetOpen, setEditSheetOpen] = useState(false);
  const [isInviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteData, setInviteData] = useState({
    code: "",
    expirationAt: new Date(),
  });
  const { mutate: generateInviteCode, isPending: isGenerating } =
    useGenerateInviteCodeMutation(selectedId ?? 0);
  const { data: membersData, isLoading: isMembersLoading } =
    useFridgeMembersQuery(selectedId ?? 0);
  const members = useMemo(() => membersData?.data || [], [membersData]);

  useEffect(() => {
    if (fridges.length > 0 && selectedId === null) {
      setSelectedId(fridges[0].id);
    }
  }, [fridges, selectedId]);

  const handleEditName = () => {
    setEditSheetOpen(true);
  };

  const handleGenerateInviteCode = () => {
    generateInviteCode(undefined, {
      onSuccess: (res) => {
        if (res.result === "SUCCESS") {
          setInviteData({
            code: res.data.code,
            expirationAt: new Date(res.data.expirationAt),
          });
          setInviteModalOpen(true);
        }
      },
      onError: (error) => {
        Toast.show({
          type: "error",
          text1: "초대 코드 생성 실패",
          text2: "잠시 후 다시 시도해주세요.",
        });
      },
    });
  };

  const handleShareKakao = async () => {
    if (!inviteData.code) return;

    const message = `[Fridgely] 냉장고 초대 코드\n\n멤버님이 당신을 냉장고 관리 그룹에 초대했습니다!\n\n초대코드: ${inviteData.code}\n유효기간: 24시간 이내`;

    const encodedMessage = encodeURIComponent(message);
    const kakaoUrl = `kakaolink://send?text=${encodedMessage}`;

    try {
      const supported = await Linking.canOpenURL(kakaoUrl);
      if (supported) {
        await Linking.openURL(kakaoUrl);
      } else {
        alert("카카오톡이 설치되어 있지 않습니다.");
      }
    } catch (error) {
      console.error("카카오톡 공유 에러:", error);
    }
  };

  const handleCopyCode = async () => {
    if (!inviteData.code) return;

    try {
      await Clipboard.setStringAsync(inviteData.code);

      Toast.show({
        type: "success",
        text1: "복사 완료",
        text2: "클립보드에 초대 코드가 복사되었습니다.",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "복사 실패",
        text2: "다시 시도해주세요.",
      });
    }
  };

  return (
    <YStack f={1} backgroundColor="$background">
      <Header title="냉장고 관리" showBackButton />

      <ScrollView f={1} contentContainerStyle={{ pb: "$10" }}>
        {isDetailLoading && !fridgeInfo && isMembersLoading ? (
          <YStack py="$20" ai="center">
            <Spinner color="$primary" />
          </YStack>
        ) : (
          fridgeInfo && (
            <>
              <YStack ai="center" py="$8" gap="$3">
                <View p="$4" br="$6" bc="$white" mb="$2">
                  <Refrigerator size={48} color="$primary" />
                </View>

                <XStack
                  ai="center"
                  gap="$2"
                  onPress={() => setSheetOpen(true)}
                  pressStyle={{ opacity: 0.7 }}
                >
                  <Text fontSize={24} fontWeight="900" fontFamily="$baemin">
                    {fridgeInfo.data.name}
                  </Text>
                  <ChevronDown size={20} color="$mainText" />
                </XStack>
              </YStack>

              <YStack px="$5" gap="$3">
                <XStack jc="space-between" ai="center">
                  <Text fontSize={16} fontWeight="700" fontFamily="$baemin">
                    참여 멤버
                  </Text>
                  <Text color="$gray9" fontSize={14}>
                    {members.length}명
                  </Text>
                </XStack>

                <YStack bc="$gray3" br="$5" ov="hidden">
                  {members.map((member, index) => (
                    <MemberItem
                      key={member.memberId}
                      member={member}
                      isLast={index === (members?.length || 0) - 1}
                    />
                  ))}
                </YStack>
              </YStack>

              <YStack px="$5" mt="$6" gap="$5">
                <Button
                  bc="$primary"
                  color="white"
                  h={56}
                  br="$4"
                  fontWeight="700"
                  fontSize={16}
                  onPress={handleGenerateInviteCode}
                  disabled={isGenerating}
                >
                  초대 코드 생성
                </Button>

                <YStack ai="center" gap="$4" py="$2">
                  <Text color="$gray10" fontSize={14}>
                    냉장고 나가기
                  </Text>
                  {fridgeInfo.data.isOwner && (
                    <Text
                      color="$gray10"
                      fontSize={14}
                      onPress={handleEditName}
                    >
                      냉장고 이름 수정
                    </Text>
                  )}
                  {fridgeInfo.data.isOwner && (
                    <Text color="$warning" fontSize={14}>
                      냉장고 삭제
                    </Text>
                  )}
                </YStack>
              </YStack>
            </>
          )
        )}
      </ScrollView>

      <FridgeSelectionSheet
        visible={isSheetOpen}
        onClose={() => setSheetOpen(false)}
        fridges={fridges}
        selectedId={selectedId || 0}
        onSelect={(id) => {
          setSelectedId(id);
          setSheetOpen(false);
        }}
      />
      <FridgeNameEditSheet
        visible={isEditSheetOpen}
        onClose={() => setEditSheetOpen(false)}
        currentName={fridgeInfo?.data.name || ""}
        onSave={(newName) => {
          updateName({ newName: newName });
          setEditSheetOpen(false);
        }}
      />
      <InviteModal
        visible={isInviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        inviteCode={inviteData.code}
        expirationAt={inviteData.expirationAt}
        onCopy={handleCopyCode}
        onShareKakao={handleShareKakao}
      />
    </YStack>
  );
}

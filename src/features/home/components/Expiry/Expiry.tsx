import { AlertCircle, AlertTriangle, CheckCircle } from "@tamagui/lucide-icons";
import { Card, Separator, XStack } from "tamagui";
import { ExpiryProps } from "../../types";
import { StatusItem } from "./StatusItem";

export function Expiry({ activeStatus, onStatusChange }: ExpiryProps) {
  return (
    <Card
      elevate
      bordered
      backgroundColor="white"
      borderRadius="$3"
      p="$4"
      mx="$4"
    >
      <XStack jc="space-around" ai="center">
        <StatusItem
          icon={<AlertCircle size={14} color="$warning" />}
          label="임박"
          count="3"
          sub="10일 이내"
          color="$warning"
          onPress={() => onStatusChange("RED")}
          opacity={activeStatus && activeStatus !== "RED" ? 0.3 : 1}
        />
        <Separator vertical height={60} opacity={1} />
        <StatusItem
          icon={<AlertTriangle size={14} color="$alert" />}
          label="주의"
          count="6"
          sub="20일 이내"
          color="$alert"
          onPress={() => onStatusChange("YELLOW")}
          opacity={activeStatus && activeStatus !== "YELLOW" ? 0.3 : 1}
        />
        <Separator vertical height={60} opacity={1} />
        <StatusItem
          icon={<CheckCircle size={14} color="$success" />}
          label="양호"
          count="12"
          sub="양호"
          color="$success"
          onPress={() => onStatusChange("GREEN")}
          opacity={activeStatus && activeStatus !== "GREEN" ? 0.3 : 1}
        />
      </XStack>
    </Card>
  );
}

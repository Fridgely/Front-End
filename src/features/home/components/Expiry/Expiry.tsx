import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "@tamagui/lucide-icons";
import { Card, Separator, XStack } from "tamagui";
import { ExpiryProps } from "../../types";
import { StatusItem } from "./StatusItem";

export function Expiry({ activeStatus, onStatusChange, counts }: ExpiryProps) {
  return (
    <Card
      elevate
      bordered
      backgroundColor="$surface"
      borderRadius="$3"
      p="$4"
      mx="$4"
    >
      <XStack jc="space-around" ai="center">
        <StatusItem
          icon={<XCircle size={14} color="$expired" />}
          label="만료"
          count={counts.BLACK.toString()}
          sub="만료"
          color="$expired"
          onPress={() => onStatusChange("BLACK")}
          opacity={activeStatus && activeStatus !== "BLACK" ? 0.3 : 1}
        />
        <Separator vertical height={60} opacity={1} />
        <StatusItem
          icon={<AlertCircle size={14} color="$warning" />}
          label="임박"
          count={counts.RED.toString()}
          sub="10일 이내"
          color="$warning"
          onPress={() => onStatusChange("RED")}
          opacity={activeStatus && activeStatus !== "RED" ? 0.3 : 1}
        />
        <Separator vertical height={60} opacity={1} />
        <StatusItem
          icon={<AlertTriangle size={14} color="$alert" />}
          label="주의"
          count={counts.YELLOW.toString()}
          sub="20일 이내"
          color="$alert"
          onPress={() => onStatusChange("YELLOW")}
          opacity={activeStatus && activeStatus !== "YELLOW" ? 0.3 : 1}
        />
        <Separator vertical height={60} opacity={1} />
        <StatusItem
          icon={<CheckCircle size={14} color="$success" />}
          label="양호"
          count={counts.GREEN.toString()}
          sub="양호"
          color="$success"
          onPress={() => onStatusChange("GREEN")}
          opacity={activeStatus && activeStatus !== "GREEN" ? 0.3 : 1}
        />
      </XStack>
    </Card>
  );
}

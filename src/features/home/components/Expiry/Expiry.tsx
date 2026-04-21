import { ms, rv, s } from "@/shared/constants/layout";
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
      p={rv({ sm: "$2", md: "$3", lg: "$3" })}
      mx="$4"
    >
      <XStack ai="stretch" jc="space-between">
        <XStack f={1} minWidth={0} jc="center">
          <StatusItem
            icon={<XCircle size={s(13)} color="$expired" />}
            label="만료"
            count={counts.BLACK.toString()}
            sub="만료"
            color="$expired"
            onPress={() => onStatusChange("BLACK")}
            opacity={activeStatus && activeStatus !== "BLACK" ? 0.3 : 1}
          />
        </XStack>
        <Separator vertical height={ms(46)} opacity={1} />
        <XStack f={1} minWidth={0} jc="center">
          <StatusItem
            icon={<AlertCircle size={s(13)} color="$warning" />}
            label="임박"
            count={counts.RED.toString()}
            sub="10일 이내"
            color="$warning"
            onPress={() => onStatusChange("RED")}
            opacity={activeStatus && activeStatus !== "RED" ? 0.3 : 1}
          />
        </XStack>
        <Separator vertical height={ms(46)} opacity={1} />
        <XStack f={1} minWidth={0} jc="center">
          <StatusItem
            icon={<AlertTriangle size={s(13)} color="$alert" />}
            label="주의"
            count={counts.YELLOW.toString()}
            sub="20일 이내"
            color="$alert"
            onPress={() => onStatusChange("YELLOW")}
            opacity={activeStatus && activeStatus !== "YELLOW" ? 0.3 : 1}
          />
        </XStack>
        <Separator vertical height={ms(46)} opacity={1} />
        <XStack f={1} minWidth={0} jc="center">
          <StatusItem
            icon={<CheckCircle size={s(13)} color="$success" />}
            label="양호"
            count={counts.GREEN.toString()}
            sub="20일 이상"
            color="$success"
            onPress={() => onStatusChange("GREEN")}
            opacity={activeStatus && activeStatus !== "GREEN" ? 0.3 : 1}
          />
        </XStack>
      </XStack>
    </Card>
  );
}

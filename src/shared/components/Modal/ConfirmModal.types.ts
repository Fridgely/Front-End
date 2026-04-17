interface ConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText: string;
  onConfirm: () => void;
  confirmColor?: string;
  // false면 확인 후에도 열린 상태 유지 — 비동기 작업 끝난 뒤  닫기
  closeOnConfirm?: boolean;
  confirmDisabled?: boolean;
}

export { ConfirmModalProps };

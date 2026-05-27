interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  showNotificationBell?: boolean;
  /** 있으면 뒤로 버튼에서 `router.back()` 대신 실행 */
  onBackPress?: () => void;
}

export { HeaderProps };

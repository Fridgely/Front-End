import {
  useAuthActions,
  useIsAuthLoaded,
} from "@/features/auth/store/useAuthStore";
import { useThemeStore } from "@/shared/stores/useThemeStore";
import { useEffect, useState } from "react";

/**
 * 앱 구동 시 필요한 데이터(인증 상태, 테마 설정 등)를
 * 저장소에서 불러와 앱 상태와 Hydration하는 커스텀 훅입니다.
 */

export function useAppHydration() {
  const isAuthLoaded = useIsAuthLoaded();
  const { hydrate } = useAuthActions();
  const theme = useThemeStore((state) => state.theme);
  const [themeLoaded, setThemeLoaded] = useState(
    useThemeStore.persist.hasHydrated(),
  );

  useEffect(() => {
    let mounted = true;

    const unsubscribeThemeHydration = useThemeStore.persist.onFinishHydration(
      () => {
        if (mounted) {
          setThemeLoaded(true);
        }
      },
    );

    const initializeStores = async () => {
      try {
        await hydrate();
      } catch (error) {
        console.error("Auth hydration failed:", error);
      }

      try {
        if (!useThemeStore.persist.hasHydrated()) {
          await useThemeStore.persist.rehydrate();
        }
      } catch (error) {
        console.error("Theme hydration failed:", error);
      } finally {
        // 성공/실패 여부와 상관없이 최종적으로 하이드레이션 상태 확인 후 완료 처리
        if (mounted && useThemeStore.persist.hasHydrated()) {
          setThemeLoaded(true);
        }
      }
    };

    initializeStores();

    return () => {
      mounted = false;
      unsubscribeThemeHydration();
    };
  }, [hydrate]);

  return {
    isAuthLoaded,
    theme,
    themeLoaded,
    // 앱 전체 하이드레이션 완료 여부: 인증과 테마가 모두 준비되어야 true
    isHydrated: isAuthLoaded && themeLoaded,
  };
}

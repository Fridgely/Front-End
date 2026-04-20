export const DEFAULT_BOTTOM_SPACING = 24;

export function getBottomPaddingForSheet({
  bottomInset,
  extraSpacing = DEFAULT_BOTTOM_SPACING,
}: {
  bottomInset: number;
  extraSpacing?: number;
}) {
  return bottomInset + extraSpacing;
}


// @flow

export const FOLDING_ANIMATION_PART_KIND = {
  TOP_TO_BOTTOM: 'TOP_TO_BOTTOM',
  BOTTOM_TO_TOP: 'BOTTOM_TO_TOP',
  RIGHT_TO_LEFT: 'RIGHT_TO_LEFT',
};

export type FoldingAnimationPartKindType = $Keys<typeof FOLDING_ANIMATION_PART_KIND>;

export const SHADOW_BASE_SIZE = 30;

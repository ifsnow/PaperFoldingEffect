// @flow

import React from 'react';
import { View } from 'react-native';

import GradientRectangle, { GRADIENT_DIRECTION } from './GradientRectangle';

import { SHADOW_BASE_SIZE } from '~/types';

type Props = {|
  position: number,
  size: number,
  isVisible?: boolean,
|};

function PaperFoldingVerticalShadow({
  position,
  size,
  isVisible = true,
}: Props) {
  const containerStyle = {
    position: 'absolute',
    left: position,
    top: 0,
    zIndex: 10,
    flexDirection: 'row',
    opacity: isVisible ? 1 : 0,
  };

  return (
    <View style={containerStyle}>
      <GradientRectangle
        direction={GRADIENT_DIRECTION.HORIZONTAL}
        width={SHADOW_BASE_SIZE}
        height={size}
        startColor="rgba(255, 255, 255, 0)"
        endColor="rgba(0, 0, 0, 0.2)"
      />
      <GradientRectangle
        direction={GRADIENT_DIRECTION.HORIZONTAL}
        width={2}
        height={size}
        startColor="rgba(0, 0, 0, 0.2)"
        endColor="rgba(255, 255, 255, 0.5)"
      />
    </View>
  );
}

export default React.memo<Props>(PaperFoldingVerticalShadow);

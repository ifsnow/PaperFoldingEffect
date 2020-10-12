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

function PaperFoldingHorizontalShadow({
  position,
  size,
  isVisible = true,
}: Props) {
  const containerStyle = {
    position: 'absolute',
    left: 0,
    right: 0,
    top: position,
    opacity: isVisible ? 1 : 0,
  };

  return (
    <View style={containerStyle}>
      <GradientRectangle
        direction={GRADIENT_DIRECTION.VERTICAL}
        width={size}
        height={SHADOW_BASE_SIZE}
        startColor="rgba(255, 255, 255, 0)"
        endColor="rgba(0, 0, 0, 0.2)"
      />
      <GradientRectangle
        direction={GRADIENT_DIRECTION.VERTICAL}
        width={size}
        height={2}
        startColor="rgba(0, 0, 0, 0.2)"
        endColor="rgba(255, 255, 255, 0.5)"
      />
    </View>
  );
}

export default React.memo<Props>(PaperFoldingHorizontalShadow);

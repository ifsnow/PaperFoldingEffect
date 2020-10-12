// @flow
import React from 'react';
import {
  Surface,
  Shape,
  LinearGradient,
  Path,
} from '@react-native-community/art';

export const GRADIENT_DIRECTION = {
  HORIZONTAL: 'HORIZONTAL',
  VERTICAL: 'VERTICAL',
};

type GradientDirectionType = $Values<typeof GRADIENT_DIRECTION>;

type Props = {|
  direction: GradientDirectionType,
  width: number,
  height: number,
  startColor: string,
  endColor: string,
|};

function GradientRectangle({
  direction,
  width,
  height,
  startColor,
  endColor,
}: Props) {
  const fill = getFill(direction, width, height, startColor, endColor);
  const path = getPath(width, height);

  return (
    <Surface width={width} height={height}>
      <Shape
        width={width}
        height={height}
        fill={fill}
        d={path}
      />
    </Surface>
  );
}

const pathCache = {};

function getPath(width: number, height: number) {
  const cacheKey = `${width}-${height}`;
  const cachePath = pathCache[cacheKey];
  if (cachePath) {
    return cachePath;
  }

  const path = new Path()
    .moveTo(0, 0)
    .lineTo(width, 0)
    .lineTo(width, height)
    .lineTo(0, height);

  pathCache[cacheKey] = path;
  return path;
}

const fillCache = {};
function getFill(direction: GradientDirectionType, width: number, height: number, startColor: string, endColor: string) {
  const cacheKey = `${direction}-${width}-${height}-${startColor}-${endColor}`;
  const cacheFill = fillCache[cacheKey];
  if (cacheFill) {
    return cacheFill;
  }

  const colorSet = {
    // $FlowFixMe
    0: startColor,
    // $FlowFixMe
    1: endColor,
  };

  const fill = getLinearGradient(direction, colorSet, width, height);

  fillCache[cacheKey] = fill;
  return fill;
}

function getLinearGradient(direction: GradientDirectionType, colorSet: Object, width: number, height: number) {
  if (direction === GRADIENT_DIRECTION.HORIZONTAL) {
    return new LinearGradient(colorSet, 0, height / 2, width, height / 2);
  }

  if (direction === GRADIENT_DIRECTION.VERTICAL) {
    return new LinearGradient(colorSet, width / 2, 0, width / 2, height);
  }
}

export default React.memo<Props>(GradientRectangle);

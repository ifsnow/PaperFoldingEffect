// @flow

import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import {
  View,
  useWindowDimensions,
  StyleSheet,
  Image,
  PixelRatio,
} from 'react-native';
import { type ImageSource } from 'react-native/Libraries/Image/ImageSource';

import PaperFoldingAnimationPart from './PaperFoldingAnimationPart';
import PaperFoldingHorizontalShadow from './PaperFoldingHorizontalShadow';
import PaperFoldingVerticalShadow from './PaperFoldingVerticalShadow';

import {
  FOLDING_ANIMATION_PART_KIND,
  SHADOW_BASE_SIZE,
} from './types';

type Props = {|
  image: ImageSource,
  isEnabled: boolean,
|};

type StateType = {
  isUpFolding: boolean,
  isBottomFolding: boolean,
  isRightLeftFolding: boolean,
  hasUpShadow: boolean,
  hasBottomShadow: boolean,
  hasRightLeftShadow: boolean,
};

function PaperFoldingEffect({
  image,
  isEnabled,
}: Props) {
  const [state, setState] = useState<StateType>({
    isUpFolding: false,
    isBottomFolding: false,
    isRightLeftFolding: false,
    hasUpShadow: false,
    hasBottomShadow: false,
    hasRightLeftShadow: false,
  });

  const {
    width,
    height,
  } = useWindowDimensions();

  const {
    imageWidth,
    imageHeight,
    halfImageWidth,
    partHeight,
    imageStyle,
    upShadowPosition,
    bottomShadowPosition,
    rightLeftShadowPosition,
  } = useMemo(() => {
    const imageWidth = PixelRatio.roundToNearestPixel(width * 0.8);
    const imageHeight = PixelRatio.roundToNearestPixel(height * 0.8);
    const halfImageWidth = PixelRatio.roundToNearestPixel(imageWidth / 2);
    const partHeight = PixelRatio.roundToNearestPixel(imageHeight / 3);

    return {
      imageWidth,
      imageHeight,
      halfImageWidth,
      partHeight,
      imageStyle: {
        width: imageWidth,
        height: imageHeight,
      },
      upShadowPosition: partHeight - SHADOW_BASE_SIZE,
      bottomShadowPosition: imageHeight - partHeight - SHADOW_BASE_SIZE,
      rightLeftShadowPosition: halfImageWidth - SHADOW_BASE_SIZE,
    };
  }, [width, height]);

  const onShowShadow = useCallback(() => {
    setState(prevState => {
      if (prevState.isUpFolding) {
        return {
          ...prevState,
          hasUpShadow: true,
        };
      } else if (prevState.isBottomFolding) {
        return {
          ...prevState,
          hasBottomShadow: true,
        };
      } else if (prevState.isRightLeftFolding) {
        return {
          ...prevState,
          hasRightLeftShadow: true,
        };
      }

      return prevState;
    });
  }, []);

  const onEndAnimation = useCallback(() => {
    setState(prevState => {
      if (prevState.isUpFolding) {
        return {
          ...prevState,
          isUpFolding: false,
          isBottomFolding: true,
        };
      } else if (prevState.isBottomFolding) {
        return {
          ...prevState,
          isBottomFolding: false,
          isRightLeftFolding: true,
        };
      }

      return prevState;
    });
  }, []);

  useEffect(() => {
    if (isEnabled) {
      setState(prevState => ({
        ...prevState,
        isUpFolding: true,
      }));
    } else {
      setState({
        isUpFolding: false,
        isBottomFolding: false,
        isRightLeftFolding: false,
        hasUpShadow: false,
        hasBottomShadow: false,
        hasRightLeftShadow: false,
      });
    }
  }, [isEnabled]);

  return (
    <View style={styles.container}>
      <View>
        <Image source={image} style={imageStyle} />

        <PaperFoldingAnimationPart
          kind={FOLDING_ANIMATION_PART_KIND.TOP_TO_BOTTOM}
          image={image}
          imageWidth={imageWidth}
          imageHeight={imageHeight}
          y={0}
          width={imageWidth}
          height={partHeight}
          isAnimating={state.isUpFolding}
          onShowShadow={onShowShadow}
          onEndAnimation={onEndAnimation}
        />

        <PaperFoldingAnimationPart
          kind={FOLDING_ANIMATION_PART_KIND.BOTTOM_TO_TOP}
          image={image}
          imageWidth={imageWidth}
          imageHeight={imageHeight}
          y={imageHeight - partHeight}
          width={imageWidth}
          height={partHeight}
          isAnimating={state.isBottomFolding}
          onShowShadow={onShowShadow}
          onEndAnimation={onEndAnimation}
        />

        <PaperFoldingHorizontalShadow
          position={upShadowPosition}
          size={imageWidth}
          isVisible={state.hasUpShadow}
        />

        <PaperFoldingHorizontalShadow
          position={bottomShadowPosition}
          size={imageWidth}
          isVisible={state.hasBottomShadow}
        />

        <PaperFoldingAnimationPart
          kind={FOLDING_ANIMATION_PART_KIND.RIGHT_TO_LEFT}
          image={image}
          imageWidth={imageWidth}
          imageHeight={imageHeight}
          x={halfImageWidth}
          y={0}
          width={halfImageWidth}
          height={imageHeight}
          isAnimating={state.isRightLeftFolding}
          onShowShadow={onShowShadow}
          isVisible={state.isRightLeftFolding}
          onEndAnimation={onEndAnimation}
        >
          <PaperFoldingHorizontalShadow
            position={upShadowPosition}
            size={halfImageWidth}
          />

          <PaperFoldingHorizontalShadow
            position={bottomShadowPosition}
            size={halfImageWidth}
          />
        </PaperFoldingAnimationPart>

        <PaperFoldingVerticalShadow
          position={rightLeftShadowPosition}
          size={imageHeight}
          isVisible={state.hasRightLeftShadow}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PaperFoldingEffect;

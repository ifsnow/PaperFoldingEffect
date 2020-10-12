// @flow

import React, {
  useMemo,
  useEffect,
  useCallback,
  useRef,
  useState,
} from 'react';

import {
  Animated,
  Image,
  View,
  Platform,
} from 'react-native';

import TransformUtil from './TransformUtil';
import {
  FOLDING_ANIMATION_PART_KIND,
  type FoldingAnimationPartKindType,
} from './types';

const IS_ANDROID = Platform.OS === 'android';

const PERSPECTIVE = IS_ANDROID ? 25000 : 1500;

type Props = {|
  kind: FoldingAnimationPartKindType,
  image: any,
  imageWidth: number,
  imageHeight: number,
  x?: number,
  y?: number,
  width: number,
  height: number,
  isAnimating: boolean,
  isVisible?: boolean,
  onShowShadow: () => mixed,
  onEndAnimation: () => mixed,
  children?: React$Node[],
|};

function PaperFoldingAnimationPart({
  kind,
  image,
  imageWidth,
  imageHeight,
  x = 0,
  y = 0,
  width,
  height,
  isAnimating,
  isVisible = true,
  onShowShadow,
  onEndAnimation,
  children,
}: Props) {
  const imageViewRef = useRef();
  const backViewRef = useRef();
  const [isImageLoaded, setImageLoaded] = useState(false);

  const {
    animationValue,
    startAnimation,
    transformBasePosition,
    containerStyle,
    backContainerStyle,
    backViewStyle,
    imageStyle,
  } = useMemo(() => {
    const animationValue = new Animated.Value(0);
    const startAnimation = (toValue: number, duration: number) => new Promise(resolve => {
      Animated.timing(animationValue, {
        toValue,
        duration,
        useNativeDriver: true,
        overshootClamping: true,
      }).start(() => {
        resolve();
      });
    });

    let transformBasePosition = 0;
    if (kind === FOLDING_ANIMATION_PART_KIND.TOP_TO_BOTTOM) {
      transformBasePosition = (imageHeight / 6) + (IS_ANDROID ? -0.5 : 0);
    } else if (kind === FOLDING_ANIMATION_PART_KIND.BOTTOM_TO_TOP) {
      transformBasePosition = -1 * (imageHeight / 6) + (IS_ANDROID ? 0.5 : 0);
    } else if (kind === FOLDING_ANIMATION_PART_KIND.RIGHT_TO_LEFT) {
      transformBasePosition = -1 * (imageWidth / 4) + (IS_ANDROID ? 0.5 : 0);
    }

    return {
      animationValue,
      startAnimation,
      transformBasePosition,
      containerStyle: {
        position: 'absolute',
        width,
        height,
        overflow: 'hidden',
        backfaceVisibility: 'hidden',
      },
      backContainerStyle: {
        position: 'absolute',
        width,
        height,
        overflow: 'hidden',
      },
      backViewStyle: {
        width,
        height,
        backgroundColor: '#ddd',
      },
      imageStyle: {
        width: imageWidth,
        height: imageHeight,
        marginLeft: -1 * x,
        marginTop: -1 * y,
      },
    };
  }, [kind, width, height, imageWidth, imageHeight, x, y]);

  const transformFolding = useCallback((deg: number) => {
    let matrix;

    if (kind === FOLDING_ANIMATION_PART_KIND.TOP_TO_BOTTOM) {
      matrix = TransformUtil.rotateX(-1 * deg, transformBasePosition, PERSPECTIVE);
    } else if (kind === FOLDING_ANIMATION_PART_KIND.BOTTOM_TO_TOP) {
      matrix = TransformUtil.rotateX(deg, transformBasePosition, PERSPECTIVE);
    } else if (kind === FOLDING_ANIMATION_PART_KIND.RIGHT_TO_LEFT) {
      matrix = TransformUtil.rotateY(-1 * deg, transformBasePosition, PERSPECTIVE);
    }

    const transformStyleProp = {
      style: {
        transform: [
          {
            matrix,
          },
        ],
      },
    };

    imageViewRef.current?.setNativeProps(transformStyleProp);
    backViewRef.current?.setNativeProps(transformStyleProp);
  }, [kind, transformBasePosition]);

  useEffect(() => {
    if (!isVisible || !isAnimating) {
      return;
    }

    let isShadowVisible = false;
    let isRestoredStep = false;

    animationValue.addListener(({ value }) => {
      transformFolding(value);

      if (isRestoredStep && !isShadowVisible && value >= -90) {
        isShadowVisible = true;
        onShowShadow();
      }
    });

    async function startAllAnimations() {
      await startAnimation(-180, 800);
      isRestoredStep = true;
      await startAnimation(0, 800);
      await startAnimation(-10, 300);
      await startAnimation(0, 200);
      onEndAnimation();
    }

    startAllAnimations();

    return () => {
      animationValue.removeAllListeners();
      animationValue.setValue(0);
    };
  }, [
    isVisible,
    isAnimating,
    startAnimation,
    animationValue,
    transformFolding,
    onShowShadow,
    onEndAnimation,
  ]);

  const onLoadImage = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const rootStyle = {
    position: 'absolute',
    left: x,
    right: 0,
    top: y,
    height,
    backgroundColor: '#f6f6f6',
    opacity: isImageLoaded && isVisible ? 1 : 0,
  };

  return (
    <View style={rootStyle}>
      <Animated.View style={backContainerStyle} ref={backViewRef}>
        <View style={backViewStyle} />
      </Animated.View>
      <Animated.View style={containerStyle} ref={imageViewRef}>
        <Image source={image} style={imageStyle} onLoad={onLoadImage} />
        {children}
      </Animated.View>
    </View>
  );
}

export default React.memo<Props>(PaperFoldingAnimationPart);

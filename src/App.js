// @flow

import React, {
  useEffect,
  useState,
  useCallback,
} from 'react';

import {
  StyleSheet,
  View,
  StatusBar,
  TouchableWithoutFeedback,
} from 'react-native';

import PaperFoldingEffect from './PaperFoldingEffect';

const App = () => {
  const [isEnabled, setEnabled] = useState(false);

  const startEffect = useCallback(() => {
    if (isEnabled) {
      setEnabled(false);
      requestAnimationFrame(() => { setEnabled(true); });
    } else {
      setEnabled(true);
    }
  }, [isEnabled]);

  useEffect(() => {
    StatusBar.setHidden(true, 'none');
    return () => {
      StatusBar.setHidden(false, 'none');
      setEnabled(false);
    };
  }, []);

  return (
    <TouchableWithoutFeedback onPress={startEffect}>
      <View style={styles.container}>
        <PaperFoldingEffect
          image={(require('~/assets/image.jpg'): any)}
          isEnabled={isEnabled}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
  },
});

export default App;

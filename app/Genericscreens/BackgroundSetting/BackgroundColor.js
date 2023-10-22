import React from 'react';
import { View, StyleSheet } from 'react-native';

const BackgroundColor = ({ children }) => {
  return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B3EAE5',

  },
});

export default BackgroundColor;

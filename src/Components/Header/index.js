import React from 'react';
import {StyleSheet, Text} from 'react-native';

export default class Header extends React.Component {
  render() {
    return <Text style={styles.header_text}>MemoryGame</Text>;
  }
}

const styles = StyleSheet.create({
  header_text: {
    backgroundColor: '#f3f3f3',
    flex: 1,
    fontWeight: 'bold',
    fontSize: 17,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});

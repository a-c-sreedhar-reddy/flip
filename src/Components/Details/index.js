import React from 'react';
import {View, Text} from 'react-native';

function Details({label, value}) {
  return (
    <View
      style={{
        // backgroundColor: '#f3f3f3',
        flex: 1,
        justifyContent: 'center',
      }}>
      <Text
        style={{
          fontWeight: 'bold',
          fontSize: 17,
          textAlign: 'center',
          textAlignVertical: 'center',
        }}>
        {label}
      </Text>
      <Text
        style={{
          fontSize: 15,
          color: 'red',
          textAlign: 'center',
          fontWeight: 'bold',
        }}>
        {value}
      </Text>
    </View>
  );
}
export default Details;

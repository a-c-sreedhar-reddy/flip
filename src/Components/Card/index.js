import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

function Card({card, onPress, disabled}) {
  if (card.status === 'notFound') {
    return (
      <TouchableOpacity
        disabled={disabled}
        style={{flex: 1, backgroundColor: 'green', margin: 5, borderRadius: 5}}
        onPress={onPress}
      />
    );
  }
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        margin: 5,
        borderColor:
          card.status == 'firstTry' || card.status == 'secondTry'
            ? 'green'
            : 'grey',
        borderWidth: 2,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text>{card.number}</Text>
    </View>
  );
}
export default Card;

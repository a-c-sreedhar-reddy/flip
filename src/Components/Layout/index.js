import React from 'react';
import {View} from 'react-native';

export default function Layout({rows, columns, children}) {
  // console.log({rows, columns, children});
  const rowsView = [];
  for (let i = 0; i < rows; i++) {
    const columnsView = [];
    for (let j = 0; j < columns; j++) {
      columnsView.push(columns * i + j);
    }
    rowsView.push(columnsView);
  }
  return (
    <View style={{flex: 1, margin: 5}}>
      {rowsView.map((columnsView, index) => (
        <View style={{flex: 1, flexDirection: 'row'}} key={index}>
          {columnsView.map((id) => (
            <View style={{flex: 1}} key={id}>
              {id < children.length && children[id]}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

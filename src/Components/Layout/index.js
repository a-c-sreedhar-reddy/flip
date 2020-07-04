import React from 'react';
import {View} from 'react-native';

export default function Layout({rows, columns, children}) {
  // console.log({rows, columns, children});
  const rowsView = [];
  for (let i = 0; i < rows; i++) {
    const columnsView = [];
    // console.log({i, noofchildren});
    for (let j = 0; j < columns; j++) {
      // console.log({index: columns * i + j});
      columnsView.push(columns * i + j);
    }
    // console.log({columnsView});
    rowsView.push(columnsView);
  }
  // console.log({rowsView});
  // console.log({rowsView});
  // const a = <View style={{flex: 1, flexDirection: 'column'}}>{rowsView}</View>;
  // console.log({a});
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

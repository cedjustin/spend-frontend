import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Spend from './navigation/navigation';


export default class App extends React.Component {
  render() {
    return (
      <Spend />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

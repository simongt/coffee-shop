import React, {Component} from 'react';
import {StyleSheet, Platform, Image, Text, View} from 'react-native';

class CounterScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {}

  render() {
    return (
      <View style={styles.container}>
        <Text style={{fontSize: 36}}>Counter</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CounterScreen;
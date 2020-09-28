import React, {Component} from 'react';
import {StyleSheet, Platform, Image, Text, View, FlatList} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {MENU, WINDOW_WIDTH} from '../constants';
import {Colors} from '../styles';

class MenuScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {}

  onMenuItemPress = (item) => {
    console.log(`Pressed ${item.name}`);
  };

  render() {
    const renderItem = ({item}) => (
      <MenuItem
        item={item}
        onPress={(item) => this.onMenuItemPress(item)}
        style={styles.menuItem}
      />
    );
    return (
      <View style={styles.container}>
        <Text style={{fontSize: 36}}>Menu</Text>

        <FlatList
          data={MENU}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
    );
  }
}

const MenuItem = ({item, onPress, style}) => (
  <TouchableOpacity onPress={onPress} style={style}>
    <Text style={styles.menuItemText}>{item.name}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItem: {
    width: WINDOW_WIDTH - 20,
    marginVertical: 10,
    height: 100,
    borderRadius: 10,
    backgroundColor: '#ddd',
  },
  menuItemText: {
    fontSize: 24,
  },
});

export default MenuScreen;

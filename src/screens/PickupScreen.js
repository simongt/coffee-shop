import React, {Component} from 'react';
import {StyleSheet, Platform, Image, Text, View, FlatList} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';

import {MENU, WINDOW_HEIGHT, WINDOW_WIDTH} from '../constants';
import {Colors} from '../styles/Colors';

class PickupScreen extends Component {
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
      <MenuItem item={item} onPress={(item) => this.onMenuItemPress(item)} />
    );
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={[Colors.primaryDark, '#2D2A43', Colors.primaryDark]}>
          <Text style={styles.screenHeaderText}>pickup counter</Text>

          <FlatList
            data={MENU}
            renderItem={renderItem}
            keyExtractor={(item) => `${item.id}`}
          />
        </LinearGradient>
      </View>
    );
  }
}

const MenuItem = ({item, onPress}) => (
  <TouchableOpacity onPress={onPress} style={styles.menuItem}>
    <LinearGradient
      colors={[Colors.primaryLight, Colors.primaryDark]}
      style={styles.menuItemGradient}>
      <Text style={styles.menuItemText}>{item.name}</Text>
    </LinearGradient>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  menuItem: {
    flex: 1,
    flexDirection: 'row',
    width: WINDOW_WIDTH - 30,
    marginBottom: 15,
    marginHorizontal: 15,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: Colors.secondaryDark,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 24,
  },
  menuItemGradient: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: WINDOW_HEIGHT * 0.05,
    paddingHorizontal: 25,
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 24,
    color: Colors.peachPuff,
  },
  screenHeaderText: {
    color: Colors.newYorkPink,
    fontSize: 36,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    paddingLeft: 15,
    paddingTop: 50,
    paddingBottom: 25,
  },
});

export default PickupScreen;

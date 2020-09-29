import React, {Component} from 'react';
import {StyleSheet, Platform, Image, Text, View, FlatList} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-root-toast';
import {v4 as uuidv4} from 'uuid';
import {
  MENU,
  WINDOW_HEIGHT,
  WINDOW_WIDTH,
  SHORT_TOAST,
  LONG_TOAST,
} from '../constants';
import {Colors} from '../styles/Colors';

class MenuScreen extends Component {
  constructor(props) {
    super();

    this.state = {};
  }

  componentDidMount() {}

  onMenuItemPress = async (item) => {
    try {
      Toast.show(`Order placed for ${item.name}.`, SHORT_TOAST);
      await this.props.setOrdersQueued([
        ...this.props.ordersQueued,
        {id: uuidv4(), name: item.name, duration: item.duration},
      ]);
    } catch (error) {
      Toast.show(`Could not place order for ${item.name}.`, LONG_TOAST);
    }
  };

  renderItem = ({item}) => (
    <MenuItem item={item} onPress={() => this.onMenuItemPress(item)} />
  );

  render() {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={[Colors.primaryDark, '#2D2A43', Colors.primaryDark]}>
          <FlatList
            data={MENU}
            renderItem={this.renderItem}
            keyExtractor={(item) => `${item.id}`}
            ListHeaderComponent={
              <Text style={styles.screenHeaderText}>order menu</Text>
            }
            ListEmptyComponent={
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  width: WINDOW_WIDTH,
                  paddingHorizontal: 15,
                }}>
                <Text style={styles.menuItemText}>N/A</Text>
              </View>
            }
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

export default MenuScreen;

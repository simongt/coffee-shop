import React, {Component} from 'react';
import {
  StyleSheet,
  Platform,
  Image,
  Text,
  View,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-root-toast';
import {
  MENU,
  WINDOW_HEIGHT,
  WINDOW_WIDTH,
  SHORT_TOAST,
  LONG_TOAST,
} from '../constants';
import {Colors} from '../styles/Colors';

class PickupScreen extends Component {
  constructor(props) {
    super();

    this.state = {
      loading: true,
    };
  }

  componentDidMount() {
    if (
      Array.isArray(this.props.ordersQueued) &&
      Array.isArray(this.props.ordersPrepped)
    ) {
      this.setState({loading: false});
    }
  }

  onMenuItemPress = async (item) => {
    try {
      Toast.show(`Order picked up for ${item.name}.`, SHORT_TOAST);
      await this.props.setOrdersPrepped(
        this.props.ordersPrepped.filter((order) => order.id !== item.id),
      );
    } catch (error) {
      Toast.show(`Could not pick up order for ${item.name}.`, LONG_TOAST);
    }
  };

  renderItem = ({item}) => (
    <MenuItem item={item} onPress={() => this.onMenuItemPress(item)} />
  );

  render() {
    return this.state.loading ? (
      <View style={{flex: 1, justifyContent: 'center'}}>
        <ActivityIndicator size="large" color={Colors.puce} />
      </View>
    ) : (
      <View style={styles.container}>
        <LinearGradient
          colors={[Colors.primaryDark, '#2D2A43', Colors.primaryDark]}>
          <FlatList
            data={this.props.ordersPrepped}
            renderItem={this.renderItem}
            keyExtractor={(item) => `${item.id}`}
            ListHeaderComponent={
              <Text style={styles.screenHeaderText}>pickup counter</Text>
            }
            ListEmptyComponent={
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  width: WINDOW_WIDTH,
                  paddingHorizontal: 15,
                }}>
                <Text style={styles.menuItemText}>
                  There are no orders to pick up at the moment.
                </Text>
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
      colors={[Colors.roseDust, Colors.eggplant]}
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
    color: Colors.champagnePink,
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

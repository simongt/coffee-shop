import * as React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-root-toast';
import { useFocusEffect } from '@react-navigation/native';

import { OrdersContext } from '../hooks';
import {
  LONG_TOAST,
  SHORT_TOAST,
  WINDOW_WIDTH,
  WINDOW_HEIGHT
} from '../constants';
import { Colors } from '../styles';

type Props = {
  children?: React.Node
};

const PickupScreen = (props: Props): React$Node => {
  const Orders = React.useContext(OrdersContext);
  const [loading, setLoading] = React.useState(true);

  useFocusEffect(() => {
    if (Array.isArray(Orders.pickup)) {
      setLoading(false);
    }
  }, [loading]);

  pickupOrder = item => {
    try {
      Orders.setPickup(Orders.pickup.filter(order => order.id !== item.id));
      Toast.show(`Order picked up for ${item.name}.`, SHORT_TOAST);
    } catch (error) {
      Toast.show(`Could not pick up order for ${item.name}.`, LONG_TOAST);
    }
  };

  renderItem = ({ item }) => (
    <MenuItem item={item} onPress={() => this.pickupOrder(item)} />
  );

  return loading ? (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <ActivityIndicator size='large' color={Colors.puce} />
    </View>
  ) : (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.primaryDark, '#2D2A43', Colors.primaryDark]}
      >
        <FlatList
          data={Orders.pickup}
          renderItem={this.renderItem}
          keyExtractor={item => `${item.id}`}
          ListHeaderComponent={
            <Text style={styles.screenHeaderText}>pickup counter</Text>
          }
          ListEmptyComponent={
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                width: WINDOW_WIDTH,
                paddingHorizontal: 15
              }}
            >
              <Text style={styles.menuItemText}>
                There are no orders to pick up at the moment.
              </Text>
            </View>
          }
        />
      </LinearGradient>
    </View>
  );
};

const MenuItem = ({ item, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.menuItem, { color: Colors.champagnePink }]}
  >
    <LinearGradient
      colors={[Colors.roseDust, Colors.eggplant]}
      style={styles.menuItemGradient}
    >
      <Text style={styles.menuItemText}>{item.name}</Text>
    </LinearGradient>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center'
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
      height: 12
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24
  },
  menuItemGradient: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: WINDOW_HEIGHT * 0.05,
    paddingHorizontal: 25,
    alignItems: 'center'
  },
  menuItemText: {
    fontSize: 24,
    color: Colors.peachPuff
  },
  screenHeaderText: {
    color: Colors.newYorkPink,
    fontSize: 36,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    paddingLeft: 15,
    paddingTop: 50,
    paddingBottom: 25
  }
});

export default PickupScreen;

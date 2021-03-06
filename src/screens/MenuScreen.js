import * as React from 'react';
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-root-toast';
import { v4 as uuidv4 } from 'uuid';
import { useFocusEffect } from '@react-navigation/native';

import { OrdersContext } from '../hooks';
import {
  MENU,
  LONG_TOAST,
  SHORT_TOAST,
  WINDOW_WIDTH,
  WINDOW_HEIGHT
} from '../constants';
import { Colors } from '../styles';

type Props = {
  children?: React.Node
};

const MenuScreen = (props: Props): React$Node => {
  const Orders = React.useContext(OrdersContext);
  const [loading, setLoading] = React.useState(true);

  useFocusEffect(() => {
    if (Array.isArray(Orders.queue) && Array.isArray(Orders.pickup) && MENU) {
      setLoading(false);
    }
  }, [loading]);

  onMenuItemPress = item => {
    console.log('====================================');
    console.log(`[MenuScreen] Menu item pressed for ${item.name}`);
    try {
      // add order to queue
      Orders.setQueue(orders => {
        const order = {
          id: item.id + '--' + uuidv4(),
          name: item.name,
          duration: item.duration,
          createdAt: Date.now()
        };
        const queue = [...orders, order];
        console.log(`[MenuScreen] Adding ${order.name} to queued orders`);
        console.table(queue);
        return queue;
      });
      Toast.show(`Order placed for ${item.name}.`, SHORT_TOAST);
    } catch (error) {
      Toast.show(`Could not place order for ${item.name}.`, LONG_TOAST);
    }
  };

  renderItem = ({ item }) => (
    <MenuItem item={item} onPress={() => this.onMenuItemPress(item)} />
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
          data={MENU}
          renderItem={this.renderItem}
          keyExtractor={item => `${item.id}`}
          ListHeaderComponent={
            <Text style={styles.screenHeaderText}>order menu</Text>
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
                The menu has no orderable items.
              </Text>
            </View>
          }
        />
      </LinearGradient>
    </View>
  );
};

const MenuItem = ({ item, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.menuItem}>
    <LinearGradient
      colors={[Colors.primaryLight, Colors.primaryDark]}
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

export default MenuScreen;

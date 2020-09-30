import * as React from 'react';
import {
  StyleSheet,
  Platform,
  Image,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  Animated
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-root-toast';
import * as Progress from 'react-native-progress';
import { useInterval, OrdersContext } from '../hooks';
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

const QueueScreen = (props: Props): React$Node => {
  const Orders = React.useContext(OrdersContext);
  const [loading, setLoading] = React.useState(true);
  const [order, setOrder] = React.useState(null);
  const [progress, setProgress] = React.useState(1);
  // const prepTime = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (
      Array.isArray(Orders.ordersQueued) &&
      Array.isArray(Orders.ordersPrepped)
    ) {
      setLoading(false);
    }
  }, [loading]);

  React.useEffect(() => {
    if (Orders.ordersQueued.length > 0) {
      setOrder(Orders.ordersQueued[0]);
    }
  }, [order]);

  onMenuItemPress = item => {
    try {
      Toast.show(`Order for ${item.name} is ready.`, SHORT_TOAST);
      Orders.setOrdersQueued(
        Orders.ordersQueued.filter(order => order.id !== item.id)
      );
      Orders.setOrdersPrepped([...Orders.ordersPrepped, item]);
      if (Orders.ordersQueued.length > 0) {
        setOrder(Orders.ordersQueued[0]);
        setProgress(0);
      }
    } catch (error) {
      Toast.show(`Could not place order for ${item.name}.`, LONG_TOAST);
    }
  };

  useInterval(() => {
    if (progress < 100 && order !== null) {
      setProgress(progress + 10 / order.duration);
    }
  }, 50);

  renderItem = ({ item }) => (
    <MenuItem
      item={item}
      onPress={() => this.onMenuItemPress(item)}
      prepping={item.id === order.id}
      ready={progress >= 100}
      progress={progress / 100}
    />
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
          data={Orders.ordersQueued}
          renderItem={this.renderItem}
          keyExtractor={item => `${item.id}`}
          ListHeaderComponent={
            <Text style={styles.screenHeaderText}>in progress</Text>
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
                There are no orders being prepped at the moment.
              </Text>
            </View>
          }
        />
      </LinearGradient>
    </View>
  );
};

const MenuItem = ({ item, onPress, prepping, ready, progress }) => {
  if (ready) {
    onPress();
  }
  return (
    <TouchableOpacity onPress={onPress} style={styles.menuItem}>
      <LinearGradient
        colors={[Colors.secondaryDark, Colors.gunmetal]}
        style={styles.menuItemGradient}
      >
        <Text style={styles.menuItemText}>{item.name}</Text>
        <View style={{ position: 'absolute', bottom: 0, left: 0 }}>
          {prepping && (
            <Progress.Bar
              progress={progress}
              useNativeDriver={true}
              // animationType={'decay'}
              color={Colors.secondary}
              // indeterminate={prepping}
              // indeterminateAnimationDuration={item.duration * 1000}
              width={WINDOW_WIDTH - 30}
              // height={35}
              borderRadius={0}
              borderColor={'transparent'}
            />
          )}
        </View>
        <View
          style={{
            padding: 5,
            margin: 5,
            borderRadius: 6,
            position: 'absolute',
            top: 0,
            right: 0,
            backgroundColor: 'rgba(0,0,0,0.25)'
          }}
        >
          <Text style={[styles.menuItemText, { fontSize: 16 }]}>
            {`${item.duration}s`}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

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
    flexDirection: 'column',
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

export default QueueScreen;

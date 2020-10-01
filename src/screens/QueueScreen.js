import * as React from 'react';
import {
  StyleSheet,
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
import { useFocusEffect } from '@react-navigation/native';

import { useInterval, OrdersContext } from '../hooks';
import {
  LONG_TOAST,
  SHORT_TOAST,
  WINDOW_WIDTH,
  WINDOW_HEIGHT,
  ANIMATION_SPEED
} from '../constants';
import { Colors } from '../styles';

type Props = {
  children?: React.Node
};

const QueueScreen = (props: Props): React$Node => {
  const Orders = React.useContext(OrdersContext);
  const [loading, setLoading] = React.useState(true);
  const [progress, setProgress] = React.useState(0);
  const [currentOrder, setCurrentOrder] = React.useState(null);

  // const prepTime = React.useRef(new Animated.Value(0)).current;

  useFocusEffect(() => {
    if (Array.isArray(Orders.queue) && Array.isArray(Orders.pickup)) {
      if (Orders.queue.length > 0) {
        console.log(`[QueueScreen] Currently prepping ${Orders.queue[0].name}`);
        console.table(Orders.queue[0]);
        setCurrentOrder(Orders.queue[0]);
      }
      setLoading(false);
    }
  }, [loading, currentOrder]);

  useInterval(() => {
    if (progress < 100 && currentOrder !== null) {
      setProgress(progress + (ANIMATION_SPEED * 10) / currentOrder.duration);
    } else if (progress >= 100 && currentOrder !== null) {
      console.log('====================================');
      console.log(`[QueueScreen] Finished with prepping ${currentOrder.name}`);
      processOrder();
    }
  }, 100);

  processOrder = () => {
    try {
      // remove order from queue
      Orders.setQueue(previousQueue => {
        const queue = previousQueue.filter(
          order => order.id !== currentOrder.id
        );
        console.log(
          `[QueueScreen] Removing ${currentOrder.name} from queued orders`
        );
        console.table(queue);
        return queue;
      });
      // add order to pickup
      Orders.setPickup(previousPickup => {
        const pickup = [...previousPickup, currentOrder];
        console.log(
          `[QueueScreen] Adding ${currentOrder.name} to pickup orders`
        );
        console.table(pickup);
        Toast.show(`Order for ${currentOrder.name} is ready.`, SHORT_TOAST);
        return pickup;
      });
      if (Orders.queue.length > 1) {
        console.log(
          `There currently are ${Orders.queue.length} orders remaining`
        );
        // find index of current order by matching current id with queue order id
        const currentIndex = Orders.queue.indexOf(
          Orders.queue.filter(order => order.id === currentOrder.id)[0]
        );
        // set next order
        setCurrentOrder(Orders.queue[currentIndex + 1]);
        setProgress(previousProgress => -previousProgress);
      } else {
        console.log(`This is currently the last order in the queue`);
        setCurrentOrder(null);
        setProgress(0);
      }
    } catch (error) {
      Toast.show(`Could not prep order for ${currentOrder.name}.`, LONG_TOAST);
    }
  };

  renderItem = ({ item, index, separators }) => (
    <MenuItem
      item={item}
      progress={progress}
      prepping={currentOrder !== null ? item.id === currentOrder.id : false}
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
          data={Orders.queue}
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

const MenuItem = ({ item, prepping, progress }) => (
  <View style={styles.menuItem}>
    <LinearGradient
      colors={[Colors.secondaryDark, Colors.gunmetal]}
      style={styles.menuItemGradient}
    >
      <View style={{ position: 'absolute', bottom: 0, left: 0 }}>
        {prepping && (
          <Progress.Bar
            progress={progress}
            animationType={'spring'}
            animationConfig={{ bounciness: 0 }}
            color={Colors.blueSapphire}
            width={WINDOW_WIDTH - 30}
            height={WINDOW_HEIGHT * 0.13}
            borderRadius={0}
            borderColor={'transparent'}
            useNativeDriver={true}
            // indeterminate={prepping}
            // indeterminateAnimationDuration={item.duration * 1000}
          />
        )}
      </View>
      <Text style={styles.menuItemText}>{item.name}</Text>
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
  </View>
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

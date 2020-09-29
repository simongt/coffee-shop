import React, {Component, useState, useEffect} from 'react';
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
import * as Progress from 'react-native-progress';
import {
  MENU,
  WINDOW_HEIGHT,
  WINDOW_WIDTH,
  SHORT_TOAST,
  LONG_TOAST,
} from '../constants';
import {Colors} from '../styles/Colors';

const QueueScreen = (props) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (
      Array.isArray(props.ordersQueued) &&
      Array.isArray(props.ordersPrepped)
    ) {
      setLoading(false);
    }
  }, [loading]);

  onMenuItemPress = async (item) => {
    try {
      Toast.show(`Order for ${item.name} is ready.`, SHORT_TOAST);
      await props.setOrdersQueued(
        props.ordersQueued.filter((order) => order.id !== item.id),
      );
      await props.setOrdersPrepped([...props.ordersPrepped, item]);
    } catch (error) {
      Toast.show(`Could not place order for ${item.name}.`, LONG_TOAST);
    }
  };

  renderItem = ({item}) => (
    <MenuItem item={item} onPress={() => this.onMenuItemPress(item)} />
  );

  return loading ? (
    <View style={{flex: 1, justifyContent: 'center'}}>
      <ActivityIndicator size="large" color={Colors.puce} />
    </View>
  ) : (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.primaryDark, '#2D2A43', Colors.primaryDark]}>
        <FlatList
          data={props.ordersQueued}
          renderItem={this.renderItem}
          keyExtractor={(item) => `${item.id}`}
          ListHeaderComponent={
            <Text style={styles.screenHeaderText}>in progress</Text>
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
                There are no orders being prepped at the moment.
              </Text>
            </View>
          }
        />
      </LinearGradient>
    </View>
  );
};

const MenuItem = ({item, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.menuItem}>
      <LinearGradient
        colors={[Colors.secondaryDark, Colors.gunmetal]}
        style={styles.menuItemGradient}>
        <Text style={styles.menuItemText}>{item.name}</Text>
        <Progress.Bar
          useNativeDriver={true}
          animationType={'decay'}
          color={Colors.secondary}
          indeterminate={true}
          indeterminateAnimationDuration={item.duration * 1000}
          width={WINDOW_WIDTH * 0.75}
          // animationConfig={{bounciness: 0.5}}
        />
        <View
          style={{
            padding: 5,
            margin: 5,
            borderRadius: 6,
            position: 'absolute',
            top: 0,
            right: 0,
            backgroundColor: 'rgba(0,0,0,0.25)',
          }}>
          <Text style={[styles.menuItemText, {fontSize: 16}]}>
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
    flexDirection: 'column',
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

export default QueueScreen;

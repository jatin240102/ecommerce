import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, { useEffect } from 'react';
import AppHeader from '../../components/common/AppHeader';
import {IMAGES} from '../../constant/imagePath';
import {ms, mvs} from 'react-native-size-matters';
import AppLayout from '../../components/layouts/AppLayout';
import {COLORS} from '../../constant/color';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import OrderTopBarContent from '../../components/dashboard/OrderTopBarContent';
import AllOrders from './AllOrders';
import PendingOrder from './PendingOrder';
import CompleteOrder from './CompleteOrder';
import CancelOrder from './CancelOrder';
import ProcessingOrder from './ProcessingOrder';
import { useGlobalData } from '../../context/AppContext';

const Tab = createMaterialTopTabNavigator();
const OrderDashboard = ({navigation}) => {
   const {isAllOrderActive, setIsAllOrderActive,} = useGlobalData();

   console.log('isAllOrderActive', isAllOrderActive);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // if (isAllOrderActive !== 'AllOrders') {
      //   console.log("----///////")
      //   navigation.reset({
      //     index: 0,
      //     routes: [{name: 'AllOrders'}],
      //   });
      // }
    });
    return unsubscribe;
  }, [navigation]);


  return (
    <AppLayout containerStyle={styles.layout}>
      <AppHeader
        containerStyle={styles.headerContainer}
        leftElement={
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              navigation.openDrawer();
            }}>
            <Image
              source={IMAGES.ic_humberIcon}
              style={{height: mvs(25), width: ms(25), resizeMode: 'contain'}}
              resizeMode="contain"
            />
          </TouchableOpacity>
        }
        rightElement={
          <TouchableOpacity
            onPress={() => navigation.navigate('Notifications')}>
            <Image
              source={IMAGES.ic_notification}
              style={{height: mvs(20), width: ms(20), tintColor: COLORS.WHITE}}
              resizeMode="cover"
            />
          </TouchableOpacity>
        }
        headerTitle={'Manage Order'}
      />
      <View style={styles.container}>
        <Tab.Navigator
          tabBar={props => <OrderTopBarContent {...props} />}
          screenOptions={{
            tabBarScrollEnabled: false,
            swipeEnabled: false,
          }}>
          <Tab.Screen name="AllOrders" component={AllOrders} />
          <Tab.Screen name="PendingOrder" component={PendingOrder} />
          <Tab.Screen name="ProcessingOrder" component={ProcessingOrder} />
          <Tab.Screen name="CompleteOrder" component={CompleteOrder} />
          <Tab.Screen name="CancelOrder" component={CancelOrder} />
        </Tab.Navigator>
      </View>
    </AppLayout>
  );
};

export default OrderDashboard;

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: ms(15),
    backgroundColor: COLORS.PRIMARY,
    paddingBottom: mvs(30),
  },
  layout: {
    paddingHorizontal: ms(0),
  },
  container: {
    flex: 1,
  },
});

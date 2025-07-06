import {
  Image,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {ms, mvs, s} from 'react-native-size-matters';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import AppLayout from '../../../components/layouts/AppLayout';
import OrderDetailTopBarContent from '../../../components/dashboard/OrderDetailTopBarContent';
import OrderDetail from './OrderDetail';
import OrderInvoicesList from './OrderInvoicesList';
import {COLORS} from '../../../constant/color';
import AppHeader from '../../../components/common/AppHeader';
import {IMAGES} from '../../../constant/imagePath';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import InvoiceOrderDetail from './InvoiceOrderDetail';
import {useGlobalData} from '../../../context/AppContext';
import OrderShipmentList from './OrderShipmentList';
import OrderShipmentDetail from './OrderShipmentDetail';
const Tab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();

const OrderDetailDashboard = ({navigation, route}) => {
  const {orderDetailHeadTitle, isInvoiceDetailActive,isShipmentLevel1Active} = useGlobalData();
  return (
    <AppLayout containerStyle={styles.layout}>
      <AppHeader
        containerStyle={styles.headerContainer}
        leftElement={
          <Pressable
            onPress={
              isInvoiceDetailActive
                ? () =>
                    navigation.navigate({
                      name: 'OrderInvoicesList', // Replace 'TabName' with the name of the tab you want to reset
                      params: {},
                      merge: true,
                    })
                : isShipmentLevel1Active
                ? ()=>navigation.navigate({
                    name: 'OrderShipmentList', // Replace 'TabName' with the name of the tab you want to reset
                    params: {},
                    merge: true,
                  })
                : () => navigation.goBack()
            }>
            <Image
              source={IMAGES.ic_backIcon}
              style={{height: mvs(20), width: ms(20)}}
              resizeMode="contain"
            />
          </Pressable>
        }
        titleStyle={styles.headerTitle}
        headerTitle={
          orderDetailHeadTitle ? `Order #${orderDetailHeadTitle}` : ''
        }
        rightElement={
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.navigate('Notifications')}>
            <Image
              source={IMAGES.ic_notification}
              style={{height: mvs(20), width: ms(20), tintColor: COLORS.WHITE}}
              resizeMode="contain"
            />
          </TouchableOpacity>
        }
      />

      <View style={styles.container}>
        <Tab.Navigator
          tabBar={props => <OrderDetailTopBarContent {...props} />}
          screenOptions={{
            tabBarScrollEnabled: false,
            swipeEnabled: false,
          }}
          backBehavior="history">
          <Tab.Screen name="OrderDetail" component={OrderDetail} />
          <Tab.Screen name="OrderInvoicesListing" component={InvoiceTab} />
          <Tab.Screen name="OrderShipmentListing" component={ShipmentTab} />
        </Tab.Navigator>
      </View>
    </AppLayout>
  );
};

export default OrderDetailDashboard;

const InvoiceTab = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
        animation: 'none',
      }}
      initialRouteName="OrderInvoicesList">
      <Stack.Screen name="OrderInvoicesList" component={OrderInvoicesList} />
      <Stack.Screen name="InvoiceOrderDetail" component={InvoiceOrderDetail} />
    </Stack.Navigator>
  );
};
const ShipmentTab = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
        animation: 'none',
      }}
      initialRouteName="OrderShipmentList">
      <Stack.Screen name="OrderShipmentList" component={OrderShipmentList} />
      <Stack.Screen name="OrderShipmentDetail" component={OrderShipmentDetail} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: ms(15),
    backgroundColor: COLORS.PRIMARY,
    paddingBottom: mvs(30),
  },
  container: {
    flex: 1,
  },
  layout: {
    paddingHorizontal: ms(0),
  },
});

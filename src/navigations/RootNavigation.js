import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Authentication from '../screens/auth/Authentication';
import ForgotPassword from '../screens/auth/ForgotPassword';
import OtpVerification from '../screens/auth/OtpVerification';
import ResetPassword from '../screens/auth/ResetPassword';
import ChangePassword from '../screens/auth/ChangePassword';
import CmsScreen from '../screens/dashboard/CmsScreen';
import Notifications from '../screens/dashboard/Notifications';
import EditStore from '../screens/auth/EditStore';
import DrawerNavigation from './DrawerNavigation';
import Settings from '../screens/dashboard/Settings';
import ContactUs from '../screens/ContactsUs';
import AddProduct from '../screens/product/AddProduct';
import EditProduct from '../screens/product/EditProduct';
import ProductDetail from '../screens/product/ProductDetail';
import OrderDetailDashboard from '../screens/orders/orderDetail/OrderDetailDashboard';
import Transaction from '../screens/dashboard/Transaction';
import SplashScreen from '../screens/APP/SplashScreen';

const Stack = createNativeStackNavigator();

const RootNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'none',
        statusBarTranslucent: true,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
      initialRouteName={'SplashScreen'}>
        
      <Stack.Screen
        name="SplashScreen"
        component={SplashScreen}
        options={{gestureEnabled: true}}
      />
      <Stack.Screen
        name="Authentication"
        component={Authentication}
        options={{gestureEnabled: true}}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPassword}
        options={{gestureEnabled: true}}
      />
      <Stack.Screen
        name="OtpVerification"
        component={OtpVerification}
        options={{gestureEnabled: true}}
      />
      <Stack.Screen
        name="ResetPassword"
        component={ResetPassword}
        options={{gestureEnabled: true}}
      />
      <Stack.Screen
        name="Notifications"
        component={Notifications}
        options={{gestureEnabled: true}}
      />
      <Stack.Screen name="Transaction" component={Transaction} />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{gestureEnabled: true}}
      />
      <Stack.Screen name="CmsScreen" component={CmsScreen} />
      <Stack.Screen
        name="Dashboard"
        component={DrawerNavigation}
        options={{gestureEnabled: false}}
      />
      <Stack.Screen
        name="EditStore"
        component={EditStore}
        options={{gestureEnabled: true}}
      />
      <Stack.Screen
        name="ContactUs"
        component={ContactUs}
        options={{gestureEnabled: true}}
      />
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{gestureEnabled: true}}
      />
      <Stack.Screen
        name="AddProduct"
        component={AddProduct}
        options={{gestureEnabled: true}}
      />
      <Stack.Screen
        name="EditProduct"
        component={EditProduct}
        options={{gestureEnabled: true}}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetail}
        options={{gestureEnabled: true}}
      />
      <Stack.Screen
        name="OrderDetailDashboard"
        component={OrderDetailDashboard}
      />
    </Stack.Navigator>
  );
};
export default RootNavigation;

import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import TabBarContent from '../components/dashboard/TabBarContent';
import Dashboard from '../screens/dashboard/Dashboard';
import {sWidth} from '../utils/global';
import Category from '../screens/category/Category';
import AddProduct from '../screens/product/AddProduct';
import MyStore from '../screens/auth/MyStore';
import OrderDashboard from '../screens/orders/OrderDashboard';
import ProductDashboard from '../screens/product/ProductDashboard';

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerShown: false,
        tabNavigationStyle: {width: sWidth},
      }}
      tabBar={props => <TabBarContent {...props} />}>
      <Tab.Screen name="TabHome" component={Dashboard} />
      <Tab.Screen name="Category" component={Category} />
      <Tab.Screen name="OrderDashboard" component={OrderDashboard} />
      <Tab.Screen name="ProductDashboard" component={ProductDashboard} />
    </Tab.Navigator>
  );
};

export default TabNavigation;

import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {sWidth} from '../utils/global';
import DrawerContent from '../components/dashboard/DrawerContent';
import TabNavigation from './TabNavigation';
const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        swipeEnabled: false,
        headerShown: false,
        drawerType: 'front',
        drawerPosition: 'left',
        drawerStyle: {
          width: sWidth * 0.7,
        },
      }}
      drawerContent={props => <DrawerContent {...props} />}
      initialRouteName="Home">
      <Drawer.Screen name="Home" component={TabNavigation} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigation;

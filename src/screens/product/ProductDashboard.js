import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import AppHeader from '../../components/common/AppHeader';
import {IMAGES} from '../../constant/imagePath';
import {ms, mvs, s} from 'react-native-size-matters';
import AppLayout from '../../components/layouts/AppLayout';
import {COLORS} from '../../constant/color';
import {FONTS, FONTSIZE} from '../../constant/fonts';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import ApprovedProduct from './ApprovedProduct';
import PendingProduct from './PendingProduct';
import RejectedProduct from './RejectedProduct';
import AllProduct from './AllProduct';
import ProductTopBarContent from '../../components/dashboard/ProductTopBarContent';
import StockProducts from './StockProducts';

const Tab = createMaterialTopTabNavigator();
const ProductDashboard = ({navigation}) => {
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
        headerTitle={'Products'}
      />
      <View style={styles.container}>
        <Tab.Navigator
          tabBar={props => <ProductTopBarContent {...props} />}
          screenOptions={{
            tabBarScrollEnabled: false,
            swipeEnabled: false,
          }}>
          <Tab.Screen name="AllProduct" component={AllProduct} />
          {/* <Tab.Screen name="StockProducts" component={StockProducts} /> */}
          <Tab.Screen name="ApprovedProduct" component={ApprovedProduct} />
          <Tab.Screen name="PendingProduct" component={PendingProduct} />
          <Tab.Screen name="RejectedProduct" component={RejectedProduct} />
        </Tab.Navigator>
      </View>
    </AppLayout>
  );
};

export default ProductDashboard;

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

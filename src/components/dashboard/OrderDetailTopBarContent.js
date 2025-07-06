import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {ms, mvs} from 'react-native-size-matters';
import {COLORS} from '../../constant/color';
import {FONTS, FONTSIZE} from '../../constant/fonts';
import {useNavigation} from '@react-navigation/native';

const OrderDetailTopBarContent = ({state}) => {
  const navigation = useNavigation();
  const tabItems = [
    {label: 'Items Ordered', route: 'OrderDetail'},
    {label: 'Invoices', route: 'OrderInvoicesListing'},
    {label: 'Shipments', route: 'OrderShipmentListing'},
  ];

  return (
    <View style={styles.wrapper}>
      <ScrollView
        bounces={false}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}>
        {tabItems.map((tab, index) => {
          const isFocused = state.index === index;
         
          return (
            <TouchableOpacity
              activeOpacity={0.9}
              key={`${index}-${tab.route}-${index}`}
              onPress={() => {
                // if (state.index === 1) {
                //   navigation.reset({
                //     routes: [{name: tab.route}],
                //     index: 1,
                //     // routes: tab.route,
                //     // routes: [{name: tab.route}],
                //   });
                // } else {
                // }
                navigation.navigate(tab.route);
              }}
              style={[
                styles.tabItem,
                isFocused ? styles.activeTabItem : styles.inactiveTabItem,
              ]}>
              <Text
                numberOfLines={1}
                style={[
                  styles.tabLabel,
                  isFocused ? styles.activeTabLabel : styles.inactiveTabLabel,
                ]}>
                {`${tab.label}`}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#1A7F651A',
    padding: mvs(5),
    borderRadius: ms(100),
    marginTop: mvs(10),
    marginHorizontal: ms(15),
  },
  scrollContainer: {
    alignItems: 'center',
  },
  tabItem: {
    paddingVertical: mvs(8),
    paddingHorizontal: ms(15),
    // marginHorizontal: ms(5),
    // borderRadius: ms(20),
    alignItems: 'center',
  },
  activeTabItem: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: ms(100),
    paddingHorizontal: ms(20),
  },
  inactiveTabItem: {
    backgroundColor: 'transparent',
  },
  tabLabel: {
    fontFamily: FONTS.workSansRegular,
    fontSize: FONTSIZE.L,
    padding: 2,
  },
  activeTabLabel: {
    color: COLORS.WHITE,
    fontFamily: FONTS.workSansMedium,
    fontSize: FONTSIZE.L,
  },
  inactiveTabLabel: {
    color: COLORS.BLACK,
    fontFamily: FONTS.workSansMedium,
    fontSize: FONTSIZE.L,
  },
});

export default OrderDetailTopBarContent;

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
import {useGlobalData} from '../../context/AppContext';

const ProductTopBarContent = ({state, navigation}) => {
  const {
    allProductCount,
    approvedProductCount,
    pendingProductCount,
    rejectedProductCount,
  } = useGlobalData();
  const tabItems = [
    {label: 'All', route: 'AllProduct', count: allProductCount},
    // {label: 'Stocks', route: 'StockProducts',},
    {label: 'Approved', route: 'ApprovedProduct', count: approvedProductCount},
    {label: 'Pending', route: 'PendingProduct', count: pendingProductCount},
    {label: 'Rejected', route: 'RejectedProduct', count: rejectedProductCount},
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
              key={index}
              onPress={() => navigation.navigate(tab.route)}
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
                {`${tab.label}${tab.count > 0 ? ` (${tab.count})` : ' (0)'}`}
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

export default ProductTopBarContent;

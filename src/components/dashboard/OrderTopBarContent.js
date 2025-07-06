import React, {useEffect} from 'react';
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
import GradientButton from '../common/GradientButton ';

const OrderTopBarContent = ({state, navigation}) => {
  const {
    allOrderCount,
    completedOrderCount,
    pendingOrderCount,
    cancelOrderCount,
    processingOrderCount,
    isAllOrderActive,
    setIsAllOrderActive,
    isFilterActive,
    setIsFilterActive,
    filterRecord,
    setFilterRecord,
  } = useGlobalData();
  const tabItems = [
    {label: 'All', route: 'AllOrders', count: allOrderCount},
    {label: 'Pending', route: 'PendingOrder', count: pendingOrderCount},
    {
      label: 'Processing',
      route: 'ProcessingOrder',
      count: processingOrderCount,
    },
    {label: 'Complete', route: 'CompleteOrder', count: completedOrderCount},
    {label: 'Cancel', route: 'CancelOrder', count: cancelOrderCount},
    // {label: 'Rejected', route: 'RejectedProduct'},
  ];

  const clearFilter = () => {
    setFilterRecord({
      status: null,
      customer: null,
      increment_id: null,
      start_date: null,
      end_date: null,
      orderSearch: null,
    });
    setIsFilterActive(false);
  };

  return (
    <React.Fragment>
      {/* {!isFilterActive ? ( */}
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
                    console.log(tab.route, '666');
                    navigation.navigate(tab.route);
                    setIsAllOrderActive(tab.route);
                  }}
                  style={[
                    styles.tabItem,
                    isFocused ? styles.activeTabItem : styles.inactiveTabItem,
                  ]}>
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.tabLabel,
                      isFocused
                        ? styles.activeTabLabel
                        : styles.inactiveTabLabel,
                    ]}>
                    {/* {`${tab.label}${tab.count > 0 ? ` (${tab.count})` : ' (0)'}`} */}
                    {`${tab.label} (${tab.count})`}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      {/* ) : (
        <GradientButton
          title={'Clear Filter'}
          onPress={() => clearFilter()}
          mainContainer={{
            marginTop: mvs(10),
            paddingHorizontal: ms(15),
            // position: 'absolute',
          }}
          buttonTxt={{fontSize: FONTSIZE.XL}}
        />
      )} */}
    </React.Fragment>
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

export default OrderTopBarContent;

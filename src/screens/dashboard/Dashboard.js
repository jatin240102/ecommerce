import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  BackHandler,
  RefreshControl,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AppLayout from '../../components/layouts/AppLayout';
import {ms, mvs, s} from 'react-native-size-matters';
import AppHeader from '../../components/common/AppHeader';
import {IMAGES} from '../../constant/imagePath';
import {COLORS} from '../../constant/color';
import {FONTS, FONTSIZE} from '../../constant/fonts';
import {PieChart} from 'react-native-gifted-charts';
import {hideLoader, showLoader} from '../../components/common/AppLoader';
import SingleSelectDropdown from '../../components/common/SelectDropdown';
import {GLOBAL_CONSTANT, STORAGE_KEYS} from '../../constant/globalConstants';
import {useQuery} from '@apollo/client';
import {
  displayPrice,
  formatDate,
  formatPriceNumber,
  showToast,
} from '../../utils/global';
import {useIsFocused} from '@react-navigation/native';
import {useGlobalData} from '../../context/AppContext';
import {DASHBOARD_LIST} from '../../queries/ProductQueries';

const dropDownData = [
  {name: 'Yearly', value: 'year'},
  {name: 'Monthly', value: 'month'},
  {name: 'Weekly', value: 'week'},
];

const Dashboard = ({navigation}) => {
  const {userData} = useGlobalData();
  const [backPressCount, setBackPressCount] = useState(0);
  const [isRefresh, setIsRefresh] = useState(false);
  const [pieChartValue, setPieChartValue] = useState([]);
  const [dashboardData, setDashboardData] = useState([]);
  const [orderValues, setOrderValues] = useState(null);
  const [filterKey, setFilterKey] = useState('');
  const isFocused = useIsFocused();

  useEffect(() => {
    const onBackPress = () => {
      handleBackPress();
      return true;
    };
    if (isFocused) {
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
    }

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    };
  }, [isFocused, backPressCount]);

  const handleBackPress = () => {
    if (backPressCount === 1) {
      BackHandler.exitApp();
    } else {
      showToast('Press back again to exit.');
      setBackPressCount(1);
      setTimeout(() => {
        setBackPressCount(0);
      }, 2000);
    }
  };
  const {loading, refetch} = useQuery(DASHBOARD_LIST, {
    variables: {
      interval: filterKey?.value ? filterKey?.value : '',
    },
    onCompleted: data => {
      setIsRefresh(false);
      hideLoader(); // Ensure refreshing state is false
      if (data && data?.sellerDashboard) {
        setDashboardData(data?.sellerDashboard?.items);
        const pendingPercent = parseFloat(data.sellerDashboard?.pendingpercent);
        const totalPercent = parseFloat(data.sellerDashboard?.totalpercent);
        setOrderValues(data?.sellerDashboard);
        if (pendingPercent === 100) {
          setPieChartValue([
            {
              value: 1,
              color: '#A3CBC1',
              text: `${pendingPercent}%`,
              shiftTextX: -5,
              shiftTextY: 5,
            },
          ]);
        }

        if (totalPercent === 100) {
          setPieChartValue([
            {
              value: totalPercent,
              color: '#1A7F65',
              text: `${totalPercent}%`,
              shiftTextX: -5,
              shiftTextY: 5,
            },
          ]);
        }

        if (pendingPercent !== 100 && totalPercent !== 100) {
          setPieChartValue([
            {
              value: pendingPercent,
              color: '#A3CBC1',
              text: `${pendingPercent}%`,
              shiftTextX: -9,
              shiftTextY: 10,
            },
            {
              value: totalPercent,
              color: '#1A7F65',
              text: `${totalPercent}%`,
              shiftTextX: -2,
              shiftTextY: 8,
            },
          ]);
        }
      } else {
        setIsRefresh(false);
      }
      hideLoader();
    },
    onError: error => {
      setIsRefresh(false);
      hideLoader();
      console.log('Error fetching Dashboard:', error);
    },
    notifyOnNetworkStatusChange: true,
  });
  const handleRefresh = () => {
    setIsRefresh(true);
    // refetch();
    setFilterKey('');
    refetch({
      interval: '',
    });
  };

  useEffect(() => {
    if (loading && !isRefresh) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [loading]);

  useEffect(() => {
    setFilterKey('');
  }, []);

  useEffect(() => {
    refetch({
      interval: filterKey?.value ? filterKey?.value : '',
    });
  }, [filterKey]);

  const staticCurrency =
    userData?.ca_vendor_country === GLOBAL_CONSTANT.UAE ? 'AED' : 'GBP';
  const statusColor = {
    complete: '#3BB349',
    pending: COLORS.YELLOW,
    canceled: '#DB0B0B',
    processing: COLORS.TITLE,
  };
  return (
    <AppLayout containerStyle={styles.layout}>
      <StatusBar
        barStyle="light-content"
        translucent={true}
        backgroundColor="transparent"
      />
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
        leftElementStyle={{flex: 5}}
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
      <View style={[styles.mainContainer]}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={isRefresh}
              onRefresh={handleRefresh}
              tintColor={COLORS.PRIMARY}
            />
          }
          showsVerticalScrollIndicator={false}
          style={{flexGrow: 1}}
          contentContainerStyle={{
            paddingHorizontal: ms(16),
            marginTop: mvs(15),
            paddingBottom: ms(30),
            // flex: dashboardData?.length > 0 ? null : 1,
          }}>
          {/* {dashboardData.length > 0 ? ( */}
          <View style={{flex: 1}}>
            <View style={styles.dropdownContainer}>
              <View
                style={{
                  flex: 1,
                }}
              />
              <SingleSelectDropdown
                data={dropDownData}
                mainContainerStyle={{
                  flex: 1,
                  height: mvs(40),
                  marginLeft: mvs(30),
                }}
                dropdownStyle={[styles.dropdownStyle]}
                rightIconStyle={{marginRight: ms(15)}}
                dropdownTitle={'Select filter'}
                onItemSelect={item => setFilterKey(item)}
                selectedValue={filterKey}
                inverted={false}
                labelField="name"
                valueField="value"
                listItemStyle={{
                  backgroundColor: 'white',
                }}
              />
            </View>
            {dashboardData.length > 0 ? (
              <>
                <View style={styles.summeryContainer}>
                  <View
                    style={{
                      flex: 1 / 2,
                    }}>
                    <Text style={styles.summeryText}>Sales Summary</Text>
                    <Text style={styles.salesPresentText}>100%</Text>
                    <View
                      style={[
                        styles.salesOrdersContainer,
                        {marginTop: mvs(30)},
                      ]}>
                      <View style={styles.flatColor} />
                      <Text style={styles.salesOrdersText}>Total Orders</Text>
                    </View>
                    <View style={styles.salesOrdersContainer}>
                      <View
                        style={[styles.flatColor, {backgroundColor: '#A3CBC1'}]}
                      />
                      <Text
                        style={[styles.salesOrdersText, {color: COLORS.TITLE}]}>
                        Pending Orders
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      flex: 1 / 2,
                      // marginLeft: Platform.OS === 'ios' ? ms(-10) : 0,
                    }}>
                    {pieChartValue.length > 0 && (
                      <PieChart
                        strokeWidth={5}
                        strokeColor={'white'}
                        donut
                        // data={[
                        //   {
                        //     value: 100,
                        //     color: '#6C7278',
                        //     // text: `0%`,
                        //     shiftTextX: -5,
                        //     shiftTextY: 0,
                        //   },
                        // ]}
                        data={pieChartValue}
                        innerCircleColor="white"
                        innerCircleBorderWidth={4}
                        innerCircleBorderColor={'white'}
                        // showValuesAsLabels={true}
                        showText
                        textSize={11}
                        innerRadius={40}
                        radius={85}
                        fontWeight="600"
                        textColor="white"
                        // showTextBackground={true}
                      />
                    )}
                  </View>
                </View>

                {/* Order section */}
                <View style={styles.orderContainer}>
                  <View style={styles.orderInnerContainer}>
                    <Text style={styles.orderPrimaryText}>Total Orders</Text>
                    <Text
                      style={[
                        styles.orderValueText,
                        {fontSize: FONTSIZE.XXXL},
                      ]}>
                      {formatPriceNumber(orderValues?.orders_total)}
                    </Text>
                  </View>
                  <View style={styles.orderInnerContainer}>
                    <Text style={styles.orderKeyText}>Complete</Text>
                    <Text style={styles.orderValueText}>
                      {formatPriceNumber(orderValues?.complete_total)}
                    </Text>
                  </View>
                  <View style={styles.orderInnerContainer}>
                    <Text style={styles.orderKeyText}>Processing</Text>
                    <Text style={styles.orderValueText}>
                      {formatPriceNumber(orderValues?.processing_total)}
                    </Text>
                  </View>
                  <View style={styles.orderInnerContainer}>
                    <Text style={styles.orderKeyText}>Pending</Text>
                    <Text style={styles.orderValueText}>
                      {formatPriceNumber(orderValues?.pending_total)}
                    </Text>
                  </View>
                  <View style={styles.orderInnerContainer}>
                    <Text style={styles.orderKeyText}>Cancelled</Text>
                    <Text style={styles.orderValueText}>
                      {formatPriceNumber(orderValues?.canceled_total)}
                    </Text>
                  </View>
                </View>

                {/* Sales container */}
                <View style={styles.orderContainer}>
                  <View style={styles.orderInnerContainer}>
                    <Text style={styles.orderPrimaryText}>Total Sales</Text>
                    <Text
                      style={[
                        styles.orderValueText,
                        {fontSize: FONTSIZE.XXXL},
                      ]}>
                      {formatPriceNumber(orderValues?.totalSale)}
                    </Text>
                  </View>
                  <View style={styles.orderInnerContainer}>
                    <Text style={styles.orderKeyText}>Total Payouts</Text>
                    <Text style={styles.orderValueText}>
                      {displayPrice(
                        orderValues?.totalPayout,
                        orderValues?.ordercurrencycode,
                      )}
                    </Text>
                  </View>
                  <View style={styles.orderInnerContainer}>
                    <Text style={styles.orderKeyText}>Remaining Payout</Text>
                    <Text style={styles.orderValueText}>
                      {displayPrice(
                        orderValues?.remainingPayout,
                        orderValues?.ordercurrencycode,
                      )}
                    </Text>
                  </View>
                  <View style={styles.orderInnerContainer}>
                    <Text style={styles.orderKeyText}>Commission Paid</Text>
                    <Text style={styles.orderValueText}>
                      {displayPrice(
                        orderValues?.commissionPaid,
                        orderValues?.ordercurrencycode,
                      )}
                    </Text>
                  </View>
                </View>

                {/* Recent Order Sections */}
                <View style={styles.orderContainer}>
                  <View style={styles.orderInnerContainer}>
                    <Text style={styles.orderPrimaryText}>Recent Orders</Text>
                    <Text
                      style={[styles.viewAllText]}
                      onPress={() => {
                        
                        navigation.navigate('OrderDashboard');
                      }}>
                      View All
                    </Text>
                  </View>
                  <View style={{height: 1, backgroundColor: COLORS.BORDER}} />
                  <View style={[styles.orderInnerContainer, {flex: 1}]}>
                    <Text
                      style={[
                        styles.recentOrderTableKey,
                        {
                          flex: 6,
                          alignSelf: 'flex-start',
                          textAlign: 'left',
                        },
                      ]}>
                      ID
                    </Text>
                    <Text style={[styles.recentOrderTableKey, {flex: 5}]}>
                      Date
                    </Text>
                    {/* <Text style={[styles.recentOrderTableKey, {flex: 5}]}>
                      Amount
                    </Text> */}
                    <Text
                      style={[
                        styles.recentOrderTableKey,
                        {flex: 5, alignSelf: 'flex-end', textAlign: 'right'},
                      ]}>
                      Status
                    </Text>
                  </View>
                  {dashboardData?.length > 0 &&
                    dashboardData?.slice(0, 5)?.map((value, i) => {
                      return (
                        <View
                          style={[styles.orderInnerContainer, {flex: 1}]}
                          key={`${value?.entity_id}-${i}`}>
                          <Text
                            style={[
                              styles.recentOrderTableData,
                              {
                                flex: 6,
                                alignSelf: 'flex-start',
                                textAlign: 'left',
                              },
                            ]}>
                            {value?.increment_id}
                          </Text>
                          <Text
                            style={[styles.recentOrderTableData, {flex: 5}]}>
                            {formatDate(value?.created_at, 'DD-MMM-YYYY')}
                          </Text>
                          {/* {value?.order_total ? (
                            <Text
                              style={[
                                styles.recentOrderTableData,
                                {color: COLORS.ERROR, flex: 5},
                              ]}>
                              {displayPrice(
                                value?.order_total,
                                orderValues?.ordercurrencycode,
                              )}
                            </Text>
                          ) : (
                            <Text
                              style={[styles.recentOrderTableData, {flex: 5}]}>
                              {''}
                            </Text>
                          )} */}
                          <Text
                            style={[
                              styles.recentOrderTableData,
                              {
                                flex: 5,
                                alignSelf: 'flex-end',
                                textAlign: 'right',
                                color: statusColor[value?.order_status],
                                textTransform: 'capitalize',
                              },
                            ]}>
                            {value?.order_status}
                          </Text>
                        </View>
                      );
                    })}
                </View>
              </>
            ) : (
              <>
                <View style={styles.summeryContainer}>
                  <View
                    style={{
                      flex: 1 / 2,
                    }}>
                    <Text style={styles.summeryText}>Sales Summary</Text>
                    <Text style={styles.salesPresentText}>100%</Text>
                    {/* <View
                      style={[
                        styles.salesOrdersContainer,
                        {marginTop: mvs(15)},
                      ]}>
                      <View style={styles.flatColor} />
                      <Text style={styles.salesOrdersText}>Total Orders</Text>
                    </View>
                    <View style={[styles.salesOrdersContainer, {marginTop: 2}]}>
                      <View
                        style={[styles.flatColor, {backgroundColor: '#A3CBC1'}]}
                      />
                      <Text
                        style={[styles.salesOrdersText, {color: COLORS.TITLE}]}>
                        Pending Orders
                      </Text>
                    </View> */}
                    <View
                      style={[
                        styles.salesOrdersContainer,
                        {marginTop: mvs(20)},
                      ]}>
                      <View
                        style={[styles.flatColor, {backgroundColor: '#CECECE'}]}
                      />
                      <Text
                        style={[styles.salesOrdersText, {color: COLORS.TITLE}]}>
                        No Orders
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      flex: 1 / 2,
                      // marginLeft: Platform.OS === 'ios' ? ms(-10) : 0,
                    }}>
                    <PieChart
                      strokeWidth={5}
                      strokeColor={'white'}
                      donut
                      data={[
                        {
                          value: 100,
                          color: '#CECECE',
                          // text: `0%`,
                          shiftTextX: -5,
                          shiftTextY: 0,
                        },
                      ]}
                      innerCircleColor="white"
                      innerCircleBorderWidth={4}
                      innerCircleBorderColor={'white'}
                      // showValuesAsLabels={true}
                      showText
                      textSize={FONTSIZE.L}
                      innerRadius={40}
                      radius={80}
                      fontWeight="600"
                      textColor="white"
                      // showTextBackground={true}
                    />
                  </View>
                </View>

                {/* Order section */}
                <View style={styles.orderContainer}>
                  <View style={styles.orderInnerContainer}>
                    <Text style={styles.orderPrimaryText}>Total Orders</Text>
                    <Text
                      style={[
                        styles.orderValueText,
                        {fontSize: FONTSIZE.XXXL},
                      ]}>
                      0
                    </Text>
                  </View>
                  <View style={styles.orderInnerContainer}>
                    <Text style={styles.orderKeyText}>Processing</Text>
                    <Text style={styles.orderValueText}>0</Text>
                  </View>
                  <View style={styles.orderInnerContainer}>
                    <Text style={styles.orderKeyText}>Complete</Text>
                    <Text style={styles.orderValueText}>0</Text>
                  </View>
                  <View style={styles.orderInnerContainer}>
                    <Text style={styles.orderKeyText}>Cancelled</Text>
                    <Text style={styles.orderValueText}>0</Text>
                  </View>
                </View>

                {/* Sales container */}
                <View style={styles.orderContainer}>
                  <View style={styles.orderInnerContainer}>
                    <Text style={styles.orderPrimaryText}>Total Sales</Text>
                    <Text
                      style={[styles.orderValueText, {fontSize: FONTSIZE.XXL}]}>
                      {displayPrice(0, staticCurrency)}
                    </Text>
                  </View>
                  <View style={styles.orderInnerContainer}>
                    <Text style={styles.orderKeyText}>Total Payouts</Text>
                    <Text style={styles.orderValueText}>
                      {displayPrice(0, staticCurrency)}
                    </Text>
                  </View>
                  <View style={styles.orderInnerContainer}>
                    <Text style={styles.orderKeyText}>Remaining Payout</Text>
                    <Text style={styles.orderValueText}>
                      {displayPrice(0, staticCurrency)}
                    </Text>
                  </View>
                  <View style={styles.orderInnerContainer}>
                    <Text style={styles.orderKeyText}>Commission Paid</Text>
                    <Text style={styles.orderValueText}>
                      {displayPrice(0, staticCurrency)}
                    </Text>
                  </View>
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </View>
    </AppLayout>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  headerContainer: {
    // paddingTop:
    //   StatusBar.currentHeight + (Platform.OS === 'android' ? mvs(30) : mvs(80)),
    paddingHorizontal: ms(15),
    paddingBottom: 50,
  },
  layout: {
    paddingHorizontal: null,
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  summeryContainer: {
    flexDirection: 'row',
    paddingVertical: mvs(16),
    paddingHorizontal: ms(15),
    borderWidth: 1,
    borderRadius: s(14),
    borderColor: COLORS.BORDER,
    marginTop: ms(16),
  },
  summeryText: {
    color: COLORS.PRIMARY,
    fontFamily: FONTS.workSansSemiBold,
    fontSize: FONTSIZE.XXL,
  },
  salesPresentText: {
    color: COLORS.BLACK,
    fontFamily: FONTS.workSansSemiBold,
    fontSize: FONTSIZE.XXXXL,
    marginTop: mvs(10),
  },
  salesOrdersText: {
    color: COLORS.TITLE,
    fontSize: FONTSIZE.L,
    fontFamily: FONTS.workSansMedium,
    textAlign: 'left',
  },
  salesOrdersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: mvs(15),
  },
  mainContainer: {
    flex: 1,
    borderTopLeftRadius: ms(30),
    borderTopRightRadius: ms(30),
    backgroundColor: COLORS.WHITE,
    paddingTop: 15,
    top: mvs(-30),
  },
  headingText: {
    fontFamily: FONTS.workSansSemiBold,
    fontSize: FONTSIZE.XL,
    color: COLORS.WHITE,
    alignSelf: 'center',
  },
  orderPrimaryText: {
    color: COLORS.PRIMARY,
    fontFamily: FONTS.workSansSemiBold,
    fontSize: FONTSIZE.XL,
  },
  orderValueText: {
    color: COLORS.BLACK,
    fontFamily: FONTS.workSansSemiBold,
    fontSize: FONTSIZE.L,
  },
  orderKeyText: {
    color: COLORS.BLACK,
    fontFamily: FONTS.workSansRegular,
    fontSize: FONTSIZE.L,
  },
  recentOrderTableKey: {
    color: COLORS.BLACK,
    fontFamily: FONTS.workSansMedium,
    fontSize: FONTSIZE.L,
  },
  recentOrderTableData: {
    color: COLORS.BLACK,
    fontFamily: FONTS.workSansRegular,
    fontSize: FONTSIZE.L,
  },
  orderContainer: {
    paddingVertical: ms(16),
    paddingHorizontal: ms(20),
    borderWidth: 1,
    borderRadius: s(14),
    borderColor: COLORS.BORDER,
    marginTop: ms(16),
    flex: 1,
    gap: s(10),
  },
  orderInnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  viewAllText: {
    color: COLORS.PRIMARY,
    fontFamily: FONTS.workSansMedium,
    fontSize: FONTSIZE.L,
  },
  flatColor: {
    backgroundColor: COLORS.PRIMARY,
    height: mvs(8),
    width: ms(15),
    borderRadius: 3,
  },
  dropdownContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // gap: ms(10),
  },
  dropdownStyle: {
    paddingHorizontal: null,
    backgroundColor: 'white',
    borderColor: COLORS.BORDER,
    borderWidth: 1,
    paddingVertical: null,
    marginTop: null,
    flex: 1,
    height: mvs(45),
  },
});

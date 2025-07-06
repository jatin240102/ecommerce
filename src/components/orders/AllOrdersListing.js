import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {ms, mvs, s} from 'react-native-size-matters';
import {FONTS, FONTSIZE} from '../../constant/fonts';
import {COLORS} from '../../constant/color';
import {displayPrice, formatDate} from '../../utils/global';
import {useNavigation} from '@react-navigation/native';
import {useGlobalData} from '../../context/AppContext';

const AllOrdersListing = ({index, item, isAllOrders = false, onClick}) => {
  const navigation = useNavigation();
  const {setOrderIncrementId, setOrderEntityId, setOrderDetailHeadTitle} =
    useGlobalData();
  const statusColor = {
    complete: '#3BB349',
    pending: COLORS.YELLOW,
    canceled: '#DB0B0B',
    processing: COLORS.TITLE,
  };
  // console.log('item-----', item)
  const handleNavigate = items => {
    // if (isAllOrders) {
      onClick();
    // }
    setOrderIncrementId(items?.increment_id);
    setOrderEntityId(items?.entity_id);
    setOrderDetailHeadTitle(item?.increment_id);

    navigation.navigate('OrderDetailDashboard', {
      screen: 'OrderDetail',
      params: {orderId: item?.increment_id},
    });
  };

  return (
    <TouchableOpacity
      key={`${index}-${item?.entity_id}-${item?.created_at}-${index}`}
      activeOpacity={0.9}
      onPress={() => handleNavigate(item)}
      style={[styles.mainContainer]}>
      <View style={styles.orderContainer}>
        {item?.increment_id && (
          <Text numberOfLines={2} style={styles.orderId}>
            Order ID#: {item?.increment_id}
          </Text>
        )}
        {isAllOrders && item?.status && (
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              numberOfLines={2}
              style={[
                styles.orderStatusColor,
                {color: statusColor[item?.status]},
              ]}>
              {'● '}
            </Text>
            <Text
              numberOfLines={2}
              style={[
                styles.orderStatusColor,
                {color: statusColor[item.status]},
              ]}>
              {item?.status}
            </Text>
          </View>
        )}
      </View>
      {item?.created_at && (
        <Text numberOfLines={2} style={styles.orderDate}>
          {formatDate(item?.created_at, 'DD MMM, YYYY, hh:mm:ss A')}
        </Text>
      )}
      {item?.itemdata &&
        item?.itemdata?.length > 0 &&
        item?.itemdata?.map((value, i) => {
          return (
            <React.Fragment
              key={`${i}-${value?.name}-${i}-${value?.thumbnail}`}>
              {value?.name && (
                <Text numberOfLines={2} style={styles.desc}>
                  {value?.name}
                </Text>
              )}
              <View style={styles.statusView}>
                {value?.qty_ordered && (
                  <Text numberOfLines={2} style={styles.orderStatus}>
                    {'Ordered: '}
                    <Text style={{color: COLORS.BLACK}}>
                      {displayPrice(value?.qty_ordered, '', true)}
                    </Text>
                  </Text>
                )}
                {value?.qty_invoiced && (
                  <Text numberOfLines={2} style={styles.orderStatus}>
                    {'Invoiced: '}
                    <Text style={{color: COLORS.BLACK}}>
                      {displayPrice(value?.qty_invoiced, '', true)}
                    </Text>
                  </Text>
                )}
                {value?.qty_shipped && (
                  <Text numberOfLines={2} style={styles.orderStatus}>
                    {'Shipped: '}
                    <Text style={{color: COLORS.BLACK}}>
                      {displayPrice(value?.qty_shipped, '', true)}
                    </Text>
                  </Text>
                )}
              </View>
            </React.Fragment>
          );
        })}

      {item?.totalOrderedAmount && (
        <Text style={styles.priceText}>
          {item?.totalOrderedAmount?.value}
          {/* {displayPrice(
            item?.totalOrderedAmount?.value,
            item?.order_currency_code,
          )} */}
        </Text>
      )}
      {item?.customer_firstname && (
        <Text numberOfLines={2} style={styles.userName}>
          {`${item?.customer_firstname} ${item?.customer_lastname}`}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default AllOrdersListing;

const styles = StyleSheet.create({
  mainContainer: {
    // flexDirection: 'row',
    // alignItems: 'center',
    paddingVertical: ms(16),
    paddingHorizontal: ms(15),
    borderWidth: 1,
    borderRadius: s(5),
    borderColor: COLORS.BORDER,
    marginTop: ms(16),
  },
  orderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userName: {
    fontSize: FONTSIZE.L,
    color: COLORS.PRIMARY,
    fontFamily: FONTS.workSansMedium,
    marginTop: mvs(5),
  },
  priceText: {
    fontSize: FONTSIZE.L,
    color: COLORS.BLACK,
    fontFamily: FONTS.workSansSemiBold,
    marginTop: mvs(5),
  },
  orderStatus: {
    fontSize: FONTSIZE.L,
    color: COLORS.TITLE,
    fontFamily: FONTS.workSansSemiBold,
  },
  statusView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: mvs(5),
    gap: 10,
  },
  desc: {
    fontSize: FONTSIZE.L,
    color: COLORS.BLACK,
    fontFamily: FONTS.workSansRegular,
    marginTop: mvs(5),
  },
  orderDate: {
    fontSize: FONTSIZE.L,
    color: COLORS.TITLE,
    fontFamily: FONTS.workSansSemiBold,
    marginTop: mvs(10),
  },
  orderId: {
    fontSize: FONTSIZE.L,
    color: COLORS.BLACK,
    fontFamily: FONTS.workSansSemiBold,
  },
  orderStatusColor: {
    fontSize: FONTSIZE.L,
    color: COLORS.PRIMARY,
    fontFamily: FONTS.workSansSemiBold,
    textTransform: 'capitalize',
  },
});

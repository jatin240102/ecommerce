import React, {useEffect, useState} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {ms, mvs, s} from 'react-native-size-matters';
import {COLORS} from '../../../constant/color';
import {FONTS, FONTSIZE} from '../../../constant/fonts';
import {displayPrice, formatDate, showToast} from '../../../utils/global';
import {showLoader} from '../../../components/common/AppLoader';
import {SELLER_ORDER_DETAIL} from '../../../queries/ProductQueries';
import {useLazyQuery} from '@apollo/client';
import {IMAGES} from '../../../constant/imagePath';
import {useGlobalData} from '../../../context/AppContext';
import AppLoading from '../../../components/common/AppLoading';

const OrderDetail = ({route}) => {
  console.log('route?.params------', route.params);
  const navigation = useNavigation();
  const {orderIncrementId} = useGlobalData();
  const [orderDetailData, setOrderRecordData] = useState([]);
  const [detailLoading, setDetailLoading] = useState(true);

  const [imageError, setImageError] = useState(null);
  const [isCollapse, setIsCollapse] = useState(true);
  const [fetchOrderDetail, {loading}] = useLazyQuery(SELLER_ORDER_DETAIL, {
    onCompleted: response => {
      setDetailLoading(false);
      // hideLoader();
      console.log('response======', response);
      if (response?.sellerCustomOrderList?.items?.length > 0) {
        setOrderRecordData(response?.sellerCustomOrderList?.items);
      } else {
        setDetailLoading(false);
      }
    },
    onError: error => {
      setDetailLoading(false);
      // hideLoader();
      if (error.graphQLErrors) {
        error.graphQLErrors.forEach(err => {
          showToast(err.message.toLocaleUpperCase);
          console.log(err.message, 'dasfjhsdfg');
        });
      }
      if (error.networkError) {
        showToast(error.networkError.message);
      }
    },
    fetchPolicy: 'cache-and-network',
  });

  // useEffect(() => {
  //   // if (loading) {
  //     showLoader();
  //   // } else {
  //   //   hideLoader();
  //   // }
  // }, []);

  useEffect(() => {
    fetchOrderDetail({
      variables: {
        status: '',
        customer: '',
        increment_id: route?.params?.orderId
          ? route?.params?.orderId
          : orderIncrementId,
        start_date: '',
        end_date: '',
        searchText: '',
        pageSize: 10,
        currentPage: 1,
      },
    });
    showLoader();
  }, []);

  const statusColor = {
    complete: '#3BB349',
    pending: COLORS.YELLOW,
    canceled: '#DB0B0B',
    processing: COLORS.TITLE,
  };

  return (
    <View style={styles.container}>
      <AppLoading appLoading={detailLoading} />
      <FlatList
        data={orderDetailData}
        keyExtractor={(item, index) =>
          item?.created_at
            ? `${item?.created_at.toString()}-${index.toString()}`
            : index.toString()
        }
        renderItem={({item, index}) => {
          return (
            <React.Fragment
              key={
                item?.entity_id
                  ? `${item?.entity_id.toString()}-${item?.increment_id.toString()}`
                  : index.toString()
              }>
              <TouchableOpacity
                activeOpacity={0.9}
                style={[styles.mainContainer]}>
                <View style={styles.orderContainer}>
                  <Text
                    numberOfLines={2}
                    style={[
                      styles.DetailText,
                      {color: COLORS.BLACK, fontSize: FONTSIZE.XL},
                    ]}>
                    {'Order Details'}
                  </Text>
                  <Text
                    numberOfLines={2}
                    style={[
                      styles.DetailText,
                      {
                        color: statusColor[item?.status],
                        textTransform: 'capitalize',
                      },
                    ]}>
                    {`●  ${item?.status}`}
                  </Text>
                </View>
                <View style={styles.orderContainer}>
                  <Text numberOfLines={2} style={styles.DetailText}>
                    {'Order ID'}
                  </Text>
                  <Text numberOfLines={2} style={styles.DetailText}>
                    {item.increment_id}
                  </Text>
                </View>
                <View style={styles.orderContainer}>
                  <Text numberOfLines={2} style={styles.DetailText}>
                    {'Order Placed'}
                  </Text>
                  <Text numberOfLines={2} style={styles.DetailText}>
                    {formatDate(item?.created_at, 'DD MMM, YYYY, hh:mm:ss A')}
                  </Text>
                </View>
                {item.totalOrderedAmount && (
                  <View style={styles.orderContainer}>
                    <Text numberOfLines={2} style={styles.DetailText}>
                      {'Total'}
                    </Text>
                    <Text numberOfLines={2} style={styles.DetailText}>
                      {item.totalOrderedAmount?.value}
                    </Text>
                  </View>
                )}
                {item.subtotal && (
                  <View style={styles.orderContainer}>
                    <Text numberOfLines={2} style={styles.DetailText}>
                      {item?.subtotal?.title}
                    </Text>
                    <Text numberOfLines={2} style={styles.DetailText}>
                      {item?.subtotal?.value}
                    </Text>
                  </View>
                )}
                {item?.totalcopuondiscount && (
                  <View style={styles.orderContainer}>
                    <Text numberOfLines={2} style={styles.DetailText}>
                      {'Discount'}
                    </Text>
                    <Text numberOfLines={2} style={styles.DetailText}>
                      {displayPrice(item?.totalcopuondiscount?.value)}
                    </Text>
                  </View>
                )}
                <View style={styles.orderContainer}>
                  <Text numberOfLines={2} style={styles.DetailText}>
                    {item?.tax?.title}
                  </Text>
                  <Text numberOfLines={2} style={styles.DetailText}>
                    {item?.tax?.value}
                  </Text>
                </View>
                <View style={styles.orderContainer}>
                  <Text numberOfLines={2} style={styles.DetailText}>
                    {item?.totalOrderedAmount?.title}
                  </Text>
                  <Text numberOfLines={2} style={styles.DetailText}>
                    {item?.totalOrderedAmount?.value}
                  </Text>
                </View>
                <View style={styles.orderContainer}>
                  <Text numberOfLines={2} style={styles.DetailText}>
                    {item?.totalVendorAmount?.title}
                  </Text>
                  <Text numberOfLines={2} style={styles.DetailText}>
                    {item?.totalVendorAmount?.value}
                  </Text>
                </View>
                <View style={styles.orderContainer}>
                  <Text numberOfLines={2} style={styles.DetailText}>
                    {item?.totalAdminComission?.title}
                  </Text>
                  <Text numberOfLines={2} style={styles.DetailText}>
                    {item?.totalAdminComission?.value}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={1}
                style={[styles.mainContainer, {marginTop: mvs(15)}]}>
                <Text
                  numberOfLines={2}
                  style={[
                    styles.DetailText,
                    {color: COLORS.BLACK, fontSize: FONTSIZE.XL},
                  ]}>
                  {`Order #${item?.increment_id}`}
                </Text>
                <View
                  style={{
                    height: 1,
                    backgroundColor: COLORS.BORDER,
                    marginTop: mvs(10),
                  }}
                />
                <View style={{marginTop: mvs(10), gap: 10}}>
                  {item?.itemdata &&
                    item?.itemdata?.length > 0 &&
                    item?.itemdata?.map((value, indexs) => {
                      const flatLineLength =
                        item?.itemdata?.length === indexs + 1
                          ? {}
                          : styles.flatLine;
                      return (
                        <React.Fragment
                          key={`${value?.name}-${indexs}-${value?.thumbnail}`}>
                          <View style={{flexDirection: 'row', gap: 10}}>
                            <Image
                              source={
                                imageError
                                  ? IMAGES.ic_defaultImage
                                  : {uri: value?.thumbnail}
                              }
                              style={styles.productImage}
                              onError={() => setImageError(true)}
                            />
                            <View style={{flex: 8}}>
                              {value?.name && (
                                <Text
                                  style={{
                                    color: COLORS.BLACK,
                                    fontFamily: FONTS.workSansMedium,
                                    fontSize: FONTSIZE.L,
                                  }}
                                  numberOfLines={3}>
                                  {value?.name}
                                </Text>
                              )}
                              {value?.row_total && (
                                <Text
                                  style={{
                                    color: COLORS.ERROR,
                                    fontFamily: FONTS.workSansMedium,
                                    fontSize: FONTSIZE.L,
                                    marginTop: 5,
                                  }}
                                  numberOfLines={3}>
                                  {value?.row_total}
                                </Text>
                              )}
                              {value?.qty_ordered && (
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    gap: 8,
                                    alignItems: 'center',
                                  }}>
                                  <Text
                                    style={{
                                      color: COLORS.TITLE,
                                      fontFamily: FONTS.workSansMedium,
                                      fontSize: FONTSIZE.L,
                                    }}
                                    numberOfLines={3}>
                                    {'Qty:'}
                                  </Text>
                                  <Text
                                    style={{
                                      color: COLORS.TITLE,
                                      fontFamily: FONTS.workSansMedium,
                                      fontSize: FONTSIZE.L,
                                    }}
                                    numberOfLines={3}>
                                    {value?.qty_ordered}
                                  </Text>
                                </View>
                              )}
                            </View>
                          </View>
                          <View style={flatLineLength} />
                        </React.Fragment>
                      );
                    })}
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.9}
                style={[styles.mainContainer, {marginTop: mvs(15)}]}>
                <TouchableOpacity
                  style={[styles.orderContainer]}
                  activeOpacity={0.8}
                  onPress={() => setIsCollapse(!isCollapse)}>
                  <Text
                    numberOfLines={2}
                    style={[
                      styles.DetailText,
                      {color: COLORS.BLACK, fontSize: FONTSIZE.XL},
                    ]}>
                    {'Buyer Information'}
                  </Text>
                  <Image
                    style={{height: 20, width: 15, resizeMode: 'contain'}}
                    source={!isCollapse ? IMAGES.downArrow : IMAGES.arrowUp}
                  />
                </TouchableOpacity>
                
                {isCollapse && (
                  <>
                    <View style={styles.orderContainer}>
                      <Text numberOfLines={2} style={styles.DetailText}>
                        {'Customer Name:'}
                      </Text>
                      <Text numberOfLines={2} style={styles.DetailText}>
                        {`${item.customer_firstname} ${item.customer_lastname}`}
                      </Text>
                    </View>
                    <View style={styles.orderContainer}>
                      <Text numberOfLines={2} style={styles.DetailText}>
                        {'Email Address:'}
                      </Text>
                      <Text numberOfLines={2} style={styles.DetailText}>
                        {item?.email}
                      </Text>
                    </View>
                    <View style={[styles.flatLine, {marginTop: mvs(10)}]} />
                    <View style={{marginTop: mvs(10)}}>
                      <Text
                        numberOfLines={2}
                        style={[
                          styles.DetailText,
                          {
                            color: COLORS.BLACK,
                            fontSize: FONTSIZE.XL,
                          },
                        ]}>
                        {'Shipping Address'}
                      </Text>
                      <Text numberOfLines={2} style={styles.DetailText}>
                        {item?.shippingaddress && item?.shippingaddress?.street
                          ? item?.shippingaddress?.street
                          : item?.billingaddress?.street}
                      </Text>
                      <Text numberOfLines={2} style={styles.DetailText}>
                        {`${
                          item?.shippingaddress && item?.shippingaddress?.city
                            ? item?.shippingaddress?.city
                            : item?.billingaddress?.city
                        } ${
                          item?.shippingaddress &&
                          item?.shippingaddress?.postcode
                            ? item?.shippingaddress?.postcode
                            : item?.billingaddress?.postcode
                        } `}
                      </Text>
                      {(item?.shippingaddress?.region ||
                        item?.billingaddress?.region) && (
                        <Text numberOfLines={2} style={styles.DetailText}>
                          {item?.shippingaddress &&
                          item?.shippingaddress?.region
                            ? item?.shippingaddress?.region
                            : item?.billingaddress?.region}
                        </Text>
                      )}
                      <Text numberOfLines={2} style={styles.DetailText}>
                        {item?.shippingaddress &&
                        item?.shippingaddress?.country_id
                          ? item?.shippingaddress?.country_id
                          : item?.billingaddress?.country_id}
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          gap: 10,
                          alignItems: 'center',
                        }}>
                        <Text numberOfLines={2} style={styles.DetailText}>
                          {'T:'}
                        </Text>
                        <Text
                          numberOfLines={2}
                          style={[styles.DetailText, {color: COLORS.PRIMARY}]}>
                          {item?.shippingaddress &&
                          item?.shippingaddress?.telephone
                            ? item?.shippingaddress?.telephone
                            : item?.billingaddress?.telephone}
                        </Text>
                      </View>
                    </View>
                    <View style={[styles.flatLine, {marginTop: mvs(10)}]} />
                    <View style={{marginTop: mvs(10)}}>
                      <Text
                        numberOfLines={2}
                        style={[
                          styles.DetailText,
                          {
                            color: COLORS.BLACK,
                            fontSize: FONTSIZE.XL,
                          },
                        ]}>
                        {'Billing Address'}
                      </Text>
                      <Text numberOfLines={2} style={styles.DetailText}>
                        {item?.billingaddress && item?.billingaddress?.street
                          ? item?.billingaddress?.street
                          : item?.shippingaddress?.street}
                      </Text>
                      <Text numberOfLines={2} style={styles.DetailText}>
                        {`${
                          item?.billingaddress && item?.billingaddress?.city
                            ? item?.billingaddress?.city
                            : item?.shippingaddress?.city
                        } ${
                          item?.billingaddress && item?.billingaddress?.postcode
                            ? item?.billingaddress?.postcode
                            : item?.shippingaddress?.postcode
                        } `}
                      </Text>
                      {(item?.billingaddress?.region ||
                        item?.billingaddress?.region) && (
                        <Text numberOfLines={2} style={styles.DetailText}>
                          {item?.billingaddress && item?.billingaddress?.region
                            ? item?.billingaddress?.region
                            : item?.shippingaddress?.region}
                        </Text>
                      )}
                      <Text numberOfLines={2} style={styles.DetailText}>
                        {item?.billingaddress &&
                        item?.billingaddress?.country_id
                          ? item?.billingaddress?.country_id
                          : item?.shippingaddress?.country_id}
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          gap: 10,
                          alignItems: 'center',
                        }}>
                        <Text numberOfLines={2} style={styles.DetailText}>
                          {'T:'}
                        </Text>
                        <Text
                          numberOfLines={2}
                          style={[styles.DetailText, {color: COLORS.PRIMARY}]}>
                          {item?.billingaddress &&
                          item?.billingaddress?.telephone
                            ? item?.billingaddress?.telephone
                            : item?.shippingaddress?.telephone}
                        </Text>
                      </View>
                    </View>
                  </>
                )}
              </TouchableOpacity>

              {item?.shippingMethodData && (
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={[styles.mainContainer, {marginTop: mvs(15)}]}>
                  <Text
                    numberOfLines={2}
                    style={[
                      styles.DetailText,
                      {color: COLORS.BLACK, fontSize: FONTSIZE.XL},
                    ]}>
                    {item?.shippingMethodData?.title}
                  </Text>
                  <Text numberOfLines={2} style={styles.DetailText}>
                    {item?.shippingMethodData?.value}
                  </Text>
                </TouchableOpacity>
              )}
              {item?.paymentMethodData && (
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={[styles.mainContainer, {marginTop: mvs(15)}]}>
                  <Text
                    numberOfLines={2}
                    style={[
                      styles.DetailText,
                      {color: COLORS.BLACK, fontSize: FONTSIZE.XL},
                    ]}>
                    {item?.paymentMethodData?.title}
                  </Text>
                  <Text numberOfLines={2} style={styles.DetailText}>
                    {item?.paymentMethodData?.value}
                  </Text>
                </TouchableOpacity>
              )}
            </React.Fragment>
          );
        }}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default OrderDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    paddingTop: mvs(20),
    paddingBottom: mvs(10),
  },
  list: {
    paddingHorizontal: ms(15),
  },
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
  DetailText: {
    fontSize: FONTSIZE.L,
    color: COLORS.TITLE,
    fontFamily: FONTS.workSansMedium,
    marginTop: mvs(5),
  },
  productImage: {
    width: ms(100),
    height: mvs(80),
    flex: 4,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: COLORS.BORDER,
    aspectRatio: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    overflow: 'hidden',
  },
  flatLine: {
    height: 1,
    backgroundColor: COLORS.BORDER,
  },
});

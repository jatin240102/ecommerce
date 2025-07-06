import {
  Animated,
  Dimensions,
  Image,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {FONTS, FONTSIZE} from '../../../constant/fonts';
import {COLORS} from '../../../constant/color';
import {ms, mvs, s} from 'react-native-size-matters';
import NoRecordFound from '../../../components/common/NoRecordFound';
import {useGlobalData} from '../../../context/AppContext';
import {useLazyQuery, useMutation} from '@apollo/client';
import {
  SELLER_ADD_TRACKING,
  SELLER_SHIPMENT_DETAIL,
} from '../../../queries/ProductQueries';
import {hideLoader, showLoader} from '../../../components/common/AppLoader';
import {formatDate, showToast, sWidth} from '../../../utils/global';
import {IMAGES} from '../../../constant/imagePath';
import TextInputBox from '../../../components/common/TextInputBox';
import LinearGradient from 'react-native-linear-gradient';
import AppLoading from '../../../components/common/AppLoading';

const OrderShipmentDetail = ({navigation, route}) => {
  const {setIsShipmentLevel1Active, orderEntityId, shipmentId} =
    useGlobalData();
  const [shipmentDetail, setShipmentDetail] = useState(null);
  const [shipmentDetailLoading, setShipmentDetailLoading] = useState(true);
  const [addShipmentValues, setAddShipmentValues] = useState({
    number: '',
    title: '',
  });
  const [addShipError, setAddShipError] = useState({
    number: '',
    title: '',
  });
  const [isAddShipment, setIsAddShipment] = useState(false);
  console.log('route', route);
  const [fetchInvoiceDetail, {loading, refetch}] = useLazyQuery(
    SELLER_SHIPMENT_DETAIL,
    {
      onCompleted: response => {
        console.log('response[[[', response);
        setShipmentDetailLoading(false);
        setIsShipmentLevel1Active(true);
        hideLoader();
        if (response?.sellerGetShipmentDetails) {
          const invoiceRecord = response?.sellerGetShipmentDetails;
          setShipmentDetail(invoiceRecord);
        } else {
          hideLoader();
          setShipmentDetailLoading(false);
        }
      },
      onError: error => {
        setIsShipmentLevel1Active(true);
        setShipmentDetailLoading(false);
        hideLoader();
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
    },
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchInvoiceDetail({
        variables: {
          orderId: route?.params?.orderId,
          shipmentId: route?.params?.shipmentId,
        },
      });
      setIsShipmentLevel1Active(true);
    });
    return unsubscribe;
  }, [navigation]);

  // useEffect(() => {
  //   if (shipmentDetailLoading) {
  //     showLoader();
  //   } else {
  //     hideLoader();
  //   }
  // }, [loading]);

  const openModal = () => {
    setIsAddShipment(true);
  };

  const closeModal = () => {
    setIsAddShipment(false);
  };
  const checkValid = () => {
    const newErrors = {};
    if (!addShipmentValues.number.trim()) {
      newErrors.number = 'Please enter tracking number';
    }
    if (!addShipmentValues.title.trim()) {
      newErrors.title = 'Please enter carrier';
    }

    if (Object.keys(newErrors).length > 0) {
      setAddShipError(newErrors);
      return false;
    }
    return true;
  };

  const [sellerAddTracking, {loading: msLoading}] = useMutation(
    SELLER_ADD_TRACKING,
    {
      onCompleted: response => {
        console.log('track response', response);
        hideLoader();
        fetchInvoiceDetail({
          variables: {
            orderId: route?.params?.orderId
              ? route?.params?.orderId
              : orderEntityId,
            shipmentId: route?.params?.shipmentId
              ? route?.params?.shipmentId
              : shipmentId,
          },
        });
      },
      onError: error => {
        console.log('error-----', error);
        hideLoader();
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
    },
  );
  console.log('msLoading-----', msLoading);
  const handleAddNewTracking = () => {
    const isValid = checkValid();
    console.log('isValid----', isValid);
    if (isValid) {
      showLoader();
      console.log('?????????', {
        orderId: Number(orderEntityId),
        shipmentId: Number(shipmentId),
        trackingId: addShipmentValues.number,
        carrier: addShipmentValues.title,
      });
      sellerAddTracking({
        variables: {
          orderId: orderEntityId,
          shipmentId: shipmentId,
          trackingId: addShipmentValues.number,
          carrier: addShipmentValues.title,
        },
      });
      closeModal();
      setAddShipmentValues({
        ...addShipmentValues,
        title: '',
        number: '',
      });
      setAddShipError({
        ...addShipError,
        title: '',
        number: '',
      });
    }
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingVertical: mvs(16),
        backgroundColor: COLORS.WHITE,
        paddingHorizontal: ms(15),
        flex: shipmentDetail ? null : 1,
      }}
      style={{
        flex: 1,
        backgroundColor: COLORS.WHITE,
      }}>
      <AppLoading appLoading={shipmentDetailLoading} />
      {isAddShipment && (
        <Modal
          transparent
          visible={isAddShipment}
          animationType="none"
          style={{alignItems: 'center', margin: 0, justifyContent: 'center'}}>
          {/* <TouchableOpacity
            style={{justifyContent: 'center'}}
            onPress={()=>closeModal}
          /> */}

          <View style={[styles.modalContent, {margin: ms(15)}]}>
            <TouchableOpacity
              onPress={() => {
                closeModal();
                setAddShipmentValues({
                  ...addShipmentValues,
                  title: '',
                  number: '',
                });
                setAddShipError({
                  ...addShipError,
                  title: '',
                  number: '',
                });
              }}
              activeOpacity={0.8}
              style={{
                height: 26,
                width: 26,
                position: 'absolute',
                right: 18,
                top: 13,
                backgroundColor: COLORS.PRIMARY,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 50,
              }}>
              <Image
                source={IMAGES.ic_closeIcon}
                tintColor={COLORS.WHITE}
                style={{
                  height: 12,
                  width: 12,
                  resizeMode: 'cover',
                }}
              />
            </TouchableOpacity>
            <TextInputBox
              title={'Tracking number'}
              value={addShipmentValues.number}
              onChangeText={item => {
                setAddShipmentValues({
                  ...addShipmentValues,
                  number: item,
                });
                setAddShipError({
                  ...addShipError,
                  number: '',
                });
              }}
              placeholder={'Enter tracking number'}
              containerStyle={{marginTop: mvs(30), marginHorizontal: 15}}
              error={addShipError.number}
            />
            <TextInputBox
              title={'Carrier title'}
              value={addShipmentValues.title}
              onChangeText={item => {
                setAddShipmentValues({
                  ...addShipmentValues,
                  title: item,
                });
                setAddShipError({
                  ...addShipError,
                  title: '',
                });
              }}
              placeholder={'Enter carrier title'}
              containerStyle={{marginTop: mvs(15), marginHorizontal: 15}}
              error={addShipError.title}
            />
            <TouchableOpacity
              style={{
                paddingVertical: mvs(10),
                marginHorizontal: 20,
                borderRadius: ms(8),
                marginTop: 15,
              }}
              activeOpacity={0.9}
              onPress={() => handleAddNewTracking()}>
              <LinearGradient
                colors={['#1A7F65', '#115543']}
                style={{
                  alignItems: 'center',
                  borderRadius: ms(8),
                  paddingVertical: mvs(10),
                }}
                start={{x: 0.2, y: 0}}
                end={{x: 0.2, y: 1}}>
                <Text
                  style={{
                    color: COLORS.WHITE,
                    fontSize: FONTSIZE.XL,
                    fontFamily: FONTS.workSansMedium,
                  }}>
                  {'Add'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Modal>
      )}

      {shipmentDetail ? (
        <React.Fragment>
          {shipmentDetail?.shippingCarriers &&
          shipmentDetail?.shippingCarriers?.length > 0 ? (
            <TouchableOpacity
              activeOpacity={0.9}
              style={[styles.mainContainer, {borderRadius: 12}]}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={[styles.recentOrderTableKey, {fontSize: FONTSIZE.XL}]}>
                  Shipment & Tracking
                </Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => openModal()}>
                  <Image
                    source={require('../../../assets/images/addshipmentIcon.png')}
                    style={{height: 30, width: 30, resizeMode: 'cover'}}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  height: 1,
                  backgroundColor: COLORS.BORDER,
                  marginTop: 10,
                }}
              />
              <View style={[styles.orderInnerContainer, {gap: 10}]}>
                <Text style={[styles.recentOrderTableKey]}>Carrier</Text>
                <Text style={styles.recentOrderTableKey}>Title</Text>
                <Text style={[styles.recentOrderTableKey]}>Number</Text>
                <Text style={styles.recentOrderTableKey}>Date</Text>
              </View>
              {shipmentDetail?.shippingCarriers?.map((v, i) => {
                const flatLineLength =
                  shipmentDetail?.shippingCarriers?.length === i + 1
                    ? {}
                    : styles.flatLine;
                return (
                  <>
                    <View
                      key={`${i}-${v?.number}-${v?.carrier}-${i}`}
                      style={[styles.orderInnerContainer, {gap: 10}]}>
                      <Text
                        style={[styles.recentOrderTableValue, {flex: 5}]}
                        numberOfLines={2}>
                        {v?.carrier}
                      </Text>
                      <Text
                        style={[styles.recentOrderTableValue, {flex: 3.5}]}
                        numberOfLines={2}>
                        {v?.title}
                      </Text>
                      <Text
                        style={[styles.recentOrderTableValue, {flex: 3}]}
                        numberOfLines={2}>
                        {v?.number}
                      </Text>
                      <Text
                        style={[
                          styles.recentOrderTableValue,
                          {alignItems: 'flex-end',flex:3.5},
                        ]}
                        numberOfLines={2}>
                        {formatDate(v?.date)}
                      </Text>
                    </View>
                    <View style={flatLineLength} />
                  </>
                );
              })}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              activeOpacity={0.9}
              style={[styles.mainContainer, {borderRadius: 12}]}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={[styles.recentOrderTableKey, {fontSize: FONTSIZE.XL}]}>
                  Shipment & Tracking
                </Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => openModal()}>
                  <Image
                    source={require('../../../assets/images/addshipmentIcon.png')}
                    style={{height: 22, width: 22, resizeMode: 'cover'}}
                  />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}

          {shipmentDetail?.items && shipmentDetail?.items?.length > 0 && (
            <TouchableOpacity
              activeOpacity={0.9}
              style={[styles.mainContainer]}>
              <Text
                style={[styles.recentOrderTableKey, {fontSize: FONTSIZE.XL}]}>
                Item Shipped
              </Text>
              <View
                style={{
                  height: 1,
                  backgroundColor: COLORS.BORDER,
                  // marginHorizontal: 10,
                  marginTop: 10,
                }}
              />
              <View style={styles.orderInnerContainer}>
                <Text style={styles.recentOrderTableKey}>Product Name</Text>
                <Text style={styles.recentOrderTableKey}>SKU</Text>
                <Text style={styles.recentOrderTableKey}>Qty Shipped</Text>
              </View>
              {shipmentDetail?.items?.map((v, i) => {
                const flatLineLength =
                  shipmentDetail?.items?.length === i + 1
                    ? {}
                    : styles.flatLine;
                return (
                  <>
                    <View
                      key={`${i}-${v?.sku}-${i}-${5.59}`}
                      style={styles.orderInnerContainer}>
                      <Text
                        style={[styles.recentOrderTableValue, {flex: 5}]}
                        numberOfLines={1}>
                        {v?.productName}
                      </Text>
                      <Text style={[styles.recentOrderTableValue, {flex: 4}]}>
                        {v?.sku}
                      </Text>
                      <Text style={[styles.recentOrderTableValue, {flex: 2}]}>
                        {v?.qty}
                      </Text>
                    </View>
                    <View style={flatLineLength} />
                  </>
                );
              })}
            </TouchableOpacity>
          )}
          <TouchableOpacity activeOpacity={0.9} style={[styles.mainContainer]}>
            {shipmentDetail?.orderData?.label && (
              <View style={styles.rowOrderContainer}>
                <Text numberOfLines={2} style={styles.DetailText}>
                  Order ID
                </Text>
                <Text numberOfLines={2} style={styles.DetailText}>
                  {`#${shipmentDetail?.orderData?.label}`}
                </Text>
              </View>
            )}
            <View style={styles.rowOrderContainer}>
              <Text numberOfLines={2} style={styles.DetailText}>
                {shipmentDetail?.orderData?.placeLabel
                  ? shipmentDetail?.orderData?.placeLabel
                  : 'Order Placed'}
              </Text>
              <Text numberOfLines={2} style={styles.DetailText}>
                {formatDate(
                  shipmentDetail?.orderData?.dateValue,
                  'DD MMM, YYYY, hh:mm:ss A',
                )}
              </Text>
            </View>
            {shipmentDetail?.orderData?.dateValue && (
              <View style={styles.rowOrderContainer}>
                <Text numberOfLines={2} style={styles.DetailText}>
                  {shipmentDetail?.orderData?.dateLabel
                    ? shipmentDetail?.orderData?.dateLabel
                    : 'Order Date'}
                </Text>
                <Text numberOfLines={2} style={styles.DetailText}>
                  {formatDate(
                    shipmentDetail?.orderData?.dateValue,
                    'DD MMM, YYYY, hh:mm:ss A',
                  )}
                </Text>
              </View>
            )}
            {shipmentDetail?.buyerData?.title && (
              <Text style={styles.buyerText}>
                {shipmentDetail ? shipmentDetail?.buyerData?.title : ''}
              </Text>
            )}
            {shipmentDetail?.buyerData?.nameValue && (
              <View style={[styles.rowOrderContainer, {marginTop: mvs(10)}]}>
                <Text numberOfLines={2} style={styles.DetailText}>
                  {shipmentDetail?.buyerData?.nameLabel
                    ? shipmentDetail?.buyerData?.nameLabel
                    : 'Customer Name'}
                </Text>
                <Text numberOfLines={2} style={styles.DetailText}>
                  {shipmentDetail?.buyerData?.nameValue}
                </Text>
              </View>
            )}
            {shipmentDetail?.buyerData?.emailValue && (
              <View style={[styles.rowOrderContainer]}>
                <Text numberOfLines={2} style={styles.DetailText}>
                  {shipmentDetail?.buyerData?.emailLabel
                    ? shipmentDetail?.buyerData?.emailLabel
                    : 'Email Address'}
                </Text>
                <Text numberOfLines={2} style={styles.DetailText}>
                  {shipmentDetail?.buyerData?.emailValue}
                </Text>
              </View>
            )}
            <View style={styles.flatLine} />
            <Text style={styles.buyerText}>
              {shipmentDetail?.shippingAddressData?.title
                ? shipmentDetail?.shippingAddressData?.title
                : 'Shipping Address'}
            </Text>
            {shipmentDetail?.shippingAddressData?.address &&
            shipmentDetail?.shippingAddressData?.address?.length > 0 ? (
              <>
                {shipmentDetail?.shippingAddressData?.address[0]?.street && (
                  <Text
                    numberOfLines={2}
                    style={[styles.DetailText, {marginTop: mvs(10)}]}>
                    {shipmentDetail?.shippingAddressData?.address[0]?.street}
                  </Text>
                )}
                {shipmentDetail?.shippingAddressData?.address[0]?.state && (
                  <Text numberOfLines={2} style={styles.DetailText}>
                    {shipmentDetail?.shippingAddressData?.address[0]?.state}
                  </Text>
                )}
                {shipmentDetail?.shippingAddressData?.address[0]?.country && (
                  <Text numberOfLines={2} style={styles.DetailText}>
                    {shipmentDetail?.shippingAddressData?.address[0]?.country}
                  </Text>
                )}
                {shipmentDetail?.shippingAddressData?.address[0]?.telephone && (
                  <Text
                    numberOfLines={2}
                    style={[styles.DetailText, {color: COLORS.PRIMARY}]}>
                    {shipmentDetail?.shippingAddressData?.address[0]?.telephone}
                  </Text>
                )}

                <View style={styles.flatLine} />
              </>
            ) : (
              <>
                {shipmentDetail?.billingAddressData?.address[0]?.street && (
                  <Text
                    numberOfLines={2}
                    style={[styles.DetailText, {marginTop: mvs(10)}]}>
                    {shipmentDetail?.billingAddressData?.address[0]?.street}
                  </Text>
                )}
                {shipmentDetail?.billingAddressData?.address[0]?.state && (
                  <Text numberOfLines={2} style={styles.DetailText}>
                    {shipmentDetail?.billingAddressData?.address[0]?.state}
                  </Text>
                )}
                {shipmentDetail?.billingAddressData?.address[0]?.country && (
                  <Text numberOfLines={2} style={styles.DetailText}>
                    {shipmentDetail?.billingAddressData?.address[0]?.country}
                  </Text>
                )}
                {shipmentDetail?.billingAddressData?.address[0]?.telephone && (
                  <Text
                    numberOfLines={2}
                    style={[styles.DetailText, {color: COLORS.PRIMARY}]}>
                    {shipmentDetail?.billingAddressData?.address[0]?.telephone}
                  </Text>
                )}
                <View style={styles.flatLine} />
              </>
            )}

            <Text style={styles.buyerText}>
              {shipmentDetail?.billingAddressData?.title
                ? shipmentDetail?.billingAddressData?.title
                : 'Billing Address'}
            </Text>
            {shipmentDetail?.billingAddressData?.address &&
            shipmentDetail?.billingAddressData?.address?.length > 0 ? (
              <>
                {shipmentDetail?.billingAddressData?.address[0]?.street && (
                  <Text
                    numberOfLines={2}
                    style={[styles.DetailText, {marginTop: mvs(10)}]}>
                    {shipmentDetail?.billingAddressData?.address[0]?.street}
                  </Text>
                )}
                {shipmentDetail?.billingAddressData?.address[0]?.state && (
                  <Text numberOfLines={2} style={styles.DetailText}>
                    {shipmentDetail?.billingAddressData?.address[0]?.state}
                  </Text>
                )}
                {shipmentDetail?.billingAddressData?.address[0]?.country && (
                  <Text numberOfLines={2} style={styles.DetailText}>
                    {shipmentDetail?.billingAddressData?.address[0]?.country}
                  </Text>
                )}
                {shipmentDetail?.billingAddressData?.address[0]?.telephone && (
                  <Text
                    numberOfLines={2}
                    style={[styles.DetailText, {color: COLORS.PRIMARY}]}>
                    {shipmentDetail?.billingAddressData?.address[0]?.telephone}
                  </Text>
                )}

                {/* <View style={styles.flatLine} /> */}
              </>
            ) : (
              <>
                {shipmentDetail?.shippingAddressData?.address[0]?.street && (
                  <Text
                    numberOfLines={2}
                    style={[styles.DetailText, {marginTop: mvs(10)}]}>
                    {shipmentDetail?.shippingAddressData?.address[0]?.street}
                  </Text>
                )}
                {shipmentDetail?.shippingAddressData?.address[0]?.state && (
                  <Text numberOfLines={2} style={styles.DetailText}>
                    {shipmentDetail?.shippingAddressData?.address[0]?.state}
                  </Text>
                )}
                {shipmentDetail?.shippingAddressData?.address[0]?.country && (
                  <Text numberOfLines={2} style={styles.DetailText}>
                    {shipmentDetail?.shippingAddressData?.address[0]?.country}
                  </Text>
                )}
                {shipmentDetail?.shippingAddressData?.address[0]?.telephone && (
                  <Text
                    numberOfLines={2}
                    style={[styles.DetailText, {color: COLORS.PRIMARY}]}>
                    {shipmentDetail?.shippingAddressData?.address[0]?.telephone}
                  </Text>
                )}
              </>
            )}
          </TouchableOpacity>
          {shipmentDetail?.shippingMethodData && (
            <TouchableOpacity
              activeOpacity={0.9}
              style={[styles.mainContainer, {marginTop: mvs(15)}]}>
              <Text
                numberOfLines={2}
                style={[
                  styles.DetailText,
                  {color: COLORS.BLACK, fontSize: FONTSIZE.XL},
                ]}>
                {shipmentDetail?.shippingMethodData?.title}
              </Text>
              <Text numberOfLines={2} style={styles.DetailText}>
                {shipmentDetail?.shippingMethodData?.method}
              </Text>
            </TouchableOpacity>
          )}
          {shipmentDetail?.paymentMethodData && (
            <TouchableOpacity
              activeOpacity={0.9}
              style={[styles.mainContainer, {marginTop: mvs(15)}]}>
              <Text
                numberOfLines={2}
                style={[
                  styles.DetailText,
                  {color: COLORS.BLACK, fontSize: FONTSIZE.XL},
                ]}>
                {shipmentDetail?.paymentMethodData?.title}
              </Text>
              <Text numberOfLines={2} style={styles.DetailText}>
                {shipmentDetail?.paymentMethodData?.method}
              </Text>
            </TouchableOpacity>
          )}
        </React.Fragment>
      ) : (
        !shipmentDetailLoading && <NoRecordFound />
      )}
    </ScrollView>
  );
};

export default OrderShipmentDetail;

const styles = StyleSheet.create({
  mainContainer: {
    paddingVertical: ms(16),
    paddingHorizontal: ms(15),
    borderWidth: 1,
    borderRadius: s(5),
    borderColor: COLORS.BORDER,
    marginTop: ms(16),
  },
  rowOrderContainer: {
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
  buyerText: {
    fontSize: FONTSIZE.L,
    color: COLORS.BLACK,
    fontFamily: FONTS.workSansSemiBold,
    marginTop: mvs(15),
    textTransform: 'capitalize',
  },
  flatLine: {
    height: 1,
    backgroundColor: COLORS.BORDER,
    marginTop: mvs(10),
  },
  recentOrderTableKey: {
    color: COLORS.BLACK,
    fontFamily: FONTS.workSansMedium,
    fontSize: FONTSIZE.L,
  },
  recentOrderTableValue: {
    color: COLORS.BLACK,
    fontFamily: FONTS.workSansRegular,
    fontSize: FONTSIZE.L,
  },
  orderInnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    position: 'absolute',
    left: 0,
    top: Platform.OS ==='ios'?StatusBar.currentHeight + 220: StatusBar.currentHeight + 120,
    bottom: 0,
    // width: sWidth * 0.92,
    right:0,
    backgroundColor: 'white',
    height: 350,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    // padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  closeButton: {
    marginTop: 20,
    color: 'red',
    textAlign: 'center',
  },
});

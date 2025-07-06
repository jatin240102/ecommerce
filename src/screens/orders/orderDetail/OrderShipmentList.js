import React, {useEffect, useState} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  StatusBar,
  TextInput,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {ms, mvs, s} from 'react-native-size-matters';
import AllOrdersListing from '../../../components/orders/AllOrdersListing';
import {products} from '../../../constant/globalConstants';
import {COLORS} from '../../../constant/color';
import {
  displayPrice,
  formatDate,
  showToast,
  sWidth,
} from '../../../utils/global';
import {IMAGES} from '../../../constant/imagePath';
import {FONTS, FONTSIZE} from '../../../constant/fonts';
import {useGlobalData} from '../../../context/AppContext';
import {useLazyQuery, useMutation} from '@apollo/client';
import {
  SELLER_CREATE_SHIPMENT,
  SELLER_ORDER_DETAIL,
  SELLER_SHIPMENT_LIST,
} from '../../../queries/ProductQueries';
import {hideLoader, showLoader} from '../../../components/common/AppLoader';
import NoRecordFound from '../../../components/common/NoRecordFound';
import GradientButton from '../../../components/common/GradientButton ';
import TextInputBox from '../../../components/common/TextInputBox';

const OrderShipmentList = () => {
  const navigation = useNavigation();
  const {
    orderEntityId,
    setIsInvoiceDetailActive,
    isShipmentLevel1Active,
    setIsShipmentLevel1Active,
    setShipmentId,
    orderIncrementId,
  } = useGlobalData();
  const [shipmentList, setShipmentList] = useState([]);
  const [orderDetailData, setOrderDetailData] = useState([]);
  const [isCreateShipment, setIsCreateShipment] = useState(false);
  const [shipmentStatus, setShipmentStatus] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [errors, setErrors] = useState({});

  const [shipmentOption, setShipmentOption] = useState({
    comment: '',
    isEmailCopy: false,
    carrierTitle:'',
    trackingNumber:''
  });
  console.log('orderDetailData', shipmentStatus);
  console.log('orderEntityId------', orderEntityId);

  const [fetchShipmentList, {loading}] = useLazyQuery(SELLER_SHIPMENT_LIST, {
    onCompleted: response => {
      console.log('invoice list response', response);
      hideLoader();
      if (response?.sellerGetShipmentList) {
        const ship = response?.sellerGetShipmentList;
        setShipmentStatus(ship);
        if (response?.sellerGetShipmentList?.item?.length > 0) {
          const invoices = response?.sellerGetShipmentList?.item;
          setShipmentList(invoices);
        }
      } else {
      }
    },
    onError: error => {
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
  });

  const [fetchOrderDetail, {loading: listingLoad}] = useLazyQuery(
    SELLER_ORDER_DETAIL,
    {
      onCompleted: response => {
        hideLoader();
        console.log('response======', response);
        if (response?.sellerCustomOrderList?.items?.length > 0) {
          setOrderDetailData(response?.sellerCustomOrderList?.items);
        } else {
        }
      },
      onError: error => {
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

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchShipmentList({
        variables: {
          orderId: orderEntityId,
        },
      });
      setErrors({});
      setQuantities({});
      setIsShipmentLevel1Active(false);
      setIsInvoiceDetailActive(false);
      fetchOrderDetail({
        variables: {
          status: '',
          customer: '',
          increment_id: orderIncrementId,
          start_date: '',
          end_date: '',
          searchText: '',
          pageSize: 10,
          currentPage: 1,
        },
      });
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (loading) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [loading]);

  const openModal = () => {
    setIsCreateShipment(true);
  };

  const closeModal = () => {
    setIsCreateShipment(false);
    setErrors({});
    setQuantities({});
  };

  const [sellerCreateShipment, {loading: msLoading}] = useMutation(
    SELLER_CREATE_SHIPMENT,
    {
      onCompleted: response => {
        console.log('track response', response);
        hideLoader();
        if (response?.sellerCreateShipment?.message) {
          showToast(response?.sellerCreateShipment?.message);
        }
        fetchShipmentList({
          variables: {
            orderId: orderEntityId,
          },
        });
        fetchOrderDetail({
          variables: {
            status: '',
            customer: '',
            increment_id: orderIncrementId,
            start_date: '',
            end_date: '',
            searchText: '',
            pageSize: 10,
            currentPage: 1,
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
  let valid = null;

  const handleQuantityChange = (text, itemId, maxQuantity) => {
    const enteredQuantity = parseInt(text, 10);

    if (enteredQuantity > maxQuantity) {
      valid = null;
      setErrors(prev => ({
        ...prev,
        [itemId]: `Quantity to Ship cannot exceed the Order Quantity. Please enter a valid amount`,
      }));
    } else {
      setErrors(prev => {
        const updatedErrors = {...prev};
        delete updatedErrors[itemId];
        return updatedErrors;
      });
    }

    setQuantities(prev => ({...prev, [itemId]: text}));
  };

  const validateItems = () => {
    const filledQuantities = Object.values(quantities).filter(
      qty => qty !== '',
    );

    if (filledQuantities.length === 0) {
      valid = 'Please enter a ship quantity for at least one item';
      // showToast('Please enter a quantity for at least one item.');
      return false;
    }

    const newErrors = {};
    orderDetailData[0]?.itemdata?.forEach(value => {
      const maxAvailable = value.qty_invoiced - value.qty_shipped;
      const enteredQty = parseInt(quantities[value.item_id], 10) || 0;

      if (enteredQty > maxAvailable) {
        valid = null;
        newErrors[
          value.item_id
        ] = `Quantity to Ship cannot exceed the Order Quantity. Please enter a valid amount`;
      }
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  // const handleQuantityChange = (text, itemId) => {
  //   setQuantities(prev => ({...prev, [itemId]: text}));
  // };

  const getItemsData = () => {
    return orderDetailData[0]?.itemdata
      ?.filter(value => quantities[value.item_id])
      .map(value => ({
        order_item_id: Number(value.item_id),
        qty: Number(quantities[value.item_id]),
      }));
  };

  const handleCreateShipment = () => {
    if (validateItems()) {
      const itemsData = getItemsData();
      console.log('Items data:', itemsData);
      console.log('sent mutation---', {
        orderId: Number(orderEntityId),
        trackingId: '',
        carrier: '',
        comment: shipmentOption.comment,
        sendemail: shipmentOption.isEmailCopy ? '1' : '0',
        items: itemsData,
      });
      showLoader();
      sellerCreateShipment({
        variables: {
          orderId: orderEntityId,
          trackingId: shipmentOption.trackingNumber,
          carrier: shipmentOption.carrierTitle,
          comment: shipmentOption.comment,
          sendemail: shipmentOption.isEmailCopy ? '1' : '0',
          items: itemsData,
        },
      });
      setIsCreateShipment(false);
      setErrors({});
      setQuantities({});
      setShipmentOption({
        ...shipmentOption,
        comment: '',
        isEmailCopy: false,
      });
      //Proceed with submission or further actions with itemsData
    } else {
      if (valid) {
        showToast(valid);
      } else {
        showToast(
          'Quantity to Ship cannot exceed the Order Quantity. Please enter a valid amount',
        );
      }
      console.log('error---', errors);
    }

    // sellerCreateTracking({
    //   variables: {
    //     orderId: orderEntityId,
    //     trackingId: '',
    //     carrier: '',
    //     comment: shipmentOption.comment,
    //     sendemail: shipmentOption.isEmailCopy ? '1' : '0',
    //     items: '',
    //   },
    // });
    // setIsCreateShipment(false)
  };
  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{flex: shipmentList?.length > 0 ? null : 1}}>
      {isCreateShipment && (
        <Modal
          onRequestClose={() => closeModal()}
          transparent
          visible={isCreateShipment}
          animationType="none"
          style={{alignItems: 'center', margin: 0, justifyContent: 'center'}}>
          {/* <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}> */}
          <View style={[styles.modalContent, {margin: ms(15)}]}>
            <TouchableOpacity
              onPress={() => closeModal()}
              activeOpacity={0.8}
              style={{
                height: 30,
                width: 30,
                position: 'absolute',
                right: -8,
                top: -10,
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

            <FlatList
              data={orderDetailData}
              keyExtractor={(item, index) =>
                item?.created_at
                  ? `${item?.created_at.toString()}-${index.toString()}-${
                      item?.increment_id
                    }`
                  : index.toString()
              }
              renderItem={({item, index}) => {
                return (
                  <React.Fragment>
                    <TouchableOpacity
                      activeOpacity={0.9}
                      style={{
                        paddingVertical: ms(16),
                        marginHorizontal: ms(15),
                        borderWidth: 1,
                        borderRadius: s(10),
                        borderColor: COLORS.BORDER,
                        gap: s(10),
                      }}>
                      <Text
                        style={[styles.recentOrderTableKey, {marginLeft: 15}]}>
                        Item Ship
                      </Text>

                      <View
                        style={{
                          height: 1,
                          backgroundColor: COLORS.BORDER,
                          marginHorizontal: 15,
                        }}
                      />
                      <View style={styles.orderInnerContainer}>
                        <Text style={styles.recentOrderTableKey}>Product</Text>
                        <Text style={styles.recentOrderTableKey}>Qty</Text>
                        <Text style={styles.recentOrderTableKey}>
                          Qty to ship
                        </Text>
                      </View>

                      <View style={{marginTop: mvs(2), gap: 10}}>
                        {item?.itemdata &&
                          item?.itemdata?.length > 0 &&
                          item?.itemdata?.map((value, indexs) => {
                            const flatLineLength =
                              item?.itemdata?.length === indexs + 1
                                ? {}
                                : styles.flatLine;
                            const maxAvailable =
                              value.qty_invoiced - value.qty_shipped;

                            return (
                              <React.Fragment>
                                <View
                                  style={[
                                    styles.orderInnerContainer,
                                    {flex: 1, justifyContent: 'center', gap: 5},
                                  ]}
                                  key={`${value?.name}-${indexs}-${value?.thumbnail}-${value?.item_id}`}>
                                  <Text
                                    numberOfLines={2}
                                    style={[
                                      styles.recentOrderTableValue,
                                      {flex: 4},
                                    ]}>
                                    {value?.name}
                                  </Text>
                                  <View
                                    style={{
                                      flex: 4,
                                      alignSelf: 'center',
                                    }}>
                                    <View
                                      style={{
                                        alignItems: 'center',
                                        justifyContent: 'flex-start',
                                        flexDirection: 'row',
                                        gap: 5,
                                      }}>
                                      <Text
                                        style={[
                                          styles.recentOrderTableValue,
                                          {textAlign: 'left'},
                                        ]}>
                                        {'Order: '}
                                      </Text>
                                      <Text
                                        style={styles.recentOrderTableValue}>
                                        {value?.qty_ordered}
                                      </Text>
                                    </View>
                                    <View
                                      style={{
                                        alignItems: 'center',
                                        justifyContent: 'flex-start',
                                        flexDirection: 'row',
                                        gap: 5,
                                      }}>
                                      <Text
                                        style={styles.recentOrderTableValue}>
                                        {'Ship: '}
                                      </Text>
                                      <Text
                                        style={styles.recentOrderTableValue}>
                                        {value?.qty_shipped}
                                      </Text>
                                    </View>
                                    <View
                                      style={{
                                        alignItems: 'center',
                                        justifyContent: 'flex-start',
                                        flexDirection: 'row',
                                        gap: 5,
                                      }}>
                                      <Text
                                        style={styles.recentOrderTableValue}>
                                        {'Invoice: '}
                                      </Text>
                                      <Text
                                        style={styles.recentOrderTableValue}>
                                        {value?.qty_invoiced}
                                      </Text>
                                    </View>
                                  </View>
                                  <View
                                    style={{
                                      flex: 2,
                                      //  alignItems: 'center',
                                      // justifyContent: 'center',
                                    }}>
                                    <TextInput
                                      style={{
                                        paddingHorizontal: 10,
                                        backgroundColor:
                                          maxAvailable !== 0
                                            ? 'white'
                                            : 'rgb(235, 235, 228)',
                                        borderRadius: 5,
                                        borderWidth: 1,
                                        color: COLORS.BLACK,
                                        fontSize: FONTSIZE.XL,
                                        borderColor: errors[value.item_id]
                                          ? 'red'
                                          : COLORS.BORDER,
                                        height: 40,
                                      }}
                                      placeholderTextColor={COLORS.BORDER}
                                      placeholder={`${maxAvailable}`}
                                      value={
                                        quantities[value.item_id] ||
                                        ''
                                      }
                                      editable={maxAvailable !== 0}
                                      onChangeText={text =>
                                        handleQuantityChange(
                                          text.replace(/[^1-9]/g, ''),
                                          value.item_id,
                                          maxAvailable,
                                        )
                                      }
                                      keyboardType="number-pad"
                                    />
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
                      style={[styles.orderContainer, {borderRadius: 10}]}>
                      <Text
                        style={[styles.recentOrderTableKey, {marginLeft: 15}]}>
                        Add Shipment Detail
                      </Text>
                      <View
                        style={{
                          height: 1,
                          backgroundColor: COLORS.BORDER,
                          marginHorizontal: 15,
                        }}
                      />
                      <TextInputBox
                        title={'Tracking Number'}
                        value={shipmentOption.trackingNumber}
                        onChangeText={text =>
                          setShipmentOption({
                            ...shipmentOption,
                            trackingNumber: text,
                          })
                        }
                        containerStyle={{
                          marginTop: mvs(2),
                          paddingHorizontal: 15,
                        }}
                        placeholder={'Tracking Number'}
                      />
                      <TextInputBox
                        title={'Carrier Title'}
                        placeholder={'Carrier Title'}
                        value={shipmentOption.carrierTitle}
                        onChangeText={text =>
                          setShipmentOption({
                            ...shipmentOption,
                            carrierTitle: text,
                          })
                        }
                        containerStyle={{
                          marginTop: mvs(2),
                          paddingHorizontal: 15,
                        }}
                      />

                      <TextInputBox
                        title={'Shipment Comments'}
                        value={{}}
                        onChangeText={text =>
                          setShipmentOption({
                            ...shipmentOption,
                            comment: text,
                          })
                        }
                        containerStyle={{
                          marginTop: mvs(2),
                          paddingHorizontal: 15,
                        }}
                        multiline={true}
                        inputStyle={{height: mvs(100), flex: 1}}
                        textAlignVertical="top"
                        numberOfLines={10}
                      />
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() =>
                          setShipmentOption(prevState => ({
                            ...prevState,
                            isEmailCopy: !prevState.isEmailCopy,
                          }))
                        }
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'flex-start',
                          gap: 10,
                          paddingHorizontal: 15,
                        }}>
                        <Image
                          source={
                            shipmentOption.isEmailCopy
                              ? IMAGES.ic_colorChecked
                              : IMAGES.ic_empty_check
                          }
                          style={{
                            height: mvs(16),
                            width: ms(16),
                            resizeMode: 'contain',
                            // marginRight: ms(6),
                          }}
                        />
                        <Text
                          style={{
                            color: COLORS.PRIMARY,
                            fontFamily: FONTS.workSansMedium,
                            fontSize: FONTSIZE.L,
                          }}>
                          {'Email Copy'}
                        </Text>
                      </TouchableOpacity>
                      <GradientButton
                        title={'Shipment Submit'}
                        onPress={() => handleCreateShipment()}
                        mainContainer={{
                          marginTop: mvs(10),
                          paddingHorizontal: ms(15),
                        }}
                        buttonTxt={{fontSize: FONTSIZE.XL}}
                      />
                    </TouchableOpacity>
                  </React.Fragment>
                );
              }}
            />
          </View>
          {/* </TouchableWithoutFeedback> */}
        </Modal>
      )}
      {shipmentList.length > 0 ? (
        <TouchableOpacity activeOpacity={0.9} style={styles.orderContainer}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginHorizontal: 15,
            }}>
            <Text style={[styles.recentOrderTableKey]}>Shipment List</Text>
            {shipmentStatus && shipmentStatus?.can_shipment === 1 && (
              <TouchableOpacity activeOpacity={0.8} onPress={() => openModal()}>
                <Image
                  source={require('../../../assets/images/addshipmentIcon.png')}
                  style={{height: 30, width: 30, resizeMode: 'cover'}}
                />
              </TouchableOpacity>
            )}
          </View>

          <View
            style={{
              height: 1,
              backgroundColor: COLORS.BORDER,
              marginHorizontal: 15,
            }}
          />
          <View style={styles.orderInnerContainer}>
            <Text style={styles.recentOrderTableKey}>Shipment #</Text>
            {/* <Text style={styles.recentOrderTableKey}>Name</Text> */}
            <Text style={styles.recentOrderTableKey}>Ship Date</Text>
            <Text style={styles.recentOrderTableKey}>Qty</Text>
            <Text style={styles.recentOrderTableKey}>Action</Text>
          </View>

          {shipmentList &&
            shipmentList.length > 0 &&
            shipmentList.map((value, i) => {
              const flatLineLength =
                shipmentList?.length === i + 1 ? {} : styles.flatLine;
              return (
                <React.Fragment
                  key={`${value?.shipment_id}-${value?.shipment_increment_id}-${value?.created_at}`}>
                  <View style={styles.orderInnerContainer}>
                    <Text style={[styles.recentOrderTableKey, {flex: 5}]}>
                      {value?.shipment_increment_id}
                    </Text>
                    {/* <Text
                      style={[styles.recentOrderTableKey, {flex: 2,backgroundColor:'#DB0B0B'}]}
                      numberOfLines={1}
                      ellipsizeMode="middle">
                      {value?.name}
                    </Text> */}
                    <Text style={[styles.recentOrderTableKey, {flex: 5}]}>
                      {formatDate(value?.created_at)}
                    </Text>

                    <Text style={[styles.recentOrderTableKey, {flex: 2}]}>
                      {displayPrice(value?.qty, '', true)}
                    </Text>
                    <TouchableOpacity
                      style={{
                        flex: 2,
                        alignItems: 'center',
                      }}
                      activeOpacity={0.9}
                      onPress={() => {
                        navigation.navigate('OrderShipmentDetail', {
                          orderId: value?.order_id,
                          shipmentId: value?.shipment_id,
                        });
                        setShipmentId(value?.shipment_id);
                      }}>
                      <Image
                        source={IMAGES.ic_showPassword}
                        style={{
                          height: mvs(20),
                          width: ms(20),
                          resizeMode: 'contain',
                        }}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={flatLineLength} />
                </React.Fragment>
              );
            })}
        </TouchableOpacity>
      ) : shipmentStatus && shipmentStatus?.can_shipment === 1 ? (
        <TouchableOpacity
          onPress={() => openModal()}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
            marginTop: 100,
          }}>
          <Image
            source={require('../../../assets/images/addshipmentIcon.png')}
            style={{height: 100, width: 100, resizeMode: 'cover'}}
          />
          <Text
            style={{
              marginTop: 10,
              fontFamily: FONTS.workSansMedium,
              fontSize: FONTSIZE.XL,
              color: COLORS.PRIMARY,
              textAlign: 'center',
            }}>
            Create New Shipment
          </Text>
        </TouchableOpacity>
      ) : (
        !loading && (
          <TouchableOpacity
            activeOpacity={1}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'center',
              marginTop: 100,
            }}>
            <Image
              source={require('../../../assets/images/noRecord.png')}
              style={{height: 100, width: 100, resizeMode: 'cover'}}
            />
            <Text
              style={{
                marginTop: 10,
                fontFamily: FONTS.workSansMedium,
                fontSize: FONTSIZE.XL,
                color: COLORS.PRIMARY,
                textAlign: 'center',
              }}>
              No Shipment available
            </Text>
          </TouchableOpacity>
        )
      )}
    </ScrollView>
  );
};
{
}

export default OrderShipmentList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    paddingTop: mvs(10),
    paddingBottom: mvs(10),
  },
  list: {
    paddingHorizontal: ms(15),
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
  orderContainer: {
    paddingVertical: ms(16),
    marginHorizontal: ms(15),
    borderWidth: 1,
    borderRadius: s(14),
    borderColor: COLORS.BORDER,
    marginTop: ms(16),
    // flex: 1,
    gap: s(10),
  },
  orderInnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ms(15),
  },
  flatLine: {
    height: 1,
    backgroundColor: COLORS.BORDER,
    marginHorizontal: 15,
  },
  modalContent: {
    position: 'absolute',
    left: 0,
    top:
      Platform.OS === 'ios'
        ? StatusBar.currentHeight + 210
        : StatusBar.currentHeight + 110,
    bottom: 0,
    right: 0,
    // width: sWidth * 0.92,
    backgroundColor: 'white',
    // height: 300,
    borderRadius: 15,
    borderWidth: 0.5,
    borderColor: COLORS.PRIMARY,
    paddingVertical: 30,
  },
});

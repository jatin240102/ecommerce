import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {COLORS} from '../../../constant/color';
import {ms, mvs, s} from 'react-native-size-matters';
import {FONTS, FONTSIZE} from '../../../constant/fonts';
import {formatDate, showToast} from '../../../utils/global';
import {hideLoader} from '../../../components/common/AppLoader';
import {SELLER_INVOICE_DETAIL} from '../../../queries/ProductQueries';
import {useLazyQuery} from '@apollo/client';
import NoRecordFound from '../../../components/common/NoRecordFound';
import {useGlobalData} from '../../../context/AppContext';
import AppLoading from '../../../components/common/AppLoading';

const InvoiceOrderDetail = ({navigation, route}) => {
  const [invoiceDetail, setInvoiceDetail] = useState(null);
  const [invoiceDetailLoading, setInvoiceDetailLoading] = useState(true);

  const {setIsInvoiceDetailActive} = useGlobalData();
  console.log('route---', route);
  const [fetchInvoiceDetail, {loading, refetch}] = useLazyQuery(
    SELLER_INVOICE_DETAIL,
    {
      onCompleted: response => {
        setInvoiceDetailLoading(false)
        setIsInvoiceDetailActive(true);
        if (response?.sellerGetInvoiceDetails) {
          const invoiceRecord = response?.sellerGetInvoiceDetails;
          setInvoiceDetail(invoiceRecord);
        } else {
        setInvoiceDetailLoading(false);

        }
      },
      onError: error => {
        setInvoiceDetailLoading(false);
        setIsInvoiceDetailActive(true);
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
          invoiceId: route?.params?.invoiceId,
        },
      });
      setIsInvoiceDetailActive(true);
    });
    return unsubscribe;
  }, [navigation]);

  // const statusColor = {
  //   complete: '#3BB349',
  //   pending: COLORS.YELLOW,
  //   canceled: '#DB0B0B',
  //   processing: COLORS.TITLE,
  // };
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingVertical: mvs(16),
        backgroundColor: COLORS.WHITE,
        paddingHorizontal: ms(15),
        flex: invoiceDetail ? null : 1,
      }}
      style={{
        flex: 1,
        backgroundColor: COLORS.WHITE,
      }}>
      <AppLoading appLoading={invoiceDetailLoading}/>
      {invoiceDetail ? (
        <React.Fragment>
          <TouchableOpacity activeOpacity={0.9} style={[styles.mainContainer]}>
            {invoiceDetail?.orderData?.label && (
              <View style={styles.rowOrderContainer}>
                <Text numberOfLines={2} style={styles.DetailText}>
                  OrderId
                </Text>
                <Text numberOfLines={2} style={styles.DetailText}>
                  {`#${invoiceDetail?.orderData?.label}`}
                </Text>
              </View>
            )}
            <View style={styles.rowOrderContainer}>
              <Text numberOfLines={2} style={styles.DetailText}>
                {invoiceDetail?.orderData?.placeLabel
                  ? invoiceDetail?.orderData?.placeLabel
                  : 'Order Placed'}
              </Text>
              <Text numberOfLines={2} style={styles.DetailText}>
                {formatDate(
                  invoiceDetail?.orderData?.dateValue,
                  'DD MMM, YYYY, hh:mm:ss A',
                )}
              </Text>
            </View>
            {invoiceDetail?.orderData?.dateValue && (
              <View style={styles.rowOrderContainer}>
                <Text numberOfLines={2} style={styles.DetailText}>
                  {invoiceDetail?.orderData?.dateLabel
                    ? invoiceDetail?.orderData?.dateLabel
                    : 'Order Date'}
                </Text>
                <Text numberOfLines={2} style={styles.DetailText}>
                  {formatDate(
                    invoiceDetail?.orderData?.dateValue,
                    'DD MMM, YYYY, hh:mm:ss A',
                  )}
                </Text>
              </View>
            )}
            {invoiceDetail?.buyerData?.title && (
              <Text style={styles.buyerText}>
                {invoiceDetail ? invoiceDetail?.buyerData?.title : ''}
              </Text>
            )}
            {invoiceDetail?.buyerData?.nameValue && (
              <View style={[styles.rowOrderContainer, {marginTop: mvs(10)}]}>
                <Text numberOfLines={2} style={styles.DetailText}>
                  {invoiceDetail?.buyerData?.nameLabel
                    ? invoiceDetail?.buyerData?.nameLabel
                    : 'Customer Name'}
                </Text>
                <Text numberOfLines={2} style={styles.DetailText}>
                  {invoiceDetail?.buyerData?.nameValue}
                </Text>
              </View>
            )}
            {invoiceDetail?.buyerData?.emailValue && (
              <View style={[styles.rowOrderContainer]}>
                <Text numberOfLines={2} style={styles.DetailText}>
                  {invoiceDetail?.buyerData?.emailLabel
                    ? invoiceDetail?.buyerData?.emailLabel
                    : 'Email Address'}
                </Text>
                <Text numberOfLines={2} style={styles.DetailText}>
                  {invoiceDetail?.buyerData?.emailValue}
                </Text>
              </View>
            )}
            <View style={styles.flatLine} />
            <Text style={styles.buyerText}>
              {invoiceDetail?.shippingAddressData?.title
                ? invoiceDetail?.shippingAddressData?.title
                : 'Shipping Address'}
            </Text>
            {invoiceDetail?.shippingAddressData?.address &&
            invoiceDetail?.shippingAddressData?.address?.length > 0 ? (
              <>
                {invoiceDetail?.shippingAddressData?.address[0]?.street && (
                  <Text
                    numberOfLines={2}
                    style={[styles.DetailText, {marginTop: mvs(10)}]}>
                    {invoiceDetail?.shippingAddressData?.address[0]?.street}
                  </Text>
                )}
                {invoiceDetail?.shippingAddressData?.address[0]?.state && (
                  <Text numberOfLines={2} style={styles.DetailText}>
                    {invoiceDetail?.shippingAddressData?.address[0]?.state}
                  </Text>
                )}
                {invoiceDetail?.shippingAddressData?.address[0]?.country && (
                  <Text numberOfLines={2} style={styles.DetailText}>
                    {invoiceDetail?.shippingAddressData?.address[0]?.country}
                  </Text>
                )}
                {invoiceDetail?.shippingAddressData?.address[0]?.telephone && (
                  <Text
                    numberOfLines={2}
                    style={[styles.DetailText, {color: COLORS.PRIMARY}]}>
                    {invoiceDetail?.shippingAddressData?.address[0]?.telephone}
                  </Text>
                )}

                <View style={styles.flatLine} />
              </>
            ) : (
              <>
                {invoiceDetail?.billingAddressData?.address[0]?.street && (
                  <Text
                    numberOfLines={2}
                    style={[styles.DetailText, {marginTop: mvs(10)}]}>
                    {invoiceDetail?.billingAddressData?.address[0]?.street}
                  </Text>
                )}
                {invoiceDetail?.billingAddressData?.address[0]?.state && (
                  <Text numberOfLines={2} style={styles.DetailText}>
                    {invoiceDetail?.billingAddressData?.address[0]?.state}
                  </Text>
                )}
                {invoiceDetail?.billingAddressData?.address[0]?.country && (
                  <Text numberOfLines={2} style={styles.DetailText}>
                    {invoiceDetail?.billingAddressData?.address[0]?.country}
                  </Text>
                )}
                {invoiceDetail?.billingAddressData?.address[0]?.telephone && (
                  <Text
                    numberOfLines={2}
                    style={[styles.DetailText, {color: COLORS.PRIMARY}]}>
                    {invoiceDetail?.billingAddressData?.address[0]?.telephone}
                  </Text>
                )}
                <View style={styles.flatLine} />
              </>
            )}
            <Text style={styles.buyerText}>
              {invoiceDetail?.billingAddressData?.title
                ? invoiceDetail?.billingAddressData?.title
                : 'Billing Address'}
            </Text>
            {invoiceDetail?.billingAddressData?.address &&
            invoiceDetail?.billingAddressData?.address?.length > 0 ? (
              <>
                {invoiceDetail?.billingAddressData?.address[0]?.street && (
                  <Text
                    numberOfLines={2}
                    style={[styles.DetailText, {marginTop: mvs(10)}]}>
                    {invoiceDetail?.billingAddressData?.address[0]?.street}
                  </Text>
                )}
                {invoiceDetail?.billingAddressData?.address[0]?.state && (
                  <Text numberOfLines={2} style={styles.DetailText}>
                    {invoiceDetail?.billingAddressData?.address[0]?.state}
                  </Text>
                )}
                {invoiceDetail?.billingAddressData?.address[0]?.country && (
                  <Text numberOfLines={2} style={styles.DetailText}>
                    {invoiceDetail?.billingAddressData?.address[0]?.country}
                  </Text>
                )}
                {invoiceDetail?.billingAddressData?.address[0]?.telephone && (
                  <Text
                    numberOfLines={2}
                    style={[styles.DetailText, {color: COLORS.PRIMARY}]}>
                    {invoiceDetail?.billingAddressData?.address[0]?.telephone}
                  </Text>
                )}

                {/* <View style={styles.flatLine} /> */}
              </>
            ) : (
              <>
                {invoiceDetail?.shippingAddressData?.address[0]?.street && (
                  <Text
                    numberOfLines={2}
                    style={[styles.DetailText, {marginTop: mvs(10)}]}>
                    {invoiceDetail?.shippingAddressData?.address[0]?.street}
                  </Text>
                )}
                {invoiceDetail?.shippingAddressData?.address[0]?.state && (
                  <Text numberOfLines={2} style={styles.DetailText}>
                    {invoiceDetail?.shippingAddressData?.address[0]?.state}
                  </Text>
                )}
                {invoiceDetail?.shippingAddressData?.address[0]?.country && (
                  <Text numberOfLines={2} style={styles.DetailText}>
                    {invoiceDetail?.shippingAddressData?.address[0]?.country}
                  </Text>
                )}
                {invoiceDetail?.shippingAddressData?.address[0]?.telephone && (
                  <Text
                    numberOfLines={2}
                    style={[styles.DetailText, {color: COLORS.PRIMARY}]}>
                    {invoiceDetail?.shippingAddressData?.address[0]?.telephone}
                  </Text>
                )}
              </>
            )}
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.9} style={[styles.mainContainer]}>
            <View style={styles.orderContainer}>
              <Text
                numberOfLines={2}
                style={[
                  styles.DetailText,
                  {color: COLORS.BLACK, fontSize: FONTSIZE.XL},
                ]}>
                {'Order Details'}
              </Text>
            </View>
            {invoiceDetail?.items &&
              invoiceDetail?.items?.length > 0 &&
              invoiceDetail?.items?.map((val, i) => {
                const flatLineLength =
                  invoiceDetail?.items?.length === i + 1 ? {} : styles.flatLine;
                return (
                  <React.Fragment
                    key={`${val?.productName}-${i}-${val?.adminComission}`}>
                    <>
                      <View
                        style={styles.orderContainer}
                        key={`${i}-${val?.adminComission}-${val?.price}`}>
                        <Text numberOfLines={2} style={styles.DetailText}>
                          {'Product Name'}
                        </Text>
                        <Text numberOfLines={2} style={styles.DetailText}>
                          {val?.productName}
                        </Text>
                      </View>
                      <View style={styles.orderContainer}>
                        <Text numberOfLines={2} style={styles.DetailText}>
                          {'Price'}
                        </Text>
                        <Text numberOfLines={2} style={styles.DetailText}>
                          {val?.price}
                        </Text>
                      </View>
                      {val?.qty && (
                        <View style={styles.orderContainer}>
                          <Text numberOfLines={2} style={styles.DetailText}>
                            {'QTY'}
                          </Text>
                          <Text numberOfLines={2} style={styles.DetailText}>
                            {val?.qty?.Invoiced ? val?.qty?.Invoiced : ''}
                          </Text>
                        </View>
                      )}
                      {val?.subTotal && (
                        <View style={styles.orderContainer}>
                          <Text numberOfLines={2} style={styles.DetailText}>
                            {'Subtotal'}
                          </Text>
                          <Text numberOfLines={2} style={styles.DetailText}>
                            {val?.subTotal}
                          </Text>
                        </View>
                      )}
                      {val?.vendorTotal && (
                        <View style={styles.orderContainer}>
                          <Text numberOfLines={2} style={styles.DetailText}>
                            {'Total Vendor Amount'}
                          </Text>
                          <Text numberOfLines={2} style={styles.DetailText}>
                            {val?.vendorTotal}
                          </Text>
                        </View>
                      )}
                      {val?.adminComission && (
                        <View style={styles.orderContainer}>
                          <Text numberOfLines={2} style={styles.DetailText}>
                            {'Total Admin Commission'}
                          </Text>
                          <Text numberOfLines={2} style={styles.DetailText}>
                            {val?.adminComission}
                          </Text>
                        </View>
                      )}
                    </>
                    <View style={flatLineLength} />
                  </React.Fragment>
                );
              })}
          </TouchableOpacity>
          {invoiceDetail?.shippingMethodData && (
            <TouchableOpacity
              activeOpacity={0.9}
              style={[styles.mainContainer, {marginTop: mvs(15)}]}>
              <Text
                numberOfLines={2}
                style={[
                  styles.DetailText,
                  {color: COLORS.BLACK, fontSize: FONTSIZE.XL},
                ]}>
                {invoiceDetail?.shippingMethodData?.title}
              </Text>
              <Text numberOfLines={2} style={styles.DetailText}>
                {invoiceDetail?.shippingMethodData?.method}
              </Text>
            </TouchableOpacity>
          )}
          {invoiceDetail?.paymentMethodData && (
            <TouchableOpacity
              activeOpacity={0.9}
              style={[styles.mainContainer, {marginTop: mvs(15)}]}>
              <Text
                numberOfLines={2}
                style={[
                  styles.DetailText,
                  {color: COLORS.BLACK, fontSize: FONTSIZE.XL},
                ]}>
                {invoiceDetail?.paymentMethodData?.title}
              </Text>
              <Text numberOfLines={2} style={styles.DetailText}>
                {invoiceDetail?.paymentMethodData?.method}
              </Text>
            </TouchableOpacity>
          )}
        </React.Fragment>
      ) : (
        !invoiceDetailLoading && <NoRecordFound />
      )}
    </ScrollView>
  );
};

export default InvoiceOrderDetail;

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
    marginTop: mvs(20),
  },
  orderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

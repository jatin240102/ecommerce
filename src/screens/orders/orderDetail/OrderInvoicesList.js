import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {ms, mvs, s} from 'react-native-size-matters';
import {COLORS} from '../../../constant/color';
import AllOrdersListing from '../../../components/orders/AllOrdersListing';
import {products} from '../../../constant/globalConstants';
import {FONTS, FONTSIZE} from '../../../constant/fonts';
import {IMAGES} from '../../../constant/imagePath';
import {formatDate, showToast} from '../../../utils/global';
import {hideLoader, showLoader} from '../../../components/common/AppLoader';
import {SELLER_INVOICE_LIST} from '../../../queries/ProductQueries';
import {useLazyQuery} from '@apollo/client';
import {useGlobalData} from '../../../context/AppContext';
import NoRecordFound from '../../../components/common/NoRecordFound';

const OrderInvoicesList = () => {
  const navigation = useNavigation();
  const {orderEntityId, setIsInvoiceDetailActive, isInvoiceDetailActive} =
    useGlobalData();
  const [invoiceList, setInvoiceList] = useState([]);

  console.log('invoiceList------', orderEntityId);
  const [fetchInvoiceList, {loading}] = useLazyQuery(
    SELLER_INVOICE_LIST,
    {
      onCompleted: response => {
        console.log('invoice list response', response)
        hideLoader();
        if (response?.sellerGetInvoiceList?.item?.length > 0) {
          const invoice = response?.sellerGetInvoiceList?.item;
          setInvoiceList(invoice);
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
    },
  );
  console.log('is---', isInvoiceDetailActive);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
    fetchInvoiceList({
      variables: {
        orderId: orderEntityId,
      },
    });
    setIsInvoiceDetailActive(false);
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

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{flex: invoiceList?.length > 0 ? null : 1}}
      // refreshControl={{}}
    >
      {invoiceList.length > 0 ? (
        <TouchableOpacity activeOpacity={0.9} style={styles.orderContainer}>
          <Text style={[styles.recentOrderTableKey, {marginLeft: 15}]}>
            Invoice List
          </Text>
          <View
            style={{
              height: 1,
              backgroundColor: COLORS.BORDER,
              marginHorizontal: 15,
            }}
          />
          <View style={styles.orderInnerContainer}>
            <Text style={styles.recentOrderTableKey}>Invoice #</Text>
            {/* <Text style={styles.recentOrderTableKey}>Name</Text> */}
            <Text style={styles.recentOrderTableKey}>Created</Text>
            <Text style={styles.recentOrderTableKey}>Amount</Text>
            <Text style={styles.recentOrderTableKey}>Action</Text>
          </View>

          {invoiceList &&
            invoiceList.length > 0 &&
            invoiceList.map((value, i) => {
              const flatLineLength =
                invoiceList?.length === i + 1 ? {} : styles.flatLine;
              return (
                <React.Fragment key={`${value?.invoice_increment_id}-${value?.created_at}`}>
                  <View style={styles.orderInnerContainer}>
                    <Text style={[styles.recentOrderTableKey, {flex: 5}]}>
                      {value?.invoice_increment_id}
                    </Text>
                    {/* <Text style={styles.recentOrderTableKey}>{value?.name}</Text> */}
                    <Text style={[styles.recentOrderTableKey, {flex: 4}]}>
                      {formatDate(value?.created_at)}
                    </Text>

                    <Text
                      style={[
                        styles.recentOrderTableKey,
                        {color: '#E44A4A', flex: 5},
                      ]}>
                      {value?.total}
                    </Text>
                    <TouchableOpacity
                      style={{
                        flex: 2,
                        alignItems: 'center',
                      }}
                      activeOpacity={0.9}
                      onPress={() =>
                        navigation.navigate('InvoiceOrderDetail', {
                          orderId: value?.order_id,
                          invoiceId: value?.invoice_id,
                        })
                      }>
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
      ) : (
        !loading&& <NoRecordFound />
      )}
    </ScrollView>
  );
};

export default OrderInvoicesList;

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
  recentOrderTableKey: {
    color: COLORS.BLACK,
    fontFamily: FONTS.workSansMedium,
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
});

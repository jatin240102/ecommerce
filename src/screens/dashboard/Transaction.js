import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {ms, mvs, s} from 'react-native-size-matters';
import {IMAGES} from '../../constant/imagePath';
import AppHeader from '../../components/common/AppHeader';
import {COLORS} from '../../constant/color';
import {FONTS, FONTSIZE} from '../../constant/fonts';
import AppLayout from '../../components/layouts/AppLayout';
import {hideLoader, showLoader} from '../../components/common/AppLoader';
import {displayPrice, formatDate, showToast} from '../../utils/global';
import {useLazyQuery} from '@apollo/client';
import {SELLER_TRANSACTION_LIST} from '../../queries/ProductQueries';
import NoRecordFound from '../../components/common/NoRecordFound';
import FilterModal from '../../components/common/FilterModal';
const transactions = [
  {
    id: '1',
    ref: 'tr-fgfgsgdshrs',
    amount: '$850.00',
    date: '25 Sep, 2024, 11:00:54 AM',
    status: 'Amount Paid',
  },
  {
    id: '2',
    ref: 'tr-fgfgsgdshrs',
    amount: '$850.00',
    date: '25 Sep, 2024, 11:00:54 AM',
    status: 'Amount Paid',
  },
  {
    id: '3',
    ref: 'tr-fgfgsgdshrs',
    amount: '$850.00',
    date: '25 Sep, 2024, 11:00:54 AM',
    status: 'Amount Paid',
  },
];

const Transaction = ({navigation, route}) => {
  const [isRefresh, setIsRefresh] = useState(false);
  const [isLoadMore, setIsLoadMore] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [transactionList, setTransactionList] = useState([]);
  const [transactionDetail, setTransactionDetail] = useState(null);

  const [fetchTransactionList, {loading}] = useLazyQuery(
    SELLER_TRANSACTION_LIST,
    {
      onCompleted: response => {
        console.log('response/////', response);
        hideLoader();
        setIsRefresh(false);
        setIsLoadMore(false);
        if (response?.sellerTransaction?.items?.length > 0) {
          const transaction = response?.sellerTransaction?.items;
          setTransactionList(transaction);
          setTransactionDetail(response?.sellerTransaction);
          console.log('transaction---------', transaction);
        } else {
          setTransactionList([]);
        }
      },
      onError: error => {
        console.log('error---', error);
        setIsRefresh(false);
        setIsLoadMore(false);

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
      // fetchPolicy: 'network-only',
      notifyOnNetworkStatusChange: true,
    },
  );
  useEffect(() => {
    if (loading) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [loading]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchTransactionList({
        variables: {
          interval: '',
        },
      });
    });
    return unsubscribe;
  }, [navigation]);

const closeFilter = ()=>{
  setFilterVisible(false)
}
const openFilter = ()=>{
  setFilterVisible(true)
}


  return (
    <AppLayout containerStyle={styles.layout}>
      <AppHeader
        containerStyle={{paddingHorizontal: ms(15)}}
        headerTitle={'Transaction'}
        leftElement={
          <Pressable onPress={() => navigation.goBack()}>
            <Image
              source={IMAGES.ic_backIcon}
              style={{height: mvs(20), width: ms(20)}}
              resizeMode="contain"
            />
          </Pressable>
        }
        rightElement={
          // <TouchableOpacity onPress={() => openFilter()}>
          <TouchableOpacity>
            <Image
              source={IMAGES.ic_searchFilter}
              style={{height: mvs(20), width: ms(20), tintColor: COLORS.WHITE}}
              resizeMode="cover"
              tintColor={COLORS.WHITE}
            />
          </TouchableOpacity>
        }
      />
      {filterVisible && (
        <FilterModal isVisible={filterVisible} onClose={() => closeFilter()} />
      )}
      <ScrollView
        style={styles.container}
        contentContainerStyle={{flex: transactionList.length > 0 ? null : 1}}>
        {transactionDetail && (
          <>
            <TouchableOpacity
              activeOpacity={0.9}
              style={[styles.mainContainer]}>
              {transactionDetail?.totalSale && (
                <View
                  style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                  <View style={{flex: 5}}>
                    <Text style={styles.statementTitle}>Statement</Text>
                    <Text style={[styles.subtitle, {color: '#938F9C'}]}>
                      Total Seller earning (base currency)
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 5,
                      alignItems: 'flex-end',
                      justifyContent: 'center',
                    }}>
                    <Text style={styles.amountGreen}>
                      {displayPrice(
                        transactionDetail?.totalSale,
                        transactionDetail?.ordercurrencycode,
                      )}
                    </Text>
                  </View>
                </View>
              )}
              <View style={styles.divider} />

              {transactionDetail?.totalSale && (
                <View style={styles.row}>
                  <Text style={styles.label}>Total Sale</Text>
                  <Text style={styles.value}>
                    {displayPrice(
                      transactionDetail?.totalSale,
                      transactionDetail?.ordercurrencycode,
                    )}
                  </Text>
                </View>
              )}
              {transactionDetail?.totalTax && (
                <View style={styles.row}>
                  <Text style={styles.label}>Tax</Text>
                  <Text style={styles.value}>
                    {displayPrice(
                      transactionDetail?.totalTax,
                      transactionDetail?.ordercurrencycode,
                    )}
                  </Text>
                </View>
              )}
              {transactionDetail?.commissionPaid && (
                <View style={styles.row}>
                  <Text style={styles.label}>Commission</Text>
                  <Text style={styles.value}>
                    {displayPrice(
                      transactionDetail?.commissionPaid,
                      transactionDetail?.ordercurrencycode,
                    )}
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            {transactionDetail?.totalPayout && (
              <TouchableOpacity
                activeOpacity={0.9}
                style={[styles.mainContainer]}>
                <View
                  style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                  <View style={{flex: 5}}>
                    <Text style={styles.statementTitle}>Total Payout</Text>
                    <Text style={styles.subtitle}>{'(Base currency)'}</Text>
                  </View>
                  <View
                    style={{
                      flex: 5,
                      alignItems: 'flex-end',
                      justifyContent: 'center',
                    }}>
                    <Text style={styles.amountGreen}>
                      {displayPrice(
                        transactionDetail?.totalPayout,
                        transactionDetail?.ordercurrencycode,
                      )}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          </>
        )}
        {/* Transaction List */}
        <FlatList
          style={{marginBottom: 30}}
          data={transactionList}
          keyExtractor={item => item.increment_id?.toString()}
          renderItem={({item}) => (
            <TouchableOpacity
              activeOpacity={0.9}
              style={[styles.mainContainer]}>
              <View style={styles.transactionRow}>
                <Text style={styles.transactionAmount}>
                  {item.increment_id}
                </Text>
                <Text style={[styles.transactionStatus, {color: '#1A7F65'}]}>
                  {displayPrice(item?.order_total, item?.order_currency_code)}
                </Text>
              </View>
              <View style={[styles.transactionRow, {marginTop: mvs(10)}]}>
                <Text style={[styles.transactionAmount, {color: '#6C7278'}]}>
                  {formatDate(item?.created_at, 'DD MMM, YYYY, hh:mm:ss A')}
                </Text>
                <Text
                  style={[
                    styles.transactionStatus,
                    {color: '#6C7278', textTransform: 'capitalize'},
                  ]}>
                  {item?.order_status}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={{flex: transactionList.length > 0 ? null : 1}}
          ListEmptyComponent={!loading && <NoRecordFound />}
        />
      </ScrollView>
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  layout: {
    paddingHorizontal: 0,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.WHITE,
  },
  statementBox: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  payoutBox: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  statementTitle: {
    fontSize: 18,
    marginBottom: 4,
    fontFamily: FONTS.workSansSemiBold,
    color:COLORS.BLACK
  },
  subtitle: {
    fontSize: 14,
    color: '#938F9C',
    marginBottom: 12,
    fontFamily: FONTS.workSansRegular,
  },
  amount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
  },
  amountGreen: {
    fontFamily: FONTS.workSansSemiBold,
    fontSize: 22,
    color: COLORS.PRIMARY,
  },
  divider: {
    height: 1,
    backgroundColor: '#DADADA',
    marginVertical: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: FONTSIZE.XL,
    color: COLORS.BLACK,
    fontFamily: FONTS.workSansMedium,
  },
  value: {
    fontSize: 16,
    color: '#000',
    fontFamily: FONTS.workSansSemiBold,
  },
  transactionItem: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  transactionRef: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: 'gray',
    marginBottom: 12,
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  transactionAmount: {
    fontSize: FONTSIZE.L,
    fontFamily: FONTS.workSansMedium,
    color: COLORS.BLACK,
  },
  transactionStatus: {
    fontSize: 14,
    color: '#218838',
  },
  mainContainer: {
    // flexDirection: 'row',
    // alignItems: 'center',
    paddingVertical: ms(16),
    paddingHorizontal: ms(15),
    borderWidth: 1,
    borderRadius: s(10),
    borderColor: COLORS.BORDER,
    marginTop: ms(16),
  },
});

export default Transaction;

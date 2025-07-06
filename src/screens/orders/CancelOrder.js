import {useEffect, useState} from 'react';
import {View, FlatList, StyleSheet, RefreshControl} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {ms, mvs, s} from 'react-native-size-matters';
import {COLORS} from '../../constant/color';
import {GLOBAL_CONSTANT} from '../../constant/globalConstants';
import AllOrdersListing from '../../components/orders/AllOrdersListing';
import {showToast} from '../../utils/global';
import {FONTS, FONTSIZE} from '../../constant/fonts';
import {useLazyQuery} from '@apollo/client';
import {SELLER_ORDER_LIST} from '../../queries/ProductQueries';
import NoRecordFound from '../../components/common/NoRecordFound';
import {useGlobalData} from '../../context/AppContext';
import {hideLoader, showLoader} from '../../components/common/AppLoader';
import ListLoader from '../../components/common/ListLoader';

const CancelOrder = () => {
  const navigation = useNavigation();
  const {setCancelOrderCount} = useGlobalData();
  const [isRefresh, setIsRefresh] = useState(false);
  const [isLoadMore, setIsLoadMore] = useState(false);
  const [allCanceledOrder, setAllCanceledOrder] = useState([]);
  const [isOrderClicked, setIsOrderClicked] = useState(false);

  const [pagination, setPagination] = useState({
    totalCount: 0,
    current_page: 1,
    page_size: GLOBAL_CONSTANT.PER_PAGE,
    total_pages: 1,
  });

  const [fetchCanceledList, {loading: canceledLoading}] = useLazyQuery(
    SELLER_ORDER_LIST,
    {
      onCompleted: response => {
        setIsRefresh(false);
        setIsLoadMore(false);
        if (response?.sellerCustomOrderList?.items?.length > 0) {
          const orders = response?.sellerCustomOrderList?.items;
          const pageInfo = response?.sellerCustomOrderList?.page_info;
          setAllCanceledOrder(orders);
          if (response?.sellerCustomOrderList?.total_canceled) {
            setCancelOrderCount(
              response?.sellerCustomOrderList?.total_canceled,
            );
          }
          if (pageInfo?.current_page > 1 && !isOrderClicked) {
            setAllCanceledOrder(prevOrders => [...prevOrders, ...orders]);
          } else {
            setAllCanceledOrder(orders);
          }

          setPagination({
            totalCount: response?.sellerCustomOrderList.total_count,
            current_page: pageInfo.current_page,
            page_size: pageInfo.page_size,
            total_pages: pageInfo.total_pages,
          });
        } else {
          setPagination({
            totalCount: 0,
            current_page: 1,
            page_size: GLOBAL_CONSTANT.PER_PAGE,
            total_pages: 1,
          });
          setAllCanceledOrder([]);
          setCancelOrderCount(0);
        }
      },
      onError: error => {
        console.log('error---', error);
        setAllCanceledOrder([]);
        setCancelOrderCount(0);
        setIsRefresh(false);
        setIsLoadMore(false);
        setPagination({
          totalCount: 0,
          current_page: 1,
          page_size: GLOBAL_CONSTANT.PER_PAGE,
          total_pages: 1,
        });
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
      // notifyOnNetworkStatusChange: true,
    },
  );

  const loadMoreItems = () => {
    if (pagination.current_page < pagination.total_pages) {
      setIsLoadMore(true);
      const nextPage = pagination.current_page + 1;
      fetchCanceledList({
        variables: {
          status: 'canceled',
          customer: '',
          increment_id: '',
          start_date: '',
          end_date: '',
          searchtext: '',
          pageSize: GLOBAL_CONSTANT.PER_PAGE,
          currentPage: nextPage,
        },
      });
    }
  };
  useEffect(() => {
    if (canceledLoading && !isRefresh) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [canceledLoading]);

  const handleReload = () => {
    setIsRefresh(true);
    fetchCanceledList({
      variables: {
        status: 'canceled',
        customer: '',
        increment_id: '',
        start_date: '',
        end_date: '',
        searchtext: '',
        pageSize: GLOBAL_CONSTANT.PER_PAGE,
        currentPage: 1,
      },
    });
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchCanceledList({
        variables: {
          status: 'canceled',
          customer: '',
          increment_id: '',
          start_date: '',
          end_date: '',
          searchtext: '',
          pageSize: GLOBAL_CONSTANT.PER_PAGE,
          currentPage: 1,
        },
      });
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <FlatList
        data={allCanceledOrder}
        keyExtractor={item => item?.increment_id}
        renderItem={({item, index}) => (
          <AllOrdersListing
            navigation={navigation}
            productData={allCanceledOrder}
            index={index}
            item={item}
            isAllOrders={false}
            onClick={() => setIsOrderClicked(true)}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={isRefresh}
            onRefresh={handleReload}
            tintColor={COLORS.PRIMARY}
          />
        }
        ListEmptyComponent={!canceledLoading && <NoRecordFound />}
        contentContainerStyle={[
          styles.list,
          {flex: allCanceledOrder?.length > 0 ? null : 1},
        ]}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.3}
        onEndReached={loadMoreItems}
        ListFooterComponent={<ListLoader loading={isLoadMore} />}
      />
    </View>
  );
};

export default CancelOrder;

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

  flatLine: {
    height: 3,
    backgroundColor: COLORS.TITLE,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: ms(50),
    borderRadius: 100,
  },
  flexContainer: {
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexDirection: 'row',
    gap: ms(10),
    flex: 1,
  },
  halfFlex: {
    flex: 1 / 2,
    justifyContent: 'center',
  },
  dropdownStyle: {
    paddingHorizontal: null,
    backgroundColor: 'white',
    borderColor: COLORS.BORDER,
    borderWidth: 1,
    paddingVertical: null,
    marginTop: 10,
    flex: 1,
    height: mvs(40),
  },
  btnText: {
    color: COLORS.WHITE,
    fontSize: FONTSIZE.XL,
    fontFamily: FONTS.workSansMedium,
  },
  cancelBtn: {
    paddingHorizontal: ms(55),
    paddingVertical: mvs(12),
    borderRadius: s(10),
    borderWidth: 1,
    borderColor: '#6C7278',
  },
  updateBtn: {
    paddingHorizontal: ms(60),
    paddingVertical: mvs(12),
    borderRadius: s(10),
    borderWidth: 1,
    borderColor: '#115543',
  },
});

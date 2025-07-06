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
import ListLoader from '../../components/common/ListLoader';

const CompleteOrder = () => {
  const navigation = useNavigation();
  const {
    setCompletedOrderCount,
  } = useGlobalData();
  const [isRefresh, setIsRefresh] = useState(false);
  const [isLoadMore, setIsLoadMore] = useState(false);
  const [allCompleteOrder, setAllCompleteOrder] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isOrderClicked, setIsOrderClicked] = useState(false);

  const [pagination, setPagination] = useState({
    totalCount: 0,
    current_page: 1,
    page_size: GLOBAL_CONSTANT.PER_PAGE,
    total_pages: 1,
  });

  const [fetchCompleteList, {loading: completeLoading}] = useLazyQuery(
    SELLER_ORDER_LIST,
    {
      onCompleted: response => {
        setIsRefresh(false);
        setIsLoadMore(false);
        if (response?.sellerCustomOrderList?.items?.length > 0) {
          const orders = response?.sellerCustomOrderList?.items;
          const pageInfo = response?.sellerCustomOrderList?.page_info;
          if (response?.sellerCustomOrderList?.total_complete) {
            setCompletedOrderCount(
              response?.sellerCustomOrderList?.total_complete,
            );
          }

          // setAllCompleteOrder(orders);
          if (pageInfo?.current_page > 1 && !isOrderClicked) {
            setAllCompleteOrder(prevOrders => [...prevOrders, ...orders]);
          } else {
            setAllCompleteOrder(orders);
          }
        setPagination({
          totalCount: response.sellerCustomOrderList.total_filter_count,
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
          setAllCompleteOrder([]);
          setCompletedOrderCount(0);
        }
      },
      onError: error => {
        console.log('error---', error);
        setAllCompleteOrder([]);
        setCompletedOrderCount(0);
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
      fetchCompleteList({
        variables: {
          status: 'complete',
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
  // useEffect(() => {
  //   if (loading && !isRefresh) {
  //     showLoader();
  //   } else {
  //     hideLoader();
  //   }
  // }, [loading]);

  const handleReload = () => {
    setIsRefresh(true);
    setCurrentPage(1);
    fetchCompleteList({
      variables: {
        status: 'complete',
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
      fetchCompleteList({
        variables: {
          status: 'complete',
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
        data={allCompleteOrder}
        keyExtractor={item => item?.increment_id}
        renderItem={({item, index}) => (
          <AllOrdersListing
            navigation={navigation}
            productData={allCompleteOrder}
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
        ListEmptyComponent={!completeLoading && <NoRecordFound />}
        contentContainerStyle={[
          styles.list,
          {flex: allCompleteOrder?.length > 0 ? null : 1},
        ]}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.3}
        onEndReached={loadMoreItems}
        ListFooterComponent={<ListLoader loading={isLoadMore} />}
      />
    </View>
  );
};

export default CompleteOrder;

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

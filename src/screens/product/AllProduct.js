import {useEffect, useRef, useState} from 'react';
import {View, FlatList, StyleSheet, RefreshControl} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {ms, mvs} from 'react-native-size-matters';
import {COLORS} from '../../constant/color';
import {GLOBAL_CONSTANT} from '../../constant/globalConstants';
import AllProductListing from '../../components/products/AllProductListing';
import {useQuery} from '@apollo/client';
import {PRODUCT_LIST} from '../../queries/ProductQueries';
import {showToast} from '../../utils/global';
import NoRecordFound from '../../components/common/NoRecordFound';
import ListLoader from '../../components/common/ListLoader';
import {useGlobalData} from '../../context/AppContext';
import AppLoading from '../../components/common/AppLoading';

const AllProduct = () => {
  const {
    setAllProductCount,
    setApprovedProductCount,
    setPendingProductCount,
    setRejectedProductCount,
  } = useGlobalData();
  const navigation = useNavigation();
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefresh, setIsRefresh] = useState(false);
  const [allProductLoading, setAllProductLoading] = useState(true);
  const [isLoadMore, setIsLoadMore] = useState(false);
  const [allProductList, setAllProductList] = useState([]);
  const [pagination, setPagination] = useState({
    totalCount: 0,
    current_page: 1,
    page_size: GLOBAL_CONSTANT.PER_PAGE,
    total_pages: 1,
  });

  const {loading, refetch} = useQuery(PRODUCT_LIST, {
    variables: {
      pageSize: GLOBAL_CONSTANT.PER_PAGE,
      currentPage: currentPage,
      status: GLOBAL_CONSTANT.ALL,
    },

    onCompleted: response => {
      setAllProductLoading(false)
      setIsRefresh(false);
      setIsLoadMore(false);
      if (response?.sellerSelfProduct?.items?.length > 0) {
        const products = response?.sellerSelfProduct?.items;
        const pageInfo = response?.sellerSelfProduct?.page_info;
        setAllProductCount(response?.sellerSelfProduct?.total_count);
        setApprovedProductCount(response?.sellerSelfProduct?.seller_approved);
        setPendingProductCount(response?.sellerSelfProduct?.seller_pending);
        setRejectedProductCount(
          response?.sellerSelfProduct?.seller_disapproved,
        );

        if (pageInfo?.current_page > 1) {
          setAllProductList(prevProducts => [...prevProducts, ...products]);
        } else {
          setAllProductList(products);
        }
        setPagination({
          totalCount: response.sellerSelfProduct.total_count,
          current_page: pageInfo.current_page,
          page_size: pageInfo.page_size,
          total_pages: pageInfo.total_pages,
        });
      } else {
      setAllProductLoading(false);
        setPagination({
          totalCount: 0,
          current_page: 1,
          page_size: GLOBAL_CONSTANT.PER_PAGE,
          total_pages: 1,
        });
        setAllProductList([]);
        setAllProductCount(0);
        setApprovedProductCount(0);
        setPendingProductCount(0);
        setRejectedProductCount(0);
      }
    },
    onError: error => {
      setAllProductLoading(false);
      setApprovedProductCount(0);
      setPendingProductCount(0);
      setRejectedProductCount(0);
      setAllProductList([]);
      setAllProductCount(0);
      setIsRefresh(false);
      setIsLoadMore(false);
      setPagination({
        totalCount: 0,
        current_page: 1,
        page_size: GLOBAL_CONSTANT.PER_PAGE,
        total_pages: 1,
      });
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
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refetch({
        pageSize: GLOBAL_CONSTANT.PER_PAGE,
        currentPage: 1,
        status: GLOBAL_CONSTANT.ALL,
      });
    });
    return unsubscribe;
  }, [navigation]);

  // useEffect(() => {
  //   if (!isRefresh && !isLoadMore && loading) {
  //     showLoader();
  //     console.log('====================================');
  //     console.log('loading------------------', loading);
  //   } else {
  //     hideLoader();
  //   }
  // }, [loading]);

  useEffect(() => {
    setAllProductCount(pagination.totalCount);
  }, [pagination.totalCount, allProductList]);

  const loadMoreItems = () => {
    if (pagination.current_page < pagination.total_pages) {
      setIsLoadMore(true);
      const nextPage = pagination.current_page + 1;
      setCurrentPage(nextPage);
      refetch({
        pageSize: GLOBAL_CONSTANT.PER_PAGE,
        currentPage: nextPage,
        status: GLOBAL_CONSTANT.ALL,
      });
    }
  };

  const handleReload = () => {
    setIsRefresh(true);
    setCurrentPage(1);
    refetch({
      pageSize: GLOBAL_CONSTANT.PER_PAGE,
      currentPage: 1,
      status: GLOBAL_CONSTANT.ALL,
    });
  };

  return (
    <View style={styles.container}>
      <AppLoading appLoading={allProductLoading} />

      <FlatList
        data={allProductList}
        keyExtractor={item => item.mageproduct_id.toString()}
        renderItem={({item, index}) => (
          <AllProductListing
            navigation={navigation}
            productData={allProductList}
            index={index}
            item={item}
            isAllProduct={true}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={isRefresh}
            onRefresh={handleReload}
            tintColor={COLORS.PRIMARY}
          />
        }
        ListEmptyComponent={!loading && <NoRecordFound />}
        contentContainerStyle={[
          styles.list,
          {flex: allProductList?.length > 0 ? null : 1},
        ]}
        onEndReachedThreshold={0.3}
        onEndReached={loadMoreItems}
        ListFooterComponent={<ListLoader loading={isLoadMore} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default AllProduct;

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
});

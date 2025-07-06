import {useEffect, useState} from 'react';
import {View, FlatList, StyleSheet, RefreshControl} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {ms, mvs} from 'react-native-size-matters';
import {COLORS} from '../../constant/color';
import {GLOBAL_CONSTANT} from '../../constant/globalConstants';
import AllProductListing from '../../components/products/AllProductListing';
import {useLazyQuery, useQuery} from '@apollo/client';
import {PRODUCT_LIST} from '../../queries/ProductQueries';
import {showToast} from '../../utils/global';
import NoRecordFound from '../../components/common/NoRecordFound';
import ListLoader from '../../components/common/ListLoader';
import {useGlobalData} from '../../context/AppContext';
import {hideLoader, showLoader} from '../../components/common/AppLoader';

const PendingProduct = () => {
  const {setPendingProductCount} = useGlobalData();
  const navigation = useNavigation();
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefresh, setIsRefresh] = useState(false);
  const [pendingProductList, setPendingProductList] = useState([]);
  const [pagination, setPagination] = useState({
    totalCount: 0,
    current_page: 1,
    page_size: GLOBAL_CONSTANT.PER_PAGE,
    total_pages: 1,
  });

  const [fetchPendingList, {loading, refetch}] = useLazyQuery(PRODUCT_LIST, {
    variables: {
      pageSize: GLOBAL_CONSTANT.PER_PAGE,
      currentPage: currentPage,
      status: GLOBAL_CONSTANT.PENDING,
    },

    onCompleted: response => {
      setIsRefresh(false);
      hideLoader();
      // console.log('--------', response?.sellerSelfProduct?.items?.length);
      // console.log('response.sellerSelfProduct.total_count--------', response.sellerSelfProduct)
      if (response?.sellerSelfProduct?.items?.length > 0) {
        const products = response.sellerSelfProduct.items;
        const pageInfo = response.sellerSelfProduct.page_info;
        setPendingProductCount(response?.sellerSelfProduct?.total_count);
        if (pageInfo.current_page > 1) {
          setPendingProductList(prevProducts => [...prevProducts, ...products]);
        } else {
          setPendingProductList(products);
        }
        setPagination({
          totalCount: response.sellerSelfProduct.total_count,
          current_page: pageInfo.current_page,
          page_size: pageInfo.page_size,
          total_pages: pageInfo.total_pages,
        });
      } else {
        console.log('>>>>>>>>>>>>', pagination.totalCount);

        setPendingProductCount(0);
        setPendingProductList([]);
        setPagination({
          totalCount: 0,
          current_page: 1,
          page_size: GLOBAL_CONSTANT.PER_PAGE,
          total_pages: 1,
        });
      }
    },
    onError: error => {
      setPendingProductList([]);
      setPendingProductCount(0);
      setIsRefresh(false);
      hideLoader();
      setPagination({
        totalCount: 0,
        current_page: 1,
        page_size: GLOBAL_CONSTANT.PER_PAGE,
        total_pages: 1,
      });
      if (error.graphQLErrors) {
        error.graphQLErrors.forEach(err => showToast(err.message));
      }
      if (error.networkError) {
        showToast(error.networkError.message);
      }
    },
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchPendingList({
        variables: {
          pageSize: GLOBAL_CONSTANT.PER_PAGE,
          currentPage: 1,
          status: GLOBAL_CONSTANT.PENDING,
        },
      });
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (!isRefresh && loading) {
      // showLoader();
    } else {
      hideLoader();
    }
  }, [loading]);

  useEffect(() => {
    setPendingProductCount(pagination.totalCount);
    // navigation.setParams({productCount: pagination.totalCount});
  }, [pagination.totalCount, pendingProductList]);

  const loadMoreItems = () => {
    if (pagination.current_page < pagination.total_pages) {
      const nextPage = pagination.current_page + 1;
      setCurrentPage(nextPage);
      refetch({
        pageSize: GLOBAL_CONSTANT.PER_PAGE,
        currentPage: nextPage,
        status: GLOBAL_CONSTANT.PENDING,
      });
    }
  };

  const handleReload = () => {
    setIsRefresh(true);
    setCurrentPage(1);
    refetch({
      pageSize: GLOBAL_CONSTANT.PER_PAGE,
      currentPage: 1,
      status: GLOBAL_CONSTANT.PENDING,
    });
  };
  return (
    <View style={styles.container}>
      <FlatList
        data={pendingProductList}
        keyExtractor={item => item.mageproduct_id.toString()}
        renderItem={({item, index}) => (
          <AllProductListing
            navigation={navigation}
            productData={pendingProductList}
            index={index}
            item={item}
            isAllProduct={false}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={isRefresh} onRefresh={handleReload} />
        }
        ListEmptyComponent={!loading && <NoRecordFound />}
        contentContainerStyle={[
          styles.list,
          {flex: pendingProductList?.length > 0 ? null : 1},
        ]}
        onEndReachedThreshold={0.3}
        onEndReached={loadMoreItems}
        ListFooterComponent={
          <ListLoader
            loading={!loading && currentPage < pagination.total_pages}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default PendingProduct;

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

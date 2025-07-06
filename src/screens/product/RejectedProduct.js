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

const RejectedProduct = () => {
  const {setRejectedProductCount} = useGlobalData();
  const navigation = useNavigation();
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefresh, setIsRefresh] = useState(false);
  const [rejectedProductList, setRejectedProductList] = useState([]);
  const [pagination, setPagination] = useState({
    totalCount: 0,
    current_page: 1,
    page_size: GLOBAL_CONSTANT.PER_PAGE,
    total_pages: 1,
  });

  const [fetchRejectedList, {loading, refetch}] = useLazyQuery(PRODUCT_LIST, {
    variables: {
      pageSize: GLOBAL_CONSTANT.PER_PAGE,
      currentPage: currentPage,
      status: GLOBAL_CONSTANT.REJECTED,
    },

    onCompleted: response => {
      setIsRefresh(false);
      hideLoader();
      if (response?.sellerSelfProduct?.items?.length > 0) {
        const products = response.sellerSelfProduct.items;
        const pageInfo = response.sellerSelfProduct.page_info;
        setRejectedProductCount(response?.sellerSelfProduct?.total_count);
        if (pageInfo.current_page > 1) {
          // Append new products to existing list for infinite scrolling
          setRejectedProductList(prevProducts => [
            ...prevProducts,
            ...products,
          ]);
        } else {
          // First page load, replace product list
          setRejectedProductList(products);
        }

        // Set pagination data
        setPagination({
          totalCount: response.sellerSelfProduct.total_count,
          current_page: pageInfo.current_page,
          page_size: pageInfo.page_size,
          total_pages: pageInfo.total_pages,
        });
      } else {
        setRejectedProductCount(0);
        setRejectedProductList([]);
      }
    },
    onError: error => {
      setRejectedProductList([]);
      setRejectedProductCount(0);
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
      fetchRejectedList({
        variables: {
          pageSize: GLOBAL_CONSTANT.PER_PAGE,
          currentPage: 1,
          status: GLOBAL_CONSTANT.REJECTED,
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
    setRejectedProductCount(pagination.totalCount);
    // navigation.setParams({productCount: pagination.totalCount});
  }, [pagination.totalCount]);

  const loadMoreItems = () => {
    if (pagination.current_page < pagination.total_pages) {
      const nextPage = pagination.current_page + 1;
      setCurrentPage(nextPage);
      refetch({
        pageSize: GLOBAL_CONSTANT.PER_PAGE,
        currentPage: nextPage,
        status: GLOBAL_CONSTANT.REJECTED,
      });
    }
  };

  const handleReload = () => {
    setIsRefresh(true);
    setCurrentPage(1);
    refetch({
      pageSize: GLOBAL_CONSTANT.PER_PAGE,
      currentPage: 1,
      status: GLOBAL_CONSTANT.REJECTED,
    });
  };
  return (
    <View style={styles.container}>
      <FlatList
        data={rejectedProductList}
        keyExtractor={item => item.mageproduct_id.toString()}
        renderItem={({item, index}) => (
          <AllProductListing
            navigation={navigation}
            productData={rejectedProductList}
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
          {flex: rejectedProductList?.length > 0 ? null : 1},
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

export default RejectedProduct;

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

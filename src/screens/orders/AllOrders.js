import {useEffect, useRef, useState} from 'react';
import {View, FlatList, StyleSheet, RefreshControl} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {ms, mvs, s} from 'react-native-size-matters';
import {COLORS} from '../../constant/color';
import {GLOBAL_CONSTANT} from '../../constant/globalConstants';
import AllOrdersListing from '../../components/orders/AllOrdersListing';
import TextInputBox from '../../components/common/TextInputBox';
import {IMAGES} from '../../constant/imagePath';
import {showToast} from '../../utils/global';
import {FONTS, FONTSIZE} from '../../constant/fonts';
import {useLazyQuery} from '@apollo/client';
import {SELLER_ORDER_LIST} from '../../queries/ProductQueries';
import NoRecordFound from '../../components/common/NoRecordFound';
import {useGlobalData} from '../../context/AppContext';
import moment from 'moment-timezone';
import useDebounce from '../../hooks/useDebounce';
import ListLoader from '../../components/common/ListLoader';
import AppLoading from '../../components/common/AppLoading';
import FilterModal from '../../components/common/FilterModal';

const filterInputs = {
  status: null,
  customer: null,
  increment_id: null,
  start_date: null,
  end_date: null,
  orderSearch: null,
};

const dropDownData = [
  {name: 'Completed', value: 'complete'},
  {name: 'Pending', value: 'pending'},
  {name: 'Processing', value: 'processing'},
  {name: 'Canceled', value: 'canceled'},
];
const AllOrders = () => {
  const navigation = useNavigation();
  const {
    setAllOrderCount,
    setOrderDetailHeadTitle,
    setCompletedOrderCount,
    setPendingOrderCount,
    setCancelOrderCount,
    setProcessingOrderCount,
    isFilterActive,
    setIsFilterActive,
  } = useGlobalData();
  const [searchValue, setSearchValue] = useState(false);
  const [filterRecord, setFilterRecord] = useState(filterInputs);
  const [filterValues, setFilterValues] = useState(filterInputs);
  const [allOrderLoading, setAllOrderLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isOrderClicked, setIsOrderClicked] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);
  const [isLoadMore, setIsLoadMore] = useState(false);
  const [allOrderData, setAllOrderData] = useState([]);
  const [pagination, setPagination] = useState({
    totalCount: 0,
    current_page: 1,
    page_size: GLOBAL_CONSTANT.PER_PAGE,
    total_pages: 1,
  });

  const [fetchOrderList, {loading: orderLoading}] = useLazyQuery(
    SELLER_ORDER_LIST,
    {
      onCompleted: response => {
        console.log('order response??', response);
        setIsRefresh(false);
        setIsLoadMore(false);
        if (response?.sellerCustomOrderList?.items?.length > 0) {
          setAllOrderLoading(false);

          const orders = response?.sellerCustomOrderList?.items;
          const pageInfo = response?.sellerCustomOrderList?.page_info;
          if (pageInfo?.current_page > 1 && !isOrderClicked) {
            setAllOrderData(prevOrders => [...prevOrders, ...orders]);
          } else {
            setAllOrderData(orders);
          }
          setPagination({
            totalCount: response.sellerCustomOrderList.total_filter_count,
            current_page: pageInfo.current_page,
            page_size: pageInfo.page_size,
            total_pages: pageInfo.total_pages,
          });
          if (response?.sellerCustomOrderList?.total_filter_count) {
            setAllOrderCount(
              response?.sellerCustomOrderList?.total_filter_count,
            );
          }
          if (isFilterActive) {
            console.log('-----------', isFilterActive);
          } else {
            if (response?.sellerCustomOrderList?.total_processing) {
              setProcessingOrderCount(
                response?.sellerCustomOrderList?.total_processing,
              );
            }
            if (response?.sellerCustomOrderList?.total_pending) {
              setPendingOrderCount(
                response?.sellerCustomOrderList?.total_pending,
              );
            }
            if (response?.sellerCustomOrderList?.total_complete) {
              setCompletedOrderCount(
                response?.sellerCustomOrderList?.total_complete,
              );
            }
            if (response?.sellerCustomOrderList?.total_canceled) {
              setCancelOrderCount(
                response?.sellerCustomOrderList?.total_canceled,
              );
            }
          }
        } else {
          setAllOrderLoading(false);
          setPagination({
            totalCount: 0,
            current_page: 1,
            page_size: GLOBAL_CONSTANT.PER_PAGE,
            total_pages: 1,
          });
          setAllOrderData([]);
          setAllOrderCount(0);
          // setCompletedOrderCount(0);
          // setPendingOrderCount(0);
          // setCancelOrderCount(0);
          // setProcessingOrderCount(0);
        }
      },
      onError: error => {
        console.log('error---', error);
        setAllOrderLoading(false);

        setAllOrderData([]);
        setAllOrderCount(0);
        setCompletedOrderCount(0);
        setPendingOrderCount(0);
        setCancelOrderCount(0);
        setProcessingOrderCount(0);
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
      // fetchPolicy: 'network-only',
      // notifyOnNetworkStatusChange: true,
    },
  );
  console.log('isFilterActive..........', isFilterActive);
  const loadMoreItems = () => {
    if (pagination.current_page < pagination.total_pages) {
      setIsLoadMore(true);
      const nextPage = pagination.current_page + 1;
      fetchOrderList({
        variables: {
          status: filterValues.status ? filterValues.status : '',
          customer: filterValues.customer ? filterValues.customer : '',
          increment_id: filterValues.increment_id
            ? filterValues.increment_id
            : '',
          start_date: filterValues.start_date
            ? moment(filterValues.start_date, 'DD/MM/YYYY').format('YYYY-MM-DD')
            : '',
          end_date: filterValues.end_date
            ? moment(filterValues.end_date, 'DD/MM/YYYY').format('YYYY-MM-DD')
            : '',
          searchtext: '',
          pageSize: GLOBAL_CONSTANT.PER_PAGE,
          currentPage: nextPage,
        },
      });
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setOrderDetailHeadTitle(null);
      setIsFilterOpen(false);
      setIsFilterActive(false);
      setFilterRecord(filterInputs);
      setFilterValues(filterInputs);
      fetchOrderList({
        variables: {
          status: '',
          customer: '',
          increment_id: '',
          start_date: '',
          end_date: '',
          searchtext: '',
          pageSize: GLOBAL_CONSTANT.PER_PAGE,
          currentPage: 1,
        },
      });
      // showLoader()
      setIsOrderClicked(false);
    });
    return unsubscribe;
  }, [navigation]);

  const closeFilter = () => {
    setIsFilterOpen(false);
  };

  const handleReload = () => {
    setIsRefresh(true);
    setFilterValues(filterInputs);
    setFilterRecord(filterInputs);
    setIsFilterActive(false);
    fetchOrderList({
      variables: {
        status: '',
        customer: '',
        increment_id: '',
        start_date: '',
        end_date: '',
        searchtext: '',
        pageSize: GLOBAL_CONSTANT.PER_PAGE,
        currentPage: 1,
      },
    });
    setSearchValue('');
  };

  const handleApplyFilter = () => {
    if (
      (filterRecord.start_date && !filterRecord.end_date) ||
      (!filterRecord.start_date && filterRecord.end_date)
    ) {
      showToast('Please fill both date field start and end date');
      return;
    } else {
      setIsFilterActive(true);
      setFilterValues(filterRecord);

      closeFilter();
      const refetchParams = {
        status: filterRecord.status ? filterRecord.status : '',
        customer: filterRecord.customer ? filterRecord.customer : '',
        increment_id: filterRecord.increment_id
          ? filterRecord.increment_id
          : '',
        start_date: filterRecord.start_date
          ? moment(filterRecord.start_date, 'DD/MM/YYYY').format('YYYY-MM-DD')
          : '',
        end_date: filterRecord.end_date
          ? moment(filterRecord.end_date, 'DD/MM/YYYY').format('YYYY-MM-DD')
          : '',
      };
      console.log('refetchParams-----', refetchParams);
      setAllOrderLoading(true);

      fetchOrderList({
        variables: {
          status: filterRecord.status ? filterRecord.status : '',
          customer: filterRecord.customer ? filterRecord.customer : '',
          increment_id: filterRecord.increment_id
            ? filterRecord.increment_id
            : '',
          start_date: filterRecord.start_date
            ? moment(filterRecord.start_date, 'DD/MM/YYYY').format('YYYY-MM-DD')
            : '',
          end_date: filterRecord.end_date
            ? moment(filterRecord.end_date, 'DD/MM/YYYY').format('YYYY-MM-DD')
            : '',
          searchtext: '',
          pageSize: GLOBAL_CONSTANT.PER_PAGE,
          currentPage: 1,
        },
      });
    }
  };

  const handleDateSelector = (prevState, start_date = false) => {
    if (start_date) {
      setFilterRecord({...filterRecord, start_date: prevState});
    } else {
      setFilterRecord({...filterRecord, end_date: prevState});
    }
  };

  const onInputChange = (key, value) => {
    setFilterRecord({...filterRecord, [key]: value});
  };

  const minDate = moment().subtract(50, 'years').toDate();
  let maxDate = new Date();
  const today = new Date();
  maxDate.setFullYear(today.getFullYear() + 50);
  const debounceSearchOrder = useDebounce(searchValue, 500);

  useEffect(() => {
    if (!debounceSearchOrder) {
      // setFilterValues({
      //   ...filterValues,
      //   orderSearch: null,
      // });
      // setIsFilterActive(true);
      setAllOrderLoading(true);

      fetchOrderList({
        variables: {
          status: '',
          customer: '',
          increment_id: '',
          start_date: '',
          end_date: '',
          searchtext: '',
          pageSize: GLOBAL_CONSTANT.PER_PAGE,
          currentPage: 1,
        },
      });
    } else {
      setAllOrderLoading(true);
      // setIsFilterActive(true);
      // setFilterValues({
      //   ...filterValues,
      //   orderSearch: debounceSearchOrder,
      // });

      fetchOrderList({
        variables: {
          status: '',
          customer: '',
          increment_id: '',
          start_date: '',
          end_date: '',
          searchtext: debounceSearchOrder?.trim(),
          pageSize: GLOBAL_CONSTANT.PER_PAGE,
          currentPage: 1,
        },
      });
    }
  }, [debounceSearchOrder]);

  const clearFilter = () => {
    setIsFilterOpen(false);
    setIsFilterActive(false);
    fetchOrderList({
      variables: {
        status: '',
        customer: '',
        increment_id: '',
        start_date: '',
        end_date: '',
        searchtext: '',
        pageSize: GLOBAL_CONSTANT.PER_PAGE,
        currentPage: 1,
      },
    });
    setFilterRecord(filterInputs);
  };

  return (
    <View style={styles.container}>
      <TextInputBox
        value={searchValue}
        onChangeText={text => setSearchValue(text)}
        placeholder={'Search Order'}
        containerStyle={{paddingHorizontal: mvs(15), paddingBottom: mvs(10)}}
        rightIcon={IMAGES.ic_searchFilter}
        leftIcon={IMAGES.ic_searchIcon}
        onRightIconPress={() => {
          // refInput.current.open();
          setIsFilterOpen(true);
        }}
        editable={isFilterOpen ? false : true}
      />
      <FilterModal
        clearFilter={() => clearFilter()}
        dropDownData={dropDownData}
        filterRecord={filterRecord}
        setFilterRecord={setFilterRecord}
        handleApplyFilter={() => handleApplyFilter()}
        handleDateSelector={(data, item) => handleDateSelector(data, item)}
        isFilterActive={isFilterActive}
        isVisible={isFilterOpen}
        maxDate={maxDate}
        minDate={minDate}
        onClose={() => closeFilter()}
        onInputChange={onInputChange}
      />
      {/* <RBSheet
        ref={refInput}
        draggable={true}
        onClose={() => setIsFilterOpen(false)}
        closeOnPressMask={() => closeFilter()}
        customModalProps={{
          animationType: 'slide',
          statusBarTranslucent: true,
        }}
        customStyles={{
          container: {
            borderTopLeftRadius: s(30),
            borderTopRightRadius: s(30),
            height: sHeight / 1.5,
          },
          draggableIcon: {
            width: ms(90),
          },
        }}>
        <ScrollView>
          <>
            <Text
              style={{
                alignSelf: 'center',
                alignItems: 'center',
                textAlign: 'center',
                color: COLORS.BLACK,
                fontSize: FONTSIZE.L,
                fontFamily: FONTS.workSansMedium,
              }}>
              Filter By
            </Text>

            <View style={{paddingHorizontal: 15}}>
              <TextInputBox
                title={'Customer'}
                value={filterRecord.customer}
                onChangeText={text => {
                  onInputChange('customer', text);
                }}
                placeholder={'Customer'}
              />
              <TextInputBox
                title={'Order Id'}
                value={filterRecord.increment_id}
                onChangeText={text => {
                  onInputChange('increment_id', text);
                }}
                placeholder={'Enter Order Id'}
                containerStyle={{marginTop: mvs(20)}}
              />

              <SingleSelectDropdown
                data={dropDownData}
                mainContainerStyle={{
                  flex: 1,
                  // height: mvs(40),
                  // marginLeft: mvs(30),
                  // marginTop: 20,
                }}
                labelStyle={{marginTop: mvs(28)}}
                label={'Select Status'}
                dropdownStyle={[styles.dropdownStyle]}
                rightIconStyle={{marginRight: ms(15)}}
                dropdownTitle={'Select Status'}
                onItemSelect={item =>
                  setFilterRecord({
                    ...filterRecord,
                    status: item.value,
                  })
                }
                selectedValue={filterRecord.status}
                inverted={false}
                labelField="name"
                valueField="value"
                listItemStyle={{
                  backgroundColor: 'white',
                }}
              />
              <View style={styles.flexContainer}>
                <View style={styles.halfFlex}>
                  <DatePickers
                    initialTip={false}
                    customStyle={{}}
                    date={null}
                    setDate={date => handleDateSelector(date, true)}
                    selectDate={filterRecord.start_date}
                    isToolTipActive={false}
                    pickerPlaceHolder={'Start Date'}
                    minimumDates={minDate}
                    // maximumDates={filterValues.end_date || maxDate}
                    maximumDates={maxDate}
                  />
                </View>
                <View style={styles.halfFlex}>
                  <DatePickers
                    initialTip={false}
                    customStyle={{}}
                    date={null}
                    setDate={date => handleDateSelector(date)}
                    selectDate={filterRecord.end_date}
                    isToolTipActive={false}
                    pickerPlaceHolder={'End Date'}
                    minimumDates={minDate}
                    maximumDates={maxDate}
                  />
                </View>
              </View>
              <View
                style={[
                  styles.flexContainer,
                  {
                    marginTop: mvs(28),
                  },
                ]}>
                {!isFilterActive ? (
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => closeFilter()}
                    style={[styles.cancelBtn]}>
                    <Text style={[styles.btnText, {color: COLORS.TITLE}]}>
                      {'Cancel'}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => {
                      refInput.current.close();
                      setIsFilterOpen(false);
                      setIsFilterActive(false);
                      fetchOrderList({
                        variables: {
                          status: '',
                          customer: '',
                          increment_id: '',
                          start_date: '',
                          end_date: '',
                          searchtext: '',
                          pageSize: GLOBAL_CONSTANT.PER_PAGE,
                          currentPage: 1,
                        },
                      });
                      setFilterRecord(filterInputs);
                      // setFilterValues(filterInputs);
                    }}
                    style={[styles.cancelBtn, {paddingHorizontal: 42}]}>
                    <Text style={[styles.btnText, {color: COLORS.TITLE}]}>
                      {'Clear filter'}
                    </Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  activeOpacity={0.95}
                  onPress={() => handleApplyFilter()}
                  style={{}}>
                  <LinearGradient
                    colors={['#1A7F65', '#115543']}
                    style={styles.updateBtn}
                    start={{x: 0.2, y: 0}}
                    end={{x: 0.2, y: 1}}>
                    <Text style={[styles.btnText]} numberOfLines={1}>
                      {'Apply'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </>
        </ScrollView>
      </RBSheet> */}
      <AppLoading appLoading={allOrderLoading} />
      <FlatList
        data={allOrderData}
        keyExtractor={item => item.increment_id?.toString()}
        renderItem={({item, index}) => (
          <AllOrdersListing
            navigation={navigation}
            productData={allOrderData}
            index={index}
            item={item}
            isAllOrders={true}
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
        ListEmptyComponent={
          !orderLoading && !allOrderLoading && <NoRecordFound />
        }
        contentContainerStyle={[
          styles.list,
          {flex: allOrderData?.length > 0 ? null : 1},
        ]}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.3}
        onEndReached={loadMoreItems}
        ListFooterComponent={<ListLoader loading={isLoadMore} />}
      />
    </View>
  );
};

export default AllOrders;

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
    gap: ms(20),
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
    height: mvs(45),
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

import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AppHeader from '../../components/common/AppHeader';
import {IMAGES} from '../../constant/imagePath';
import {ms, mvs, s} from 'react-native-size-matters';
import AppLayout from '../../components/layouts/AppLayout';
import {COLORS} from '../../constant/color';
import {FONTS, FONTSIZE} from '../../constant/fonts';
import {useQuery} from '@apollo/client';
import NoRecordFound from '../../components/common/NoRecordFound';
import {hideLoader, showLoader} from '../../components/common/AppLoader';
import {showToast} from '../../utils/global';
import {GET_CATEGORY} from '../../queries/ProductQueries';
import {useGlobalData} from '../../context/AppContext';
import CustomModal from '../../components/common/CustomModal';
import LinearGradient from 'react-native-linear-gradient';

const Category = ({navigation}) => {
  const {userData} = useGlobalData();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryList, setCategoryList] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isUserRequired, setIsUserRequired] = useState(false);
  const [pagination, setPagination] = useState(null);
  // Use the lazy query to fetch categories
  const {loading, refetch} = useQuery(GET_CATEGORY, {
    variables: {
      pageSize: 50,
      currentPage: 1,
    },
    onCompleted: data => {
      setIsRefreshing(false);
      hideLoader(); // Ensure refreshing state is false
      if (data && data?.categories && data?.categories?.items?.length > 0) {
        setCategoryList(data?.categories?.items);
        setPagination(data?.categories?.page_info);
      } else {
        setCategoryList([]);
      }
      hideLoader();
    },
    onError: error => {
      setIsRefreshing(false);
      setCategoryList([]);
      hideLoader();
      console.log('Error fetching categories:', error);
    },
    notifyOnNetworkStatusChange: true,
  });
  console.log('isRefreshing----', loading, isRefreshing);

  const handleReload = () => {
    setIsRefreshing(true);
    refetch({
      pageSize: 50,
      currentPage: 1,
    });
  };
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refetch({
        pageSize: 50,
        currentPage: 1,
      });
      setSelectedCategory(null);
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (!isRefreshing && loading) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [loading]);

  const handleCategorySelect = item => {
    // navigation.navigate('AddProduct', {selectedCategory: item.id});
    if (userData && userData?.ca_vendor_lat && userData?.ca_vendor_long) {
      setSelectedCategory(item.id);
      navigation.navigate('AddProduct', {selectedCategory: item.id});
    } else {
      setIsUserRequired(true);
      //  navigation.navigate('EditStore')
      // showToast('Please update first your store info');
    }
  };

  const renderCategoryItem = ({item}) => {
    const isSelected = selectedCategory === item.id;
    const imageUrl = item?.image ? {uri: item?.image} : IMAGES.ic_defaultImage;
    return (
      <TouchableOpacity
        style={[styles.categoryItem]}
        activeOpacity={0.8}
        onPress={() => handleCategorySelect(item)}>
        {imageUrl && (
          <Image
            source={imageUrl}
            style={[
              styles.categoryImage,
              {
                borderColor: isSelected ? COLORS.PRIMARY : COLORS.WHITE,
                borderWidth: isSelected ? 2 : 1,
              },
            ]}
            resizeMode="cover"
          />
        )}
        {item?.name && (
          <Text
            style={[
              styles.categoryText,
              {color: isSelected ? '#14604C' : COLORS.BLACK},
            ]}
            numberOfLines={2}>
            {item?.name}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <AppLayout containerStyle={styles.layout}>
      {isUserRequired && (
        <CustomModal
          isVisible={isUserRequired}
          hasHeader={false}
          modalContainerStyle={styles.modalContainer}
          contentContainerStyle={{}}
          animationInTiming={350}
          animationOutTiming={350}
          onClose={() => setIsUserRequired(false)}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              {'Please update first your store information'}
            </Text>
            <View style={styles.mainContainer}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setIsUserRequired(false)}
                style={[styles.cancelBtn]}>
                <Text style={[styles.btnText, {color: COLORS.TITLE}]}>
                  {'Cancel'}
                </Text>
              </TouchableOpacity>
              <LinearGradient
                colors={['#1A7F65', '#115543']}
                style={{borderRadius: 10}}
                // style={[styles.updateBtn]}
                start={{x: 0.2, y: 0}}
                end={{x: 0.2, y: 1}}>
                <TouchableOpacity
                  style={styles.updateBtn}
                  activeOpacity={0.9}
                  onPress={() => {
                    navigation.navigate('EditStore');
                    setIsUserRequired(false);
                  }}>
                  <Text style={styles.btnText}>{'Okay'}</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
        </CustomModal>
      )}
      <AppHeader
        containerStyle={styles.headerContainer}
        leftElement={
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              navigation.openDrawer();
            }}>
            <Image
              source={IMAGES.ic_humberIcon}
              style={{height: mvs(25), width: ms(25), resizeMode: 'contain'}}
              resizeMode="contain"
            />
          </TouchableOpacity>
        }
        rightElement={
          <TouchableOpacity
            onPress={() => navigation.navigate('Notifications')}>
            <Image
              source={IMAGES.ic_notification}
              style={{height: mvs(20), width: ms(20), tintColor: COLORS.WHITE}}
              resizeMode="cover"
            />
          </TouchableOpacity>
        }
        headerTitle={'Choose category'}
      />
      <FlatList
        data={categoryList}
        renderItem={renderCategoryItem}
        keyExtractor={item => item.id.toString()}
        numColumns={3}
        style={{flex: 1}}
        contentContainerStyle={{
          paddingHorizontal: 15,
          flex: categoryList.length > 0 ? null : 1,
          paddingBottom: mvs(30),
        }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleReload}
            tintColor={COLORS.PRIMARY}
          />
        }
        ListEmptyComponent={!loading && <NoRecordFound />}
        // onEndReached={loadMoreItems}
        // onEndReachedThreshold={0.5}
      />
      {/* <StoreHours/> */}
    </AppLayout>
  );
};

export default Category;

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: ms(15),
    paddingBottom: mvs(30),
  },
  gradient: {
    paddingVertical: 15,
    // paddingHorizontal: 25,
    borderRadius: 10,
    alignItems: 'center',
  },
  layout: {
    paddingHorizontal: ms(0),
  },
  categoryItem: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    flex: 1 / 3,
    marginTop: mvs(20),
  },
  categoryImage: {
    height: 100,
    width: 100,
    borderRadius: 100,
    resizeMode: '',
    marginBottom: mvs(10),
    borderColor: COLORS.WHITE,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: FONTSIZE.L,
    color: COLORS.BLACK,
    fontFamily: FONTS.workSansMedium,
    textAlign: 'center',
  },
  pieChart: {
    height: 200,
    width: 200,
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalText: {
    fontSize: FONTSIZE.XL,
    fontFamily: FONTS.workSansMedium,
    color: COLORS.BLACK,
    textAlign: 'center',
    // marginTop: mvs(20),
  },
  modalView: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: mvs(10),
  },
  btnText: {
    color: COLORS.WHITE,
    fontSize: FONTSIZE.XL,
    fontFamily: FONTS.workSansMedium,
  },
  cancelBtn: {
    paddingHorizontal: ms(40),
    paddingVertical: mvs(12),
    borderRadius: s(10),
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  updateBtn: {
    paddingHorizontal: ms(50),
    paddingVertical: mvs(12),
    borderRadius: s(10),
  },
  mainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: mvs(20),
  },
});

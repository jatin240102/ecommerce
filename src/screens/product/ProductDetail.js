import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Switch,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import AppLayout from '../../components/layouts/AppLayout';
import AppHeader from '../../components/common/AppHeader';
import {IMAGES} from '../../constant/imagePath';
import {ms, mvs} from 'react-native-size-matters';
import {COLORS} from '../../constant/color';
import {FONTS, FONTSIZE} from '../../constant/fonts';
import NoRecordFound from '../../components/common/NoRecordFound';
import {displayPrice, formatDate, showToast} from '../../utils/global';
import Swiper from 'react-native-swiper';
import {useLazyQuery, useQuery} from '@apollo/client';
import {
  PRODUCT_DETAIL,
  PRODUCT_STATUS_UPDATE,
} from '../../queries/ProductQueries';
import {hideLoader, showLoader} from '../../components/common/AppLoader';

const ProductDetail = ({navigation, route}) => {
  const [isEnabled, setIsEnabled] = React.useState(false);
  const [isDisable, setIsDisable] = React.useState(false);
  console.log('isDisable', isDisable);
  const [productData, setProductData] = useState(null);
  const [mediaGallery, setMediaGallery] = useState([]);
  // const toggleSwitch = () => setIsEnabled(!isEnabled);
  const {productId} = route.params;

  const {loading, refetch} = useQuery(PRODUCT_DETAIL, {
    variables: {id: productId},

    onCompleted: data => {
      console.log('data===', data);
      hideLoader();
      setProductData(data?.sellerProductDetail?.items);
      setMediaGallery(data?.sellerProductDetail?.gallery);
    },
    onError: error => {
      hideLoader();
      if (error.graphQLErrors) {
        error.graphQLErrors.forEach(err => showToast(err.message));
      }
      if (error.networkError) {
        showToast(error.networkError.message);
      }
    },
  });
  console.log('productData?.status-----', productData?.status);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refetch({id: productId});
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (loading) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [loading, productData]);

  useEffect(() => {
    if (productData?.seller_status === 'Approve') {
      setIsEnabled(true);
      setIsDisable(false);
    } else {
      setIsDisable(true);
      setIsEnabled(false);
    }
  }, [productData]);
  const deliveryMethods = productData?.delivery_methods?.split(',') || null;

  const [sellerProductStatusUpdate] = useLazyQuery(PRODUCT_STATUS_UPDATE, {
    onCompleted: response => {
      showToast(response?.sellerProductStatusUpdate?.message);
    },
    onError: error => {
      if (error.graphQLErrors) {
        error.graphQLErrors.forEach(err => showToast(err.message));
      }
      if (error.networkError) {
        showToast(error.networkError.message);
      }
    },
    notifyOnNetworkStatusChange: true,
  });

  // Toggle the switch and call the API
  const toggleSwitch = () => {
    const newStatus = !isEnabled ? 1 : 2;

    if (isEnabled) {
      setIsEnabled(false);
      setIsDisable(true);
    } else {
      setIsEnabled(false);
      setIsDisable(true);
    }

    sellerProductStatusUpdate({
      variables: {
        id: productId,
        status: newStatus,
      },
    });
    if (!isEnabled) {
      setIsDisable(true);
    }
    refetch({
      id: productId,
    });
  };

console.log('productData.', productData?.description);

  return (
    <AppLayout containerStyle={styles.layout}>
      <AppHeader
        containerStyle={styles.headerContainer}
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
          <TouchableOpacity
            onPress={
              productData && productData?.mageproduct_id
                ? () =>
                    navigation.navigate('EditProduct', {
                      productId: productData?.mageproduct_id,
                    })
                : () => {}
            }>
            <Image
              source={IMAGES.editProductIcon}
              style={{height: mvs(20), width: ms(20), tintColor: COLORS.WHITE}}
              resizeMode="cover"
            />
          </TouchableOpacity>
        }
        headerTitle={'Product Detail'}
      />
      {productData ? (
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: productData ? null : 15,
            flexGrow: 1,
            // backgroundColor: 'red',
          }}
          bounces={false}
          showsVerticalScrollIndicator={false}>
          {/* Product Image */}
          <View style={{height: 300}}>
            <Swiper
              style={{alignItems: 'center'}}
              showsButtons={false}
              // autoplay={true}
              // dotColor="#c4c4c4"
              // activeDotColor="#42A5F5"
              dot={<View style={styles.dot} />}
              activeDot={<View style={styles.activeDot} />}
              paginationStyle={styles.paginationStyle}>
              {mediaGallery
                ?.filter(image => image.disabled === 0)
                .map(image => {
                  return (
                    <View
                      key={`${image?.id}-${image.url}`}
                      style={[styles.slider]}>
                      <Image
                        source={{uri: image.url}}
                        style={styles.sliderImage}
                        resizeMode="cover"
                      />
                    </View>
                  );
                })}
            </Swiper>
          </View>
          <View style={{marginTop: -18, flexGrow: 1}}>
            <View style={styles.detailContainer}>
              <View style={styles.statusRow}>
                <Text style={styles.statusText}>Product Status</Text>
                <Pressable
                  onPress={() =>
                    isDisable
                      ? showToast('This product has not been approved')
                      : {}
                  }>
                  <Switch
                    trackColor={{false: '#767577', true: COLORS.PRIMARY}}
                    thumbColor={isEnabled ? '#ffffff' : '#f4f3f4'}
                    ios_backgroundColor={COLORS.PRIMARY}
                    onValueChange={toggleSwitch}
                    value={isEnabled}
                    disabled={isDisable}
                  />
                </Pressable>
              </View>

              {/* Product Title and Price */}
              {productData?.name && (
                <Text style={[styles.productTitle, {fontSize: 20}]}>
                  {productData?.name}
                </Text>
              )}
              <View style={styles.ratingRow}>
                <Image
                  source={IMAGES.ic_starRating}
                  style={{
                    height: mvs(20),
                    width: ms(20),
                    resizeMode: 'contain',
                  }}
                  resizeMode="contain"
                />
                <Text style={styles.ratingText}>4.8</Text>
                <Text style={styles.innerRatingText}>(320 Review)</Text>
              </View>
              <View style={styles.priceRow}>
                {productData?.price && (
                  <Text style={styles.productPrice}>
                    {`${productData?.currencyCode} ${displayPrice(
                      productData?.price,
                    )}`}
                  </Text>
                )}
                {productData?.sku && (
                  <Text style={styles.productSku}>{productData?.sku}</Text>
                )}
              </View>
              {/* Product Stock and Validity */}
              <View style={styles.stockContainer}>
                <Text
                  style={styles.stockText}>{`Stock: ${productData?.qty}`}</Text>
                {productData?.news_to_date && (
                  <Text style={styles.validityText}>
                    Product Validity:{' '}
                    {formatDate(
                      new Date(productData?.news_to_date),
                      'DD/MM/YYYY',
                    )}
                  </Text>
                )}
              </View>
              <View style={styles.flatLine} />

              {/* Description */}
              {productData?.description && (
                <>
                  <Text style={styles.sectionHeader}>Description</Text>
                  <Text style={styles.productDescription} numberOfLines={8}>
                    {productData?.description}
                  </Text>
                </>
              )}
              <View style={styles.flatLine} />

              {/* Delivery Method */}
              <View style={styles.deliveryMethods}>
                <Text style={styles.deliveryHeader}>Delivery Method</Text>
                <View style={styles.deliveryMethod}>
                  {deliveryMethods.includes('Pickup') && (
                    <View style={styles.methodInnerView}>
                      <Image
                        source={IMAGES.ic_pickUpOnlyColor}
                        style={{height: mvs(20), width: ms(20)}}
                        resizeMode="contain"
                      />
                      <Text style={styles.deliveryText}>Pickup</Text>
                    </View>
                  )}
                  {deliveryMethods.includes('Delivery') && (
                    <View style={styles.methodInnerView}>
                      <Image
                        source={IMAGES.ic_deliveryOnlyColor}
                        style={{height: mvs(20), width: ms(20)}}
                        resizeMode="contain"
                      />
                      <Text style={styles.deliveryText}>Delivery</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      ) : (
        !loading && <NoRecordFound />
      )}
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: ms(15),
    paddingBottom: mvs(30),
  },
  layout: {
    paddingHorizontal: ms(0),
  },
  container: {
    // flexGrow: 1,
  },
  productImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  detailContainer: {
    backgroundColor: COLORS.WHITE,
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // marginBottom: mvs(30),
    shadowColor: COLORS.BLACK,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexGrow: 1,
    // marginTop:-20
    // paddingBottom:0
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusText: {
    fontFamily: FONTS.workSansMedium,
    fontSize: FONTSIZE.L,
    color: '#6C7278',
  },
  productTitle: {
    fontFamily: FONTS.workSansSemiBold,
    fontSize: FONTSIZE.XL,
    color: '#264653',
    marginTop: mvs(10),
    textTransform: 'capitalize',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
    marginTop: mvs(15),
  },
  ratingText: {
    fontFamily: FONTS.workSansBold,
    fontSize: FONTSIZE.L,
    color: COLORS.BLACK,
    marginLeft: 4,
  },
  innerRatingText: {
    fontFamily: FONTS.workSansRegular,
    fontSize: FONTSIZE.L,
    color: COLORS.TITLE,
    marginLeft: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: mvs(15),
  },
  productPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E44A4A',
  },
  productSku: {
    fontFamily: FONTS.workSansBold,
    fontSize: FONTSIZE.L,
    color: COLORS.BLACK,
    textTransform: 'uppercase',
  },
  stockContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: mvs(20),
  },
  stockText: {
    fontFamily: FONTS.workSansSemiBold,
    fontSize: FONTSIZE.L,
    color: COLORS.BLACK,
  },
  validityText: {
    fontFamily: FONTS.workSansSemiBold,
    fontSize: FONTSIZE.L,
    color: COLORS.BLACK,
  },
  sectionHeader: {
    fontFamily: FONTS.workSansMedium,
    fontSize: FONTSIZE.L,
    color: COLORS.BLACK,
    marginTop: mvs(15),
    marginBottom: 8,
  },
  deliveryHeader: {
    fontFamily: FONTS.workSansSemiBold,
    fontSize: FONTSIZE.L,
    color: COLORS.TITLE,
  },
  productDescription: {
    fontFamily: FONTS.workSansRegular,
    fontSize: FONTSIZE.L,
    color: COLORS.TITLE,
    lineHeight: 20,
  },
  flatLine: {
    height: 1,
    backgroundColor: COLORS.BORDER,
    marginTop: mvs(20),
  },
  deliveryMethods: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    alignItems: 'center',
    alignContent: 'center',
  },
  deliveryMethod: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  methodInnerView: {flexDirection: 'row', alignItems: 'center'},
  deliveryText: {
    fontFamily: FONTS.workSansSemiBold,
    fontSize: FONTSIZE.L,
    color: COLORS.PRIMARY,
    marginLeft: 6,
  },
  slider: {
    // flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: COLORS.WHITE,
  },
  sliderImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },

  paginationStyle: {
    // bottom: -30,
  },
  dot: {
    backgroundColor: COLORS.WHITE,
    width: 8,
    height: 8,
    borderRadius: 100,
    marginLeft: 6,
    marginRight: 6,
    // marginTop: 6,
    marginBottom: 16,
  },
  activeDot: {
    backgroundColor: COLORS.PRIMARY,
    width: 12,
    height: 12,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: COLORS.PRIMARY,

    marginLeft: 6,
    marginRight: 6,
    // marginTop: 6,
    marginBottom: 16,
  },
});

export default ProductDetail;

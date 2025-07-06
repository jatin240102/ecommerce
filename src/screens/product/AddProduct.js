import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import AppHeader from '../../components/common/AppHeader';
import {IMAGES} from '../../constant/imagePath';
import {ms, mvs, s} from 'react-native-size-matters';
import AppLayout from '../../components/layouts/AppLayout';
import {COLORS} from '../../constant/color';
import TextInputBox from '../../components/common/TextInputBox';
import {
  APP_TEXT,
  initialProductState,
  LENGTHS,
  ERROR_MESSAGE,
  GLOBAL_CONSTANT,
} from '../../constant/globalConstants';
import GradientButton from '../../components/common/GradientButton ';
import {FONTS, FONTSIZE} from '../../constant/fonts';
import ImagePickerModal from '../../components/common/ImagePickerModal';
import DatePickers from '../../components/common/DatePickers';
import {useGlobalData} from '../../context/AppContext';
import PickedImageList from '../../components/common/PickedImageList';
import Tooltip from 'react-native-walkthrough-tooltip';
import {formatDate, showToast, sWidth} from '../../utils/global';
import {hideLoader, showLoader} from '../../components/common/AppLoader';
import {useMutation} from '@apollo/client';
import {ADD_PRODUCT, PRODUCT_IMAGE_UPLOAD} from '../../queries/ProductQueries';
import moment from 'moment-timezone';

const AddProduct = ({navigation, route}) => {
  const {selectedCategory} = route.params;
  console.log('selectedCategory', selectedCategory);
  const {userData, countryData} = useGlobalData();
  const [productState, setProductState] = useState(initialProductState);
  const [productError, setProductError] = useState(initialProductState);
  const [productImage, setProductImage] = useState([]);
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);
  const handleProductValidate = () => {
    const newErrors = {};
    if (!productState.productName.trim()) {
      newErrors.productName = ERROR_MESSAGE.product_name;
    }
    if (!productState.productDesc.trim()) {
      newErrors.productDesc = ERROR_MESSAGE.product_desc;
    }
    if (!productState.price.trim()) {
      newErrors.price = ERROR_MESSAGE.product_price;
    } else if (productState.price === '0') {
      newErrors.price = 'Please enter valid product price';
    }
    if (!productState.productSku.trim()) {
      newErrors.productSku = ERROR_MESSAGE.product_sku;
    }
    if (!productState.productSustainability.trim()) {
      newErrors.productSustainability = ERROR_MESSAGE.product_sustainability;
    } else if (productState.productSustainability === '0') {
      newErrors.productSustainability =
        'The number of sustainability products must be at least 1';
    }
    if (!productState.productBundle.trim()) {
      newErrors.productBundle = ERROR_MESSAGE.product_bundle;
    } else if (productState.productBundle === '0') {
      newErrors.productBundle =
        'The number of product bundle must be at least 1';
    }
    if (productImage.length <= 0) {
      // if (!productState.offerDate) {
      //   newErrors.offerDate = ERROR_MESSAGE.product_offerDate;
      // }

      newErrors.selectedImage = ERROR_MESSAGE.product_image;
    }

    if (
      !productState.isPickupOnlySelect &&
      !productState.isDeliveryOnlySelect
    ) {
      newErrors.isPickupOnlySelect = ERROR_MESSAGE.product_pickupOnly;
    }

    console.log('error---', newErrors);
    if (Object.keys(newErrors).length > 0) {
      setProductError(newErrors);
      return false;
    }
    return true;
  };

  const onInputChange = (key, value) => {
    setProductState({...productState, [key]: value});
    setProductError({...productError, [key]: ''});
  };

  // console.log('productImage', productImage);
  const handlePickedImage = image => {
    setIsPickerVisible(false);
    if (image && image.path) {
      console.log('image', image.path);
      const imageArr = [];
      imageArr.push({image: image, imagePath: image.path});
      setProductImage(prevState => [...prevState, imageArr]);
      setProductError({...productError, selectedImage: ''});
      showLoader();
      uploadImage({
        variables: {
          imageEncoded: image.data,
          imageName: image?.path.split('/').pop(),
        },
      });
    }
  };

  const [uploadImage] = useMutation(PRODUCT_IMAGE_UPLOAD, {
    onCompleted: data => {
      hideLoader();
      if (data && data?.uploadImage && data?.uploadImage?.file) {
        const newImageUrl = data?.uploadImage?.file;
        console.log('newImageUrl', newImageUrl);
        setImageUrls(prevUrls => [...prevUrls, newImageUrl]);

        // setRegisterState({
        //   ...registerState,
        //   base64: data?.hkUploadFiles?.items[0]?.order_path,
        // });
      } else {
        console.log('navigation failed');
      }
    },
    onError: error => {
      hideLoader();
      if (error.graphQLErrors) {
        console.log('GraphQL errors:', JSON.stringify(error.graphQLErrors));
        error.graphQLErrors.forEach(e => {
          if (e.message) {
            showToast(e.message);
          } else {
            showToast(APP_TEXT.GraphQl_error);
          }
        });
      }
      if (error.networkError) {
        if (error.networkError.message) {
          showToast(error.networkError?.message);
        } else {
          showToast(APP_TEXT.network_error);
        }
        console.log('Network error:', JSON.stringify(error.networkError));
      }
    },
    errorPolicy: 'all',
  });

  const handleDateSelector = prevState => {
    setProductState({...productState, offerDate: prevState});
    setProductError({...productError, offerDate: ''});
  };

  const [sellerAddProduct] = useMutation(ADD_PRODUCT, {
    onCompleted: async data => {
      console.log('Mutation Success:', JSON.stringify(data));
      hideLoader();
      if (
        data &&
        data?.sellerAddProduct &&
        data?.sellerAddProduct?.error === 0 &&
        data?.sellerAddProduct?.product_id
      ) {
        navigation.navigate('ProductDashboard');
        showToast(data?.sellerAddProduct?.message);
        console.log(
          'data?.sellerAddProduct-------------',
          data?.sellerAddProduct.message,
        );
      } else {
        if (data?.sellerAddProduct?.message) {
          showToast(data?.sellerAddProduct?.message);
        } else {
          showToast('Internal Server Error');
        }
        console.log('navigation failed', data?.sellerAddProduct?.message);
      }
    },
    onError: error => {
      hideLoader();
      if (error.graphQLErrors) {
        error.graphQLErrors.forEach(err => {
          if (err.message.toLowerCase().includes('sku')) {
            showToast(err.message);
            setProductError(prevState => ({
              ...prevState,
              productSku: err.message,
            }));
          } else {
            showToast(err.message);
          }
        });
      }

      if (error.networkError) {
        if (error.networkError.message) {
          showToast(error.networkError?.message);
        } else {
          showToast(APP_TEXT.network_error);
        }
        console.log('Network error:', JSON.stringify(error.networkError));
      }
    },
    errorPolicy: 'all',
  });

  const handleAddProduct = async () => {
    const isValid = handleProductValidate();
    if (isValid) {
      const mediaGalleryArray =
        imageUrls.length > 0
          ? imageUrls.map((data, index) => {
              const imageLabel = data?.split('/').pop();
              return {
                file: data,
                label: imageLabel,
                media_type: 'image',
              };
            })
          : [];

      console.log('imageBookArray', JSON.stringify(mediaGalleryArray));
      showLoader();

      sellerAddProduct({
        variables: {
          name: productState.productName,
          description: productState.productDesc,
          price: productState.price,
          sku: productState.productSku,
          category_ids: selectedCategory,
          no_of_products_in_your_bundle: productState.productBundle,
          number_of_sustainability_boxes: productState.productSustainability,
          delivery_methods:
            productState.isDeliveryOnlySelect && productState.isPickupOnlySelect
              ? '4,5'
              : productState.isDeliveryOnlySelect
              ? '5'
              : productState.isPickupOnlySelect
              ? '4'
              : '',
          image: imageUrls.length > 0 ? imageUrls[0] : '',
          thumbnail: imageUrls.length > 0 ? imageUrls[0] : '',
          small_image: imageUrls.length > 0 ? imageUrls[0] : '',
          media_gallery: mediaGalleryArray,
          news_to_date: productState.offerDate
            ? moment(productState.offerDate, 'DD/MM/YYYY').format('MM/DD/YYYY')
            : '',
          latitude: userData?.ca_vendor_lat ? userData?.ca_vendor_lat : '',
          longitude: userData?.ca_vendor_long ? userData?.ca_vendor_long : '',
        },
      });
    } else {
      console.log('validation failed');
    }
  };
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
        headerTitle={'Add Product'}
      />
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}>
        <TextInputBox
          title={'Product Name'}
          value={productState.productName}
          onChangeText={text => {
            onInputChange('productName', text);
          }}
          error={productError.productName}
          placeholder={'Enter product name'}
          containerStyle={{marginTop: mvs(15)}}
          titleImage={
            <Tooltip
              isVisible={productState.isProductNameTip}
              arrowSize={{width: 16, height: 18}}
              contentStyle={styles.tooltipContent}
              content={
                <Text style={styles.tooltipText}>
                  {APP_TEXT.product_name_tip}
                </Text>
              }
              onClose={() =>
                setProductState({...productState, isProductNameTip: false})
              }
              placement="left"
              backgroundColor="transparent"
              topAdjustment={
                Platform.OS === 'android' ? -StatusBar.currentHeight : 0
              }>
              <TouchableOpacity
                onPress={() =>
                  setProductState({...productState, isProductNameTip: true})
                }>
                <Image
                  source={IMAGES.ic_info_Image}
                  style={{height: mvs(18), width: ms(18)}}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </Tooltip>
          }
        />

        <TextInputBox
          title={'Product Price'}
          value={productState.price}
          onChangeText={text => {
            onInputChange('price', text.replace(/[^0-9.]/g, ''));
          }}
          error={productError.price}
          placeholder={'Enter product price'}
          containerStyle={{marginTop: mvs(28)}}
          keyboardType={'number-pad'}
          rightContainer={
            <TouchableOpacity
              activeOpacity={1}
              style={styles.priceRightContainer}>
              <Text style={styles.priceRightText}>
                {countryData && countryData === GLOBAL_CONSTANT.UAE
                  ? 'AED'
                  : userData?.ca_vendor_country === GLOBAL_CONSTANT.UAE
                  ? 'AED'
                  : 'GBP'}
              </Text>
            </TouchableOpacity>
          }
          titleImage={
            <Tooltip
              isVisible={productState.isProductPriceTip}
              arrowSize={{width: 16, height: 18}}
              contentStyle={[styles.tooltipContent, {width: sWidth / 1.5}]}
              content={
                <Text style={styles.tooltipText}>
                  {APP_TEXT.product_price_tip}
                </Text>
              }
              onClose={() =>
                setProductState({...productState, isProductPriceTip: false})
              }
              placement="left"
              backgroundColor="transparent"
              topAdjustment={
                Platform.OS === 'android' ? -StatusBar.currentHeight : 0
              }>
              <TouchableOpacity
                onPress={() =>
                  setProductState({...productState, isProductPriceTip: true})
                }>
                <Image
                  source={IMAGES.ic_info_Image}
                  style={{height: mvs(18), width: ms(18)}}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </Tooltip>
          }
        />

        <TextInputBox
          title={'No of Products in your bundle'}
          value={productState.productBundle}
          onChangeText={text => {
            onInputChange('productBundle', text.replace(/[^0-9.]/g, ''));
          }}
          error={productError.productBundle}
          placeholder={'Enter number of products'}
          containerStyle={{marginTop: mvs(28)}}
          keyboardType={'number-pad'}
        />

        <TextInputBox
          title={'Product SKU'}
          value={productState.productSku}
          onChangeText={text => {
            onInputChange('productSku', text);
          }}
          error={productError.productSku}
          placeholder={'Enter product sku'}
          containerStyle={{marginTop: mvs(28)}}
        />

        <TextInputBox
          title={'Number of sustainability boxes'}
          value={productState.productSustainability}
          onChangeText={text => {
            onInputChange(
              'productSustainability',
              text.replace(/[^0-9.]/g, ''),
            );
          }}
          error={productError.productSustainability}
          placeholder={'Enter Number of sustainability boxes'}
          containerStyle={{marginTop: mvs(28)}}
          keyboardType={'number-pad'}
        />

        <DatePickers
          customStyle={[styles.datepickerContainer]}
          date={null}
          setDate={date => handleDateSelector(date)}
          selectDate={productState.offerDate}
          //error={productError.offerDate}
          isToolTipActive={productState.isProductValidityTip}
          onToolTipClose={() => {
            setProductState({...productState, isProductValidityTip: false});
          }}
          onToolTipOpen={() => {
            setProductState({...productState, isProductValidityTip: true});
          }}
        />
        {isPickerVisible && (
          <ImagePickerModal
            title={'Add Product Image'}
            isVisible={isPickerVisible}
            onClose={() => {
              setIsPickerVisible(false);
            }}
            imagePickerOptions={{
              freeStyleCropEnabled: true,
            }}
            onImageSelect={image => {
              handlePickedImage(image);
            }}
          />
        )}
        {!productImage.length > 0 && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setIsPickerVisible(true)}
            style={[
              styles.imgContainer,
              productError.selectedImage && {borderColor: COLORS.ERROR},
            ]}>
            <Image
              source={IMAGES.ic_tabCamera}
              resizeMode="contain"
              style={{height: mvs(28), width: ms(28), tintColor: COLORS.TITLE}}
            />
            <Text style={styles.imgText}>Add Image</Text>
          </TouchableOpacity>
        )}

        {productImage.length > 0 && (
          <PickedImageList
            imageData={productImage}
            onImageCancel={(updatedArray, indexToRemove) => {
              setProductImage(updatedArray);
              setImageUrls(prevUrls =>
                prevUrls.filter((_, index) => index !== indexToRemove),
              );
            }}
            onAddImage={() => setIsPickerVisible(true)}
            contentContainerStyle={{marginTop: 20}}
          />
        )}
        <TextInputBox
          title={'Product Description'}
          value={productState.productDesc}
          onChangeText={text => {
            onInputChange('productDesc', text);
          }}
          error={productError.productDesc}
          placeholder={'Enter product description'}
          containerStyle={{marginTop: mvs(28)}}
          multiline={true}
          inputStyle={{height: mvs(135), flex: 1}}
          textAlignVertical="top"
          numberOfLines={10}
          maxLength={LENGTHS.DESCRIPTION}
        />
        <Text style={styles.descriptionCount}>
          {`${productState.productDesc ? productState.productDesc.length : 0}/${
            LENGTHS.DESCRIPTION
          }`}
        </Text>

        <Text style={styles.deliveryText}>Delivery Method</Text>

        <View style={styles.deliveryContainer}>
          <TouchableOpacity
            onPress={() => {
              onInputChange(
                'isPickupOnlySelect',
                !productState.isPickupOnlySelect,
              );
            }}
            activeOpacity={0.9}
            style={styles.deliveryInnerContainer}>
            <Image
              source={
                productState.isPickupOnlySelect
                  ? IMAGES.ic_colorChecked
                  : IMAGES.ic_empty_check
              }
              style={styles.checkImage}
              resizeMode="contain"
            />
            <Image
              source={
                productState.isPickupOnlySelect
                  ? IMAGES.ic_pickUpOnlyColor
                  : IMAGES.ic_pickUpOnlyGray
              }
              style={styles.deliveryImg}
              resizeMode="contain"
            />
            <Text
              style={[
                styles.deliveryTextSelect,
                productState.isPickupOnlySelect && {color: COLORS.PRIMARY},
              ]}>
              Pickup Only
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              onInputChange(
                'isDeliveryOnlySelect',
                !productState.isDeliveryOnlySelect,
              );
              setProductError({
                ...productError,
                isPickupOnlySelect: '',
              });
            }}
            activeOpacity={0.9}
            style={styles.deliveryInnerContainer}>
            <Image
              source={
                productState.isDeliveryOnlySelect
                  ? IMAGES.ic_colorChecked
                  : IMAGES.ic_empty_check
              }
              style={styles.checkImage}
              resizeMode="contain"
            />
            <Image
              source={
                productState.isDeliveryOnlySelect
                  ? IMAGES.ic_deliveryOnlyColor
                  : IMAGES.ic_deliveryOnlyGray
              }
              style={styles.deliveryImg}
              resizeMode="contain"
            />
            <Text
              style={[
                styles.deliveryTextSelect,
                productState.isDeliveryOnlySelect && {color: COLORS.PRIMARY},
              ]}>
              Delivery Only
            </Text>
          </TouchableOpacity>
        </View>
        {productError.isPickupOnlySelect && (
          <Text style={styles.errorText} numberOfLines={2}>
            {productError.isPickupOnlySelect}
          </Text>
        )}
        <GradientButton
          title="Submit"
          onPress={() => handleAddProduct()}
          buttonTxt={styles.btnText}
          mainContainer={{marginTop: mvs(30)}}
        />
      </ScrollView>
    </AppLayout>
  );
};

export default AddProduct;

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: ms(15),
    backgroundColor: COLORS.PRIMARY,
    paddingBottom: mvs(30),
  },
  layout: {
    paddingHorizontal: ms(0),
  },
  imgContainer: {
    backgroundColor: COLORS.WHITE,
    height: mvs(70),
    borderWidth: 1,
    borderRadius: 10,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: s(10),
    marginTop: mvs(30),
  },
  imgText: {
    fontSize: FONTSIZE.XL,
    fontFamily: FONTS.workSansMedium,
    color: COLORS.TITLE,
  },
  btnText: {
    fontSize: FONTSIZE.XL,
    fontFamily: FONTS.workSansSemiBold,
  },
  scrollContainer: {
    backgroundColor: COLORS.WHITE,
    flex: 1,
    marginTop: mvs(20),
    paddingHorizontal: ms(15),
  },
  saleContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    gap: ms(10),
    flex: 1,
    marginTop: mvs(28),
  },
  priceRightContainer: {
    flex: 0.7,
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 1,
    borderLeftColor: COLORS.BORDER,
    height: Platform.OS === 'android' ? mvs(45) : ms(42),
  },
  priceRightText: {
    textAlign: 'right',
    color: COLORS.TITLE,
    fontFamily: FONTS.workSansMedium,
    fontSize: FONTSIZE.M,
    marginLeft: 10,
  },
  deliveryText: {
    textAlign: 'left',
    color: COLORS.TITLE,
    fontFamily: FONTS.workSansMedium,
    fontSize: FONTSIZE.L,
    marginTop: mvs(20),
  },
  deliveryImg: {height: mvs(20), width: ms(20), resizeMode: 'contain'},
  checkImage: {
    height: mvs(16),
    width: ms(16),
    resizeMode: 'contain',
  },
  deliveryTextSelect: {
    color: COLORS.TITLE,
    fontFamily: FONTS.workSansMedium,
    fontSize: FONTSIZE.L,
  },
  deliveryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: mvs(10),
  },
  deliveryInnerContainer: {flexDirection: 'row', alignItems: 'center', gap: 10},
  tooltipText: {
    color: COLORS.BLACK,
    fontSize: FONTSIZE.L,
    fontFamily: FONTS.workSansMedium,
    textAlign: 'center',
  },
  tooltipContent: {
    backgroundColor: '#e7e7e7',
    borderRadius: 5,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3, // For shadow on Android
    shadowColor: '#000', // For shadow on iOS
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  descriptionCount: {
    textAlign: 'right',
    color: COLORS.BLACK,
    fontSize: FONTSIZE.L,
    fontFamily: FONTS.workSansRegular,
  },
  errorText: {
    color: COLORS.ERROR,
    fontFamily: FONTS.workSansRegular,
    fontSize: FONTSIZE.M,
    marginTop: Platform.OS === 'ios' ? mvs(5) : 0,
  },
});

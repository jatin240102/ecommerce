import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Pressable,
  ImageBackground,
  Linking,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {ms, mvs, s} from 'react-native-size-matters';
import {
  APP_CREDENTIALS,
  APP_TEXT,
  ERROR_MESSAGE,
  GLOBAL_CONSTANT,
  LENGTHS,
  REGEX,
  STORAGE_KEYS,
} from '../../constant/globalConstants';
import {IMAGES} from '../../constant/imagePath';
import ImagePickerModal from '../../components/common/ImagePickerModal';
import {COLORS} from '../../constant/color';
import {FONTS, FONTSIZE} from '../../constant/fonts';
import AppLayout from '../../components/layouts/AppLayout';
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  PROVIDER_DEFAULT,
} from 'react-native-maps';
import TextInputBox from '../../components/common/TextInputBox';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import AppHeader from '../../components/common/AppHeader';
import {useGlobalData} from '../../context/AppContext';
import Geolocation from 'react-native-geolocation-service';
import {requestLocationPermission, showToast} from '../../utils/global';
import {hideLoader, showLoader} from '../../components/common/AppLoader';
import GradientButton from '../../components/common/GradientButton ';
import {useMutation} from '@apollo/client';
import {VENDOR_PROFILE_UPDATE} from '../../queries/AuthQueries';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {PRODUCT_IMAGE_UPLOAD} from '../../queries/ProductQueries';
import Geocoder from 'react-native-geocoding';
Geocoder.init(APP_CREDENTIALS.GOOGLE_PLACES_AUTOCOMPLETE_KEY);
const initialState = {
  businessName: '',
  email: '',
  phoneNumber: '',
  coordinates: null,
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  postCode: '',
  country: '',
  selectedImage: null,
  registration: '',
  base64: '',
};

const EditStore = () => {
  const navigation = useNavigation();
  const {countryData, setUserData, userData, setCountryData} = useGlobalData();
  const [inputValue, setInputValue] = useState('');
  const [inputValueError, setInputValueError] = useState('');
  const [imageError, setImageError] = useState(false);
  const [isAutocompleteFocused, setIsAutocompleteFocused] = useState(false);
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [profileState, setProfileState] = useState(initialState);
  const [errors, setErrors] = useState(initialState);
  const mapRef = useRef();
  const autocompleteRef = useRef();
  let autoCompleteCountry;

  if (countryData !== undefined && countryData === 'United Arab Emirates') {
    autoCompleteCountry = 'AE';
  } else {
    autoCompleteCountry = 'UK';
  }

  const onInputChange = (key, value) => {
    setProfileState({...profileState, [key]: value});
    setErrors({...errors, [key]: ''});
  };

  const [uploadImage] = useMutation(PRODUCT_IMAGE_UPLOAD, {
    onCompleted: data => {
      hideLoader();
      if (data && data?.uploadImage && data?.uploadImage?.url) {
        const newImageUrl = data?.uploadImage;
        console.log('newImageUrl', newImageUrl);
        setProfileState({
          ...profileState,
          base64: newImageUrl,
        });
      } else {
        showToast('Not uploaded your store image');
        console.log('image not upload');
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
  const handlePickedImage = image => {
    setImageError(false);
    setIsPickerVisible(false);
    if (image && image.path) {
      setProfileState({...profileState, selectedImage: image.path});
      showLoader();
      uploadImage({
        variables: {
          imageEncoded: image.data,
          imageName: image?.path.split('/').pop(),
        },
      });
    }
  };
console.log('userData?.ca_vendor_lat && userData?.ca_vendor_long', userData?.ca_vendor_lat, userData?.ca_vendor_long)
  const handleUserData = async () => {
    try {
      let coordinate = null;

      if (userData?.ca_vendor_lat && userData?.ca_vendor_long) {
        coordinate = {
          latitude: Number(userData?.ca_vendor_lat),
          longitude: Number(userData?.ca_vendor_long),
        };
      }
      showLoader();
      if (userData) {
        hideLoader();
        setProfileState({
          businessName: userData?.ca_business_name,
          firstName: userData.firstname,
          lastName: userData.lastname,
          email: userData?.email,
          registration: userData?.ca_business_registration,
          phoneNumber: userData?.ca_seller_telephone,
          state: userData?.ca_vendor_state,
          city: userData?.ca_vendor_city,
          postCode: userData?.ca_vendor_postcode,
          addressLine1: userData?.ca_vendor_street,
          coordinates: coordinate,
        });
      } else {
        hideLoader();
        console.log('User data not found in AsyncStorage Test');
      }
    } catch (error) {
      hideLoader();
    }
  };
  
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      handleUserData();
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation]);
  console.log('profileState.coordinates', profileState.coordinates);

  const getAddress = async (latitude, longitude) => {
    try {
      const response = await Geocoder.from(latitude, longitude);
      console.log('response----', response);
      let addressLine1 = profileState.addressLine1;
      let addressLine2 = profileState.addressLine2;
      let city = profileState.city;
      let state = profileState.state;
      let postCode = profileState.postCode;

      // Iterate over the address components to populate fields based on types
      response.results[0]?.address_components.forEach(component => {
        const types = component?.types;

        if (
          types.includes('street_number') ||
          types.includes('route') ||
          types.includes('plus_code')
        ) {
          addressLine1 = component.long_name;
        } else if (
          types.includes('neighborhood') ||
          types.includes('street_number') ||
          types.includes('sublocality') ||
          types.includes('premise')
        ) {
          addressLine2 = component.long_name;
        } else if (types.includes('locality')) {
          city = component.long_name;
        } else if (types.includes('administrative_area_level_1')) {
          state = component.long_name;
        } else if (types.includes('postal_code')) {
          postCode = component.long_name;
        }
      });

      setProfileState({
        ...profileState,
        coordinates: {
          latitude: latitude,
          longitude: longitude,
        },
        addressLine1,
        addressLine2,
        city,
        state,
        postCode,
      });
      // console.log(
      //   'response///',
      //   addressLine1,
      //   addressLine2,
      //   city,
      //   state,
      //   postCode,
      // );
    } catch (error) {
      // Catch and display the error
      console.error('Geocoding Error:', error);
    }
  };

  const getCurrentLocation = () => {
    try {
      Geolocation.getCurrentPosition(
        async position => {
          if (position && position.coords) {
            const {latitude, longitude} = position.coords;
            getAddress(latitude, longitude);
          }
        },
        error => {
          console.log('error.code', error.code, error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        },
      );
    } catch (err) {
      console.log('err---', err);
    }
  };

  const reqAndroidLocationPermission = async () => {
    const result = await requestLocationPermission();
    console.log('result//////////', result);
    if (Platform.OS === 'ios') {
      // Geolocation.requestAuthorization('whenInUse');
      // getCurrentLocation();
      Geolocation.requestAuthorization('whenInUse').then(res => {
        console.log('mmmmmmmmmm111111111111', res);
        if (res === 'granted') {
          getCurrentLocation();
        } else {
          showToast('Please Turn on your GPS location/Permission');
          setTimeout(() => {
            Linking.openSettings();
          }, 2000);
        }
      });
    } else {
      if (result === 'granted') {
        getCurrentLocation();
      } else {
        showToast('Please Turn on your GPS location/Permission');
        setTimeout(() => {
          Linking.openSettings();
        }, 2000);
        // Linking.openSettings();
      }
    }
  };

  const storeFormValidate = () => {
    const newErrors = {};
    if (!profileState.businessName.trim()) {
      newErrors.businessName = ERROR_MESSAGE.business_name_required;
    }
    if (!profileState.registration.trim()) {
      newErrors.registration = ERROR_MESSAGE.business_reg_required;
    }
    // if (!profileState.firstName.trim()) {
    //   newErrors.firstName = ERROR_MESSAGE.first_name_required;
    // } else if (!REGEX.TEXT.test(profileState.firstName)) {
    //   newErrors.firstName = ERROR_MESSAGE.invalid_first_name;
    // }
    // if (!profileState.lastName.trim()) {
    //   newErrors.lastName = ERROR_MESSAGE.last_name_required;
    // } else if (!REGEX.TEXT.test(profileState.lastName)) {
    //   newErrors.lastName = ERROR_MESSAGE.invalid_last_name;
    // }
    if (!profileState.phoneNumber.trim()) {
      newErrors.phoneNumber = ERROR_MESSAGE.phone_required;
    } else if (!REGEX.NUMBER.test(profileState.phoneNumber)) {
      newErrors.phoneNumber = ERROR_MESSAGE.invalid_phone_number;
    }
    // if (!profileState.selectedImage) {
    //   newErrors.selectedImage = ERROR_MESSAGE.store_img_required;
    // }
    // if (!profileState.email) {
    //   newErrors.email = ERROR_MESSAGE.email_requires;
    // } else if (!REGEX.EMAIL.test(profileState.email)) {
    //   newErrors.email = ERROR_MESSAGE.invalid_email;
    // }

    if (!profileState.addressLine1.trim()) {
      newErrors.addressLine1 = ERROR_MESSAGE.address_line1_required;
    }
    // if (!profileState.country?.trim()) {
    //   newErrors.country = ERROR_MESSAGE.country_required;
    // }
    if (!profileState.city?.trim()) {
      newErrors.city = ERROR_MESSAGE.city_required;
    } 
    // else if (!REGEX.ALPHABET.test(profileState.city.trim())) {
    //   newErrors.city = ERROR_MESSAGE.invalid_city;
    // }
    if (!profileState.state?.trim()) {
      newErrors.state = ERROR_MESSAGE.state_required;
    }
    //  else if (!REGEX.ALPHABET.test(profileState?.state?.trim())) {
    //   newErrors.state = ERROR_MESSAGE.invalid_county;
    // }
    if (!profileState.postCode?.trim()) {
      newErrors.postCode = ERROR_MESSAGE.zipCode_required;
    } 
    // else if (!REGEX.DIGIT.test(profileState.postCode?.trim())) {
    //   newErrors.postCode = ERROR_MESSAGE.invalid_zipCode;
    // }
    console.log('Signup error---', newErrors);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }
    return true;
  };

  const saveProfileRecord = async data => {
    await AsyncStorage.setItem(
      STORAGE_KEYS.USER_DATA,
      JSON.stringify({
        ...data?.saveSellerProfile?.customerData, // Spread existing customerData
        company_logo: data?.saveSellerProfile?.company_logo, // Add seller_id key
      }),
    );
  };

  const [saveSellerProfile] = useMutation(VENDOR_PROFILE_UPDATE, {
    onCompleted: data => {
      console.log('Mutation Success:', data);
      hideLoader();
      if (data && data?.saveSellerProfile) {
        saveProfileRecord(data);
        // await AsyncStorage.setItem(
        //   STORAGE_KEYS.USER_DATA,
        //   JSON.stringify({
        //     ...data?.saveSellerProfile?.customerData, // Spread existing customerData
        //     company_logo: data?.saveSellerProfile?.company_logo, // Add seller_id key
        //   }),
        // );
        if (data?.saveSellerProfile?.customerData?.ca_vendor_country) {
          setCountryData(
            data?.saveSellerProfile?.customerData?.ca_vendor_country,
          );
        }
        setUserData({
          ...data?.saveSellerProfile?.customerData, // Spread existing customerData
          company_logo: data?.saveSellerProfile?.company_logo, // Add seller_id key
        });
        navigation.navigate('Dashboard');
        showToast('Update your profile successfully');
      } else {
        console.log('navigation failed');
      }
    },
    onError: error => {
      console.log('error----', error)
      hideLoader();

      if (error.graphQLErrors) {
        console.log('GraphQL errors:', JSON.stringify(error.graphQLErrors));
        error.graphQLErrors.forEach(e => {
          if (e.message) {
            showToast(e.message);
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

  const updateVendorProfile = () => {
    const isValid = storeFormValidate();
    if (isValid) {
      const filePath = profileState.base64?.url?.split('image/')[0];
      const fileName = profileState.base64?.url?.split('image/')[1];
      let companyLogo = null;
      if (fileName !== undefined && filePath !== undefined) {
        companyLogo = {
          file_name: fileName,
          file_path: `${filePath}image`,
        };
      }
      const withoutImage = {
        file_name: '',
        file_path: '',
      };
      showLoader();
       const refetchParams = {
         ca_business_name: profileState.businessName,
         ca_seller_telephone: profileState.phoneNumber,
         ca_shop_image: '',
         ca_vendor_city: profileState.city,
         ca_vendor_country: countryData
           ? countryData
           : userData?.ca_vendor_country,
         ca_vendor_lat:
           profileState.coordinates && profileState.coordinates.latitude
             ? profileState.coordinates.latitude
             : '',
         ca_vendor_long:
           profileState.coordinates && profileState.coordinates.longitude
             ? profileState.coordinates.longitude
             : '',
         ca_vendor_postcode: profileState.postCode,
         ca_vendor_state: profileState.state,
         ca_vendor_street: `${profileState.addressLine1}${
           profileState.addressLine2 ? `, ${profileState.addressLine2}` : ''
         }`,
         ca_business_registration: profileState.registration,
         company_logo: companyLogo ? companyLogo : withoutImage,
       };
      //  console.log('send Params----', refetchParams)
      saveSellerProfile({
        variables: {
          ca_business_name: profileState.businessName,
          ca_seller_telephone: profileState.phoneNumber,
          ca_shop_image: '',
          ca_vendor_city: profileState.city,
          ca_vendor_country: countryData
            ? countryData
            : userData?.ca_vendor_country,
          ca_vendor_lat:
            profileState.coordinates && profileState.coordinates.latitude
              ? profileState.coordinates.latitude
              : '',
          ca_vendor_long:
            profileState.coordinates && profileState.coordinates.longitude
              ? profileState.coordinates.longitude
              : '',
          ca_vendor_postcode: profileState.postCode,
          ca_vendor_state: profileState.state,
          ca_vendor_street: `${profileState.addressLine1}${
            profileState.addressLine2 ? `, ${profileState.addressLine2}` : ''
          }`,
          ca_business_registration: profileState.registration,
          company_logo: companyLogo ? companyLogo : withoutImage,
        },
      });
    }
  };

  const countryCode =
    countryData === GLOBAL_CONSTANT.UAE ||
    userData?.ca_vendor_country === GLOBAL_CONSTANT.UAE
      ? 'AE'
      : countryData === GLOBAL_CONSTANT.UK ||
        userData?.ca_vendor_country === GLOBAL_CONSTANT.UK
      ? 'UK'
      : 'AE';

  let regions;

  if (userData?.ca_vendor_country === GLOBAL_CONSTANT.UAE) {
    regions = {
      latitude: 24.52,
      longitude: 54.285,
    };
  } else {
    regions = {latitude: 55.3781, longitude: -3.436};
  }

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
            onPress={() => navigation.navigate('Notifications')}>
            <Image
              source={IMAGES.ic_notification}
              style={{height: mvs(20), width: ms(20), tintColor: COLORS.WHITE}}
              resizeMode="cover"
            />
          </TouchableOpacity>
        }
        headerTitle={'Edit Store'}
      />
      {isPickerVisible && (
        <ImagePickerModal
          title={'Add Store Image'}
          isVisible={isPickerVisible}
          onClose={() => {
            setIsPickerVisible(false);
          }}
          imagePickerOptions={{
            multiple: false,
          }}
          onImageSelect={image => {
            handlePickedImage(image);
          }}
        />
      )}
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        style={{flex: 1, backgroundColor: COLORS.WHITE}}
        contentContainerStyle={{paddingTop: 20, backgroundColor: COLORS.WHITE}}
        nestedScrollEnabled
        keyboardShouldPersistTaps="handled">
        <View
          style={{
            alignSelf: 'center',
            zIndex: 5,
            position: 'absolute',
            top: mvs(65),
          }}>
          <ImageBackground
            source={
              imageError
                ? IMAGES.ic_defaultImage
                : {
                    uri: profileState.selectedImage
                      ? profileState.selectedImage
                      : userData?.company_logo
                      ? userData?.company_logo
                      : 'https://cdn.pixabay.com/photo/2020/04/12/10/57/store-5033746_640.png',
                  }
            }
            imageStyle={styles.userImageStyle}
            style={styles.userProfileImage}
            onError={() => setImageError(true)}
            resizeMode="cover">
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.editContainer}
              onPress={() => setIsPickerVisible(true)}>
              <Image
                source={IMAGES.ic_editProfileCamera}
                style={[styles.editIcon, {}]}
              />
            </TouchableOpacity>
          </ImageBackground>
        </View>

        <View
          style={[
            styles.mainView,
            // styles.shadowView,
            // Platform.OS === 'android' && {elevation: 5},
          ]}>
          <TextInputBox
            title={APP_TEXT.business_name}
            value={profileState.businessName}
            onChangeText={text => {
              onInputChange('businessName', text);
            }}
            error={errors.businessName}
            placeholder={APP_TEXT.business_name_placeholder}
            containerStyle={{marginTop: mvs(28)}}
          />
          <TextInputBox
            title={APP_TEXT.email}
            value={profileState.email}
            onChangeText={text => {
              onInputChange('email', text);
            }}
            error={errors.email}
            keyboardType={'email-address'}
            containerStyle={{marginTop: mvs(18)}}
            editable={false}
          />
          <TextInputBox
            title={APP_TEXT.phone_number}
            placeholder={APP_TEXT.phone_number_placeholder}
            value={profileState.phoneNumber}
            onChangeText={text => {
              onInputChange('phoneNumber', text);
            }}
            error={errors.phoneNumber}
            keyboardType={'numeric'}
            containerStyle={{marginTop: mvs(18)}}
          />
          <TextInputBox
            title={APP_TEXT.store_location}
            value={profileState.addressLine1}
            onChangeText={text => {
              onInputChange('addressLine1', text);
            }}
            error={errors.addressLine1}
            placeholder={APP_TEXT.addressLine1_placeholder}
            containerStyle={{marginTop: mvs(28)}}
          />
          <TextInputBox
            value={profileState.addressLine2}
            onChangeText={text => {
              onInputChange('addressLine2', text);
            }}
            placeholder={APP_TEXT.addressLine2_placeholder}
            containerStyle={{marginTop: mvs(15)}}
          />
          <View style={styles.flexContainer}>
            <View style={styles.halfFlex}>
              <TextInputBox
                title={'Country'}
                value={countryData ? countryData : userData?.ca_vendor_country}
                onChangeText={text => {
                  onInputChange('country', text);
                }}
                error={errors.country}
                placeholder={'Enter country'}
                editable={false}
                mainContainerCss={{paddingHorizontal: ms(5)}}
              />
            </View>
            <View style={styles.halfFlex}>
              <TextInputBox
                title={'State/Region'}
                value={profileState.state}
                onChangeText={text => {
                  onInputChange('state', text);
                }}
                error={errors.state}
                placeholder={'Enter state'}
              />
            </View>
          </View>
          <View style={styles.flexContainer}>
            <View
              style={{
                flex: 1 / 2,
              }}>
              <TextInputBox
                title={'City'}
                value={profileState.city}
                onChangeText={text => {
                  onInputChange('city', text);
                }}
                error={errors.city}
                placeholder={'Enter city'}
              />
            </View>
            <View style={styles.halfFlex}>
              <TextInputBox
                title={'Pin/Zip Code'}
                value={profileState.postCode}
                onChangeText={text => {
                  onInputChange('postCode', text);
                }}
                error={errors.postCode}
                placeholder={'Enter pin code'}
                keyboardType={'numeric'}
              />
            </View>
          </View>

          <View style={styles.mapContainer}>
            <MapView
              provider={PROVIDER_DEFAULT}
              style={styles.map}
              ref={mapRef}
              region={{
                latitude: profileState.coordinates
                  ? profileState.coordinates.latitude
                  : regions?.latitude,
                longitude: profileState.coordinates
                  ? profileState.coordinates.longitude
                  : regions?.longitude,
                latitudeDelta: 0.5,
                longitudeDelta: 0.5,
              }}
              zoomControlEnabled={false}
              zoomEnabled={true}
              scrollEnabled
              mapType="terrain"
              showsScale={true}
              onPress={e => {
                const {latitude, longitude} = e.nativeEvent.coordinate || {};
                if (latitude && longitude) {
                  // setProfileState({
                  //   ...profileState,
                  //   coordinates: {latitude, longitude},
                  // });
                  getAddress(latitude, longitude);
                }
              }}
              googleRenderer="LATEST">
              {profileState.coordinates && (
                <Marker
                  coordinate={{
                    latitude: Number(profileState.coordinates?.latitude),
                    longitude: Number(profileState.coordinates?.longitude),
                  }}
                  onDragEnd={data => {
                    const {latitude, longitude} =data?.nativeEvent?.coordinate;
                    getAddress(latitude, longitude);
                  }}
                  draggable={true}>
                  <Image
                    source={require('../../assets/images/mapMarker.png')}
                    style={{width: 50, height: 50}}
                    resizeMode="contain"
                  />
                </Marker>
              )}
            </MapView>
            <Pressable
              style={styles.useMyLocationBtn}
              onPress={() => reqAndroidLocationPermission()}>
              <Image
                source={IMAGES.ic_useMyLocationIcon}
                style={{
                  height: mvs(28),
                  width: mvs(28),
                  resizeMode: 'contain',
                }}
              />
            </Pressable>
            <GooglePlacesAutocomplete
              placeholder={APP_TEXT.store_location_placeholder}
              onFail={error => console.log('Google Places API Error:', error)}
              // onNotFound={error =>
              //   console.error('Error:', error)
              // }
              ref={autocompleteRef}
              fetchDetails={true}
              isRowScrollable={true}
              keyboardShouldPersistTaps="always"
              textInputProps={{
                onChangeText: text => {
                  setInputValue(text);
                  setIsAutocompleteFocused(false);
                },
                onFocus: () => {
                  setIsAutocompleteFocused(true);
                },
                defaultValue: '',
                onBlur: () => {},
                placeholderTextColor: '#969696',
                value: inputValue,
              }}
              onPress={(data, details = null) => {
                let selectedLocation = details?.geometry?.location;
                let formatted_address = details.formatted_address;
                console.log('data, details', details);
                // Initialize address parts to avoid undefined values
                let addressLine1 = profileState.addressLine1;
                let addressLine2 = profileState.addressLine2;
                let city = profileState.city;
                let state = profileState.state;
                let postCode = profileState.postCode;

                // Iterate over the address components to populate fields based on types
                details.address_components.forEach(component => {
                  const types = component?.types;

                  if (
                    types.includes('street_number') ||
                    types.includes('route') ||
                    types.includes('plus_code')
                  ) {
                    addressLine1 = component.long_name;
                  } else if (
                    types.includes('neighborhood') ||
                    types.includes('sublocality')
                  ) {
                    addressLine2 = component.long_name;
                  } else if (types.includes('locality')) {
                    city = component.long_name;
                  } else if (types.includes('administrative_area_level_1')) {
                    state = component.long_name;
                  } else if (types.includes('postal_code')) {
                    postCode = component.long_name;
                  }
                });

                setProfileState({
                  ...profileState,
                  coordinates: {
                    latitude: selectedLocation.lat,
                    longitude: selectedLocation.lng,
                  },
                  addressLine1,
                  addressLine2,
                  city,
                  state,
                  postCode,
                });
                setInputValue(formatted_address);
              }}
              query={{
                key: APP_CREDENTIALS.GOOGLE_PLACES_AUTOCOMPLETE_KEY,
                // language: 'en',
                language: 'en-GB',
                // components: `country:IN`,
                components: `country:${countryCode}`,
              }}
              styles={{
                textInputContainer: {
                  height: mvs(50),
                },
                container: {
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: mvs(10),
                  paddingHorizontal: ms(15),
                },
                textInput: {
                  height: mvs(50),
                  fontSize: FONTSIZE.L,
                  borderRadius: 10,
                  borderWidth: 0.5,
                  borderColor: COLORS.PRIMARY,
                  marginTop: mvs(10),
                  color: COLORS.BLACK,
                },
                listView: {
                  zIndex: 99,
                  marginTop: mvs(20),
                  borderColor: COLORS.BORDER,
                  borderWidth: isAutocompleteFocused ? 0 : 1,
                  borderRadius: 10,
                },
                row: {
                  backgroundColor: COLORS.WHITE,
                  padding: 13,
                  height: 44,
                },
                description: {
                  color: 'black',
                },
              }}
            />
          </View>
          <GradientButton
            title={'Save'}
            onPress={() => updateVendorProfile()}
            // onPress={() => setIsLoginError(true)}
            buttonTxt={{fontSize: FONTSIZE.L}}
            mainContainer={{paddingHorizontal: ms(10), marginTop: mvs(30)}}
          />
        </View>
      </ScrollView>
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: 'gray',
  },
  mainView: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopEndRadius: ms(30),
    borderTopStartRadius: ms(30),
    // marginBottom: mvs(30),
    shadowColor: COLORS.BLACK,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: mvs(110),
    // backgroundColor: 'red',
  },

  shadowView: {
    shadowColor: COLORS.BLACK,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.25,
    shadowRadius: 1,
    elevation: 5,
    overflow: 'hidden',
  },

  headerContainer: {
    paddingHorizontal: ms(15),
    paddingBottom: mvs(30),
  },
  layout: {
    paddingHorizontal: ms(0),
  },
  flexContainer: {
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexDirection: 'row',
    gap: ms(10),
    flex: 1,
    marginTop: mvs(28),
  },
  halfFlex: {
    flex: 1 / 2,
    justifyContent: 'center',
  },
  userProfileImage: {
    height: ms(120),
    width: ms(120),
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    padding: ms(5),
  },
  userImageStyle: {
    borderRadius: s(100),
    borderColor: 'white',
    borderWidth: 1,
  },
  editContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: ms(32),
    width: ms(32),
    borderRadius: s(100),
    // borderColor: 'white',
    // borderWidth: 1,
  },
  editIcon: {
    width: ms(35),
    height: ms(35),
    resizeMode: 'contain',
  },
  mapContainer: {
    marginTop: mvs(30),
    borderRadius: s(20),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  map: {
    height: mvs(400),
    overflow: 'hidden',
    borderRadius: 10,
  },
  useMyLocationBtn: {
    position: 'absolute',
    bottom: 25,
    right: 20,
    backgroundColor: COLORS.WHITE,
    padding: ms(10),
    borderRadius: s(100),
  },
});

export default EditStore;

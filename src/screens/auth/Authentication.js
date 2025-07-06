import {
  Image,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  ScrollView,
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {IMAGES} from '../../constant/imagePath';
import AppLayout from '../../components/layouts/AppLayout';
import {ms, mvs, s} from 'react-native-size-matters';
import {FONTS, FONTSIZE} from '../../constant/fonts';
import {COLORS} from '../../constant/color';
import {loginFormValidate, showToast, sWidth} from '../../utils/global';
import TextInputBox from '../../components/common/TextInputBox';
import GradientButton from '../../components/common/GradientButton ';
import {
  APP_TEXT,
  ERROR_MESSAGE,
  initialLoginState,
  initialRegisterState,
  LENGTHS,
  REGEX,
  STORAGE_KEYS,
} from '../../constant/globalConstants';
import ImagePickerModal from '../../components/common/ImagePickerModal';
import CustomModal from '../../components/common/CustomModal';
import {useGlobalData} from '../../context/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {hideLoader, showLoader} from '../../components/common/AppLoader';
import {useMutation} from '@apollo/client';
import SingleSelectDropdown from '../../components/common/SelectDropdown';
import {PRODUCT_IMAGE_UPLOAD} from '../../queries/ProductQueries';
import {VENDOR_LOGIN, VENDOR_REGISTER} from '../../queries/AuthQueries';

const dropDownData = [
  {name: 'United Arab Emirates', value: 'United Arab Emirates'},
  {name: 'United Kingdom', value: 'United Kingdom'},
];

const Authentication = ({navigation}) => {
  const {setCountryData, setUserToken, setUserData} = useGlobalData();
  const [selectedTab, setSelectedTab] = useState('login');
  const [loginState, setLoginState] = useState(initialLoginState);
  const [registerState, setRegisterState] = useState(initialRegisterState);
  const [errors, setErrors] = useState(initialLoginState);
  const [registerErrors, setRegisterErrors] = useState(initialRegisterState);
  const [isLoginError, setIsLoginError] = useState(false);
  const [loginErrorMessage, setLoginErrorMessage] = useState('');
  const [isPickerVisible, setIsPickerVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setSelectedTab('login');
      loadRememberedCredentials();
      setRegisterState({
        ...registerState,
        country: dropDownData[0]?.value,
      });
    });
    return unsubscribe;
  }, [navigation]);

  const onInputChange = (key, value) => {
    setRegisterState({...registerState, [key]: value});
    setRegisterErrors({...registerErrors, [key]: ''});
  };

  const signUpFormValidate = signupState => {
    const newErrors = {};
    if (!signupState.businessName.trim()) {
      newErrors.businessName = ERROR_MESSAGE.business_name_required;
    }
    if (!signupState.businessRegistration.trim()) {
      newErrors.businessRegistration = ERROR_MESSAGE.business_reg_required;
    }
    if (!signupState.firstName.trim()) {
      newErrors.firstName = ERROR_MESSAGE.first_name_required;
    }
    if (!signupState.lastName.trim()) {
      newErrors.lastName = ERROR_MESSAGE.last_name_required;
    }
    if (!signupState.phoneNumber.trim()) {
      newErrors.phoneNumber = ERROR_MESSAGE.phone_required;
    } else if (!REGEX.NUMBER.test(signupState.phoneNumber)) {
      newErrors.phoneNumber = ERROR_MESSAGE.invalid_phone_number;
    }
    if (!signupState.selectedImage) {
      newErrors.selectedImage = ERROR_MESSAGE.store_img_required;
    }
    if (!registerState.isConditionAccept) {
      newErrors.isConditionAccept = ERROR_MESSAGE.term_and_condition;
    }
    if (!signupState.email) {
      newErrors.email = ERROR_MESSAGE.email_requires;
    } else if (!REGEX.EMAIL.test(signupState.email)) {
      newErrors.email = ERROR_MESSAGE.invalid_email;
    }
    if (!signupState.registerPassword.trim() || !signupState.registerPassword) {
      newErrors.registerPassword = ERROR_MESSAGE.password_require;
    } else if (
      signupState.registerPassword.length < LENGTHS.MIN_PASSWORD ||
      signupState.registerPassword.length > LENGTHS.MAX_PASSWORD
    ) {
      newErrors.registerPassword = ERROR_MESSAGE.invalid_password;
    } else if (!REGEX.PASSWORD.test(signupState.registerPassword.trim())) {
      newErrors.registerPassword = ERROR_MESSAGE.invalid_password_signup;
    }
    if (!signupState.confirmPassword.trim()) {
      newErrors.confirmPassword = ERROR_MESSAGE.confirm_password;
    }
    if (signupState.registerPassword !== signupState.confirmPassword) {
      newErrors.confirmPassword = ERROR_MESSAGE.invalid_confirmPassword;
    }
    if (!signupState?.addressLine1?.trim()) {
      newErrors.addressLine1 = ERROR_MESSAGE.address_line1_required;
    }
    // if (!signupState.country) {
    //   newErrors.country = ERROR_MESSAGE.country_required;
    // }
    if (!signupState.city?.trim()) {
      newErrors.city = ERROR_MESSAGE.city_required;
    }
    // else if (!REGEX.ALPHABET.test(signupState.city.trim())) {
    //   newErrors.city = ERROR_MESSAGE.invalid_city;
    // }
    if (!signupState.state?.trim()) {
      newErrors.state = ERROR_MESSAGE.state_required;
    }
    // else if (!REGEX.ALPHABET.test(signupState?.state?.trim())) {
    //   newErrors.state = ERROR_MESSAGE.invalid_county;
    // }
    if (!signupState.pinCode?.trim()) {
      newErrors.pinCode = ERROR_MESSAGE.zipCode_required;
    }
    // else if (!REGEX.TEXT.test(signupState.pinCode?.trim())) {
    //   newErrors.pinCode = ERROR_MESSAGE.invalid_zipCode;
    // }
    console.log('Signup error---', newErrors);
    if (Object.keys(newErrors).length > 0) {
      setRegisterErrors(newErrors);
      return false;
    }
    return true;
  };

  const onLoginInputChange = (key, value) => {
    setLoginState({...loginState, [key]: value});
    setErrors({...errors, [key]: ''});
  };

  const getTabStyle = tab => ({
    ...styles.tabView,
    backgroundColor: tab === selectedTab ? COLORS.WHITE : '#F5F6F9',
  });

  const handlePickedImage = image => {
    setIsPickerVisible(false);
    if (image && image.path) {
      setRegisterState({
        ...registerState,
        selectedImage: image.path,
      });
      console.log(
        'image?.path?.split().pop()---',
        image?.path?.split('/').pop(),
      );
      showLoader();
      uploadImage({
        variables: {
          imageEncoded: image?.data,
          imageName: image?.path?.split('/').pop(),
        },
      });
      // hkUploadFiles({
      //   variables: {
      //     base64_encoded_file: `data:${image.mime};base64,${image.data}`,
      //     name: image?.path.split('/').pop(),
      //   },
      // });
      setRegisterErrors({
        ...registerErrors,
        selectedImage: '',
      });
    }
  };

  const handleTermNavigation = key => {
    if (key === 'term-and-condition') {
      navigation.navigate('CmsScreen', {slug: 'term-and-condition'});
    } else {
      navigation.navigate('CmsScreen', {
        slug: 'privacy-policy-cookie-restriction-mode',
      });
    }
  };

  const userCountry = async () => {
    if (selectedTab === 'register') {
      if (registerState.country) {
        setCountryData(registerState.country);
      } else {
        setCountryData(registerState.country);
      }
    } else {
      setCountryData(null);
    }
  };

  useEffect(() => {
    userCountry();
  }, [registerState.country, selectedTab]);

  const loadRememberedCredentials = async () => {
    try {
      const savedCredential = await AsyncStorage.getItem(
        STORAGE_KEYS.REMEMBER_ME_DATA,
      );
      console.log('savedCredential----------', savedCredential);
      if (savedCredential) {
        let parseCredential = JSON.parse(savedCredential);
        setLoginState({
          ...loginState,
          email: parseCredential.email,
          loginPassword: parseCredential.loginPassword,
          rememberMeCheck: parseCredential.rememberMeCheck,
        });
      }
    } catch (error) {
      console.log('Error loading remembered credentials:', error);
    }
  };

  // const [hkUploadFiles] = useMutation(UPLOAD_STORE_IMAGE, {
  //   onCompleted: data => {
  //     hideLoader();
  //     if (
  //       data &&
  //       data?.hkUploadFiles &&
  //       data?.hkUploadFiles?.items &&
  //       data?.hkUploadFiles?.items?.length > 0
  //     ) {
  //       console.log(
  //         'data?.hkUploadFiles?.items[0]?.order_path',
  //         data?.hkUploadFiles?.items[0]?.order_path,
  //       );
  //       setRegisterState({
  //         ...registerState,
  //         base64: data?.hkUploadFiles?.items[0]?.order_path,
  //       });
  //     } else {
  //       console.log('navigation failed');
  //     }
  //   },
  //   onError: error => {
  //     hideLoader();

  //     if (error.graphQLErrors) {
  //       error.graphQLErrors.forEach(e => {
  //         if (e.message) {
  //           showToast(e.message);
  //         } else {
  //           showToast(APP_TEXT.GraphQl_error);
  //         }
  //       });
  //       console.error('GraphQL errors:', JSON.stringify(error.graphQLErrors));
  //     }
  //   },
  //   errorPolicy: 'all',
  // });

  const [uploadImage] = useMutation(PRODUCT_IMAGE_UPLOAD, {
    onCompleted: data => {
      console.log('data---------', data);
      hideLoader();
      if (data && data?.uploadImage && data?.uploadImage?.url) {
        const newImageUrl = data?.uploadImage;
        console.log('newImageUrl', newImageUrl);
        setRegisterState({
          ...registerState,
          base64: newImageUrl,
        });
      } else {
        setRegisterState({
          ...registerState,
          selectedImage: null,
        });
        showToast('Please upload the your store image again');
        console.log('image not upload');
      }
    },

    onError: error => {
      setRegisterState({
        ...registerState,
        selectedImage: null,
      });
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

  const [createSellerAccount] = useMutation(VENDOR_REGISTER, {
    onCompleted: data => {
      // console.log('Mutation Success:', JSON.stringify(data));
      hideLoader();
      if (
        data &&
        data?.createSellerAccount &&
        data?.createSellerAccount?.customer &&
        data?.createSellerAccount?.customer?.email
      ) {
        navigation.navigate('OtpVerification', {
          from: 'register',
          email: data?.createSellerAccount?.customer?.email,
        });
        showToast(APP_TEXT.send_otp_message);
        setRegisterState(initialRegisterState);
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
            setRegisterErrors(prevState => ({
              ...prevState,
              email: e.message,
            }));
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
    // errorPolicy: 'all',
  });

  const [generateCustomerToken] = useMutation(VENDOR_LOGIN, {
    onCompleted: async data => {
      // console.log(
      //   'Mutation Success:---------',
      //   JSON.stringify(data.generateCustomerToken.token),
      //   JSON.stringify(data.generateCustomerToken.customerData),
      // );
      hideLoader();
      if (
        data &&
        data?.generateCustomerToken &&
        data?.generateCustomerToken?.token
      ) {
        await AsyncStorage.setItem(
          STORAGE_KEYS.AUTH_TOKEN,
          data?.generateCustomerToken?.token,
        );

        await AsyncStorage.setItem(
          STORAGE_KEYS.USER_DATA,
          JSON.stringify({
            ...data?.generateCustomerToken?.customerData, // Spread existing customerData
            seller_id: data?.generateCustomerToken?.seller_id,
            company_logo: data?.generateCustomerToken?.company_logo, // Add seller_id key
          }),
        );

        if (data?.generateCustomerToken?.customerData?.ca_vendor_country) {
          setCountryData(
            data?.generateCustomerToken?.customerData?.ca_vendor_country,
          );
        }
        if (loginState.rememberMeCheck) {
          let loginData = {
            email: loginState.email,
            loginPassword: loginState.loginPassword,
            rememberMeCheck: loginState.rememberMeCheck,
          };

          await AsyncStorage.setItem(
            STORAGE_KEYS.REMEMBER_ME_DATA,
            JSON.stringify(loginData),
          );
        } else {
          await AsyncStorage.removeItem(STORAGE_KEYS.REMEMBER_ME_DATA);
        }

        // setUserData(data?.generateCustomerToken?.customerData);
        setUserData({
          ...data?.generateCustomerToken?.customerData, // Spread existing customerData
          seller_id: data?.generateCustomerToken?.seller_id,
          company_logo: data?.generateCustomerToken?.company_logo, // Add seller_id key
        });
        setUserToken(data?.generateCustomerToken?.token);
        navigation.navigate('Dashboard');
        setLoginState(initialLoginState);
        setErrors(initialLoginState);
        showToast(
          `Welcome to the ${data?.generateCustomerToken?.customerData?.firstname} ${data?.generateCustomerToken?.customerData?.lastname}`,
        );
      } else {
        console.log('navigation failed');
      }
    },
    onError: error => {
      hideLoader();
      if (error.graphQLErrors) {
        console.log('error.graphQLErrors', error.graphQLErrors);
        error.graphQLErrors.forEach(err => {
          // Case 1: Email not found
          if (
            err.message.includes('Email not found. Please contact support.')
          ) {
            setErrors(prevState => ({
              ...prevState,
              email: err.message,
            }));
          }

          // Case 2: OTP verification pending
          else if (
            err.message.includes(
              'Your OTP verification is still pending. Please verify your OTP',
            )
          ) {
            showToast(err.message);
            navigation.navigate('OtpVerification', {
              from: 'register',
              email: loginState.email,
            });
            setLoginState(initialLoginState);
            setErrors(initialLoginState);
          }
          // Case 3: incorrect crediental
          else if (
            err.message.includes(
              'The account sign-in was incorrect or your account is disabled temporarily. Please wait and try again later',
            )
          ) {
            setErrors(prevState => ({
              ...prevState,
              email: err.message,
            }));
          }
          // Case 4: Account under review
          else if (
            err.message.includes(
              'Your account is currently under review by our admin team',
            )
          ) {
            setIsLoginError(true);
            setLoginErrorMessage(err.message);
            console.log('Account under review:', err.message);
            setErrors(initialLoginState);
            setLoginState(initialLoginState);
          } else {
            setErrors(prevState => ({
              ...prevState,
              email: err.message,
            }));
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

  const handleSubmit = () => {
    if (selectedTab === 'register') {
      const isRegisterValid = signUpFormValidate(registerState);
      if (isRegisterValid) {
        const filePath = registerState?.base64?.url?.split('image/')[0];
        const fileName = registerState?.base64?.url?.split('image/')[1];

        let companyLogo = null;
        if (fileName !== undefined && filePath !== undefined) {
          companyLogo = {
            file_name: fileName,
            file_path: `${filePath}image`,
          };
        }
        console.log('companyLogo', companyLogo);
        const withoutImage = {
          file_name: '',
          file_path: '',
        };
        console.log('first', {
          firstname: registerState.firstName,
          lastname: registerState.lastName,
          email: registerState.email,
          password: registerState.registerPassword,
          ca_business_name: registerState.businessName,
          ca_seller_telephone: registerState.phoneNumber,
          ca_shop_image: '',
          ca_vendor_city: registerState.city,
          ca_vendor_country: registerState.country,
          ca_vendor_lat: '',
          ca_vendor_long: '',
          ca_vendor_postcode: registerState.pinCode,
          ca_vendor_state: registerState.state,
          ca_vendor_street: `${registerState.addressLine1}${
            registerState.addressLine2 ? `, ${registerState.addressLine2}` : ''
          }`,
          ca_business_registration: registerState.businessRegistration,
          profileurl: `${registerState.businessName}-${registerState.businessRegistration}`,
          is_seller: 2,
          company_logo: companyLogo ? companyLogo : withoutImage,
        });
        showLoader();
        createSellerAccount({
          variables: {
            firstname: registerState.firstName,
            lastname: registerState.lastName,
            email: registerState.email,
            password: registerState.registerPassword,
            ca_business_name: registerState.businessName,
            ca_seller_telephone: registerState.phoneNumber,
            ca_shop_image: '',
            ca_vendor_city: registerState.city,
            ca_vendor_country: registerState.country,
            ca_vendor_lat: '',
            ca_vendor_long: '',
            ca_vendor_postcode: registerState.pinCode,
            ca_vendor_state: registerState.state,
            ca_vendor_street: `${registerState.addressLine1}${
              registerState.addressLine2
                ? `, ${registerState.addressLine2}`
                : ''
            }`,
            ca_business_registration: registerState.businessRegistration,
            profileurl: `${registerState.businessName}-${registerState.businessRegistration}`,
            is_seller: 2,
            company_logo: companyLogo ? companyLogo : withoutImage,
          },
        });
        console.log('company_logo', companyLogo);
      } else {
        console.log('form not valid');
      }
    }
  };

  const handleLoginSubmit = async () => {
    if (selectedTab === 'login') {
      const isValid = loginFormValidate(loginState, setErrors);
      console.log('loginState.email------', loginState.email);
      if (isValid) {
        // getSellerStore();
        showLoader();
        generateCustomerToken({
          variables: {
            email: loginState.email,
            password: loginState.loginPassword,
          },
        });
      } else {
        console.log('validation failed');
      }
    }
  };

  return (
    <AppLayout containerStyle={{paddingHorizontal: 0}}>
      {/* <ScrollView
        contentContainerStyle={{paddingBottom: 20}}
        bounces={false}
        showsVerticalScrollIndicator={false}> */}
      {isLoginError && (
        <CustomModal
          isVisible={isLoginError}
          hasHeader={false}
          modalContainerStyle={styles.modalContainer}
          contentContainerStyle={{}}
          animationInTiming={350}
          animationOutTiming={350}
          onClose={() => setIsLoginError(false)}>
          <View style={styles.modalView}>
            <Image
              source={IMAGES.ic_pendingIcon}
              style={{height: mvs(28), width: ms(28)}}
              resizeMode="contain"
            />
            <Text style={styles.modalText}>{loginErrorMessage}</Text>
          </View>
        </CustomModal>
      )}

      {isPickerVisible && (
        <ImagePickerModal
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
          title={'Add Your Store Image'}
        />
      )}
      <ScrollView
        contentContainerStyle={{paddingBottom: 20}}
        bounces={false}
        nestedScrollEnabled
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <ImageBackground
          resizeMode="cover"
          source={IMAGES.ic_auth_bg}
          style={{height: 300, width: sWidth, paddingHorizontal: ms(15)}}>
          <View
            style={{
              marginTop:
                StatusBar.currentHeight + Platform.OS === 'android'
                  ? mvs(20)
                  : mvs(80),
            }}>
            <Image
              resizeMode="center"
              source={IMAGES.ic_splash_icon}
              style={{height: mvs(28), width: ms(188)}}
            />
          </View>

          <Text style={styles.getStartedText}>{APP_TEXT.get_started}</Text>
          <Text style={styles.getStartedDesc} numberOfLines={2}>
            {APP_TEXT.create_account}
          </Text>
        </ImageBackground>

        <View style={{paddingHorizontal: ms(8)}}>
          <View style={styles.tabViewContainer}>
            <TouchableOpacity
              onPress={() => {
                setSelectedTab('login');
                setRegisterErrors({});
                setRegisterState(initialRegisterState);
              }}
              style={getTabStyle('login')}
              activeOpacity={0.9}>
              <Text
                style={
                  selectedTab === 'login'
                    ? styles.tabViewActiveText
                    : styles.tabViewInActiveText
                }>
                {APP_TEXT.login}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setSelectedTab('register');
                setLoginState(initialLoginState);
                setErrors({});
              }}
              style={getTabStyle('register')}
              activeOpacity={0.9}>
              <Text
                style={
                  selectedTab === 'register'
                    ? styles.tabViewActiveText
                    : styles.tabViewInActiveText
                }>
                {APP_TEXT.register}
              </Text>
            </TouchableOpacity>
          </View>
          {selectedTab === 'login' ? (
            <>
              <View style={{paddingHorizontal: 15}}>
                <TextInputBox
                  // isRequired={true}
                  placeholder={APP_TEXT.email_placeholder}
                  containerStyle={{marginTop: mvs(28)}}
                  title={APP_TEXT.email}
                  value={loginState.email}
                  onChangeText={text => {
                    onLoginInputChange('email', text);
                  }}
                  error={errors.email}
                  keyboardType={'email-address'}
                />

                <Text style={[styles.titleTxt]}>{APP_TEXT.password}</Text>
                <View
                  style={[
                    styles.passwordContainer,
                    errors.loginPassword && {borderColor: COLORS.ERROR},
                  ]}>
                  <TextInput
                    placeholder="Enter password"
                    placeholderTextColor={'#969696'}
                    value={loginState.loginPassword}
                    onChangeText={text => {
                      onLoginInputChange('loginPassword', text);
                    }}
                    style={styles.passwordInput}
                    secureTextEntry={!loginState.showLoginPass}
                    // onFocus={() => {
                    //   if (loginState.email) {
                    //     getSellerStore(); // Call the API when input is focused and email is valid
                    //   }
                    // }}
                  />
                  <TouchableOpacity
                    style={[styles.iconContainer]}
                    activeOpacity={1}
                    onPress={() =>
                      onLoginInputChange(
                        'showLoginPass',
                        !loginState.showLoginPass,
                      )
                    }>
                    <Image
                      style={[styles.icon]}
                      source={
                        !loginState.showLoginPass
                          ? IMAGES.ic_hidePassword
                          : IMAGES.ic_showPassword
                      }
                    />
                  </TouchableOpacity>
                </View>
                {errors.loginPassword && (
                  <Text style={styles.errorText} numberOfLines={2}>
                    {errors.loginPassword}
                  </Text>
                )}
              </View>

              <View style={styles.checkMainContainer}>
                <TouchableOpacity
                  onPress={() => {
                    onLoginInputChange(
                      'rememberMeCheck',
                      !loginState.rememberMeCheck,
                    );
                  }}
                  activeOpacity={1}
                  style={styles.checkImgContainer}>
                  <Image
                    source={
                      loginState.rememberMeCheck
                        ? IMAGES.ic_colorChecked
                        : IMAGES.ic_empty_check
                    }
                    style={styles.checkImage}
                  />
                  <Text style={styles.rememberText}>
                    {APP_TEXT.remember_me}
                  </Text>
                </TouchableOpacity>

                <Text
                  style={styles.forgotPasswordLink}
                  onPress={() => {
                    navigation.navigate('ForgotPassword');
                    setErrors(initialLoginState);
                    setLoginState(initialLoginState);
                  }}>
                  {APP_TEXT.forgot_password_q}
                </Text>
              </View>
              <GradientButton
                title={APP_TEXT.log_in}
                onPress={() => handleLoginSubmit()}
                // onPress={() => setIsLoginError(true)}
                buttonTxt={{fontSize: FONTSIZE.L}}
                mainContainer={{paddingHorizontal: ms(10), marginTop: mvs(30)}}
              />
              <View style={styles.continueButtonContainer}>
                <View style={styles.flatLine} />
                <Text style={styles.orText}>{APP_TEXT.or}</Text>
                <View style={styles.flatLine} />
              </View>
              <View style={styles.bottomContainer}>
                <Text style={styles.anyAccountText}>
                  {APP_TEXT.no_account_q}
                </Text>
                <Text
                  style={styles.registerText}
                  onPress={() => setSelectedTab('register')}
                  // onPress={() => navigation.navigate('Dashboard')}
                >
                  {APP_TEXT.register}
                </Text>
              </View>
            </>
          ) : (
            <>
              <View style={{paddingHorizontal: 15}}>
                <View style={styles.flexContainer}>
                  <View style={styles.halfFlex}>
                    <TextInputBox
                      isRequired={true}
                      title={'First name'}
                      value={registerState.firstName}
                      onChangeText={text => {
                        onInputChange('firstName', text);
                      }}
                      error={registerErrors.firstName}
                      placeholder={'Enter first name'}
                    />
                  </View>
                  <View style={styles.halfFlex}>
                    <TextInputBox
                      isRequired={true}
                      title={'Last name'}
                      value={registerState.lastName}
                      onChangeText={text => {
                        onInputChange('lastName', text);
                      }}
                      error={registerErrors.lastName}
                      placeholder={'Enter last name'}
                    />
                  </View>
                </View>
                <TextInputBox
                  isRequired={true}
                  title={APP_TEXT.business_name}
                  value={registerState.businessName}
                  onChangeText={text => {
                    onInputChange('businessName', text);
                  }}
                  error={registerErrors.businessName}
                  placeholder={APP_TEXT.business_name_placeholder}
                  containerStyle={{marginTop: mvs(28)}}
                />
                <TextInputBox
                  isRequired={true}
                  title={APP_TEXT.business_registration}
                  value={registerState.businessRegistration}
                  onChangeText={text => {
                    onInputChange('businessRegistration', text);
                  }}
                  error={registerErrors.businessRegistration}
                  placeholder={APP_TEXT.business_reg_placeholder}
                  containerStyle={{marginTop: mvs(28)}}
                />
                <TextInputBox
                  isRequired={true}
                  placeholder={APP_TEXT.email_placeholder}
                  title={APP_TEXT.email}
                  value={registerState.email}
                  onChangeText={text => {
                    onInputChange('email', text);
                  }}
                  error={registerErrors.email}
                  keyboardType={'email-address'}
                  containerStyle={{marginTop: mvs(18)}}
                />
                <TextInputBox
                  isRequired={true}
                  title={APP_TEXT.phone_number}
                  placeholder={APP_TEXT.phone_number_placeholder}
                  value={registerState.phoneNumber}
                  onChangeText={text => {
                    onInputChange('phoneNumber', text.replace(/[^0-9.]/g, ''));
                  }}
                  error={registerErrors.phoneNumber}
                  keyboardType={'numeric'}
                  containerStyle={{marginTop: mvs(18)}}
                />
                {/* <View style={styles.mapContainer}>
                  <MapView
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    // customMapStyle={mapStyles}
                    ref={mapRef}
                    showsMyLocationButton={true}
                    region={{
                      latitude: registerState.autocompleteCoordinate
                        ? registerState.autocompleteCoordinate.latitude
                        : GLOBAL_CONSTANT.default_coordinates.lat,
                      longitude: registerState.autocompleteCoordinate
                        ? registerState.autocompleteCoordinate.longitude
                        : GLOBAL_CONSTANT.default_coordinates.lng,
                      latitudeDelta:
                        GLOBAL_CONSTANT.default_coordinates.latDelta,
                      longitudeDelta:
                        GLOBAL_CONSTANT.default_coordinates.longDelta,
                    }}
                    zoomControlEnabled={true}
                    zoomEnabled
                    scrollEnabled
                    showsScale={true}
                    googleRenderer="LATEST"
                    onPress={e =>
                      setRegisterState({
                        ...registerState,
                        coordinates: e.nativeEvent.coordinate,
                      })
                    }>
                    <Marker
                      coordinate={{
                        latitude: registerState.coordinates
                          ? registerState.coordinates.latitude
                          : GLOBAL_CONSTANT.default_coordinates.lat,
                        longitude: registerState.coordinates
                          ? registerState.coordinates.longitude
                          : GLOBAL_CONSTANT.default_coordinates.lng,
                      }}
                      draggable
                      onDragEnd={data => {
                        setRegisterState({
                          ...registerState,
                          coordinates: data.nativeEvent.coordinate,
                        });
                      }}
                    />
                  </MapView>

                  <GooglePlacesAutocomplete
                    placeholder={APP_TEXT.store_location_placeholder}
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
                      console.log('data, details', selectedLocation);
                      setRegisterState({
                        ...registerState,
                        coordinates: {
                          latitude: selectedLocation.lat,
                          longitude: selectedLocation.lng,
                        },
                        autocompleteCoordinate: {
                          latitude: selectedLocation.lat,
                          longitude: selectedLocation.lng,
                        },
                      });
                      setInputValue(formatted_address);
                    }}
                    query={{
                      key: APP_CREDENTIALS.AUTOCOMPLETE_KEY,
                      language: 'en',
                      components: `country:${deviceCountry}`,
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
                        borderWidth: 1,
                        borderColor: inputValueError
                          ? COLORS.ERROR
                          : COLORS.BORDER,
                        marginTop: mvs(10),
                      },
                      listView: {
                        zIndex: 99,
                        marginTop: mvs(20),
                        borderColor: COLORS.BORDER,
                        borderWidth: isAutocompleteFocused ? 0 : 1,
                        borderRadius: 10,
                        // paddingHorizontal: ms(10),
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
                </View> */}
                <TextInputBox
                  isRequired={true}
                  title={APP_TEXT.store_location}
                  // titleImage={
                  //   <Image
                  //     source={IMAGES.ic_info_Image}
                  //     style={{height: mvs(18), width: ms(18)}}
                  //     resizeMode="contain"
                  //   />
                  // }
                  value={registerState.addressLine1}
                  onChangeText={text => {
                    onInputChange('addressLine1', text);
                  }}
                  error={registerErrors.addressLine1}
                  placeholder={APP_TEXT.addressLine1_placeholder}
                  containerStyle={{marginTop: mvs(28)}}
                />
                <TextInputBox
                  isRequired={true}
                  value={registerState.addressLine2}
                  onChangeText={text => {
                    onInputChange('addressLine2', text);
                  }}
                  placeholder={APP_TEXT.addressLine2_placeholder}
                  containerStyle={{marginTop: mvs(15)}}
                />
                <View style={styles.flexContainer}>
                  <View style={styles.halfFlex}>
                    {/* <TextInputBox
                      isRequired={true}
                      title={'Country'}
                      value={registerState.country}
                      onChangeText={text => {
                        onInputChange('country', text);
                      }}
                      error={registerErrors.country}
                      placeholder={'Enter country'}
                      editable={false}
                    /> */}
                    <SingleSelectDropdown
                      isRequired={true}
                      data={dropDownData}
                      mainContainerStyle={{
                        marginTop: 8,
                      }}
                      dropdownStyle={[
                        styles.dropdownStyle,
                        // {backgroundColor: 'red'},
                      ]}
                      rightIconStyle={{marginRight: ms(15)}}
                      dropdownTitle={
                        registerState.country
                          ? registerState.country
                          : dropDownData[0]?.name
                      }
                      onItemSelect={async item => {
                        await AsyncStorage.setItem(
                          STORAGE_KEYS.USER_COUNTRY,
                          registerState.country,
                        );
                        setRegisterState({
                          ...registerState,
                          country: item.value,
                        });
                        if (selectedTab === 'register') {
                          if (registerState.country) {
                            setCountryData(registerState.country);
                          }
                        }
                      }}
                      selectedValue={registerState.country}
                      inverted={false}
                      label={'Country'}
                      labelField="name"
                      valueField="value"
                      listItemStyle={{
                        backgroundColor: 'white',
                        paddingVertical: 10,
                      }}
                    />
                  </View>
                  <View style={styles.halfFlex}>
                    <TextInputBox
                      isRequired={true}
                      title={'State/Region'}
                      value={registerState.state}
                      onChangeText={text => {
                        onInputChange('state', text);
                      }}
                      error={registerErrors.state}
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
                      isRequired={true}
                      title={'City'}
                      value={registerState.city}
                      onChangeText={text => {
                        onInputChange('city', text);
                      }}
                      error={registerErrors.city}
                      placeholder={'Enter city'}
                    />
                  </View>
                  <View style={styles.halfFlex}>
                    <TextInputBox
                      isRequired={true}
                      title={'Pin/Zip code'}
                      value={registerState.pinCode}
                      onChangeText={text => {
                        onInputChange('pinCode', text);
                      }}
                      error={registerErrors.pinCode}
                      placeholder={'Enter pin code'}
                    />
                  </View>
                </View>
                {!registerState.selectedImage && (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setIsPickerVisible(true)}
                    style={[
                      styles.imgContainer,
                      {
                        borderColor: registerErrors.selectedImage
                          ? COLORS.ERROR
                          : COLORS.BLACK,
                      },
                    ]}>
                    <Image
                      source={IMAGES.ic_tabCamera}
                      resizeMode="contain"
                      style={{
                        height: mvs(25),
                        width: ms(25),
                        tintColor: COLORS.TITLE,
                      }}
                    />
                    <Text style={styles.imgText}>
                      {APP_TEXT.upload_store_image}
                    </Text>
                  </TouchableOpacity>
                )}
                {registerErrors.selectedImage && (
                  <Text style={styles.errorText} numberOfLines={3}>
                    {registerErrors.selectedImage}
                  </Text>
                )}
                {registerState.selectedImage && (
                  <ImageBackground
                    resizeMode="cover"
                    source={{uri: registerState.selectedImage}}
                    style={styles.storeImage}
                    imageStyle={{borderRadius: 10}}>
                    <TouchableOpacity
                      activeOpacity={0.9}
                      style={styles.selectedImage}
                      onPress={() =>
                        setRegisterState({
                          ...registerState,
                          selectedImage: null,
                        })
                      }>
                      <Image
                        source={IMAGES.ic_closeIcon}
                        style={styles.closeIcon}
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
                  </ImageBackground>
                )}
                <TextInputBox
                  isRequired={true}
                  title={APP_TEXT.password}
                  containerStyle={{marginTop: mvs(18)}}
                  secureTextEntry={!registerState.showPassword}
                  onRightIconPress={() => {
                    onInputChange('showPassword', !registerState.showPassword);
                  }}
                  rightIcon={
                    !registerState.showPassword
                      ? IMAGES.ic_hidePassword
                      : IMAGES.ic_showPassword
                  }
                  rightIconImageStyle={{height: mvs(22), width: ms(25)}}
                  onChangeText={text => {
                    onInputChange('registerPassword', text);
                  }}
                  value={registerState.registerPassword}
                  error={registerErrors.registerPassword}
                />
                <TextInputBox
                  isRequired={true}
                  title={APP_TEXT.confirm_password}
                  containerStyle={{marginTop: mvs(18)}}
                  secureTextEntry={!registerState.showConfirmPass}
                  onRightIconPress={() => {
                    onInputChange(
                      'showConfirmPass',
                      !registerState.showConfirmPass,
                    );
                  }}
                  rightIcon={
                    !registerState.showConfirmPass
                      ? IMAGES.ic_hidePassword
                      : IMAGES.ic_showPassword
                  }
                  rightIconImageStyle={{height: mvs(22), width: ms(25)}}
                  onChangeText={text => {
                    onInputChange('confirmPassword', text);
                  }}
                  value={registerState.confirmPassword}
                  error={registerErrors.confirmPassword}
                />
                <View
                  style={[
                    styles.checkImgContainer,
                    {marginTop: 20, justifyContent: null},
                  ]}>
                  <TouchableOpacity
                    onPress={() => {
                      onInputChange(
                        'isConditionAccept',
                        !registerState.isConditionAccept,
                      );
                    }}
                    activeOpacity={1}>
                    <Image
                      source={
                        registerState.isConditionAccept
                          ? IMAGES.ic_colorChecked
                          : IMAGES.ic_empty_check
                      }
                      style={styles.checkImage}
                    />
                  </TouchableOpacity>

                  <Text style={[styles.rememberText]}>{APP_TEXT.iAgree}</Text>
                  <Text
                    style={styles.privacyText}
                    numberOfLines={2}
                    onPress={() => handleTermNavigation('term-and-condition')}>
                    {APP_TEXT.term_condition}
                  </Text>
                  <Text style={[styles.rememberText]} numberOfLines={2}>
                    {APP_TEXT.and}
                  </Text>
                  <Text
                    style={styles.privacyText}
                    onPress={() =>
                      handleTermNavigation(
                        'privacy-policy-cookie-restriction-mode',
                      )
                    }>
                    {APP_TEXT.privacy}
                  </Text>
                </View>
                {registerErrors.isConditionAccept && (
                  <Text style={[styles.errorText]} numberOfLines={3}>
                    {registerErrors.isConditionAccept}
                  </Text>
                )}
              </View>

              <GradientButton
                title={APP_TEXT.register}
                onPress={() => handleSubmit()}
                mainContainer={{marginTop: mvs(40), paddingHorizontal: ms(10)}}
                buttonTxt={{fontSize: FONTSIZE.XL}}
              />
            </>
          )}
        </View>
      </ScrollView>
    </AppLayout>
  );
};

export default Authentication;

const styles = StyleSheet.create({
  tabViewContainer: {
    marginTop: mvs(50),
    marginHorizontal: ms(15),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F6F9',
    paddingVertical: mvs(4),
    paddingHorizontal: ms(2),
    borderRadius: s(10),
  },
  tabView: {
    paddingVertical: mvs(14),
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: s(5),
    marginHorizontal: ms(2),
    flex: 1 / 2,
  },
  tabViewActiveText: {
    color: '#323135',
    fontFamily: FONTS.workSansSemiBold,
    fontSize: FONTSIZE.L,
    textAlign: 'center',
  },

  tabViewInActiveText: {
    color: '#7D7D91',
    fontFamily: FONTS.workSansMedium,
    fontSize: FONTSIZE.L,
    textAlign: 'center',
  },
  checkImage: {
    height: mvs(16),
    width: ms(16),
    resizeMode: 'contain',
    marginRight: ms(6),
  },
  checkImgContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginLeft: ms(5),
  },
  checkMainContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: mvs(10),
    paddingHorizontal: ms(10),
  },
  forgotPasswordLink: {
    textAlign: 'right',
    fontFamily: FONTS.workSansSemiBold,
    color: '#264653',
    fontSize: FONTSIZE.L,
    // marginRight: ms(18),
  },
  rememberText: {
    color: COLORS.TITLE,
    fontSize: FONTSIZE.L,
    fontFamily: FONTS.workSansMedium,
  },
  privacyText: {
    color: COLORS.PRIMARY,
    fontSize: FONTSIZE.M,
    fontFamily: FONTS.workSansSemiBold,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.PRIMARY,
    textAlign: 'center',
  },
  continueButtonContainer: {
    flexDirection: 'row',
    marginVertical: mvs(20),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: ms(10),
  },
  flatLine: {
    height: mvs(1),
    backgroundColor: '#EDF1F3',
    flex: 5,
  },
  orText: {
    fontFamily: FONTS.workSansMedium,
    fontSize: FONTSIZE.L,
    color: COLORS.TITLE,
    marginHorizontal: ms(7.5),
    flex: 1,
    textAlign: 'center',
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  anyAccountText: {
    color: '#524B6B',
    fontFamily: FONTS.workSansMedium,
    fontSize: FONTSIZE.L,
  },
  registerText: {
    color: '#135F4B',
    fontFamily: FONTS.workSansSemiBold,
    fontSize: FONTSIZE.L,
    borderBottomWidth: 1,
    borderBottomColor: '#135F4B',
  },
  imageBackground: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%',
    paddingHorizontal: ms(15),
    paddingBottom: 20,
  },

  getStartedText: {
    fontSize: s(26),
    fontFamily: FONTS.workSansSemiBold,
    color: COLORS.WHITE,
    textAlign: 'left',
    marginTop: mvs(32),
  },
  getStartedDesc: {
    fontSize: FONTSIZE.XXL,
    fontFamily: FONTS.workSansRegular,
    color: COLORS.WHITE,
    textAlign: 'left',
  },
  storeText: {
    fontFamily: FONTS.workSansMedium,
    fontSize: FONTSIZE.L,
    color: COLORS.TITLE,
    textAlign: 'left',
  },
  imgContainer: {
    backgroundColor: COLORS.WHITE,
    height: mvs(70),
    borderWidth: 0.5,
    borderRadius: s(10),
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: s(10),
    marginTop: mvs(35),
    borderColor: COLORS.ERROR,
  },
  imgText: {
    fontSize: FONTSIZE.L,
    fontFamily: FONTS.workSansMedium,
    color: COLORS.TITLE,
  },
  selectedImage: {
    backgroundColor: COLORS.WHITE,
    borderRadius: s(100),
    padding: s(8),
    top: mvs(-10),
    right: ms(-10),
    position: 'absolute',
    elevation: 20,
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },

  closeIcon: {
    height: mvs(8),
    width: ms(8),
  },
  storeImage: {
    height: mvs(100),
    width: ms(150),
    paddingHorizontal: ms(15),
    marginTop: mvs(20),
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
    marginTop: mvs(20),
  },
  modalView: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: mvs(10),
  },
  errorText: {
    color: COLORS.ERROR,
    fontFamily: FONTS.workSansRegular,
    fontSize: FONTSIZE.M,
    // marginTop: Platform.OS === 'ios' ? mvs(5) : 10,
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
  iconContainer: {flex: 0.5, justifyContent: 'center', alignItems: 'center'},
  icon: {height: mvs(20), width: ms(20), resizeMode: 'contain'},
  titleTxt: {
    fontFamily: FONTS.workSansMedium,
    fontSize: FONTSIZE.L,
    color: COLORS.TITLE,
    textAlign: 'left',
    marginTop: mvs(20),
  },
  passwordContainer: {
    backgroundColor: COLORS.WHITE,
    borderRadius: ms(8),
    borderColor: COLORS.BORDER,
    borderWidth: 1,
    paddingHorizontal: ms(16),
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: mvs(8),
  },
  passwordInput: {
    color: COLORS.BLACK,
    fontFamily: FONTS.workSansRegular,
    fontSize: FONTSIZE.L,
    height: Platform.OS === 'android' ? mvs(45) : ms(42),
    flex: 5,
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
  dropdownStyle: {
    paddingHorizontal: null,
    backgroundColor: 'white',
    borderColor: COLORS.BORDER,
    borderWidth: 1,
    // paddingVertical: null,
    // paddingBottom:-20,
    height: Platform.OS === 'android' ? mvs(45) : ms(42),
    // alignItems:'center',
  },
});

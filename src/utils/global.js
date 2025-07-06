import {
  Alert,
  BackHandler,
  Dimensions,
  Linking,
  Platform,
  Text,
  TextInput,
} from 'react-native';
import Toast from 'react-native-simple-toast';
// import SplashScreen from 'react-native-splash-screen';
import moment from 'moment-timezone';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ERROR_MESSAGE,
  GLOBAL_CONSTANT,
  LENGTHS,
  REGEX,
} from '../constant/globalConstants';
import {IMAGES} from '../constant/imagePath';
import {PERMISSIONS, request} from 'react-native-permissions';

const loginFormValidate = (loginState, setErrors) => {
  const newErrors = {};
  if (!loginState.email.trim()) {
    newErrors.email = ERROR_MESSAGE.email_requires;
  } else if (!REGEX.EMAIL.test(loginState.email)) {
    newErrors.email = ERROR_MESSAGE.invalid_email;
  }

  if (!loginState.loginPassword.trim() || !loginState.loginPassword) {
    newErrors.loginPassword = ERROR_MESSAGE.password_require;
  }
  // else if (
  //   loginState.loginPassword.length < LENGTHS.MIN_PASSWORD ||
  //   loginState.loginPassword.length > LENGTHS.MAX_PASSWORD
  // ) {
  //   newErrors.loginPassword = ERROR_MESSAGE.invalid_password;
  // } else if (!REGEX.PASSWORD.test(loginState.loginPassword)) {
  //   newErrors.loginPassword = ERROR_MESSAGE.invalid_password_signup;
  // }

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return false;
  }
  return true;
};

const forgotFormValidate = (forgot, setErrors) => {
  const newErrors = {};
  if (!forgot.email.trim()) {
    newErrors.email = ERROR_MESSAGE.email_requires;
  } else if (!REGEX.EMAIL.test(forgot.email)) {
    newErrors.email = ERROR_MESSAGE.invalid_email;
  }
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return false;
  }
  return true;
};

const resetFormValidate = (reset, setErrors) => {
  const newErrors = {};
  if (!reset.password.trim() || !reset.password) {
    newErrors.password = ERROR_MESSAGE.password_require;
  } else if (
    reset.password.length < LENGTHS.MIN_PASSWORD ||
    reset.password.length > LENGTHS.MAX_PASSWORD
  ) {
    newErrors.password = ERROR_MESSAGE.invalid_password;
  } else if (!REGEX.PASSWORD.test(reset.password?.trim())) {
    newErrors.password = ERROR_MESSAGE.invalid_password_signup;
  }
  if (!reset.confirmPassword.trim()) {
    newErrors.confirmPassword = ERROR_MESSAGE.confirm_password;
  }
  if (reset.password !== reset.confirmPassword) {
    newErrors.confirmPassword = ERROR_MESSAGE.invalid_confirmPassword;
  }
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return false;
  }
  return true;
};

const changePasswordFormValidate = (change, setErrors) => {
  const newErrors = {};
  if (!change.password.trim() || !change.password) {
    newErrors.password = ERROR_MESSAGE.new_password;
  } else if (
    change.password.length < LENGTHS.MIN_PASSWORD ||
    change.password.length > LENGTHS.MAX_PASSWORD
  ) {
    newErrors.password = ERROR_MESSAGE.invalid_password;
  } else if (!REGEX.PASSWORD.test(change.password?.trim())) {
    newErrors.password = ERROR_MESSAGE.invalid_password_signup;
  }

  if (!change.currentPassword.trim() || !change.currentPassword) {
    newErrors.currentPassword = ERROR_MESSAGE.current_password_require;
  } else if (
    change.currentPassword.length < LENGTHS.MIN_PASSWORD ||
    change.currentPassword.length > LENGTHS.MAX_PASSWORD
  ) {
    newErrors.currentPassword = ERROR_MESSAGE.invalid_password;
  } else if (!REGEX.PASSWORD.test(change.currentPassword?.trim())) {
    newErrors.currentPassword = ERROR_MESSAGE.invalid_password_signup;
  }

  if (!change.confirmPassword.trim()) {
    newErrors.confirmPassword = ERROR_MESSAGE.confirm_password;
  }
  if (change.password !== change.confirmPassword) {
    newErrors.confirmPassword = ERROR_MESSAGE.invalid_confirmPassword;
  }
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return false;
  }
  return true;
};

const maskMobileNumber = (mobileNumber = null) => {
  let maskedNumber;
  if (mobileNumber) {
    mobileNumber.substring(0, 3) +
      '*'.repeat(mobileNumber.length - 5) +
      mobileNumber.substring(mobileNumber.length - 2);
  }

  return maskedNumber;
};

const showToast = (message, duration = Toast.SHORT) => {
  Toast.show(message, duration, {tapToDismissEnabled: true});
};

const formatOtpTimer = time => {
  const minutes = Math.floor(time / 60);
  const remainingSeconds = time % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(
    remainingSeconds,
  ).padStart(2, '0')}`;
  return formattedTime;
};

const signUpFormValidate = (signupState, setErrors) => {
  const newErrors = {};
  if (!signupState.businessName) {
    newErrors.businessName = ERROR_MESSAGE.first_name_required;
  }
  if (!signupState.phoneNumber) {
    newErrors.phoneNumber = ERROR_MESSAGE.phone_required;
  }
  if (!signupState.email) {
    newErrors.email = ERROR_MESSAGE.email_requires;
  } else if (!REGEX.EMAIL.test(signupState.email)) {
    newErrors.email = ERROR_MESSAGE.invalid_email;
  }
  if (!signupState.registerPassword) {
    newErrors.registerPassword = ERROR_MESSAGE.password_require;
  } else if (signupState.registerPassword.length <= 8) {
    newErrors.registerPassword = ERROR_MESSAGE.invalid_password;
  }
  if (!signupState.confirmPassword) {
    newErrors.confirmPassword = ERROR_MESSAGE.confirm_password;
  }
  if (signupState.registerPassword !== signupState.confirmPassword) {
    newErrors.confirmPassword = ERROR_MESSAGE.invalid_confirmPassword;
  }
  console.log('newErrors', newErrors);
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return false;
  }
  return true;
};
const contactUsFormValidate = (contactUS, setErrors) => {
  const newErrors = {};
  if (!contactUS.selectedSubject) {
    newErrors.selectedSubject = ERROR_MESSAGE.contactQuery_required;
  }
  if (!contactUS.comment) {
    newErrors.comment = ERROR_MESSAGE.contact_message_required;
  }

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return false;
  }
  return true;
};

const editProfileValidate = (profileState, setErrors) => {
  const newErrors = {};
  if (!profileState.firstName) {
    newErrors.firstName = ERROR_MESSAGE.first_name_required;
  }
  if (!profileState.lastName) {
    newErrors.lastName = ERROR_MESSAGE.last_name_required;
  }
  if (!profileState.phoneNumber) {
    newErrors.phoneNumber = ERROR_MESSAGE.phone_required;
  }
  // if (!profileState.email) {
  //   newErrors.email = ERROR_MESSAGE.email_requires;
  // } else if (!regex.email_regex.test(profileState.email)) {
  //   newErrors.email = ERROR_MESSAGE.invalid_email;
  // }
  // if (!profileState.password) {
  //   newErrors.password = ERROR_MESSAGE.password_require;
  // } else if (profileState.password.length <= 8) {
  //   newErrors.password = ERROR_MESSAGE.invalid_password;
  // }
  // if (!profileState.confirmPassword) {
  //   newErrors.confirmPassword = ERROR_MESSAGE.confirm_password;
  // }
  // if (profileState.password !== profileState.confirmPassword) {
  //   newErrors.confirmPassword = ERROR_MESSAGE.invalid_confirmPassword;
  // }

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return false;
  }
  return true;
};

const {height: sHeight, width: sWidth} = Dimensions.get('window');

const displayPrice = (amount = 0, currency = '', isFormat= false) => {
  if (isFormat){
    return `${parseFloat(amount).toFixed(0)}`;
  }else{
    if (amount !== null && amount !== undefined) {
      if (currency) {
        return `${currency} ${parseFloat(amount).toFixed(2)}`;
      } else {
        return `${parseFloat(amount).toFixed(2)}`;
      }
    } else {
      return ' ';
    }}
};

const defaultAppProps = () => {
  Text.defaultProps = Text.defaultProps || {};
  Text.defaultProps.allowFontScaling = false;
  TextInput.defaultProps = TextInput.defaultProps || {};
  TextInput.defaultProps.allowFontScaling = false;
};

// const splashScreenHandler = () => {
//   setTimeout(() => {
//     SplashScreen.hide();
//   }, GLOBAL_CONSTANT.SPLASH_TIME);
// };

const shouldRedirect = url => {
  return !url.includes('doNotRedirect');
};

const handlePressUrl = async url => {
  if (url) {
    if (shouldRedirect(url)) {
      if (await Linking.canOpenURL(url)) {
        Linking.openURL(url);
      } else {
        Linking.openURL(url);
      }
    } else {
      console.log('URL should not be redirected:', url);
    }
  }
};

const getPaymentImage = paymentType => {
  switch (paymentType) {
    case 'bank':
      return IMAGES.ic_bank;
    case 'upi':
      return IMAGES.ic_upi;
    default:
      return Platform.OS === 'android'
        ? IMAGES.ic_playstore
        : IMAGES.ic_apple_pay;
  }
};

const formatDate = (d, format = GLOBAL_CONSTANT.DATE_FORMAT) => {
  const timeZone = 'Asia/Kolkata'; //Intl.DateTimeFormat().resolvedOptions().timeZone; // get the default time zone
  const date = moment(d);
  // const date = moment(d).tz(timeZone);
  return date.format(format);
};

const getImageUrl = (imagePath = null, item = null, type = null) => {
  if (type && type === 'profile') {
    return IMAGES.ic_avatar;
  } else if (imagePath && item) {
    return {uri: `${imagePath}/${item}`};
  } else {
    return IMAGES.ic_logo;
  }
};

const handleAsyncStorage = async (action = '', key = null, value = null) => {
  try {
    switch (action) {
      case 'get':
        if (key) {
          const item = await AsyncStorage.getItem(key);
          return item ? JSON.parse(item) : null;
        }
        return null;
      case 'set':
        if (key && value) {
          await AsyncStorage.setItem(key, JSON.stringify(value));
        }
        return false;
      case 'remove':
        if (key) {
          await AsyncStorage.removeItem(key);
        }
        return false;
      case 'multiSet':
        if (
          Array.isArray(key) &&
          Array.isArray(value) &&
          key.length === value.length
        ) {
          const keyValuePairs = key.map((k, i) => [
            k,
            JSON.stringify(value[i]),
          ]);
          await AsyncStorage.multiSet(keyValuePairs);
          return true;
        }
        return false;
      default:
        return null;
    }
  } catch (error) {
    console.log('AsyncStorage error:', error);
    return null;
  }
};

const getProductPrice = (regularPrice = null, salePrice = null) => {
  let offer = null;
  if (regularPrice || salePrice) {
    if (salePrice && regularPrice) {
      offer = Math.min(salePrice, regularPrice);
    } else if (salePrice) {
      offer = salePrice;
    } else if (regularPrice) {
      offer = regularPrice;
    }
  }
  if (offer && offer !== 'undefined') {
    return displayPrice(offer);
  }
};

const handleBackPress = () => {
  Alert.alert(
    'Hold on!',
    'Are you sure you want to Exit App?',
    [
      {
        text: 'Cancel',
        onPress: () => {
          console.log('Cancel pressed');
        },
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => BackHandler.exitApp(),
      },
    ],
    {
      cancelable: false,
    },
  );
  return true;
};

const requestLocationPermission = async () => {
  let permission;

  if (Platform.OS === 'android') {
    permission = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
  } else {
    permission = PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
  }
  const result = await request(permission);

  return result;
};

const returnText = value => {
  switch (value) {
    case 'forgotPassword':
      return {
        h1: 'Enter OTP',
        desc: 'Please enter the OTP sent to your email to verify your identity.',
        details: 'Please enter the 4-digit OTP sent to your email.',
      };
    case 'changePassword':
      return {
        h1: 'Change Password',
        desc: 'Change your password? Update it here to secure your account.',
      };
    case 'register':
      return {
        h1: 'OTP Verification',
        desc: 'Enter the One-Time Password (OTP) sent to your registered Email for verification.',
        details: 'Please enter the 4-digit OTP sent to your email.',
      };
    default:
      return {
        h1: 'Welcome',
        desc: 'Access your account securely by using our services.',
      };
  }
};

function formatPriceNumber(value) {
  if (Number(value) >= 1000000) {
    return Math.floor(Number(value) / 100000) / 10 + 'M'; // 1M for a million
  } else if (Number(value) >= 1000) {
    return Math.floor(Number(value) / 100) / 10 + 'K'; // 1K for a thousand
  } else {
    return Number(value).toString(); // Display the number as-is if it's less than 1000
  }

  // if (Number(value) >= 1000000) {
  //   return (Number(value) / 1000000).toFixed(1) + 'M'; // 1M for a million
  // } else if (Number(value) >= 1000) {
  //   return (Number(value) / 1000).toFixed(1) + 'K'; // 1K for a thousand
  // } else {
  //   return Number(value).toString(); // Display the number as-is if it's less than 1000
  // }
}

export {
  loginFormValidate,
  maskMobileNumber,
  showToast,
  formatOtpTimer,
  signUpFormValidate,
  defaultAppProps,
  //splashScreenHandler,
  handlePressUrl,
  getPaymentImage,
  formatDate,
  getImageUrl,
  handleAsyncStorage,
  editProfileValidate,
  getProductPrice,
  handleBackPress,
  displayPrice,
  sHeight,
  sWidth,
  forgotFormValidate,
  resetFormValidate,
  changePasswordFormValidate,
  returnText,
  contactUsFormValidate,
  requestLocationPermission,
  formatPriceNumber,
};

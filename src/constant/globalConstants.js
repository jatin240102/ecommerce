import {COLORS} from './color';

const GLOBAL_CONSTANT = {
  SPLASH_TIME: 2 * 1000,
  DATE_FORMAT: 'DD/MM/YYYY',
  default_coordinates: {
    lat: 20.5937,
    lng: 78.9629,
    latDelta: 0.04,
    longDelta: 0.05,
  },
  STORE_IMAGE_PATH: 'https://vendorapplication.24livehost.com/media/',
  PER_PAGE: 10,
  PENDING: 0,
  APPROVED: 1,
  REJECTED: 2,
  ALL: 3,
  UAE: 'United Arab Emirates',
  UK: 'United Kingdom',
};

const mode = 'development'; // development, staging
let BASE_URL = 'https://m243extensions.projectstatus.in';
// let BASE_URL = 'https://vendorapplication.24livehost.com';

if (mode === 'development') {
  BASE_URL = 'https://m243extensions.projectstatus.in';
} else if (mode === 'live') {
  BASE_URL = 'https://';
}

const APP_CREDENTIALS = {
  API_URL: `${BASE_URL}/graphql`,
  ENCRYPTION_KEY: '',
  ENCRYPTION_IV: '',
  // GOOGLE_PLACES_AUTOCOMPLETE_KEY: 'AIzaSyBK6nZeAvYmGJMahrmpJcOFsrHOT5508y0',
  GOOGLE_PLACES_AUTOCOMPLETE_KEY: 'AIzaSyAGI4gcDgXj-OyYpAR__Kmec9CMyQLKZd8',
};

const API_METHOD = {
  SIGNUP: 'signup',
  LOGIN: 'login',
  FORGOT_PASSWORD: 'forgotPassword',
  VERIFY_OTP: 'verifyOtp',
  RESEND_OTP: 'resendOtp',
  PROFILE: 'profile',
  UPDATE_PROFILE: 'updateProfile',
  RESET_PASSWORD: 'resetPassword',
  CHANGE_PASSWORD: 'changePassword',
  SETTINGS: 'settings',
  HOME: 'home',
};

const API_STATUS = {
  SUCCESS: 'true',
  ERROR: 'false',
  PENDING: 'pending',
};

/* AsyncStorage */
const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_DATA: 'loggedInUserData',
  REMEMBER_ME_DATA: 'rememberMeData',
  USER_COUNTRY: 'userCountry',
};

const APP_TEXT = {
  submit: 'Submit',
  logout: 'LogOut',
  delete: 'Delete',
  settings: 'Settings',
  product: 'Products',
  category: 'Category',
  profile: 'Profile',
  submit_passwordText: 'Submit Password',
  submit_verificationText: 'Submit verification',
  resendText: 'Resend',
  network_error: 'network error',
  GraphQl_error: 'GraphQl Error',
  /*--------------Authancations-----------------------*/
  get_started: 'Get Started now',
  create_account: 'Create an account or log in to explore about our app',
  login: 'Log In',
  log_in: 'Login',
  register: 'Register',
  email: 'Email',
  email_placeholder: 'Enter your email',
  password: 'Password',
  remember_me: 'Remember me',
  forgot_password_q: 'Forgot Password ?',
  login_action: 'Login',
  or: 'Or',
  no_account_q: "You don't have an account yet?",
  register_action: 'Register',
  business_name: 'Business name',
  business_registration: 'Business registration number',
  business_name_placeholder: 'Enter your business name',
  business_reg_placeholder: 'Enter your business registration no.',
  addressLine1_placeholder: 'Address line 1',
  addressLine2_placeholder: 'Address line 2',
  phone_number: 'Phone number',
  phone_number_placeholder: 'Enter your phone number',
  store_location: 'Store location',
  store_location_placeholder: 'Search store location',
  upload_store_image: 'Upload Store Image',
  confirm_password: 'Confirm password',
  iAgree: 'I agree to the',
  term_condition: ' Terms & Conditions ',
  and: 'and',
  privacy: ' Privacy Policy',
  send_code: 'Send code',
  verify: 'Verify',
  send_otp_message:
    'We have send an verification code on your registered email address.',

  /*--------------Add Product-----------------------*/
  product_name_tip:
    "Add multiple items to attract customers. We don't recommend adding single products",
  product_price_tip:
    'We recommend setting the sale price at 1/3 of the original value.',
  product_validity_tip: 'Select for your product minimum expiry date',
  /*--------------Setting-----------------------*/
  delete_account_msg: 'Are you sure you want to delete your account?',
};

/** Regex */
const REGEX = {
  EMAIL:
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  TEXT: /^[A-Za-z0-9 ]+$/,
  NUMBER: /^[0-9]{5,14}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\d]).+$/,
  // PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  // TEXT: /^[a-zA-Z]{1,50}$/,
  ALPHABET: /^[A-Za-z]+$/,
  DIGIT: /^[0-9]+$/,
};

/* length */
const LENGTHS = {
  MIN_PHONE: 7,
  MAX_PHONE: 15,
  MIN_PASSWORD: 8,
  MAX_PASSWORD: 15,
  OTP_LENGTH: 4,
  DESCRIPTION: 200,
};

const ERROR_MESSAGE = {
  /**Auth Error */
  email_requires: 'Please enter your email address',
  first_name_required: 'Please enter first name',
  business_name_required: 'Please enter your Business name',
  business_reg_required: 'Please enter your business registration no.',
  last_name_required: 'Please enter last name',
  phone_required: 'Please enter your contact number',
  store_img_required: 'Please choose your store image',
  store_address_required: 'Please select your store address',
  gender_required: 'Please select gender',
  dob_required: 'Please select dob',
  password_require: 'Please enter a password',
  current_password_require: 'Please enter current password',
  confirm_password: 'Please enter confirm password',
  new_password: 'Please enter new password',
  current_password: 'Please enter current password',
 term_and_condition: 'Please accept terms & conditions',
  otp_required: 'Please enter OTP',
  query_required: 'Please select a query',
  comment_required: 'Please enter your comment',
  name_required: 'Please enter your name',
  address_line1_required: 'Please enter your address',
  city_required: 'Please enter city',
  state_required: 'Please enter state',
  country_required: 'Please enter country',
  zipCode_required: 'Please enter zipcode/pincode',
  contactQuery_required: 'Please select subject',
  contact_message_required: 'Please enter your comment',

  /**Product Error */
  product_name: 'Please enter product name',
  product_desc: 'Please enter product description',
  product_price: 'Please enter product price',
  product_offerDate: 'Please enter product expire date',
  product_sku: 'Please enter product SKU',
  product_sustainability: 'Please enter your sustainability',
  product_bundle: 'Please enter number of product bundle',
  product_pickupOnly: 'Please select at least one delivery method',
  product_delivery: '',
  product_image: 'Please select at least 2 images of your product.',

  //regex message
  invalid_email: 'Please enter a valid email address',
  invalid_password:
    'Password should be minimum 8 characters & maximum 15 characters.',
  password_mismatch: 'Password and confirm password does not match',
  invalid_phone_number: 'Please enter a valid contact number at least 5 digits',
  invalid_dob: 'Please enter a valid dob',
  invalid_first_name:
    'First name should alphabet and between 1 to 50 characters',
  invalid_last_name: 'Last name should alphabet and between 1 to 50 characters',
  invalid_regex_name: 'Please enter a valid first name',
  invalid_regex_last_name: 'Please enter a valid last name',
  invalid_otp: 'Please enter a valid otp',
  invalid_name: 'Please enter valid name',
  invalid_county: 'Please enter valid state/county',
  invalid_city: 'Please enter valid city',
  invalid_zipCode: 'Please enter valid zipcode/pincode',
  invalid_confirmPassword: 'The passwords do not match',
  invalid_password_signup:
    'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character',
  invalid_product_image: 'You can select only 5 images',
};

const ImagePickerOptions = {
  cropping: false,
  mediaType: 'photo',
  freeStyleCropEnabled: false,
  multiple: false,
  width: 200,
  height: 200,
  avoidEmptySpaceAroundImage: true,
  hideBottomControls: false,
  compressImageQuality: 1,
  includeBase64: true,
};

const FileOptions = {
  FILE_SIZE: 3 * 1024 * 1024,

  FILE_TYPE: ['image/jpg', 'image/jpeg', 'image/png'],

  ACCEPTED_FILE_TYPES: ['jpg', 'png', 'jpeg'],

  PROFILE_TYPE: ['image/jpg', 'image/jpeg', 'image/png'],
  AUDIO_RECORDING_FILE_TYPE: 'audio/mpeg',
};
const initialProductState = {
  productName: '',
  productDesc: '',
  price: '',
  productBundle: '',
  productSku: '',
  productSustainability: '',
  stock: '',
  offerPrice: '',
  offerDate: null,
  isPickupOnlySelect: false,
  isDeliveryOnlySelect: false,
  isProductNameTip: false,
  isProductPriceTip: false,
  selectedImage: '',
  currencyCode: '',
  isProductValidityTip: false,
};

const initialLoginState = {
  email: '',
  loginPassword: '',
  showLoginPass: false,
  rememberMeCheck: false,
};

const initialRegisterState = {
  firstName: '',
  lastName: '',
  businessName: '',
  businessRegistration: '',
  email: '',
  phoneNumber: '',
  registerPassword: '',
  confirmPassword: '',
  showPassword: false,
  showConfirmPass: false,
  selectedImage: null,
  coordinates: null,
  autocompleteCoordinate: null,
  storeAddress: '',
  isConditionAccept: false,
  state: '',
  city: '',
  country: 'United Arab Emirates',
  pinCode: '',
  addressLine1: '',
  addressLine2: '',
  base64: null,
};
const statusColor = {
  approved: '#3BB349',
  Pending: COLORS.YELLOW,
  Disapproved: '#DB0B0B',
};
export {
  APP_CREDENTIALS,
  ERROR_MESSAGE,
  LENGTHS,
  REGEX,
  APP_TEXT,
  STORAGE_KEYS,
  API_STATUS,
  API_METHOD,
  GLOBAL_CONSTANT,
  ImagePickerOptions,
  initialLoginState,
  initialRegisterState,
  initialProductState,
  FileOptions,
  statusColor,
};

export const products = [
  {
    id: '1',
    title: 'Summer Flavour bundle - Refresh your taste buds',
    inventory: 'Summer Flavour bundle',
    price: 'AED 162.00',
    stock: 1241,
    status: 'Approved',
    stockStatus: 'In Stock',
    imageUrl:
      'https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1674045767/Croma%20Assets/Communication/Headphones%20and%20Earphones/Images/239031_0_ncmgtt.png',
  },
  {
    id: '2',
    title: 'Summer Flavour bundle - Refresh your taste buds',
    inventory: 'Summer Flavour bundle',
    price: 'AED 162.00',
    stock: 0,
    status: 'Pending',
    stockStatus: 'Out of Stock',
    imageUrl:
      'https://cdn.pixabay.com/photo/2020/04/12/10/57/store-5033746_640.png',
  },
  {
    id: '15',
    title: 'Summer Flavour bundle - Refresh your taste buds',
    inventory: 'Summer Flavour bundle',
    price: 'AED 162.00',
    stock: 0,
    status: 'Rejected',
    stockStatus: 'Out of Stock',
    imageUrl:
      'https://cdn.pixabay.com/photo/2020/04/12/10/57/store-5033746_640.png',
  },
  {
    id: '3',
    title: 'Summer Flavour bundle - Refresh your taste buds',
    inventory: 'Summer Flavour bundle',
    price: 'AED 162.00',
    stock: 0,
    status: 'Rejected',
    stockStatus: 'Out of Stock',
    imageUrl:
      'https://cdn.pixabay.com/photo/2020/04/12/10/57/store-5033746_640.png',
  },
  {
    id: '4',
    title: 'Summer Flavour bundle',
    inventory: 'Summer Flavour bundle',
    price: 'AED 162.00',
    stock: 0,
    status: 'Rejected',
    stockStatus: 'Out of Stock',
    imageUrl:
      'https://cdn.pixabay.com/photo/2020/04/12/10/57/store-5033746_640.png',
  },
  {
    id: '5',
    title: 'Refresh your taste buds',
    inventory: 'Summer Flavour bundle Summer Flavour bundle ',
    price: 'AED 162.00',
    stock: 0,
    status: 'Rejected',
    stockStatus: 'Out of Stock',
    imageUrl:
      'https://cdn.pixabay.com/photo/2020/04/12/10/57/store-5033746_640.png',
  },
  {
    id: '6',
    title: 'Summer your taste buds',
    inventory: 'Summer Flavour bundle',
    price: 'AED 162.00',
    stock: 0,
    status: 'Rejected',
    stockStatus: 'Out of Stock',
    imageUrl:
      'https://cdn.pixabay.com/photo/2020/04/12/10/57/store-5033746_640.png',
  },
];



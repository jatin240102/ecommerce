import {gql} from '@apollo/client';

export const VENDOR_REGISTER = gql`
  mutation (
    $firstname: String!
    $lastname: String!
    $email: String!
    $password: String!
    $ca_business_name: String!
    $ca_seller_telephone: String!
    $ca_shop_image: String!
    $ca_vendor_city: String!
    $ca_vendor_country: String!
    $ca_vendor_lat: String!
    $ca_vendor_long: String!
    $ca_vendor_postcode: String!
    $ca_vendor_state: String!
    $ca_vendor_street: String!
    $ca_business_registration: String!
    $profileurl: String!
    $is_seller: Int!
    $company_logo: ImageUpload
  ) {
    createSellerAccount(
      customer: {
        firstname: $firstname
        lastname: $lastname
        email: $email
        password: $password
        ca_business_name: $ca_business_name
        ca_seller_telephone: $ca_seller_telephone
        ca_shop_image: $ca_shop_image
        ca_vendor_city: $ca_vendor_city
        ca_vendor_country: $ca_vendor_country
        ca_vendor_lat: $ca_vendor_lat
        ca_vendor_long: $ca_vendor_long
        ca_vendor_postcode: $ca_vendor_postcode
        ca_vendor_state: $ca_vendor_state
        ca_vendor_street: $ca_vendor_street
        ca_business_registration: $ca_business_registration
        profileurl: $profileurl
        is_seller: $is_seller
        company_logo: $company_logo
      }
    ) {
      customer {
        email
        firstname
      }
    }
  }
`;

export const VENDOR_PROFILE_UPDATE = gql`
  mutation (
    $ca_business_name: String!
    $ca_seller_telephone: String!
    $ca_shop_image: String!
    $ca_vendor_city: String!
    $ca_vendor_country: String!
    $ca_vendor_lat: String!
    $ca_vendor_long: String!
    $ca_vendor_postcode: String!
    $ca_vendor_state: String!
    $ca_vendor_street: String!
    $ca_business_registration: String!
    $company_logo: ImageUpload
  ) {
    saveSellerProfile(
      input: {
        ca_business_name: $ca_business_name
        ca_seller_telephone: $ca_seller_telephone
        ca_shop_image: $ca_shop_image
        ca_vendor_city: $ca_vendor_city
        ca_vendor_country: $ca_vendor_country
        ca_vendor_lat: $ca_vendor_lat
        ca_vendor_long: $ca_vendor_long
        ca_vendor_postcode: $ca_vendor_postcode
        ca_vendor_state: $ca_vendor_state
        ca_vendor_street: $ca_vendor_street
        ca_business_registration: $ca_business_registration
        company_logo: $company_logo
      }
    ) {
      customerData {
        ca_business_name
        ca_business_registration
        ca_seller_telephone
        ca_shop_image
        ca_vendor_country
        ca_vendor_city
        ca_vendor_lat
        ca_vendor_long
        ca_vendor_postcode
        ca_vendor_state
        ca_vendor_street
        created_at
        date_of_birth
        dob
        email
        firstname
        gender
        id
        lastname
        middlename
      }
      is_seller
      profileurl
      company_logo
    }
  }
`;

export const VENDOR_LOGIN = gql`
  mutation ($email: String!, $password: String!) {
    generateCustomerToken(email: $email, password: $password) {
      customerData {
        ca_business_name
        ca_business_registration
        ca_seller_telephone
        ca_shop_image
        ca_vendor_city
        ca_vendor_lat
        ca_vendor_long
        ca_vendor_postcode
        ca_vendor_state
        ca_vendor_street
        created_at
        date_of_birth
        dob
        email
        firstname
        gender
        id
        lastname
        middlename
        ca_vendor_country
      }
      is_seller
      profileurl
      token
      seller_id
      company_logo
    }
  }
`;

export const OTP_VERIFICATION = gql`
  mutation ($otp: String!, $email: String!) {
    otpverification(input: {otp: $otp, email: $email}) {
      message
      status
    }
  }
`;

export const UPLOAD_STORE_IMAGE = gql`
  mutation ($base64_encoded_file: String!, $name: String!) {
    hkUploadFiles(
      input: [{base64_encoded_file: $base64_encoded_file, name: $name}]
    ) {
      items {
        full_path
        name
        order_path
        quote_path
        secret_key
      }
    }
  }
`;

export const RESEND_OTP_VERIFICATION = gql`
  mutation ($email: String!) {
    otpreverification(input: {email: $email}) {
      message
      status
    }
  }
`;

export const FORGOT_PASSWORD = gql`
  mutation ($email: String!) {
    restpasswordotp(input: {email: $email}) {
      message
      status
    }
  }
`;

export const RESET_PASSWORD = gql`
  mutation ($email: String!, $password: String!) {
    passwordupdate(input: {email: $email, password: $password}) {
      message
      status
    }
  }
`;

export const CHANGE_PASSWORD = gql`
  mutation ($currentPassword: String!, $newPassword: String!) {
    changeCustomerPassword(
      currentPassword: $currentPassword
      newPassword: $newPassword
    ) {
      email
    }
  }
`;

export const USER_DETAIL = gql`
  query {
    customer {
      addresses {
        city
        company
        country_code
        country_id
        customer_id
        default_billing
        default_shipping
        fax
        firstname
        id
        lastname
        middlename
        postcode
        prefix
        region_id
        street
        suffix
        telephone
        vat_id
      }
      allow_remote_shopping_assistance
      confirmation_status
      created_at
      date_of_birth
      default_billing
      default_shipping
      dob
      email
      firstname
      gender
      group_id
      id
      is_subscribed
      lastname
      middlename
    }
  }
`;

export const GET_USER_STORE = gql`
  query ($email: String!) {
    userStoreInfo(email: $email) {
      store
    }
  }
`;

export const DELETE_VENDOR_ACCOUNT = gql`
  query {
    deleteSellerToEmailAdmin {
      message
    }
  }
`;

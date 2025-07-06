import {
  Image,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import {IMAGES} from '../../constant/imagePath';
import AppLayout from '../../components/layouts/AppLayout';
import {ms, mvs, s} from 'react-native-size-matters';
import {FONTS, FONTSIZE} from '../../constant/fonts';
import {COLORS} from '../../constant/color';
import {forgotFormValidate, showToast, sWidth} from '../../utils/global';
import TextInputBox from '../../components/common/TextInputBox';
import GradientButton from '../../components/common/GradientButton ';
import {hideLoader, showLoader} from '../../components/common/AppLoader';
import {useMutation} from '@apollo/client';
import {FORGOT_PASSWORD} from '../../queries/AuthQueries';
import {API_STATUS, APP_TEXT} from '../../constant/globalConstants';

const initialState = {
  email: '',
};

const ForgotPassword = ({navigation}) => {
  const [forgotState, setForgotState] = useState(initialState);
  const [errors, setErrors] = useState(initialState);

  const onLoginInputChange = (key, value) => {
    setForgotState({...forgotState, [key]: value});
    setErrors({...errors, [key]: ''});
  };

  const [restpasswordotp] = useMutation(FORGOT_PASSWORD, {
    onCompleted: data => {
      hideLoader();
      if (
        data &&
        data?.restpasswordotp &&
        data?.restpasswordotp?.status === API_STATUS.ERROR
      ) {
        setErrors(prevState => ({
          ...prevState,
          email: data?.restpasswordotp?.message,
        }));
      } else if (
        data &&
        data?.restpasswordotp &&
        data?.restpasswordotp?.status === API_STATUS.SUCCESS
      ) {
        showToast(data?.restpasswordotp?.message);
        navigation.navigate('OtpVerification', {
          from: 'forgotPassword',
          email: forgotState.email,
        });
      }
    },
    onError: error => {
      hideLoader();
      if (error.graphQLErrors) {
        error.graphQLErrors.forEach(e => {
          if (e.message) {
            showToast(e.message);
          } else {
            showToast(APP_TEXT.GraphQl_error);
          }
        });
        console.log('GraphQL errors:', JSON.stringify(error.graphQLErrors));
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
    const isValid = forgotFormValidate(forgotState, setErrors);
    if (isValid) {
      showLoader();
      restpasswordotp({
        variables: {
          email: forgotState.email,
        },
      });

      // navigation.navigate('OtpVerification', {
      //   from: 'forgotPassword',
      //   email: forgotState.email,
      // });
    }
  };

  return (
    <AppLayout containerStyle={{paddingHorizontal: 0}}>
      <ScrollView
        contentContainerStyle={{paddingBottom: 20}}
        bounces={false}
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

          <Text style={styles.getStartedText}>Forgot Password</Text>
          <Text style={styles.getStartedDesc} numberOfLines={2}>
            Forgot your password? Reset it here to regain access to your
            account.
          </Text>
        </ImageBackground>

        <View style={{paddingHorizontal: 15, marginTop: mvs(25)}}>
          <Text style={styles.defaultText}>
            Please Enter Your Email Address To Receive a Verification Code.
          </Text>
          <TextInputBox
            containerStyle={{marginTop: mvs(28)}}
            title={'Email'}
            placeholder={'Email your email'}
            value={forgotState.email}
            onChangeText={text => {
              onLoginInputChange('email', text);
            }}
            error={errors.email}
            keyboardType={'email-address'}
          />

          <GradientButton
            title="Send Code"
            onPress={() => handleSubmit()}
            mainContainer={{marginTop: mvs(40), paddingHorizontal: ms(10)}}
            buttonTxt={{fontSize: FONTSIZE.XL}}
          />
        </View>
      </ScrollView>
    </AppLayout>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  getStartedText: {
    fontSize: s(26),
    fontFamily: FONTS.workSansSemiBold,
    color: COLORS.WHITE,
    textAlign: 'left',
    marginTop: mvs(32),
  },
  getStartedDesc: {
    fontSize: FONTSIZE.XL,
    fontFamily: FONTS.workSansRegular,
    color: COLORS.WHITE,
    textAlign: 'left',
  },

  defaultText: {
    color: COLORS.BLACK,
    textAlign: 'center',
    fontSize: FONTSIZE.XL,
    fontFamily: FONTS.workSansSemiBold,
    marginTop: mvs(50),
    alignItems: 'center',
    paddingHorizontal: 28,
  },
});

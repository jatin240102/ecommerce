import {
  View,
  StyleSheet,
  Text,
  Keyboard,
  ImageBackground,
  Platform,
  StatusBar,
  Image,
  ScrollView,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {ms, mvs, s, vs} from 'react-native-size-matters';
import OTPTextInput from 'react-native-otp-textinput';
import {StackActions, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLayout from '../../components/layouts/AppLayout';
import GradientButton from '../../components/common/GradientButton ';
import {FONTS, FONTSIZE} from '../../constant/fonts';
import {
  formatOtpTimer,
  returnText,
  showToast,
  sWidth,
} from '../../utils/global';
import {COLORS} from '../../constant/color';
import {IMAGES} from '../../constant/imagePath';
import {useMutation} from '@apollo/client';
import {
  OTP_VERIFICATION,
  RESEND_OTP_VERIFICATION,
} from '../../queries/AuthQueries';
import {
  API_STATUS,
  APP_TEXT,
  STORAGE_KEYS,
} from '../../constant/globalConstants';
import {hideLoader, showLoader} from '../../components/common/AppLoader';

const initValue = {
  otp: '',
  otpCount: 4,
  isResetVisible: false,
};

export default function OtpVerification({navigation, route}) {
  const {from, email} = route?.params;
  const navigate = useNavigation();
  console.log('from---', from);
  const [state, setState] = useState(initValue);
  const [timer, setTimer] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const otpRef = useRef();
  const [otpError, setOtpError] = useState('');

  // useEffect to reset state on focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setState(initValue);
    });
    return unsubscribe;
  }, [navigation]);

  // useEffect to handle the countdown timer
  useEffect(() => {
    let interval;
    if (isTimerActive) {
      interval = setInterval(() => {
        if (timer > 0) {
          setTimer(prevTimer => prevTimer - 1);
        } else {
          clearInterval(interval);
          setIsTimerActive(false);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isTimerActive, timer]);

  const onInputChange = (key, value) => {
    // console.log(otpRef.current, 'otpRef.current');
    setOtpError('');
    setState({...state, [key]: value});
    if (value.length === state.otpCount) {
      Keyboard.dismiss();
    }
  };

  const removeRememberMe = async () => {
    await AsyncStorage.removeItem(STORAGE_KEYS.REMEMBER_ME_DATA);
  };

  // Verification OTP
  const [otpverification] = useMutation(OTP_VERIFICATION, {
    onCompleted: data => {
      hideLoader();
      if (
        data &&
        data?.otpverification &&
        data?.otpverification?.status === API_STATUS.ERROR
      ) {
        otpRef.current && otpRef.current.clear();
        showToast(data?.otpverification?.message);
      } else if (
        data &&
        data?.otpverification &&
        data?.otpverification?.status === API_STATUS.SUCCESS
      ) {
        if (from === 'forgotPassword') {
          navigation.replace('ResetPassword', {email: email});
        } else if (from === 'register') {
          removeRememberMe();
          navigation.replace('Authentication');
        }
        otpRef.current && otpRef.current.clear();
        showToast(data?.otpverification?.message);
        console.log('OTP success');
      }
    },
    onError: error => {
      otpRef.current && otpRef.current.clear();
      hideLoader();
      console.log('Mutation Error:', error);
      if (error.graphQLErrors) {
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
        console.log('Network error:', error.networkError);
      }
    },
  });

  // Resend OTP
  const [otpreverification] = useMutation(RESEND_OTP_VERIFICATION, {
    onCompleted: data => {
      hideLoader();
      if (
        data &&
        data?.otpreverification &&
        data?.otpreverification?.status === API_STATUS.ERROR
      ) {
        showToast(data?.otpreverification?.message);
        otpRef.current && otpRef.current.clear();
      } else if (
        data &&
        data?.otpreverification &&
        data?.otpreverification?.status === API_STATUS.SUCCESS
      ) {
        showToast(data?.otpreverification?.message);
        otpRef.current && otpRef.current.clear();
      }
      console.log('Mutation Resend:', JSON.stringify(data));
    },
    onError: error => {
      otpRef.current && otpRef.current.clear();
      hideLoader();
      console.log('Mutation Error Resend:', error);
      if (error.networkError) {
        if (error.networkError.message) {
          showToast(error.networkError?.message);
        } else {
          showToast(APP_TEXT.network_error);
        }
        console.log('Network error Resend:', error.networkError);
      }
      if (error.graphQLErrors) {
        console.log('GraphQL errors Resend:', error.graphQLErrors);
      }
    },
  });

  const handleResendOTP = () => {
    if (!isTimerActive) {
      setState({...initValue});
      setTimer(30);
      setIsTimerActive(true);
      otpRef.current && otpRef.current.clear();

      if (from === 'register' || from === 'login') {
        showLoader();
        otpreverification({
          variables: {
            email: email,
          },
        });
      } else if (from === 'forgotPassword') {
        showLoader();
        otpreverification({
          variables: {
            email: email,
          },
        });
      } else if (from === 'changePassword') {
        // data.password = route?.params?.password;
      }
    }
  };

  // Function to handle form submission
  console.log('from', from, state.otp, email);
  const handleSubmit = () => {
    if (state.otp.length === state.otpCount) {
      if (from === 'register' || from === 'forgotPassword') {
        showLoader();
        otpverification({
          variables: {
            otp: state.otp,
            email: email,
          },
        });
      }
    } else {
      setOtpError('Please Enter the OTP');
    }
  };

  const textContent = returnText(from);
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

          <Text style={styles.getStartedText}>{textContent.h1}</Text>
          <Text style={styles.getStartedDesc} numberOfLines={2}>
            {textContent.desc}
          </Text>
        </ImageBackground>
        <View
          style={{
            marginHorizontal: ms(18),
            flex: 1,
          }}>
          <Text style={styles.otpText}>{textContent.details}</Text>
          <OTPTextInput
            ref={otpRef}
            containerStyle={{marginTop: mvs(40)}}
            inputCount={state.otpCount}
            autoFocus={true}
            handleTextChange={text => {
              onInputChange('otp', text);
            }}
            textInputStyle={styles.otpInput}
            tintColor={COLORS.PRIMARY}
            offTintColor={COLORS.TITLE}
            keyboardType="number-pad"
            inputCellLength={1}
          />
          {otpError && (
            <Text style={styles.errorText} numberOfLines={2}>
              {otpError}
            </Text>
          )}
          <GradientButton
            title="Verify"
            onPress={() => handleSubmit()}
            mainContainer={{marginTop: mvs(40), paddingHorizontal: ms(10)}}
            buttonTxt={{fontSize: FONTSIZE.XL}}
          />

          {!isTimerActive ? (
            <Text
              onPress={() => handleResendOTP()}
              style={[
                styles.footerText,
                {
                  fontSize: FONTSIZE.XL,
                  borderBottomColor: COLORS.PRIMARY,
                  borderBottomWidth: 0.5,
                  alignSelf: 'center',
                },
              ]}>
              Resend Code
            </Text>
          ) : (
            <Text style={styles.footerText}>
              Resend Code in? {''}
              <Text style={styles.resendText}>
                {`${formatOtpTimer(timer)}`}
              </Text>
              <Text style={[styles.resendText, {color: COLORS.BLACK}]}> s</Text>
            </Text>
          )}
        </View>
      </ScrollView>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  textContainer: {
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verificationText: {
    fontFamily: FONTS.workSansSemiBold,
    fontSize: s(30),
    color: 'black',
  },
  otpText: {
    color: COLORS.BLACK,
    textAlign: 'center',
    fontSize: FONTSIZE.XL,
    fontFamily: FONTS.workSansSemiBold,
    marginTop: mvs(50),
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  otpTimer: {
    fontFamily: FONTS.workSansMedium,
    color: 'pink',
    fontSize: FONTSIZE.XL,
    textAlign: 'center',
  },
  footerText: {
    marginTop: mvs(10),
    textAlign: 'center',
    fontSize: FONTSIZE.L,
    fontFamily: FONTS.workSansMedium,
    color: COLORS.BLACK,
  },
  resendText: {
    fontFamily: FONTS.workSansMedium,
    fontSize: FONTSIZE.L,
    textAlign: 'center',
    color: COLORS.PRIMARY,
  },
  btnContainer: {flex: 1, marginTop: mvs(50)},

  otpInput: {
    fontFamily: FONTS.workSansMedium,
    borderWidth: 1,
    borderBottomWidth: 1,
    borderRadius: s(10),
    height: ms(55),
    width: ms(70),
    textAlign: 'center',
    fontSize: FONTSIZE.XXXL,
    color: 'black',
    // backgroundColor:'#14604c14'
  },
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
  errorText: {
    color: COLORS.ERROR,
    fontFamily: FONTS.workSansRegular,
    fontSize: FONTSIZE.M,
    // marginTop: Platform.OS === 'ios' ? mvs(5) : 10,
  },
});

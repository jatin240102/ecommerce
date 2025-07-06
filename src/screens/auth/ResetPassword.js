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
import {resetFormValidate, showToast, sWidth} from '../../utils/global';
import TextInputBox from '../../components/common/TextInputBox';
import GradientButton from '../../components/common/GradientButton ';
import {RESET_PASSWORD} from '../../queries/AuthQueries';
import {useMutation} from '@apollo/client';
import {API_STATUS, APP_TEXT} from '../../constant/globalConstants';
import {hideLoader, showLoader} from '../../components/common/AppLoader';

const initialState = {
  password: '',
  confirmPassword: '',
  showConfirmPass: false,
  showPassword: false,
};

const ResetPassword = ({navigation, route}) => {
  const {email} = route?.params;

  const [resetState, setResetState] = useState(initialState);
  const [errors, setErrors] = useState(initialState);

  const onInputChange = (key, value) => {
    setResetState({...resetState, [key]: value});
    setErrors({...errors, [key]: ''});
  };

  const [passwordupdate] = useMutation(RESET_PASSWORD, {
    onCompleted: data => {
      hideLoader();
      if (
        data &&
        data?.passwordupdate &&
        data?.passwordupdate?.status === API_STATUS.ERROR
      ) {
        showToast(data?.passwordupdate?.message);
      } else if (
        data &&
        data?.passwordupdate &&
        data?.passwordupdate?.status === API_STATUS.SUCCESS
      ) {
        navigation.navigate('Authentication');
        showToast(data?.passwordupdate?.message);
      }
      console.log('Mutation Success:', JSON.stringify(data));
    },
    onError: error => {
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
        console.log('GraphQL errors:', error.graphQLErrors);
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

  const handleSubmit = () => {
    const isValid = resetFormValidate(resetState, setErrors);
    if (isValid) {
      showLoader();
      passwordupdate({
        variables: {
          email: email,
          password: resetState.password,
        },
      });
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

          <Text style={styles.getStartedText}>Set Enter Password</Text>
          <Text style={styles.getStartedDesc} numberOfLines={2}>
            Set a new one here to regain access to your account.
          </Text>
        </ImageBackground>

        <View style={{paddingHorizontal: ms(15), marginTop: mvs(10)}}>
          <Text style={styles.defaultText}>
            Your new password must be different from previously used password.
          </Text>
          <TextInputBox
            title={'Password'}
            containerStyle={{marginTop: mvs(25)}}
            secureTextEntry={!resetState.showPassword}
            onRightIconPress={() => {
              onInputChange('showPassword', !resetState.showPassword);
            }}
            rightIcon={
              !resetState.showPassword
                ? IMAGES.ic_hidePassword
                : IMAGES.ic_showPassword
            }
            rightIconImageStyle={{height: mvs(22), width: ms(25)}}
            onChangeText={text => {
              onInputChange('password', text);
            }}
            value={resetState.password}
            error={errors.password}
          />
          <TextInputBox
            title={'Confirm Password'}
            containerStyle={{marginTop: mvs(18)}}
            secureTextEntry={!resetState.showConfirmPass}
            onRightIconPress={() => {
              onInputChange('showConfirmPass', !resetState.showConfirmPass);
            }}
            rightIcon={
              !resetState.showConfirmPass
                ? IMAGES.ic_hidePassword
                : IMAGES.ic_showPassword
            }
            rightIconImageStyle={{height: mvs(22), width: ms(25)}}
            onChangeText={text => {
              onInputChange('confirmPassword', text);
            }}
            value={resetState.confirmPassword}
            error={errors.confirmPassword}
          />

          <GradientButton
            title="Reset Password"
            onPress={() => handleSubmit()}
            mainContainer={{marginTop: mvs(40), paddingHorizontal: ms(10)}}
            buttonTxt={{fontSize: FONTSIZE.XL}}
          />
        </View>
      </ScrollView>
    </AppLayout>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
  getStartedText: {
    fontSize: s(24),
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

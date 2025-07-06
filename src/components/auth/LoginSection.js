import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import GradientButton from '../common/GradientButton ';
import {FONTSIZE} from '../../constant/fonts';
import {ms, mvs} from 'react-native-size-matters';
import {IMAGES} from '../../constant/imagePath';
import TextInputBox from '../common/TextInputBox';

const LoginSection = ({
  loginState,
  onLoginInputChange,
  errors,
  navigation,
  onRegisterClick,
  handleSubmit,
  styles,
}) => {
  return (
    <>
      <View style={{paddingHorizontal: 15}}>
        <TextInputBox
          containerStyle={{marginTop: mvs(28)}}
          title={'Email'}
          value={loginState.email}
          onChangeText={text => {
            onLoginInputChange('email', text);
          }}
          error={errors.email}
          keyboardType={'email-address'}
        />
        <TextInputBox
          title={'Password'}
          containerStyle={{marginTop: mvs(20)}}
          onChangeText={text => {
            onLoginInputChange('loginPassword', text);
          }}
          secureTextEntry={!loginState.showLoginPass}
          onRightIconPress={() => {
            onLoginInputChange('showLoginPass', !loginState.showLoginPass);
          }}
          rightIcon={
            !loginState.showLoginPass
              ? IMAGES.ic_hidePassword
              : IMAGES.ic_showPassword
          }
          rightIconImageStyle={{height: mvs(22), width: ms(25)}}
          value={loginState.loginPassword}
          error={errors.loginPassword}
        />
      </View>
      <View style={styles.checkMainContainer}>
        <TouchableOpacity
          onPress={() => {
            onLoginInputChange('rememberMeCheck', !loginState.rememberMeCheck);
          }}
          activeOpacity={1}
          style={styles.checkImgContainer}>
          <Image
            source={
              loginState.rememberMeCheck
                ? IMAGES.ic_check_fill
                : IMAGES.ic_empty_check
            }
            style={styles.checkImage}
          />
          <Text style={styles.rememberText}>{'Remember me'}</Text>
        </TouchableOpacity>

        <Text
          style={styles.forgotPasswordLink}
          onPress={() => navigation.navigate('ForgotPassword')}>
          {'Forgot Password ?'}
        </Text>
      </View>
      <GradientButton
        title="Login"
        onPress={() => handleSubmit()}
        buttonTxt={{fontSize: FONTSIZE.L}}
        mainContainer={{paddingHorizontal: ms(10), marginTop: mvs(30)}}
      />
      <View style={styles.continueButtonContainer}>
        <View style={styles.flatLine} />
        <Text style={styles.orText}>{'Or'}</Text>
        <View style={styles.flatLine} />
      </View>
      <View style={styles.bottomContainer}>
        <Text style={styles.anyAccountText}>
          You don't have an account yet?
        </Text>
        <Text style={styles.registerText} onPress={onRegisterClick()}>
          Register
        </Text>
      </View>
    </>
  );
};

export default LoginSection;

const styles = StyleSheet.create({});

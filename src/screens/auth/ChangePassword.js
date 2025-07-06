import {Image, StyleSheet, View, ScrollView, Pressable} from 'react-native';
import React, {useState} from 'react';
import {IMAGES} from '../../constant/imagePath';
import AppLayout from '../../components/layouts/AppLayout';
import {ms, mvs, s} from 'react-native-size-matters';
import {FONTSIZE} from '../../constant/fonts';
import {changePasswordFormValidate, showToast} from '../../utils/global';
import TextInputBox from '../../components/common/TextInputBox';
import GradientButton from '../../components/common/GradientButton ';
import AppHeader from '../../components/common/AppHeader';
import {hideLoader, showLoader} from '../../components/common/AppLoader';
import {CHANGE_PASSWORD} from '../../queries/AuthQueries';
import {useMutation} from '@apollo/client';
import { APP_TEXT } from '../../constant/globalConstants';

const initialState = {
  currentPassword: '',
  password: '',
  confirmPassword: '',
  showConfirmPass: false,
  showPassword: false,
  showCurrentPass: false,
};

const ChangePassword = ({navigation}) => {
  const [changeState, setChangeState] = useState(initialState);
  const [errors, setErrors] = useState(initialState);

  const onInputChange = (key, value) => {
    setChangeState({...changeState, [key]: value});
    setErrors({...errors, [key]: ''});
  };

  const [changeCustomerPassword] = useMutation(CHANGE_PASSWORD, {
    onCompleted: async data => {
      console.log('Mutation Success:', JSON.stringify(data));
      hideLoader();
      if (
        data &&
        data?.changeCustomerPassword &&
        data?.changeCustomerPassword?.email
      ) {
        navigation.navigate('Dashboard');
        showToast('Your Password successfully change.');
      } else {
        console.log('navigation failed');
      }
    },

    onError: error => {
      hideLoader();
      if (error.graphQLErrors) {
        console.log('error.graphQLErrors', error.graphQLErrors);
        error.graphQLErrors.find(e =>
          setErrors(prevState => ({
            ...prevState,
            currentPassword: e.message,
          })),
        );
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
    const isValid = changePasswordFormValidate(changeState, setErrors);
    if (isValid) {
      showLoader();
      changeCustomerPassword({
        variables: {
          currentPassword: changeState.currentPassword,
          newPassword: changeState.password,
        },
      });
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
        headerTitle={'Change Password'}
      />
      <ScrollView
        style={{paddingBottom: 20, backgroundColor: 'white'}}
        bounces={false}
        showsVerticalScrollIndicator={false}>
        <View style={{paddingHorizontal: ms(15), marginTop: mvs(10)}}>
          <TextInputBox
            title={'Current Password'}
            containerStyle={{marginTop: mvs(25)}}
            secureTextEntry={!changeState.showCurrentPass}
            onRightIconPress={() => {
              onInputChange('showCurrentPass', !changeState.showCurrentPass);
            }}
            rightIcon={
              !changeState.showCurrentPass
                ? IMAGES.ic_hidePassword
                : IMAGES.ic_showPassword
            }
            rightIconImageStyle={{height: mvs(22), width: ms(25)}}
            onChangeText={text => {
              onInputChange('currentPassword', text);
            }}
            value={changeState.currentPassword}
            error={errors.currentPassword}
          />
          <TextInputBox
            title={'Password'}
            containerStyle={{marginTop: mvs(25)}}
            secureTextEntry={!changeState.showPassword}
            onRightIconPress={() => {
              onInputChange('showPassword', !changeState.showPassword);
            }}
            rightIcon={
              !changeState.showPassword
                ? IMAGES.ic_hidePassword
                : IMAGES.ic_showPassword
            }
            rightIconImageStyle={{height: mvs(22), width: ms(25)}}
            onChangeText={text => {
              onInputChange('password', text);
            }}
            value={changeState.password}
            error={errors.password}
          />
          <TextInputBox
            title={'Confirm Password'}
            containerStyle={{marginTop: mvs(18)}}
            secureTextEntry={!changeState.showConfirmPass}
            onRightIconPress={() => {
              onInputChange('showConfirmPass', !changeState.showConfirmPass);
            }}
            rightIcon={
              !changeState.showConfirmPass
                ? IMAGES.ic_hidePassword
                : IMAGES.ic_showPassword
            }
            rightIconImageStyle={{height: mvs(22), width: ms(25)}}
            onChangeText={text => {
              onInputChange('confirmPassword', text);
            }}
            value={changeState.confirmPassword}
            error={errors.confirmPassword}
          />

          <GradientButton
            title="Change Password"
            onPress={() => handleSubmit()}
            mainContainer={{marginTop: mvs(40), paddingHorizontal: ms(10)}}
            buttonTxt={{fontSize: FONTSIZE.XL}}
          />

          {/* <SingleSelectDropdown
            data={[]}
            isSearch={true}
            dropdownTitle={'select'}
            onItemSelect={item => {
              console.log('sdhg');
            }}
            selectedValue={''}
            errorMessage={'new error'}
            label={'Select'}
          /> */}
        </View>
      </ScrollView>
    </AppLayout>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: ms(15),
  },
  layout: {
    paddingHorizontal: ms(0),
  },
});

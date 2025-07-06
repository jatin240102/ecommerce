import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
  TouchableOpacity,
  View,
  Text,
  Switch,
} from 'react-native';
import {ms, mvs, s} from 'react-native-size-matters';
import {IMAGES} from '../../constant/imagePath';
import AppHeader from '../../components/common/AppHeader';
import {COLORS} from '../../constant/color';
import {FONTS, FONTSIZE} from '../../constant/fonts';
import AppLayout from '../../components/layouts/AppLayout';
import ButtonModal from '../../components/common/ButtonModal';
import {APP_TEXT} from '../../constant/globalConstants';
import {useLazyQuery} from '@apollo/client';
import {DELETE_VENDOR_ACCOUNT} from '../../queries/AuthQueries';
import {showToast} from '../../utils/global';
import {hideLoader, showLoader} from '../../components/common/AppLoader';

const Settings = ({navigation}) => {
  const [isDeleteAccount, setIsDeleteAccount] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isNotifyEnabled, setIsNotifyEnabled] = useState(true);

  // const toggleSwitch = () => setIsEnabled(!isEnabled);
  const toggleNotifySwitch = () => setIsNotifyEnabled(!isNotifyEnabled);

  const [deleteSellerToEmailAdmin, {loading: statusLoading}] = useLazyQuery(
    DELETE_VENDOR_ACCOUNT,
    {
      onCompleted: response => {
        hideLoader();

        // console.log('response', response)
        if (response && response?.deleteSellerToEmailAdmin) {
          console.log(
            'response?.userStoreInfo?.store',
            response?.deleteSellerToEmailAdmin,
          );
          navigation.navigate('Dashboard')
          showToast(response?.deleteSellerToEmailAdmin?.message);
          setIsDeleteAccount(false);
        } else {
          console.log('store not fill-----------------');
        }
        // showToast();
      },
      onError: error => {
        setIsDeleteAccount(false);
        hideLoader();
        if (error.graphQLErrors) {
          error.graphQLErrors.forEach(err => showToast(err.message));
        }
        if (error.networkError) {
          showToast(error.networkError.message);
        }
      },
      notifyOnNetworkStatusChange: true,
    },
  );

  const handleDeleteAccRequest = () => {
    setIsDeleteAccount(false);
    showLoader();
    deleteSellerToEmailAdmin();
  };

  useEffect(() => {
    if (statusLoading) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [statusLoading]);
  return (
    <AppLayout containerStyle={styles.container}>
      <AppHeader
        containerStyle={{paddingHorizontal: ms(15)}}
        headerTitle={'Settings'}
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
            activeOpacity={0.9}
            onPress={() => navigation.navigate('Notifications')}>
            <Image
              source={IMAGES.ic_notification}
              style={{height: mvs(20), width: ms(20), tintColor: COLORS.WHITE}}
              resizeMode="contain"
            />
          </TouchableOpacity>
        }
      />

      {isDeleteAccount && (
        <ButtonModal
          isOpen={isDeleteAccount}
          onFirstBtnClick={() => setIsDeleteAccount(false)}
          title={APP_TEXT.delete_account_msg}
          onSecondBtnClick={() => handleDeleteAccRequest()}
          secondBtnText="Delete"
        />
      )}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingHorizontal: ms(16)}}>
        <View style={{marginVertical: mvs(16)}}>
          <Text style={styles.sectionTitle}>Settings</Text>
          {/* <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.8}
            onPress={() => {}}>
            <Text style={styles.menuItemText}>{'Show Updates'}</Text>
            <Switch
              trackColor={{false: '#767577', true: COLORS.PRIMARY}}
              thumbColor={isEnabled ? '#ffffff' : '#f4f3f4'}
              ios_backgroundColor={COLORS.PRIMARY}
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </TouchableOpacity> */}
          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={1}
            onPress={() => {}}>
            <Text style={styles.menuItemText}>{'Notifications'}</Text>
            <Switch
              trackColor={{false: '#767577', true: COLORS.PRIMARY}}
              thumbColor={isNotifyEnabled ? '#ffffff' : '#f4f3f4'}
              ios_backgroundColor={COLORS.PRIMARY}
              onValueChange={toggleNotifySwitch}
              value={isNotifyEnabled}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteMenu}
            activeOpacity={1}
            onPress={() => setIsDeleteAccount(true)}>
            <Text style={styles.menuItemText}>{'Delete your account'}</Text>
            <Image
              style={{
                height: mvs(20),
                width: mvs(20),
                resizeMode: 'contain',
                marginRight: ms(5),
              }}
              resizeMode="contain"
              source={IMAGES.ic_rightArrow}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: 0,
  },

  sectionTitle: {
    fontSize: FONTSIZE.XL,
    fontFamily: FONTS.workSansSemiBold,
    color: COLORS.BLACK,
    marginBottom: 6,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: ms(10),
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: s(14),
    borderColor: COLORS.BORDER,
    marginTop: ms(16),
  },
  deleteMenu: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: ms(12),
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: s(14),
    borderColor: COLORS.BORDER,
    marginTop: ms(16),
  },
  menuItemText: {
    flex: 1,
    fontSize: FONTSIZE.L,
    fontFamily: FONTS.workSansMedium,
    marginLeft: ms(16),
    color: COLORS.BLACK,
  },
});

export default Settings;

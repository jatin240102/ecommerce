import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {COLORS} from '../../constant/color';
import LinearGradient from 'react-native-linear-gradient';
import {ms, mvs, s} from 'react-native-size-matters';
import {IMAGES} from '../../constant/imagePath';
import {FONTS, FONTSIZE} from '../../constant/fonts';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GLOBAL_CONSTANT, STORAGE_KEYS} from '../../constant/globalConstants';
import ButtonModal from '../common/ButtonModal';
import {useGlobalData} from '../../context/AppContext';

const menuItems = [
  {
    title: 'Edit Store',
    screen: 'EditStore',
    image: IMAGES.ic_editIcon,
  },
  {title: 'Products', screen: 'ProductDashboard', image: IMAGES.ic_products},

  {
    title: 'Change Password',
    screen: 'ChangePassword',
    image: IMAGES.ic_changePassword,
  },
  {
    title: 'Manage Order',
    screen: 'OrderDashboard',
    image: IMAGES.ic_myOrder,
  },
  {title: 'Transaction', screen: 'Transaction', image: IMAGES.ic_transaction},
  {
    title: 'Notification',
    screen: 'Notifications',
    image: IMAGES.ic_notification,
  },
  {
    title: 'Contact Us',
    screen: 'ContactUs',
    image: IMAGES.ic_contact,
  },
  {
    title: 'About Us',
    screen: 'CmsScreen',
    image: IMAGES.ic_aboutUs,
    params: {slug: 'about-us'},
  },
  {title: 'Settings', screen: 'Settings', image: IMAGES.ic_setting},

  {title: 'Logout', image: IMAGES.ic_logout},
];

const ItemComponent = ({title, image, onPress}) => (
  <TouchableOpacity
    style={styles.menuItem}
    activeOpacity={0.9}
    onPress={onPress}>
    <Image
      style={{
        height: mvs(22),
        width: mvs(22),
        resizeMode: 'contain',
        tintColor: COLORS.WHITE,
      }}
      source={image}
    />
    <Text style={styles.menuItemText}>{title}</Text>
  </TouchableOpacity>
);

const DrawerContent = ({navigation}) => {
  const {
    userData,
    setAllOrderCount,
    setOrderDetailHeadTitle,
    setCompletedOrderCount,
    setPendingOrderCount,
    setCancelOrderCount,
    setProcessingOrderCount,
  } = useGlobalData();

  const appVersion = DeviceInfo.getVersion();
  const [isLogout, setIsLogout] = useState(false);
  const [imageError, setImageError] = useState(false);

  const onLogout = async () => {
    setIsLogout(false);
    await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_COUNTRY);
    navigation.replace('Authentication');
    setAllOrderCount(0);
    setOrderDetailHeadTitle(0);
    setCompletedOrderCount(0);
    setPendingOrderCount(0);
    setCancelOrderCount(0);
    setProcessingOrderCount(0);
  };
  return (
    <LinearGradient
      style={{flex: 1}}
      colors={['#1A7F65', '#115543']}
      start={{x: 0.2, y: 0}}
      end={{x: 0.2, y: 1}}>
      {isLogout && (
        <ButtonModal
          isOpen={isLogout}
          title="Are you sure you want to logout your account?"
          onFirstBtnClick={() => setIsLogout(false)}
          onSecondBtnClick={() => onLogout()}
          secondBtnText="Logout"
        />
      )}
      <View style={styles.profileHeader}>
        <Image
          source={
            imageError
              ? IMAGES.ic_defaultImage
              : {
                  uri: userData?.company_logo
                    ? userData?.company_logo
                    : 'https://cdn.pixabay.com/photo/2020/04/12/10/57/store-5033746_640.png',
                }
          }
          onError={() => setImageError(true)}
          style={styles.profileImage}
        />
        <View style={styles.userInfo}>
          {userData?.ca_business_name && (
            <Text style={styles.userName} numberOfLines={2}>
              {userData?.ca_business_name}
              {/* {`${userData?.firstname} ${userData?.lastname}`} */}
            </Text>
          )}
          {userData && (
            <Text style={styles.userEmail} numberOfLines={2}>
              {userData?.email}
            </Text>
          )}
        </View>
      </View>
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 30}}
        style={styles.scrollContainer}>
        <View style={{marginTop: 0}}>
          {menuItems.map((item, index) => (
            <ItemComponent
              key={index}
              title={item.title}
              image={item.image}
              onPress={() => {
                if (item.title === 'Logout') {
                  setIsLogout(true);
                } else if (item.screen) {
                  navigation.navigate(item.screen, item.params);
                }
                navigation.closeDrawer();
              }}
            />
          ))}
        </View>
        <View style={styles.flatLine} />
        <Text style={styles.versionText}>App Version: {appVersion}</Text>
      </ScrollView>
    </LinearGradient>
  );
};

export default DrawerContent;

const styles = StyleSheet.create({
  scrollContainer: {
    // marginTop: StatusBar.currentHeight + mvs(50),
    paddingHorizontal: ms(18),
    marginBottom: mvs(10),
    flex: 1,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: mvs(20),
    marginTop: StatusBar.currentHeight + mvs(50),
    paddingHorizontal: ms(18),
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: s(100),
    borderWidth: 1,
    borderColor: COLORS.WHITE,
  },
  userInfo: {
    flex: 1,
    marginLeft: ms(16),
  },
  userName: {
    fontSize: FONTSIZE.XL,
    fontFamily: FONTS.workSansSemiBold,
    color: COLORS.WHITE,
    textTransform: 'capitalize',
  },
  userEmail: {
    fontSize: FONTSIZE.L,
    fontFamily: FONTS.workSansMedium,
    color: COLORS.WHITE,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: ms(16),
    paddingHorizontal: 10,
    // borderWidth: 1,
    // borderRadius: s(14),
    // borderColor: COLORS.BORDER,
    // marginTop: ms(16),
  },
  menuItemText: {
    flex: 1,
    fontSize: FONTSIZE.XL,
    fontFamily: FONTS.workSansSemiBold,
    marginLeft: ms(16),
    color: COLORS.WHITE,
    textTransform: 'capitalize',
  },
  versionText: {
    color: COLORS.WHITE,
    fontSize: FONTSIZE.M,
    fontFamily: FONTS.workSansRegular,
    marginTop: mvs(10),
    textAlign: 'left',
  },
  flatLine: {
    height: 0.5,
    backgroundColor: COLORS.BORDER,
    marginTop: mvs(20),
  },
});

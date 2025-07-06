import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {ms, mvs, s} from 'react-native-size-matters';
import {IMAGES} from '../../constant/imagePath';
import AppHeader from '../../components/common/AppHeader';
import {COLORS} from '../../constant/color';
import {FONTS, FONTSIZE} from '../../constant/fonts';
import AppLayout from '../../components/layouts/AppLayout';
import DeviceInfo from 'react-native-device-info';

const MyStore = () => {
  const navigation = useNavigation();
  const appVersion = DeviceInfo.getVersion();

  const menuItems = [
    {title: 'About Us', screen: 'CmsScreen', image: IMAGES.ic_aboutUs,params:{slug: 'about Us'}},
    {
      title: 'Change Password',
      screen: 'ChangePassword',
      image: IMAGES.ic_changePassword,
    },
    {title: 'Products', screen: 'Products', image: IMAGES.ic_products},
    {
      title: 'My Order',
      screen: 'MyOrder',
      image: IMAGES.ic_myOrder,
    },
    {
      title: 'Order Pickup',
      screen: 'OrderPickup',
      image: IMAGES.ic_orderPickup,
    },
    {title: 'Reviews', screen: 'Reviews', image: IMAGES.ic_review},
    {
      title: 'Notification',
      screen: 'Notification',
      image: IMAGES.ic_notification,
    },
    {
      title: 'Contact Us',
      screen: 'ContactUs',
      image: IMAGES.ic_contact,
    },
    {title: 'Settings', screen: 'Settings', image: IMAGES.ic_setting},
  ];

  return (
    <AppLayout containerStyle={styles.container}>
      <AppHeader
        containerStyle={{paddingHorizontal: ms(15)}}
        headerTitle={'My Profile'}
        leftElement={
          <Pressable onPress={() => navigation.goBack()}>
            <Image
              source={IMAGES.ic_backIcon}
              style={{height: mvs(20), width: ms(20)}}
              resizeMode="contain"
            />
          </Pressable>
        }
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingHorizontal: ms(16)}}>
        <View style={styles.header}>
          <Image
            source={{
              uri: 'https://cdn.pixabay.com/photo/2020/04/12/10/57/store-5033746_640.png',
            }}
            style={styles.profileImage}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>Theresa Webb</Text>
            <Text style={styles.userEmail}>tim.jennings@example.com</Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('EditStore')}>
            <Image
              style={{height: mvs(20), width: mvs(20), resizeMode: 'contain'}}
              source={IMAGES.ic_editIcon}
            />
          </TouchableOpacity>
        </View>

        <View style={{marginVertical: mvs(16)}}>
          <Text style={styles.sectionTitle}>General</Text>
          {menuItems.map((item, index) => (
            <ItemComponent
              key={index}
              title={item.title}
              image={item.image}
              onPress={() => navigation.navigate(item.screen,item.params)}
            />
          ))}
        </View>

        <TouchableOpacity
          style={styles.logoutContainer}
          activeOpacity={0.8}
          // onPress={onPress}
        >
          <Image
            style={{height: mvs(22), width: mvs(22), resizeMode: 'contain'}}
            source={IMAGES.ic_logout}
          />
          <Text style={styles.logoutText}>{'Log Out'}</Text>
        </TouchableOpacity>
        <View style={{marginTop: 20, paddingBottom: 30}}>
          <Text style={styles.appVersion}>App version: {appVersion}</Text>
        </View>

        {/* <View style={{height: 120}} /> */}
      </ScrollView>
    </AppLayout>
  );
};

const ItemComponent = ({title, image, onPress}) => (
  <TouchableOpacity
    style={styles.menuItem}
    activeOpacity={0.8}
    onPress={onPress}
  >
    <Image
      style={{height: mvs(22), width: mvs(22), resizeMode: 'contain'}}
      source={image}
    />
    <Text style={styles.menuItemText}>{title}</Text>
    <Image
      style={{
        height: mvs(18),
        width: mvs(18),
        resizeMode: 'contain',
        marginRight: ms(5),
      }}
      resizeMode="contain"
      source={IMAGES.ic_rightArrow}
    />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    // flexGrow: 1,
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: mvs(20),
    padding: s(16),
    borderRadius: s(10),
    backgroundColor: COLORS.WHITE,
    shadowColor: COLORS.BLACK,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileImage: {
    width: ms(60),
    height: mvs(60),
    borderRadius: s(30),
  },
  userInfo: {
    flex: 1,
    marginLeft: ms(16),
  },
  userName: {
    fontSize: FONTSIZE.XL,
    fontFamily: FONTS.workSansSemiBold,
    color: COLORS.BLACK,
  },
  userEmail: {
    fontSize: FONTSIZE.L,
    fontFamily: FONTS.workSansMedium,
    color: COLORS.TITLE,
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
    paddingVertical: ms(16),
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: s(14),
    borderColor: COLORS.BORDER,
    marginTop: ms(16),
  },
  logoutContainer: {
    flexDirection: 'row',
    paddingVertical: ms(16),
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 14,
    borderColor: COLORS.BORDER,
    marginTop: ms(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemText: {
    flex: 1,
    fontSize: FONTSIZE.L,
    fontFamily: FONTS.workSansMedium,
    marginLeft: ms(16),
    color: COLORS.BLACK,
  },
  logoutText: {
    fontSize: FONTSIZE.XL,
    fontFamily: FONTS.workSansMedium,
    marginLeft: ms(16),
    color: '#DB0B0B',
  },
  appVersion: {
    textAlign: 'center',
    fontSize: FONTSIZE.L,
    fontFamily: FONTS.workSansMedium,
    color: COLORS.TITLE,
  },
});

export default MyStore;

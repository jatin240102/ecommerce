import {ms, mvs} from 'react-native-size-matters';
import {Image, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useEffect, useState} from 'react';
import NetInfo from '@react-native-community/netinfo';
import {FONTS, FONTSIZE} from '../../constant/fonts';
import {COLORS} from '../../constant/color';
import {IMAGES} from '../../constant/imagePath';

const TabBarContent = ({state, navigation}) => {
  const [isInternetConnected, setIsInternetConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsInternetConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  const tabItems = [
    {
      label: 'Home',
      route: 'TabHome',
      activeImage: IMAGES.ic_selectTabHome,
      inactiveImage: IMAGES.ic_tabHome,
    },
    {
      label: 'Add Product',
      route: 'Category',
      activeImage: IMAGES.ic_selectTabCamera,
      inactiveImage: IMAGES.ic_tabCamera,
    },
    {
      label: 'Orders',
      route: 'OrderDashboard',
      activeImage: IMAGES.ic_selectTabOrderHome,
      inactiveImage: IMAGES.ic_tabOrder,
    },
    {
      label: 'Products',
      route: 'ProductDashboard',
      activeImage: IMAGES.ic_tabProductColor,
      inactiveImage: IMAGES.ic_tabProduct,
    },
  ];

  return (
    <View
      style={[
        styles.container,
        {
          display: !isInternetConnected ? 'none' : 'flex',
        },
      ]}>
      {tabItems.map((tab, index) => {
        return (
          <View key={index} style={[styles.imgMainContainer]}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                navigation.navigate(tab.route);
              }}
              style={{
                alignItems: 'center',
              }}>
              <Image
                source={
                  state.index === index ? tab.activeImage : tab.inactiveImage
                }
                resizeMode="contain"
                style={styles.imgStyle}
              />
              <Text
                style={[
                  styles.nameText,
                  state.index === index && {
                    fontFamily: FONTS.workSansMedium,
                    color: '#115543',
                  },
                ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.WHITE,
    // justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E5',
    width: '100%',
    alignItems:'center',
    justifyContent:'space-around',
    paddingHorizontal:10,
    paddingBottom:Platform.OS === 'ios'? 20:null
  },
  imgStyle: {width: ms(26), height: ms(26)},
  imgMainContainer: {
    // flex: 1,
    paddingVertical: mvs(15),
    // gap: 10,
    // alignItems: 'center',
  },
  nameText: {
    fontSize: FONTSIZE.L,
    fontFamily: FONTS.workSansMedium,
    color: COLORS.BLACK,
  },
});
export default TabBarContent;

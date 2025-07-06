import React from 'react';
import {View, Text, StyleSheet, StatusBar, Platform} from 'react-native';
import {ms, mvs} from 'react-native-size-matters';
import {FONTS, FONTSIZE} from '../../constant/fonts';
import {COLORS} from '../../constant/color';

const AppHeader = ({
  leftElement,
  rightElement,
  isHeaderImage = false,
  headerTitle,
  containerStyle,
  imageStyle,
  imageContainerStyle,
  titleStyle,
  leftElementStyle,
}) => {
  return (
    <View style={[styles.mainContainer, containerStyle]}>
      {leftElement ? (
        <View
          style={[
            styles.headerElementContainer,
            leftElementStyle,
            {alignItems: 'flex-start'},
          ]}>
          {leftElement}
        </View>
      ) : (
        <View style={{flex: 1}} />
      )}

      {isHeaderImage ? (
        <View style={[styles.imageContainerStyle, imageContainerStyle]}>
          {/* <AppLogo logoImageStyle={[styles.logo, imageStyle]} /> */}
        </View>
      ) : (
        <Text
          style={[styles.titleTxt, titleStyle]}
          numberOfLines={1}
          lineBreakMode="tail"
          ellipsizeMode="tail">
          {headerTitle}
        </Text>
      )}

      {rightElement ? (
        <View style={[styles.headerElementContainer, {alignItems: 'flex-end'}]}>
          {rightElement}
        </View>
      ) : (
        <View style={{flex: 1}} />
      )}
    </View>
  );
};
export default AppHeader;

const styles = StyleSheet.create({
  mainContainer: {
    paddingTop:
      StatusBar.currentHeight + (Platform.OS === 'android' ? mvs(15) : mvs(75)),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: mvs(22),
    backgroundColor: COLORS.PRIMARY,
  },
  navIconContainer: {
    justifyContent: 'center',
  },
  navIcon: {
    height: mvs(25),
    width: mvs(25),
    resizeMode: 'contain',
  },
  logo: {
    height: mvs(30),
    width: ms(30),
    resizeMode: 'contain',
  },
  imageContainerStyle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleTxt: {
    textAlign: 'center',
    fontSize: FONTSIZE.XL,
    fontFamily: FONTS.workSansSemiBold,
    color: COLORS.WHITE,
    textTransform: 'capitalize',
    flex: 6,
  },
  rightIconImg: {
    width: ms(20),
    height: ms(20),
    resizeMode: 'contain',
  },
  headerElementContainer: {flex: 1, justifyContent: 'center'},
});

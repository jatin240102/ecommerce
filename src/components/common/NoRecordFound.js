import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {COLORS} from '../../constant/color';
import {FONTS, FONTSIZE} from '../../constant/fonts';
import {IMAGES} from '../../constant/imagePath';
import {ms, mvs, s} from 'react-native-size-matters';

const NoRecordFound = ({title, description, mainContainer}) => {
  return (
    <View style={[styles.container, mainContainer]}>
      {/* <View style={styles.innerView}> */}
      <Image
        source={IMAGES.ic_noRecord}
        style={{height: mvs(80), width: ms(80)}}
        resizeMode="contain"
      />
      <Text style={styles.offlineText}>
        {title ? title : 'No Record Found'}
      </Text>
      <Text style={styles.desc} numberOfLines={2}>
        {description
          ? description
          : 'Oops ... this information is not available for a moment'}
      </Text>
      {/* <TouchableOpacity
          activeOpacity={0.8}
          style={styles.retryBtn}
          //   onPress={onRetry}
        >
          <Image
            source={IMAGES.ic_refresh}
            style={{height: 20, width: 20}}
            resizeMode="contain"
          />
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity> */}
      {/* </View> */}
    </View>
  );
};

export default NoRecordFound;

const styles = StyleSheet.create({
  retryBtn: {
    alignItems: 'center',
    justifyContent: '',
    backgroundColor: COLORS.PRIMARY,
    flexDirection: 'row',
    paddingHorizontal: ms(18),
    borderRadius: s(100),
    paddingVertical: mvs(8),
    gap: s(10),
    marginTop: mvs(20),
  },
  retryText: {
    color: COLORS.WHITE,
    fontFamily: FONTS.workSansMedium,
    fontSize: FONTSIZE.L,
  },
  desc: {
    color: COLORS.TITLE,
    fontFamily: FONTS.workSansMedium,
    fontSize: FONTSIZE.L,
    marginTop: mvs(15),
    textAlign: 'center',
  },
  offlineText: {
    color: COLORS.BLACK,
    fontFamily: FONTS.workSansSemiBold,
    fontSize: FONTSIZE.XL,
    marginTop: mvs(10),
  },
  innerView: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFAFA',
    paddingHorizontal: ms(18),
    borderRadius: s(5),
    paddingVertical: mvs(15),
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.WHITE,
  },
});

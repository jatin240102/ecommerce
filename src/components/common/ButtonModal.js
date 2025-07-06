import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import CustomModal from './CustomModal';
import {FONTS, FONTSIZE} from '../../constant/fonts';
import {COLORS} from '../../constant/color';
import {ms, mvs, s} from 'react-native-size-matters';

const ButtonModal = ({
  isOpen = false,
  firstBtnText = 'Cancel',
  secondBtnText = 'Update',
  firstBtnStyle,
  secondBtnStyle,
  onFirstBtnClick,
  onSecondBtnClick,
  title = '',
}) => {
  return (
    <CustomModal
      isVisible={isOpen}
      hasHeader={false}
      modalContainerStyle={styles.modalContainer}
      contentContainerStyle={{}}
      animationInTiming={350}
      animationOutTiming={350}
      // onClose={() => setIsLoginError(false)}
    >
      <View style={styles.modalView}>
        {title && <Text style={styles.modalText}>{title}</Text>}
        <View style={styles.mainContainer}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={onFirstBtnClick}
            style={[styles.cancelBtn, firstBtnStyle]}>
            <Text style={[styles.btnText, {color: COLORS.TITLE}]}>
              {firstBtnText}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={onSecondBtnClick}
            style={[styles.updateBtn, secondBtnStyle]}>
            <Text style={styles.btnText}>{secondBtnText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </CustomModal>
  );
};

export default ButtonModal;

const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: mvs(20),
  },
  modalText: {
    fontSize: FONTSIZE.XL,
    fontFamily: FONTS.workSansMedium,
    color: COLORS.BLACK,
    textAlign: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: mvs(10),
    marginHorizontal: ms(20),
  },
  btnText: {
    color: COLORS.WHITE,
    fontSize: FONTSIZE.XL,
    fontFamily: FONTS.workSansMedium,
  },
  cancelBtn: {
    paddingHorizontal: ms(40),
    paddingVertical: mvs(12),
    borderRadius: s(10),
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  updateBtn: {
    backgroundColor: '#D60000',
    paddingHorizontal: ms(50),
    paddingVertical: mvs(12),
    borderRadius: s(10),
  },
});

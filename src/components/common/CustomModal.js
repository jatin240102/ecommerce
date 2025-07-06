import {
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import Modal from 'react-native-modal';
import {ms, mvs, s} from 'react-native-size-matters';
import {IMAGES} from '../../constant/imagePath';
import {COLORS} from '../../constant/color';
import {FONTS, FONTSIZE} from '../../constant/fonts';
import { sHeight } from '../../utils/global';

const CustomModal = ({
  isVisible,
  onClose,
  headerText,
  children,
  animationInTiming = 750,
  animationOutTiming = 750,
  backDrop = 0.5,
  animationIn = 'slideInUp',
  animationOut = 'slideOutDown',
  contentContainerStyle,
  headerContainerStyle,
  hasCloseIcon = true,
  headerTextStyle,
  modalContainerStyle,
  hasHeader = false,
  scrollContainerStyle,
  modalStyle,
  otherActionContainer,
  otherActions,
  swipeDirection,
  onSwipeComplete,
  scrollerStyle,
}) => {
  return (
    <Modal
      isVisible={isVisible}
      style={modalStyle}
      backdropOpacity={backDrop}
      animationInTiming={animationInTiming}
      animationOutTiming={animationOutTiming}
      animationIn={animationIn}
      animationOut={animationOut}
      onBackdropPress={onClose}
      onSwipeComplete={onSwipeComplete}
      swipeDirection={swipeDirection}
      backdropTransitionInTiming={animationInTiming}
      backdropTransitionOutTiming={animationOutTiming}>
      <KeyboardAvoidingView
        style={[styles.modalContainer, modalContainerStyle]}
        keyboardVerticalOffset={0}
        behavior="height">
        {hasHeader && (
          <View style={[styles.headerContainer, headerContainerStyle]}>
            <Text
              style={[
                styles.headerText,
                {textAlign: 'center', color: COLORS.PRIMARY},
                headerTextStyle,
              ]}>
              {headerText}
            </Text>
            {hasCloseIcon && (
              <TouchableOpacity
                onPress={onClose}
                style={styles.closeIconContainer}>
                <Image
                  source={IMAGES.ic_check_fill}
                  style={{height: 20, width: 20}}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            )}
          </View>
        )}
        <View
          style={[
            {
              ...styles.contentContainer,
            },
            hasHeader
              ? {borderBottomLeftRadius: s(10), borderBottomRightRadius: s(10)}
              : {borderRadius: 10},
            contentContainerStyle,
          ]}>
          <ScrollView
            contentContainerStyle={[{}, scrollContainerStyle]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            style={scrollerStyle}
            nestedScrollEnabled={true}
            scrollEnabled={true}
            bounces={false}>
            {children}
          </ScrollView>

          {otherActions && (
            <View style={[{}, otherActionContainer]}>{otherActions}</View>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default CustomModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    maxHeight: mvs(230),
    borderRadius: s(10),
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

    paddingHorizontal: ms(16),
    paddingVertical: mvs(10),

    backgroundColor: 'gray',
    borderTopStartRadius: s(10),
    borderTopEndRadius: s(10),
  },
  headerText: {
    fontSize: FONTSIZE.L,

    fontFamily: FONTS.workSansSemiBold,
    textAlign: 'center',
    flex: 1,
  },
  closeIconContainer: {
    marginLeft: 'auto',
  },
  contentContainer: {
    width: '100%',
    paddingHorizontal: ms(16),
    paddingVertical: mvs(15),
    backgroundColor: COLORS.WHITE,
  },
});

import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Linking,
} from 'react-native';
import React from 'react';
import {ms, mvs, s} from 'react-native-size-matters';
import ImagePicker from 'react-native-image-crop-picker';
import {ImagePickerOptions} from '../../constant/globalConstants';
import {COLORS} from '../../constant/color';
import {FONTS, FONTSIZE} from '../../constant/fonts';
import CustomModal from './CustomModal';
import {IMAGES} from '../../constant/imagePath';
import {
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';

const ImagePickerModal = ({
  isVisible,
  onClose,
  onImageSelect,
  imagePickerOptions,
  title,
}) => {
  const requestCameraPermission = async () => {
    try {
      const permission =
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.CAMERA
          : PERMISSIONS.ANDROID.CAMERA;

      const result = await request(permission);
      console.log('result-------', result);
      if (result === RESULTS.GRANTED) {
        handleCameraPicker();
      } else {
        Linking.openSettings();
        console.log('Camera permission denied');
      }
    } catch (error) {
      console.log('Camera permission error:', error);
    }
  };

  // const requestCameraPermission = async () => {
  //   try {
  //     const permission = PERMISSIONS.IOS.CAMERA; // For iOS

  //     const result = await request(permission);

  //     if (result === RESULTS.GRANTED) {
  //       console.log('Camera permission granted');
  //       handleCameraPicker();
  //     } else if (result === RESULTS.DENIED) {
  //       console.log('Camera permission denied');
  //       // Optionally redirect to settings
  //       Linking.openSettings();
  //     } else if (result === RESULTS.BLOCKED) {
  //       console.log('Camera permission blocked');
  //       Linking.openSettings();
  //     } else {
  //       console.log('Camera permission status unknown');
  //     }
  //   } catch (error) {
  //     console.log('Camera permission error:', error);
  //   }
  // };

  const requestGalleryPermission = async () => {
    try {
      if (Platform.OS === 'ios') {
        const permission = PERMISSIONS.IOS.PHOTO_LIBRARY;
        const result = await request(permission);
        if (result === RESULTS.GRANTED) {
          handleGalleryPicker();
        } else {
          console.log('Gallery permission denied');
        }
      } else {
        handleGalleryPicker();
      }
    } catch (error) {
      console.log('Gallery permission error:', error);
    }
  };

  const handleCameraPicker = () => {
    try {
      ImagePicker.openCamera({...ImagePickerOptions, ...imagePickerOptions})
        .then(onImageSelect)
        .catch(err => {
          console.log('err', err);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const handleGalleryPicker = () => {
    try {
      ImagePicker.openPicker({...ImagePickerOptions, ...imagePickerOptions})
        .then(onImageSelect)
        .catch(err => {
          console.log('err', err);
        });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <CustomModal
      isVisible={isVisible}
      hasHeader={false}
      modalContainerStyle={styles.modalContainer}
      animationInTiming={350}
      animationOutTiming={350}
      onClose={onClose}>
      <View style={styles.modalView}>
        {title && <Text style={styles.modalText}>{title}</Text>}
        <View style={styles.mainContainer}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={requestCameraPermission}
            style={[styles.btnContainer]}>
            <Image
              source={IMAGES.ic_tabCamera}
              style={{
                height: mvs(20),
                width: ms(20),
                resizeMode: 'contain',
                tintColor: COLORS.WHITE,
              }}
              resizeMode="contain"
            />
            <Text style={[styles.btnText]}>{'Camera'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={requestGalleryPermission}
            style={[styles.btnContainer]}>
            <Image
              source={IMAGES.ic_uploadImage}
              style={{
                height: mvs(20),
                width: ms(20),
                resizeMode: 'contain',
                tintColor: COLORS.WHITE,
              }}
              resizeMode="contain"
            />
            <Text style={[styles.btnText]}>{'Upload'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </CustomModal>
  );
};

export default ImagePickerModal;

const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  mainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(20),
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
    marginVertical: 20,
  },
  btnText: {
    color: COLORS.WHITE,
    fontSize: FONTSIZE.L,
    fontFamily: FONTS.workSansMedium,
  },
  btnContainer: {
    paddingHorizontal: ms(20),
    paddingVertical: mvs(12),
    borderRadius: s(10),
    backgroundColor: COLORS.PRIMARY,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
});

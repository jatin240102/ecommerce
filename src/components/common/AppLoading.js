import React from 'react';
import {ActivityIndicator, Modal, StyleSheet, Text, View} from 'react-native';
import { ms, mvs} from 'react-native-size-matters';
import {FONTSIZE} from '../../constant/fonts';
import {COLORS} from '../../constant/color';
const AppLoading = ({appLoading}) => {
  return (
    appLoading && (
      <Modal
        animationType="none"
        transparent={true}
        visible={appLoading}
        statusBarTranslucent={true}>
        <View style={styles.centeredView}>
          <View style={[styles.modalView]}>
            <ActivityIndicator
              style={{alignSelf: 'center', marginTop: mvs(20)}}
              size="large"
              color={COLORS.PRIMARY}
              animating={true}
            />
            <Text style={[styles.modalText]} numberOfLines={1}>
              {'Loading...'}
            </Text>
          </View>
        </View>
      </Modal>
    )
  );
};

export default AppLoading;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0008',
  },
  modalView: {
    width: ms(85),
    height: mvs(85),
    backgroundColor: 'white',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    paddingHorizontal: 5,
  },

  modalText: {
    marginVertical: mvs(15),
    textAlign: 'center',
    fontSize: FONTSIZE.M,
    alignSelf: 'center',
    color: COLORS.BLACK,
  },
});

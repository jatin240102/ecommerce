import React from 'react';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {COLORS} from '../../constant/color';
import {FONTS, FONTSIZE} from '../../constant/fonts';

const GradientButton = ({
  title = 'Click',
  onPress,
  colors = null,
  mainContainer,
  buttonTxt,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.95}
      onPress={onPress}
      style={[styles.buttonContainer, mainContainer]}>
      <LinearGradient
        colors={colors ? colors : ['#1A7F65', '#115543']}
        style={styles.gradient}
        start={{x: 0.2, y: 0}}
        end={{x: 0.2, y: 1}}>
        <Text style={[styles.buttonText, buttonTxt]} numberOfLines={1}>
          {title}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    marginVertical: 10,
  },
  gradient: {
    paddingVertical: 15,
    // paddingHorizontal: 25,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.WHITE,
    fontSize: FONTSIZE.L,
    // fontWeight: 'bold',
    fontFamily: FONTS.workSansBold,
  },
});

export default GradientButton;

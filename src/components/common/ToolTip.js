import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Tooltip from 'react-native-walkthrough-tooltip';
import {COLORS} from '../../constant/color';
import {FONTS, FONTSIZE} from '../../constant/fonts';

const ToolTip = ({
  children,
  tooltipText,
  visible,
  position = 'left',
  onClose,
}) => {
  return (
    <Tooltip
      isVisible={visible}
      content={<Text style={styles.tooltipText}>{tooltipText}</Text>}
      placement={position}
      onClose={onClose}
      backgroundColor="transparent"
      // arrowSize={{width: 16, height: 8}}
      contentStyle={styles.tooltipContent}>
      {children}
    </Tooltip>
  );
};

export default ToolTip;

const styles = StyleSheet.create({
  tooltipText: {
    color: COLORS.BLACK,
    fontSize: FONTSIZE.L,
    fontFamily: FONTS.workSansSemiBold,
  },
  tooltipContent: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 5,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3, // For shadow on Android
    shadowColor: '#000', // For shadow on iOS
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});

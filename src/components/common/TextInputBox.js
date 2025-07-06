import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  Platform,
  Pressable,
  Keyboard,
} from 'react-native';
import React, { useEffect } from 'react';
import {ms, mvs} from 'react-native-size-matters';
import {FONTS, FONTSIZE} from '../../constant/fonts';
import {COLORS} from '../../constant/color';

const TextInputBox = props => {
  //  useEffect(() => {
  //    const keyboardHide = Keyboard.addListener('keyboardDidHide', () => {
  //      Keyboard.dismiss();
  //    });
  //    return () => {
  //      keyboardHide.remove();
  //    };
  //  }, []);
  return (
    <View style={props?.containerStyle}>
      {props?.title && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={[styles.titleTxt, props?.titleStyle]}>
            {props.title}
            {props.isRequired && (
              <Text style={{color: props.isRequired ? COLORS.ERROR : ''}}>
                {props.isRequired && '*'}
              </Text>
            )}
          </Text>

          {props.titleImage && (
            <View style={[props?.titleImageStyle]}>{props.titleImage}</View>
          )}
        </View>
      )}
      <View
        style={[
          styles.mainContainer,
          props.error && {borderColor: COLORS.ERROR},
          props?.editable === false && {
            backgroundColor: 'rgb(235, 235, 228)',
            opacity: 0.5,
          },
          props.mainContainerCss,
        ]}>
        {props?.leftIcon && (
          <Pressable
            style={[
              styles.iconContainer,
              {marginRight: 10},
              props?.leftIconContainer,
            ]}
            onPress={props?.onLeftIconPress}>
            <Image
              style={[styles.icon, props?.leftIconImageStyle]}
              source={props?.leftIcon}
            />
          </Pressable>
        )}
        <TextInput
          style={[styles.inputStyle, props?.inputStyle]}
          value={props?.value}
          onChangeText={props?.onChangeText}
          keyboardType={
            props?.keyboardType
              ? props?.keyboardType
              : props?.isMobile || props?.isOtp
              ? 'numeric'
              : 'default'
          }
          placeholder={props?.placeholder || props?.title}
          placeholderTextColor={props?.placeholderTextColor || '#969696'}
          secureTextEntry={
            props?.secureTextEntry ? props?.secureTextEntry : false
          }
          multiline={props?.multiline}
          numberOfLines={props?.numberOfLines}
          textAlignVertical={props?.textAlignVertical}
          onEndEditing={props?.onEndEditing}
          onChange={props?.onChange}
          textBreakStrategy={props?.textBreakStrategy}
          onSubmitEditing={props?.onSubmitEditing}
          onFocus={props?.onFocus}
          onBlur={props?.onBlur}
          maxLength={props?.maxLength}
          onLayout={props?.onLayout}
          onKeyPress={props?.onKeyPress}
          ref={props?.textInputRef}
          editable={props?.editable}
        />
        {props?.rightIcon && (
          <TouchableOpacity
            style={[styles.iconContainer, props?.rightIconContainerStyle]}
            activeOpacity={1}
            onPress={props?.onRightIconPress ? props?.onRightIconPress : null}>
            <Image
              style={[styles.icon, props?.rightIconImageStyle]}
              source={props?.rightIcon}
            />
          </TouchableOpacity>
        )}
        {props?.rightContainer && props.rightContainer}
      </View>
      {props.error && (
        <Text style={styles.errorText} numberOfLines={2}>
          {props.error}
        </Text>
      )}
    </View>
  );
};
export default TextInputBox;
const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: COLORS.WHITE,
    borderRadius: ms(8),
    borderColor: COLORS.BORDER,
    borderWidth: 1,
    paddingHorizontal: ms(16),
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: mvs(8),
  },
  countryCode: {
    color: 'black',
    fontFamily: FONTS.workSansRegular,
    fontSize: FONTSIZE.L,
  },
  inputStyle: {
    color: COLORS.BLACK,
    fontFamily: FONTS.workSansRegular,
    fontSize: FONTSIZE.L,
    height: Platform.OS === 'android' ? mvs(45) : ms(42),
    flex: 5,
  },

  iconContainer: {flex: 0.5, justifyContent: 'center', alignItems: 'center'},
  icon: {height: mvs(20), width: ms(20), resizeMode: 'contain'},
  errorText: {
    color: COLORS.ERROR,
    fontFamily: FONTS.workSansRegular,
    fontSize: FONTSIZE.M,
    marginTop: Platform.OS === 'ios' ? mvs(5) : 0,
  },
  titleTxt: {
    fontFamily: FONTS.workSansMedium,
    fontSize: FONTSIZE.L,
    color: COLORS.TITLE,
    textAlign: 'left',
  },
});

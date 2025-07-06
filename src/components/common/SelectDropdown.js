import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Dropdown} from 'react-native-element-dropdown';
import {ms, mvs, s} from 'react-native-size-matters';
import {COLORS} from '../../constant/color';
import {FONTS, FONTSIZE} from '../../constant/fonts';

const SingleSelectDropdown = ({
  data = [],
  dropdownTitle = '',
  isSearch = false,
  labelField = 'name',
  valueField = '_id',
  searchPlaceholder,
  containerStyle,
  onItemSelect,
  selectedValue = null,
  listText,
  dropdownStyle,
  dropdownPosition = 'auto',
  inverted,
  maxHeight = 300,
  dropdownProps,
  showsVerticalScrollIndicator = false,
  mode = 'default',
  mainContainerStyle,
  label = '',
  errorMessage,
  labelStyle,
  rightIconStyle,
  listItemStyle,
  secondaryItemKey,
  secondaryItemIndicator,
  listLoading = false,
}) => {
  const renderSingleItem = item => {
    if (data.length <= 0) {
      return null;
    }
    return (
      <View style={[styles.item, listItemStyle]} key={item._id}>
        <Text
          style={[styles.listText, secondaryItemKey && {flex: 4.5}, listText]}>
          {item.name}
        </Text>
      </View>
    );
  };

  return (
    <View style={[mainContainerStyle]}>
      {label && (
        <Text style={[styles.dropdownTitleTxt, labelStyle]}>{`${label}`}</Text>
      )}
      <Dropdown
        mode={mode}
        style={[
          styles.dropdown,
          dropdownStyle,
          errorMessage && {borderColor: COLORS.ERROR},
        ]}
        selectedTextProps={{
          numberOfLines: 1,
          style: {
            ...styles.selectedTextStyle,
            overflow: 'visible',
            flex: 8,
          },
        }}
        keyboardAvoiding={true}
        autoScroll={false}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={[styles.iconStyle]}
        data={data}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        search={isSearch}
        maxHeight={maxHeight}
        labelField={labelField}
        valueField={valueField}
        placeholder={dropdownTitle}
        placeholderTextColor={'red'}
        searchPlaceholder={searchPlaceholder ? searchPlaceholder : 'Search'}
        value={selectedValue}
        dropdownPosition={dropdownPosition}
        inverted={inverted}
        disable={data.length === 0}
        containerStyle={[
          {
            borderRadius: 5,
            marginTop: 3,
          },
          containerStyle,
        ]}
        onChange={item => {
          onItemSelect(item);
        }}
        itemContainerStyle={{
          borderRadius: 2,
          marginHorizontal: 5,
        }}
        renderItem={renderSingleItem}
        renderRightIcon={() => (
          <Image
            source={require('../../assets/images/downArrow.png')}
            style={[styles.rightIcon, rightIconStyle]}
            resizeMode="contain"
          />
        )}
      />

      {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
    </View>
  );
};

export default SingleSelectDropdown;

const styles = StyleSheet.create({
  dropdown: {
    height: mvs(50),
    borderRadius: 10,
    backgroundColor: COLORS.WHITE,
    marginTop: mvs(5),
    paddingHorizontal: ms(10),
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  selectedTextStyle: {
    color: COLORS.BLACK,
    fontFamily: FONTS.workSansRegular,
    fontSize: FONTSIZE.L,
    // height: Platform.OS === 'android' ? mvs(45) : ms(42),
    marginLeft: ms(10),
  },

  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 50,
    fontSize: 16,
    borderRadius: 10,
  },

  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    // paddingTop:10
    paddingVertical: mvs(5),
  },
  listText: {
    color: COLORS.BLACK,
    textTransform: 'capitalize',
    fontSize: FONTSIZE.L,
    fontFamily: FONTS.workSansRegular,
  },
  dropdownTitleTxt: {
    fontFamily: FONTS.workSansMedium,
    fontSize: FONTSIZE.L,
    color: COLORS.TITLE,
    textAlign: 'left',
  },
  errorMessage: {
    color: COLORS.ERROR,
    fontFamily: FONTS.workSansRegular,
    fontSize: FONTSIZE.M,
    marginTop: ms(5),
  },
  rightIcon: {height: mvs(15), width: ms(15), resizeMode: 'contain'},
});

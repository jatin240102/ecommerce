import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  Image,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {ms, mvs, s} from 'react-native-size-matters';
import moment from 'moment-timezone';
import {COLORS} from '../../constant/color';
import {FONTS, FONTSIZE} from '../../constant/fonts';
import {useNavigation} from '@react-navigation/native';
import {formatDate, sWidth} from '../../utils/global';
import Tooltip from 'react-native-walkthrough-tooltip';
import {APP_TEXT} from '../../constant/globalConstants';
import {IMAGES} from '../../constant/imagePath';

const DatePickers = ({
  dateFormat = 'DD/MM/YYYY',
  customStyle = {},
  setDate,
  selectDate = null,
  title,
  titleStyle,
  error,
  isToolTipActive = false,
  onToolTipClose,
  onToolTipOpen,
  initialTip = true,
  pickerPlaceHolder = '',
  maximumDates = null,
  minimumDates = null,
}) => {
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setDate(null);
    });
    return unsubscribe;
  }, [navigation]);

  const [open, setOpen] = useState(false);
  const currentDate = new Date();
  const onDateSelect = selectedDate => {
    const confirmDate = moment(selectedDate).format(dateFormat);
    setOpen(false);
    setDate(confirmDate);
  };

  let today = new Date();

  // Calculate the date 10 years from today
  let tenYearsFromToday = new Date();
  tenYearsFromToday.setFullYear(today.getFullYear() + 10);

  return (
    <>
      <View style={styles.titleView}>
        <Text style={[styles.titleTxt, titleStyle]}>
          {title ? title : pickerPlaceHolder ? pickerPlaceHolder : 'Validity'}
        </Text>
        {initialTip && (
          <Tooltip
            isVisible={isToolTipActive}
            arrowSize={{width: 16, height: 18}}
            contentStyle={[styles.tooltipContent, {width: sWidth / 1.5}]}
            content={
              <Text style={styles.tooltipText}>
                {APP_TEXT.product_validity_tip}
              </Text>
            }
            onClose={onToolTipClose}
            placement="left"
            backgroundColor="transparent"
            topAdjustment={
              Platform.OS === 'android' ? -StatusBar.currentHeight : 0
            }>
            <TouchableOpacity onPress={onToolTipOpen}>
              <Image
                source={IMAGES.ic_info_Image}
                style={{height: mvs(18), width: ms(18)}}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </Tooltip>
        )}
      </View>

      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => setOpen(true)}
        style={[styles.pickerContainer, error && {borderColor: COLORS.ERROR}]}>
        <Text style={[styles.dateText, selectDate && {color: COLORS.BLACK}]}>
          {selectDate
            ? selectDate
            : pickerPlaceHolder
            ? pickerPlaceHolder
            : 'Product validity'}
        </Text>
        <DatePicker
          modal
          title={pickerPlaceHolder ? pickerPlaceHolder : 'Product Validity'}
          textColor={'black'}
          open={open}
          date={currentDate}
          onConfirm={selectedDate => onDateSelect(selectedDate)}
          mode="date"
          theme="light"
          onCancel={() => setOpen(false)}
          maximumDate={maximumDates ? maximumDates : tenYearsFromToday}
          minimumDate={minimumDates ? minimumDates : currentDate}
        />
      </TouchableOpacity>
      {/* {error && (
        <Text style={styles.errorText} numberOfLines={2}>
          {error}
        </Text>
      )} */}
    </>
  );
};

export default DatePickers;

const styles = StyleSheet.create({
  pickerContainer: {
    height: Platform.OS === 'android' ? mvs(45) : ms(42),
    marginTop: mvs(10),
    borderRadius: s(6),
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    backgroundColor: COLORS.WHITE,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  dateText: {
    color: '#969696',
    fontFamily: FONTS.workSansRegular,
    fontSize: FONTSIZE.L,
    marginLeft: ms(20),
  },
  titleTxt: {
    fontFamily: FONTS.workSansMedium,
    fontSize: FONTSIZE.L,
    color: COLORS.TITLE,
    textAlign: 'left',
    // marginTop: mvs(28),
  },
  errorText: {
    color: COLORS.ERROR,
    fontFamily: FONTS.workSansRegular,
    fontSize: FONTSIZE.M,
    marginTop: Platform.OS === 'ios' ? mvs(5) : 0,
  },
  tooltipText: {
    color: COLORS.BLACK,
    fontSize: FONTSIZE.L,
    fontFamily: FONTS.workSansMedium,
    textAlign: 'center',
  },
  tooltipContent: {
    backgroundColor: '#e7e7e7',
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
  titleView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: mvs(28),
  },
});

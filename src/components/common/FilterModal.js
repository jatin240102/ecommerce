import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Modal from 'react-native-modal';
import {COLORS} from '../../constant/color';
import {FONTS, FONTSIZE} from '../../constant/fonts';
import TextInputBox from './TextInputBox';
import SingleSelectDropdown from './SelectDropdown';
import {ms, mvs, s} from 'react-native-size-matters';
import DatePickers from './DatePickers';
import LinearGradient from 'react-native-linear-gradient';

const FilterModal = ({
  isVisible,
  onClose,
  onInputChange,
  filterRecord,
  dropDownData,
  setFilterRecord,
  handleDateSelector,
  minDate,
  maxDate,
  clearFilter,
  isFilterActive,
  handleApplyFilter,
}) => {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      style={styles.modal}
      backdropOpacity={0.1}
      swipeDirection="down"
      onSwipeComplete={onClose}>
      <View style={styles.container}>
        <View style={styles.headerIndicator} />
        <Text
          style={{
            alignSelf: 'center',
            alignItems: 'center',
            textAlign: 'center',
            color: COLORS.BLACK,
            fontSize: FONTSIZE.L,
            fontFamily: FONTS.workSansMedium,
          }}>
          Filter By
        </Text>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TextInputBox
            title={'Customer'}
            value={filterRecord.customer}
            onChangeText={text => {
              onInputChange('customer', text);
            }}
            placeholder={'Customer'}
          />
          <TextInputBox
            title={'Order Id'}
            value={filterRecord.increment_id}
            onChangeText={text => {
              onInputChange('increment_id', text);
            }}
            placeholder={'Enter Order Id'}
            containerStyle={{marginTop: mvs(20)}}
          />

          <SingleSelectDropdown
            data={dropDownData}
            mainContainerStyle={{
              flex: 1,
              // height: mvs(40),
              // marginLeft: mvs(30),
              // marginTop: 20,
            }}
            labelStyle={{marginTop: mvs(28)}}
            label={'Select Status'}
            dropdownStyle={[styles.dropdownStyle]}
            rightIconStyle={{marginRight: ms(15)}}
            dropdownTitle={'Select Status'}
            onItemSelect={item =>
              setFilterRecord({
                ...filterRecord,
                status: item.value,
              })
            }
            selectedValue={filterRecord.status}
            inverted={false}
            labelField="name"
            valueField="value"
            listItemStyle={{
              backgroundColor: 'white',
            }}
          />
          <View style={styles.flexContainer}>
            <View style={styles.halfFlex}>
              <DatePickers
                initialTip={false}
                customStyle={{}}
                date={null}
                setDate={date => handleDateSelector(date, true)}
                selectDate={filterRecord.start_date}
                isToolTipActive={false}
                pickerPlaceHolder={'Start Date'}
                minimumDates={minDate}
                // maximumDates={filterValues.end_date || maxDate}
                maximumDates={maxDate}
              />
            </View>
            <View style={styles.halfFlex}>
              <DatePickers
                initialTip={false}
                customStyle={{}}
                date={null}
                setDate={date => handleDateSelector(date)}
                selectDate={filterRecord.end_date}
                isToolTipActive={false}
                pickerPlaceHolder={'End Date'}
                minimumDates={minDate}
                maximumDates={maxDate}
              />
            </View>
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          {!isFilterActive ? (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => onClose()}
              style={[styles.cancelBtn]}>
              <Text style={[styles.btnText, {color: COLORS.TITLE}]}>
                {'Cancel'}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => clearFilter()}
              style={[styles.cancelBtn, {paddingHorizontal: 42}]}>
              <Text style={[styles.btnText, {color: COLORS.TITLE}]}>
                {'Clear filter'}
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={{overflow: 'hidden'}}
            onPress={() => handleApplyFilter()}>
            <LinearGradient
              colors={['#1A7F65', '#115543']}
              style={styles.updateBtn}
              start={{x: 0.2, y: 0}}
              end={{x: 0.2, y: 1}}>
              <Text style={[styles.btnText]} numberOfLines={1}>
                {'Apply'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    maxHeight: '90%',
    paddingBottom: 20,
  },
  headerIndicator: {
    width: 50,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 10,
    alignSelf: 'center',
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  dateInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    width: '48%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    height: 45,
    backgroundColor: '#ccc',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  applyButton: {
    flex: 1,
    height: 45,
    backgroundColor: '#006400',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  flexContainer: {
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexDirection: 'row',
    gap: ms(20),
    flex: 1,
  },
  halfFlex: {
    flex: 1 / 2,
    justifyContent: 'center',
  },
  dropdownStyle: {
    paddingHorizontal: null,
    backgroundColor: 'white',
    borderColor: COLORS.BORDER,
    borderWidth: 1,
    paddingVertical: null,
    marginTop: 10,
    flex: 1,
    height: mvs(45),
  },
  btnText: {
    color: COLORS.WHITE,
    fontSize: FONTSIZE.XL,
    fontFamily: FONTS.workSansMedium,
  },
  cancelBtn: {
    paddingHorizontal: ms(55),
    paddingVertical: mvs(12),
    borderRadius: s(10),
    borderWidth: 1,
    borderColor: '#6C7278',
  },
  updateBtn: {
    paddingHorizontal: ms(60),
    paddingVertical: mvs(12),
    borderRadius: s(10),
    borderWidth: 1,
    borderColor: '#115543',
    overflow: 'hidden',
  },
});

export default FilterModal;

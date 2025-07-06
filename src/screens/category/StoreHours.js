import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Button,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const StoreHours = () => {
  const [storeHours, setStoreHours] = useState([
    {day: 'Monday', startTime: new Date(), endTime: new Date(), isOpen: true},
    {day: 'Tuesday', startTime: new Date(), endTime: new Date(), isOpen: true},
    {
      day: 'Wednesday',
      startTime: new Date(),
      endTime: new Date(),
      isOpen: true,
    },
    {day: 'Thursday', startTime: new Date(), endTime: new Date(), isOpen: true},
    {day: 'Friday', startTime: new Date(), endTime: new Date(), isOpen: true},
    {day: 'Saturday', startTime: new Date(), endTime: new Date(), isOpen: true},
    {day: 'Sunday', startTime: new Date(), endTime: new Date(), isOpen: false}, // Default Closed
  ]);

  const [showPicker, setShowPicker] = useState({index: null, type: null});

  const handleTimeChange = (event, selectedTime, index, type) => {
    if (event.type === 'set') {
      const newHours = [...storeHours];
      if (type === 'start') {
        newHours[index].startTime = selectedTime || newHours[index].startTime;
      } else {
        newHours[index].endTime = selectedTime || newHours[index].endTime;
      }
      setStoreHours(newHours);
    }
    setShowPicker({index: null, type: null}); // Hide the picker after selection
  };

  const showTimePicker = (index, type) => {
    setShowPicker({index, type});
  };

  const formatTime = date => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const strMinutes = minutes < 10 ? '0' + minutes : minutes;
    return hours + ':' + strMinutes + ' ' + ampm;
  };

  const renderHoursRow = ({item, index}) => (
    <View style={styles.row}>
      <Text style={styles.dayText}>{item.day}</Text>
      <TouchableOpacity onPress={() => showTimePicker(index, 'start')}>
        <Text style={styles.timeText}>{formatTime(item.startTime)}</Text>
      </TouchableOpacity>
      <Text style={styles.timeText}> - </Text>
      <TouchableOpacity onPress={() => showTimePicker(index, 'end')}>
        <Text style={styles.timeText}>{formatTime(item.endTime)}</Text>
      </TouchableOpacity>
      {showPicker.index === index && (
        <DateTimePicker
          value={showPicker.type === 'start' ? item.startTime : item.endTime}
          mode="time"
          is24Hour={false}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedTime) =>
            handleTimeChange(event, selectedTime, index, showPicker.type)
          }
        />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={storeHours}
        keyExtractor={item => item.day}
        renderItem={renderHoursRow}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  dayText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  timeText: {
    fontSize: 16,
    color: 'blue',
  },
});

export default StoreHours;

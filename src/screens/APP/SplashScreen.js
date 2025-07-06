import React, {useEffect} from 'react';
import {View, StyleSheet, StatusBar, Image, Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {STORAGE_KEYS} from '../../constant/globalConstants';
import {COLORS} from '../../constant/color';
import LinearGradient from 'react-native-linear-gradient';
import {IMAGES} from '../../constant/imagePath';

const SplashScreen = ({navigation}) => {
  const loginStatusCheck = async () => {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    // console.log('token.....................', token);
    if (token) {
      navigation.replace('Dashboard');
    } else {
      navigation.replace('Authentication');
    }
  };

  useEffect(() => {
    const splashTimeout = setTimeout(() => {
      loginStatusCheck();
    }, 3000);

    return () => clearTimeout(splashTimeout);
  }, []);

  return (
    <>
      <StatusBar
        barStyle="light-content"
        translucent={true}
        backgroundColor="transparent"
      />
      <LinearGradient
        colors={['#1A7F65', '#115543']}
        style={styles.container}
        start={{x: 0.2, y: 0}}
        end={{x: 0.2, y: 1}}>
        <Image
          source={IMAGES.ic_splashScreen}
          style={{
            width: Platform.OS === 'android' ? 200 : 150,
            height: Platform.OS === 'android' ? 200 : 150,
            resizeMode: 'contain',
          }}
          resizeMode="contain"
        />
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.PRIMARY,
  },
});

export default SplashScreen;

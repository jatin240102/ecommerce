import {StyleSheet, SafeAreaView, StatusBar, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {ms} from 'react-native-size-matters';
import NetInfo from '@react-native-community/netinfo';
import NoInternet from '../common/NoInternet';
import {COLORS} from '../../constant/color';

const AppLayout = ({children, containerStyle}) => {
  const [isInternetConnected, setIsInternetConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsInternetConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  const checkConnection = () => {
    console.log('first--------------',)
    NetInfo.fetch().then(state => {
      setIsInternetConnected(state.isConnected);
    });
  };

  return (
    <View style={[styles.mainContainer, containerStyle]}>
    <StatusBar
        barStyle="light-content"
        translucent={true}
        backgroundColor="transparent"
      />
      {!isInternetConnected ? (
        <NoInternet onRetry={()=>checkConnection()} />
      ) : (
        children
      )}
    </View>
  );
};

export default AppLayout;
const styles = StyleSheet.create({
  mainContainer: {
    // marginTop: StatusBar.currentHeight + 50,
    flex: 1,
    paddingHorizontal: ms(15),
    backgroundColor: COLORS.WHITE,
  },
});

import React from 'react';
import {StyleSheet, Image, ScrollView, Pressable} from 'react-native';
import {ms, mvs, s} from 'react-native-size-matters';
import {IMAGES} from '../../constant/imagePath';
import AppHeader from '../../components/common/AppHeader';
import {COLORS} from '../../constant/color';
import {FONTS, FONTSIZE} from '../../constant/fonts';
import AppLayout from '../../components/layouts/AppLayout';

const Notifications = ({navigation, route}) => {
  return (
    <AppLayout containerStyle={styles.container}>
      <AppHeader
        containerStyle={{paddingHorizontal: ms(15)}}
        headerTitle={'Notifications'}
        leftElement={
          <Pressable onPress={() => navigation.goBack()}>
            <Image
              source={IMAGES.ic_backIcon}
              style={{height: mvs(20), width: ms(20)}}
              resizeMode="contain"
            />
          </Pressable>
        }
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingHorizontal: ms(15)}}></ScrollView>
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: 0,
  },
});

export default Notifications;

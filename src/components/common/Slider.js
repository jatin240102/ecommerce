/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Dimensions} from 'react-native';
import {ImageSlider} from 'react-native-image-slider-banner';
import {COLORS} from '../../constant/color';

const Slider = ({sliders}) => {
  return (
    <ImageSlider
      data={sliders.map(i => ({...i, img: i.url}))}
      autoPlay={true}
      caroselImageStyle={{
        resizeMode: 'cover',
        width: Dimensions.get('window').width - 30,
        height: Dimensions.get('window').width - 30,
        aspectRatio: 1,
      }}
      caroselImageContainerStyle={{
        marginHorizontal: 15,
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 30,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      indicatorContainerStyle={{bottom: -20}}
      inActiveIndicatorStyle={{backgroundColor: '#7d7d7d', height: 8, width: 8}}
      activeIndicatorStyle={{
        backgroundColor: COLORS.PRIMARY,
        height: 8,
        width: 32,
      }}
      // onItemChanged={item => console.log('item', item)}
      timer={2000}
      preview={false}
    />
  );
};

export default Slider;

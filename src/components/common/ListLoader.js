import {ActivityIndicator} from 'react-native';
import React from 'react';
import {mvs} from 'react-native-size-matters';
import {COLORS} from '../../constant/color';

const ListLoader = ({loading = false}) => {
  return (
    <>
      {loading && (
        <ActivityIndicator
          size="large"
          color={COLORS.PRIMARY}
          style={{marginTop: mvs(8)}}
        />
      )}
    </>
  );
};

export default ListLoader;

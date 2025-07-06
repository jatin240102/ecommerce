import React, {useEffect, useRef} from 'react';
import {
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
  View,
  Text,
  Dimensions,
} from 'react-native';
import {ms, mvs, s} from 'react-native-size-matters';
import {IMAGES} from '../../constant/imagePath';
import AppHeader from '../../components/common/AppHeader';
import {COLORS} from '../../constant/color';
import {FONTS, FONTSIZE} from '../../constant/fonts';
import AppLayout from '../../components/layouts/AppLayout';
import {useQuery} from '@apollo/client';
import {hideLoader, showLoader} from '../../components/common/AppLoader';
import RenderHTML from 'react-native-render-html';
import {CMS_PAGE_DATA} from '../../queries/ProductQueries';

const CmsScreen = ({navigation, route}) => {
  console.log('route', route);

  const {slug} = route.params;
  const cmsRef = useRef(null);
  console.log('slug----', slug);
  const {
    loading,
    data: {cmsPage = null} = {},
    refetch,
  } = useQuery(CMS_PAGE_DATA, {
    variables: {
      identifier: slug,
    },
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    refetch({
      identifier: slug,
    });
  }, [slug]);

  useEffect(() => {
    if (loading) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [loading]);

  console.log('cmsPage---', cmsPage);

  useEffect(() => {
    if (cmsRef.current) {
      cmsRef.current.scrollTo({y: 0, animated: false});
    }
  }, [cmsPage, cmsRef]);

  let titleName = '';

  if (slug === 'about-us') {
    titleName = 'About Us';
  } else if (slug === 'term-and-condition') {
    titleName = 'Term & Conditions';
  } else if (slug === 'privacy-policy-cookie-restriction-mode') {
    titleName = 'Privacy Policy';
  }
  return (
    <AppLayout containerStyle={styles.container}>
      <AppHeader
        containerStyle={{paddingHorizontal: ms(15)}}
        headerTitle={cmsPage?.title ? cmsPage?.title : titleName}
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
        ref={cmsRef}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scrollSection}>
        <View style={styles.mainSection}>
          <RenderHTML
            source={{
              html: cmsPage?.content,
            }}
            contentWidth={Dimensions.get('window').width - 40}
            tagsStyles={{
              div: {
                color: COLORS.BLACK,
                fontFamily: FONTS.workSansMedium,
                fontSize: 14,
                textAlign: 'justify',
              },
              p: {
                color: COLORS.BLACK,
                fontFamily: FONTS.workSansMedium,
                fontSize: 14,
                textAlign: 'justify',
              },
            }}
            classesStyles={{}}
          />
        </View>
      </ScrollView>
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: 0,
  },
  scrollSection: {flexGrow: 1, backgroundColor: 'black'},
  mainSection: {
    backgroundColor: 'white',
    paddingBottom: 20,
    paddingHorizontal: 20,
    minHeight: Dimensions.get('window').height - 96,
    paddingTop: ms(20),
  },
});

export default CmsScreen;

import {
  Alert,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {ms, mvs, s} from 'react-native-size-matters';
import AppHeader from '../components/common/AppHeader';
import AppLayout from '../components/layouts/AppLayout';
import {IMAGES} from '../constant/imagePath';
import {FONTS, FONTSIZE} from '../constant/fonts';
import {COLORS} from '../constant/color';
import SingleSelectDropdown from '../components/common/SelectDropdown';
import TextInputBox from '../components/common/TextInputBox';
import GradientButton from '../components/common/GradientButton ';
import {contactUsFormValidate, showToast} from '../utils/global';
import {APP_TEXT} from '../constant/globalConstants';
import {hideLoader, showLoader} from '../components/common/AppLoader';
import {useMutation, useQuery} from '@apollo/client';
import {
  CONTACT_US,
  CONTACT_US_DETAIL,
  CONTACT_US_QUERY,
} from '../queries/ProductQueries';

const queryData = [];
const initialState = {
  selectedSubject: null,
  comment: '',
  address: '',
  phoneNumber: '',
  email: '',
  allSubject: [],
};

const ContactUs = ({navigation}) => {
  const [contactState, setContactState] = useState(initialState);
  const [contactError, setContactError] = useState(initialState);

  const onInputChange = (key, value) => {
    setContactState({...contactState, [key]: value});
    setContactError({...contactError, [key]: ''});
  };

  const {loading, refetch} = useQuery(CONTACT_US_DETAIL, {
    onCompleted: data => {
      hideLoader();
      if (data && data?.sellerContactData) {
        const subjects = data?.sellerContactData?.subjects
          .split(',')
          .map(subject => subject.trim());
        const subjectsMap = subjects.map(subject => ({
          name: subject,
          value: subject,
        }));

        setContactState({
          ...contactState,
          phoneNumber: data?.sellerContactData?.phonenumber,
          address: data?.sellerContactData?.address,
          email: data?.sellerContactData?.adminemail,
          allSubject: subjectsMap,
        });
      }
      hideLoader();
    },
    onError: error => {
      hideLoader();
      console.log('Error fetching categories:', error);
    },
    notifyOnNetworkStatusChange: true,
  });

  const [contactSellerToAdmin] = useMutation(CONTACT_US_QUERY, {
    onCompleted: data => {
      hideLoader();
      if (data && data?.contactSellerToAdmin?.message) {
        showToast(data?.contactSellerToAdmin?.message);
        navigation.navigate('Dashboard');
      } else {
        hideLoader();
        console.log('Your query could not be sent. Please contact support');
      }
    },
    onError: error => {
      hideLoader();
      if (error.graphQLErrors) {
        console.log('GraphQL errors:', JSON.stringify(error.graphQLErrors));
        error.graphQLErrors.forEach(e => {
          if (e.message) {
            showToast(e.message);
          }
        });
      }
      if (error.networkError) {
        if (error.networkError.message) {
          showToast(error.networkError?.message);
        } else {
          showToast(APP_TEXT.network_error);
        }
        console.log('Network error:', JSON.stringify(error.networkError));
      }
    },
    errorPolicy: 'all',
  });

  useEffect(() => {
    if (loading) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [loading]);

  const handleSubmit = () => {
    const valid = contactUsFormValidate(contactState, setContactError);

    if (valid) {
      if (contactState.selectedSubject && contactState.selectedSubject?.value) {
        showLoader();
        contactSellerToAdmin({
          variables: {
            subject: contactState.selectedSubject?.value,
            query: contactState.comment,
          },
        });
      } else {
        showToast('Your query could not be sent. Please contact support');
      }
    } else {
      console.log('form not valid');
    }
  };
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refetch();
    });
    return unsubscribe;
  }, [navigation]);

  console.log(
    'contactState?.allSubject------------',
    contactState?.allSubject?.length,
  );

  return (
    <AppLayout containerStyle={styles.layout}>
      <AppHeader
        containerStyle={styles.headerContainer}
        leftElement={
          <Pressable onPress={() => navigation.goBack()}>
            <Image
              source={IMAGES.ic_backIcon}
              style={{height: mvs(20), width: ms(20)}}
              resizeMode="contain"
            />
          </Pressable>
        }
        rightElement={
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.navigate('Notifications')}>
            <Image
              source={IMAGES.ic_notification}
              style={{height: mvs(20), width: ms(20), tintColor: COLORS.WHITE}}
              resizeMode="contain"
            />
          </TouchableOpacity>
        }
        headerTitle={'Contact Us'}
      />
      <ScrollView
        style={{paddingHorizontal: 15}}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.supportText}>Customer Support</Text>
        <View style={styles.imageContainer}>
          {contactState?.phoneNumber && (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() =>
                Linking.openURL(`tel:${contactState.phoneNumber}`)
              }>
              <Image
                source={IMAGES.ic_contactCall}
                style={styles.img}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}

          {contactState.email && (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => Linking.openURL(`mailto:${contactState.email}`)}>
              <Image
                source={IMAGES.ic_contactUsEmail}
                style={styles.img}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
        </View>
        {contactState?.address && (
          <>
            <Text style={styles.addressText}>Address</Text>
            <Text numberOfLines={3} style={styles.addressDetailText}>
              {contactState?.address}
            </Text>
          </>
        )}
        <Text style={styles.touchText}>Get In Touch</Text>
        <Text style={styles.inQueryText}>
          If have any inquiries get in touch with us.
        </Text>
        <SingleSelectDropdown
          data={
            contactState?.allSubject?.length > 0 ? contactState?.allSubject : []
          }
          isSearch={false}
          dropdownTitle={'Select Subject'}
          onItemSelect={item => {
            setContactState({...contactState, selectedSubject: item});
            setContactError({...contactError, selectedSubject: ''});
          }}
          selectedValue={contactState.selectedSubject}
          errorMessage={contactError.selectedSubject}
          label={'Subject'}
          mainContainerStyle={{marginTop: mvs(25)}}
          labelField="name"
          valueField="value"
          listItemStyle={{backgroundColor: 'white', paddingVertical: 10}}
          //         labelField = 'name',
          // valueField = '_id',
        />

        <TextInputBox
          title={'Message'}
          value={contactState.comment}
          onChangeText={text => {
            onInputChange('comment', text);
          }}
          error={contactError.comment}
          placeholder={'Enter Your Message'}
          containerStyle={{marginTop: mvs(28)}}
          multiline={true}
          inputStyle={{height: mvs(135), flex: 1}}
          textAlignVertical="top"
          numberOfLines={10}
          maxLength={200}
        />
        <GradientButton
          title={APP_TEXT.submit}
          onPress={() => handleSubmit()}
          buttonTxt={styles.btnText}
          mainContainer={{marginTop: mvs(30)}}
        />
      </ScrollView>
    </AppLayout>
  );
};

export default ContactUs;

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: ms(15),
    paddingBottom: mvs(30),
    //   marginTop:20
  },
  layout: {
    paddingHorizontal: ms(0),
  },
  categoryItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1 / 3,
    marginTop: mvs(20),
  },
  categoryImage: {
    width: ms(100),
    height: mvs(100),
    borderRadius: s(100),
    resizeMode: 'cover',
    marginBottom: mvs(10),
    borderColor: COLORS.WHITE,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: FONTSIZE.XL,
    color: COLORS.BLACK,
    fontFamily: FONTS.workSansMedium,
    textAlign: 'center',
  },
  pieChart: {
    height: 200,
    width: 200,
  },
  btnText: {
    fontSize: FONTSIZE.XL,
    fontFamily: FONTS.workSansSemiBold,
  },
  img: {height: mvs(40), width: ms(40), resizeMode: 'contain'},
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: s(10),
    marginTop: mvs(18),
  },
  supportText: {
    marginTop: mvs(30),
    color: COLORS.BLACK,
    fontFamily: FONTS.workSansSemiBold,
    fontSize: FONTSIZE.XL,
  },
  addressText: {
    marginTop: mvs(20),
    color: COLORS.TITLE,
    fontFamily: FONTS.workSansMedium,
    fontSize: FONTSIZE.L,
  },
  addressDetailText: {
    marginTop: mvs(5),
    color: COLORS.BLACK,
    fontFamily: FONTS.workSansMedium,
    fontSize: FONTSIZE.L,
    textAlign: 'left',
  },
  touchText: {
    marginTop: mvs(15),
    color: COLORS.BLACK,
    fontFamily: FONTS.workSansMedium,
    fontSize: FONTSIZE.XXL,
    textAlign: 'left',
  },
  inQueryText: {
    marginTop: mvs(3),
    color: COLORS.TITLE,
    fontFamily: FONTS.workSansRegular,
    fontSize: FONTSIZE.L,
    textAlign: 'left',
  },
});

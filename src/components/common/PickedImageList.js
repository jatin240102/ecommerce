import {
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {ms, mvs, s} from 'react-native-size-matters';
import {IMAGES} from '../../constant/imagePath';
import {COLORS} from '../../constant/color';
import {sWidth} from '../../utils/global';
import {FONTS, FONTSIZE} from '../../constant/fonts';

const PickedImageList = ({
  imageData = [],
  contentContainerStyle,
  flatListStyle,
  onImageCancel,
  onAddImage,
  isDisable = false,
}) => {
  // Add an extra item for the "Add Image" button
  const dataWithAddButton = [...imageData, {isAddButton: true}];

  return (
    <React.Fragment>
      <FlatList
        data={dataWithAddButton}
        numColumns={3}
        showsVerticalScrollIndicator={false}
        style={[{paddingVertical: 20}, flatListStyle]}
        contentContainerStyle={[styles.content, contentContainerStyle]}
        renderItem={({item, index}) => {
          const imageUrl = item?.url ? item?.url : item[0]?.image?.path;
          const cardWidth = (sWidth - ms(70)) / 3;
          if (item.isAddButton) {
            // Render the "Add Image" button
            return (
              <TouchableOpacity
                key={index}
                disabled={isDisable}
                activeOpacity={0.8}
                onPress={onAddImage} // Add image handler passed in props
                style={[styles.imgContainer, {width: cardWidth}]}>
                <Image
                  source={IMAGES.ic_tabCamera}
                  resizeMode="contain"
                  style={{
                    height: mvs(15),
                    width: ms(15),
                    tintColor: COLORS.TITLE,
                    resizeMode: 'contain',
                  }}
                />
                <Text
                  style={{
                    fontFamily: FONTS.workSansMedium,
                    fontSize: FONTSIZE.M,
                    color: COLORS.TITLE,
                  }}>
                  Add Image
                </Text>
              </TouchableOpacity>
            );
          }

          // Render image items
          return (
            <Pressable style={{margin: s(5), width: cardWidth}} key={index}>
              <ImageBackground
                style={styles.selectedImageContainer}
                imageStyle={{borderRadius: 5}}
                source={{uri: imageUrl}}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={styles.selectedImage}
                  onPress={() => {
                    const updatedArray = [...imageData];
                    const removedImage = updatedArray[index];
                    updatedArray.splice(index, 1);
                    onImageCancel(updatedArray, index, removedImage);
                  }}>
                  <Image
                    source={IMAGES.ic_closeIcon}
                    style={styles.closeIcon}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              </ImageBackground>
            </Pressable>
          );
        }}
      />
    </React.Fragment>
  );
};

export default PickedImageList;

const styles = StyleSheet.create({
  selectedImageContainer: {
    flex: 1,
    aspectRatio: 1,
    resizeMode: 'contain',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignContent: 'space-between',
  },
  selectedImage: {
    backgroundColor: COLORS.WHITE,
    borderRadius: s(100),
    padding: s(6),
    top: mvs(-8),
    right: ms(-8),
    position: 'absolute',
    elevation: 20,
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  closeIcon: {
    height: mvs(5),
    width: ms(5),
  },
  imgContainer: {
    backgroundColor: COLORS.WHITE,
    height: (sWidth - ms(70)) / 3,
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: ms(5),
    // aspectRatio: 1,
    top: 8,
    // paddingBottom:10,
    borderColor: COLORS.BORDER,
  },
});

// import {
//   FlatList,
//   Image,
//   ImageBackground,
//   Pressable,
//   StyleSheet,
//   TouchableOpacity,
// } from 'react-native';
// import React from 'react';
// import {ms, mvs, s} from 'react-native-size-matters';
// import {IMAGES} from '../../constant/imagePath';
// import {COLORS} from '../../constant/color';
// import {sWidth} from '../../utils/global';

// const PickedImageList = ({
//   imageData = [],
//   contentContainerStyle,
//   flatListStyle,
//   onImageCancel,
// }) => {
//   return (
//     <React.Fragment>
//       <FlatList
//         data={imageData}
//         numColumns={3}
//         showsVerticalScrollIndicator={false}
//         style={[{paddingTop: 20}, flatListStyle]}
//         contentContainerStyle={[styles.content, contentContainerStyle]}
//         renderItem={({item, index}) => {
//           const cardWidth = (sWidth - ms(70)) / 3;
//           return (
//             <Pressable style={{margin: s(5), width: cardWidth}} key={index}>
//               <ImageBackground
//                 style={styles.selectedImageContainer}
//                 imageStyle={{borderRadius: 5}}
//                 source={{uri: item[0].image.path}}>
//                 <TouchableOpacity
//                   activeOpacity={0.9}
//                   style={styles.selectedImage}
//                   onPress={() => {
//                     const updatedArray = [...imageData];
//                     updatedArray.splice(index, 1);
//                     onImageCancel(updatedArray);
//                   }}>
//                   <Image
//                     source={IMAGES.ic_closeIcon}
//                     style={styles.closeIcon}
//                     resizeMode="cover"
//                   />
//                 </TouchableOpacity>
//               </ImageBackground>
//             </Pressable>
//           );
//         }}
//       />
//       <TouchableOpacity
//         activeOpacity={0.8}
//         onPress={{}}
//         style={styles.imgContainer}>
//         <Image
//           source={IMAGES.ic_AddImageIcon}
//           resizeMode="contain"
//           style={{
//             height: mvs(15),
//             width: ms(15),
//             tintColor: COLORS.TITLE,
//             resizeMode: 'contain',
//           }}
//         />
//       </TouchableOpacity>
//     </React.Fragment>
//   );
// };

// export default PickedImageList;

// const styles = StyleSheet.create({
//   selectedImageContainer: {
//     flex: 1,
//     aspectRatio: 1,
//     resizeMode: 'contain',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   content: {
//     alignContent: 'space-between',
//   },
//   selectedImage: {
//     backgroundColor: COLORS.WHITE,
//     borderRadius: s(100),
//     padding: s(8),
//     top: mvs(-8),
//     right: ms(-8),
//     position: 'absolute',
//     elevation: 20,
//     shadowColor: '#171717',
//     shadowOffset: {width: -2, height: 4},
//     shadowOpacity: 0.2,
//     shadowRadius: 3,
//   },

//   closeIcon: {
//     height: mvs(8),
//     width: ms(8),
//   },
//   imgContainer: {
//     backgroundColor: COLORS.WHITE,
//     height: (sWidth - ms(70)) / 3,
//     width: (sWidth - ms(70)) / 3,
//     borderWidth: 1,
//     borderRadius: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//     // flexDirection: 'row',
//     // marginTop: mvs(30),
//   },
// });

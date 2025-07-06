import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {IMAGES} from '../../constant/imagePath';
import {ms, mvs, s} from 'react-native-size-matters';
import {statusColor} from '../../constant/globalConstants';
import {FONTS, FONTSIZE} from '../../constant/fonts';
import {COLORS} from '../../constant/color';
import {displayPrice} from '../../utils/global';

const AllProductListing = ({
  index,
  item,
  navigation,
  productData,
  isAllProduct = false,
}) => {
  const flatLineLength =
    productData.length === index + 1 ? {} : styles.flatLine;
  const imageUrl = item?.image ? {uri: item?.image} : IMAGES.ic_defaultImage;
  let productStatus = null;

  if (item.seller_status === 'approved') {
    productStatus = 'Approved';
  } else if (item.seller_status === 'Pending') {
    productStatus = 'Pending';
  } else if (item.seller_status === 'Disapproved') {
    productStatus = 'Rejected';
  }
  return (
    <>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() =>
          navigation.navigate('ProductDetail', {
            productId: Number(item?.mageproduct_id),
          })
        }
        style={[
          styles.card,
          index !== 0 && {
            marginTop: mvs(20),
          },
        ]}
        key={Number(item?.mageproduct_id)}>
        <Image
          source={imageUrl}
          style={styles.productImage}
          resizeMode="cover"
        />
        <View style={[styles.productDetails, {flex: 8}]}>
          {item?.name && (
            <Text style={styles.title} numberOfLines={2}>
              {item?.name}
            </Text>
          )}

          <View style={styles.statusWrapper}>
            {item?.currencyCode && item?.price && (
              <>
                <Text style={[styles.price]} numberOfLines={2}>
                  {item?.currencyCode}
                </Text>

                <Text style={[styles.price, {marginLeft: 5}]} numberOfLines={2}>
                  {displayPrice(item?.price)}
                </Text>
              </>
            )}
          </View>

          <View style={styles.statusWrapper}>
            <Text
              numberOfLines={2}
              style={[
                styles.stock,
                item.stock_status === '0' ? styles.outOfStock : null,
              ]}>
              {item.stock_status === '1'
                ? `Stock: ${item.qty}`
                : 'Out of Stock'}
            </Text>

            {isAllProduct && productStatus && (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={[
                    styles.bullet,
                    {color: statusColor[item?.seller_status]},
                  ]}>
                  ●
                </Text>
                <Text
                  numberOfLines={2}
                  style={[
                    styles.statusText,
                    {color: statusColor[item.seller_status]},
                  ]}>
                  {productStatus}
                </Text>
              </View>
            )}
          </View>
        </View>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('EditProduct', {
              productId: Number(item?.mageproduct_id),
            })
          }
          style={[styles.editIconWrapper, {flex: 1}]}
          activeOpacity={0.8}>
          <Image
            source={IMAGES.ic_editRoundIcon}
            style={{height: mvs(20), width: ms(20), resizeMode: 'contain'}}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </TouchableOpacity>
      <View style={flatLineLength} />
    </>
  );
};

export default AllProductListing;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.WHITE,
    borderRadius: s(8),
    marginBottom: mvs(16),
    flex: 1,
  },
  productImage: {
    width: ms(100),
    height: mvs(100),
    flex: 4,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: COLORS.BORDER,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  productDetails: {
    marginLeft: ms(12),
  },
  title: {
    color: COLORS.BLACK,
    fontFamily: FONTS.workSansMedium,
    fontSize: FONTSIZE.L,
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  inventory: {
    color: COLORS.BLACK,
    fontFamily: FONTS.workSansMedium,
    fontSize: FONTSIZE.L,
    marginBottom: 4,
  },
  price: {
    color: COLORS.ERROR,
    fontFamily: FONTS.workSansMedium,
    fontSize: FONTSIZE.L,
    marginBottom: 4,
  },
  stockStatus: {
    color: COLORS.ERROR,
    fontFamily: FONTS.workSansMedium,
    fontSize: FONTSIZE.L,
    marginBottom: 4,
  },
  outOfStock: {
    color: 'red',
  },
  stock: {
    fontFamily: FONTS.workSansSemiBold,
    fontSize: FONTSIZE.L,
    color: COLORS.BLACK,
    marginBottom: 4,
  },
  statusWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  statusText: {
    fontSize: FONTSIZE.L,
    marginLeft: 4,
    fontFamily: FONTS.workSansMedium,
  },
  editIconWrapper: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },

  bullet: {
    fontSize: FONTSIZE.L,
    marginLeft: 10,
  },
  flatLine: {
    height: 0.5,
    backgroundColor: COLORS.BORDER,
  },
});

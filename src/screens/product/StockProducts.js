import {useEffect} from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {ms, mvs} from 'react-native-size-matters';
import {COLORS} from '../../constant/color';
import {products} from '../../constant/globalConstants';
import AllProductListing from '../../components/products/AllProductListing';

const StockProducts = () => {
  const navigation = useNavigation();

  // Pass product count to the top tab bar
  useEffect(() => {
    navigation.setParams({productCount: products.length});
  }, []);

  return (
    <View style={styles.container}>
      {/* <FlatList
        data={products}
        keyExtractor={item => item.id}
        renderItem={({item, index}) => (
          <AllProductListing
            navigation={navigation}
            productData={products}
            index={index}
            item={item}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      /> */}
    </View>
  );
};

export default StockProducts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    paddingTop: mvs(20),
    paddingBottom: mvs(10),
  },
  list: {
    paddingHorizontal: ms(15),
  },
});

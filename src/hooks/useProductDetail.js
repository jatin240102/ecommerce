import {useState, useEffect} from 'react';
import {useQuery} from '@apollo/client'; // Assuming Apollo Client is set up
import {showToast} from '../utils/global';
import {PRODUCT_DETAIL} from '../queries/ProductQueries';
import {hideLoader, showLoader} from '../components/common/AppLoader';

const useProductDetail = id => {
  const [productData, setProductData] = useState(null);
  const [mediaGallery, setMediaGallery] = useState([]);
  const [loading, setLoading] = useState(false);
  const {
    data,
    loading: queryLoading,
    error: queryError,
  } = useQuery(PRODUCT_DETAIL, {
    variables: {id: id},
  });
  // console.log('data----', data);
  // console.log('queryError', queryError);
  useEffect(() => {
    if (queryLoading) {
      setLoading(true);
      showLoader();
    } else if (queryError) {
      setLoading(false);
      hideLoader();
      showToast(queryError.message);
    } else if (
      data &&
      data?.sellerProductDetail &&
      data?.sellerProductDetail?.items
    ) {
      hideLoader();
      setLoading(false);
      setProductData(data?.sellerProductDetail?.items);
      if (data?.sellerProductDetail?.gallery?.length > 0) {
        setMediaGallery(data?.sellerProductDetail?.gallery);
      }
    }

    setLoading(false);
    hideLoader();
  }, [queryLoading, queryError, data]);

  return {loading, productData, mediaGallery};
};

export default useProductDetail;

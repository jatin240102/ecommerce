import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {createContext, useContext, useEffect, useState} from 'react';
import {getCurrencies, getCountry} from 'react-native-localize';
import {STORAGE_KEYS} from '../constant/globalConstants';

const AppContext = createContext();

export const AppProvider = ({children}) => {
  const [deviceCountry, setDeviceCountry] = useState('');
  const [deviceCurrency, setDeviceCurrency] = useState('');
  const [userToken, setUserToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [countryData, setCountryData] = useState(null);
  const [orderEntityId, setOrderEntityId] = useState(null);
  const [orderIncrementId, setOrderIncrementId] = useState(null);
  const [allProductCount, setAllProductCount] = useState(0);
  const [approvedProductCount, setApprovedProductCount] = useState(0);
  const [pendingProductCount, setPendingProductCount] = useState(0);
  const [rejectedProductCount, setRejectedProductCount] = useState(0);
  const [allOrderCount, setAllOrderCount] = useState(0);
  const [completedOrderCount, setCompletedOrderCount] = useState(0);
  const [pendingOrderCount, setPendingOrderCount] = useState(0);
  const [processingOrderCount, setProcessingOrderCount] = useState(0);
  const [cancelOrderCount, setCancelOrderCount] = useState(0);
  const [isInvoiceDetailActive, setIsInvoiceDetailActive] = useState(false);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [isShipmentLevel1Active, setIsShipmentLevel1Active] = useState(false);
  const [orderDetailHeadTitle, setOrderDetailHeadTitle] = useState(null);
  const [isAllOrderActive, setIsAllOrderActive] = useState("");
  const [shipmentId, setShipmentId] = useState(null);
  const [orderSearch, setOrderSearch] = useState("");
  const [filterRecord, setFilterRecord] = useState({
    status: null,
    customer: null,
    increment_id: null,
    start_date: null,
    end_date: null,
    orderSearch: null,
  });

  const [filterValues, setFilterValues] = useState({
    status: null,
    customer: null,
    increment_id: null,
    start_date: null,
    end_date: null,
    orderSearch:null
  });

  const getUserToken = async () => {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    const userInfo = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    const userCountry = await AsyncStorage.getItem(STORAGE_KEYS.USER_COUNTRY);
    if (token) {
      setUserToken(token);
    }

    if (userInfo) {
      setUserData(JSON.parse(userInfo));
    }

    if (countryData) {
      setCountryData(userCountry);
    }

    if (userData?.ca_vendor_country) {
      setCountryData(userData?.ca_vendor_country);
    }
  };

  useEffect(() => {
    getUserToken();
    const country = getCountry();
    const currency = getCurrencies();
    if (country) {
      setDeviceCountry(country);
    }

    if (currency) {
      setDeviceCurrency(currency);
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        deviceCountry,
        deviceCurrency,
        userToken,
        setUserToken,
        userData,
        setUserData,
        allProductCount,
        setAllProductCount,
        approvedProductCount,
        setApprovedProductCount,
        pendingProductCount,
        setPendingProductCount,
        rejectedProductCount,
        setRejectedProductCount,
        countryData,
        setCountryData,
        allOrderCount,
        setAllOrderCount,
        completedOrderCount,
        setCompletedOrderCount,
        pendingOrderCount,
        setPendingOrderCount,
        cancelOrderCount,
        setCancelOrderCount,
        processingOrderCount,
        setProcessingOrderCount,
        orderEntityId,
        setOrderEntityId,
        orderIncrementId,
        setOrderIncrementId,
        orderDetailHeadTitle,
        setOrderDetailHeadTitle,
        isInvoiceDetailActive,
        setIsInvoiceDetailActive,
        filterValues,
        setFilterValues,
        isFilterActive,
        setIsFilterActive,
        orderSearch,
        setOrderSearch,
        isShipmentLevel1Active,
        setIsShipmentLevel1Active,
        shipmentId,
        setShipmentId,
        isAllOrderActive,
        setIsAllOrderActive,
        filterRecord,
        setFilterRecord,
      }}>
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalData = () => {
  return useContext(AppContext);
};

import {gql} from '@apollo/client';

export const GET_CATEGORY = gql`
  query ($pageSize: Int, $currentPage: Int) {
    categories(
      filters: {parent_id: {in: ["2"]}}
      pageSize: $pageSize
      currentPage: $currentPage
    ) {
      items {
        available_sort_by
        canonical_url
        children_count
        created_at
        custom_layout_update_file
        default_sort_by
        description
        display_mode
        filter_price_range
        id
        image
        include_in_menu
        is_anchor
        landing_page
        level
        meta_description
        meta_keywords
        meta_title
        name
        path
        path_in_store
        position
        product_count
        redirect_code
        relative_url
        type
        uid
        updated_at
        url_key
        url_path
        url_suffix
      }
      page_info {
        current_page
        page_size
        total_pages
      }
      total_count
    }
  }
`;

export const ADD_PRODUCT = gql`
  mutation (
    $name: String!
    $description: String!
    $price: Int!
    $sku: String!
    $category_ids: [Int]
    $no_of_products_in_your_bundle: Int!
    $number_of_sustainability_boxes: Int!
    $delivery_methods: String!
    $image: String!
    $thumbnail: String!
    $small_image: String!
    $media_gallery: [ProductImageInput]
    $news_to_date: String!
    $latitude: String
    $longitude: String
  ) {
    sellerAddProduct(
      type: "simple"
      set: 4
      product: {
        name: $name
        description: $description
        price: $price
        quantity_and_stock_status: {
          is_in_stock: 1
          qty: $number_of_sustainability_boxes
        }
        sku: $sku
        stock_data: {manage_stock: 1, use_config_manage_stock: 1}
        visibility: 4
        delivery_methods: $delivery_methods
        number_of_sustainability_boxes: $number_of_sustainability_boxes
        no_of_products_in_your_bundle: $no_of_products_in_your_bundle
        category_ids: $category_ids
        image: $image
        thumbnail: $thumbnail
        small_image: $small_image
        media_gallery: {images: $media_gallery}
        news_to_date: $news_to_date
        latitude: $latitude
        longitude: $longitude
        weight: 0
        product_has_weight: 1
        type_id: "simple"
        attribute_set_id: 4
      }
    ) {
      error
      message
      product_id
    }
  }
`;

export const EDIT_PRODUCT = gql`
  mutation (
    $entity_id: Int!
    $name: String!
    $description: String!
    $price: Int!
    $sku: String!
    $category_ids: [Int]
    $no_of_products_in_your_bundle: Int!
    $number_of_sustainability_boxes: Int!
    $delivery_methods: String!
    $image: String
    $thumbnail: String
    $small_image: String
    $media_gallery: [ProductImageInput]
    $news_to_date: String!
    $latitude: String
    $longitude: String
  ) {
    sellerAddProduct(
      type: "simple"
      set: 4
      product: {
        entity_id: $entity_id
        name: $name
        description: $description
        price: $price
        quantity_and_stock_status: {
          is_in_stock: 1
          qty: $number_of_sustainability_boxes
        }
        sku: $sku
        stock_data: {manage_stock: 1, use_config_manage_stock: 1}
        visibility: 4
        delivery_methods: $delivery_methods
        number_of_sustainability_boxes: $number_of_sustainability_boxes
        no_of_products_in_your_bundle: $no_of_products_in_your_bundle
        category_ids: $category_ids
        image: $image
        thumbnail: $thumbnail
        small_image: $small_image
        media_gallery: {images: $media_gallery}
        news_to_date: $news_to_date
        latitude: $latitude
        longitude: $longitude
        weight: 0
        product_has_weight: 1
        type_id: "simple"
        attribute_set_id: 4
      }
    ) {
      error
      message
      product_id
    }
  }
`;

export const PRODUCT_IMAGE_UPLOAD = gql`
  mutation ($imageEncoded: String!, $imageName: String!) {
    uploadImage(imageEncoded: $imageEncoded, imageName: $imageName) {
      file
      message
      success
      url
    }
  }
`;

export const PRODUCT_LIST = gql`
  query ($pageSize: Int, $currentPage: Int, $status: Int) {
    sellerSelfProduct(
      pageSize: $pageSize
      currentPage: $currentPage
      status: $status
    ) {
      items {
        mageproduct_id
        name
        sku
        type
        currencyCode
        price
        qty
        seller_status
        status
        image
        stock_status
      }
      seller_pending
      seller_approved
      seller_disapproved
      total_count
      page_info {
        current_page
        page_size
        total_pages
      }
    }
  }
`;

export const PRODUCT_STATUS_UPDATE = gql`
  query ($id: Int!, $status: Int!) {
    sellerProductStatusUpdate(mageproduct_id: $id, status: $status) {
      status
      message
    }
  }
`;

export const PRODUCT_DETAIL = gql`
  query ($id: Int!) {
    sellerProductDetail(mageproduct_id: $id) {
      items {
        mageproduct_id
        name
        sku
        type
        currencyCode
        price
        qty
        seller_status
        status
        image
        stock_status
        description
        delivery_methods
        news_to_date
        no_of_products_in_your_bundle
      }
      gallery {
        id
        disabled
        url
        label
        ismainimage
      }
    }
  }
`;

export const CMS_PAGE_DATA = gql`
  query ($identifier: String!) {
    cmsPage(identifier: $identifier) {
      title
      url_key
      content_heading
      content
      page_layout
      meta_title
      meta_keywords
      meta_description
    }
  }
`;

export const CONTACT_US_QUERY = gql`
  mutation ($subject: String!, $query: String!) {
    contactSellerToAdmin(subject: $subject, query: $query) {
      message
    }
  }
`;

export const CONTACT_US_DETAIL = gql`
  query {
    sellerContactData {
      phonenumber
      address
      subjects
      adminemail
    }
  }
`;

export const DASHBOARD_LIST = gql`
  query ($interval: String) {
    sellerDashboard(interval: $interval) {
      total_count
      pendingpercent
      totalpercent
      pending
      orders_total
      complete_total
      pending_total
      canceled_total
      processing_total
      ordercurrencycode
      totalSale
      totalPayout
      remainingPayout
      commissionPaid
      items {
        increment_id
        carrier_name
        coupon_amount
        created_at
        creditmemo_id
        entity_id
        invoice_id
        is_canceled
        order_id
        order_status
        product_ids
        refunded_coupon_amount
        refunded_shipping_charges
        seller_id
        seller_pending_notification
        shipment_id
        shipping_charges
        tax_to_seller
        total_tax
        tracking_number
        updated_at
        order_total
      }
    }
  }
`;

export const SELLER_ORDER_LIST = gql`
  query (
    $status: String
    $customer: String
    $increment_id: String
    $start_date: String
    $end_date: String
    $searchtext: String
    $pageSize: Int
    $currentPage: Int
  ) {
    sellerCustomOrderList(
      status: $status
      customer: $customer
      increment_id: $increment_id
      start_date: $start_date
      end_date: $end_date
      searchtext: $searchtext
      pageSize: $pageSize
      currentPage: $currentPage
    ) {
      items {
        entity_id
        increment_id
        status
        grand_total
        order_currency_code
        created_at
        customer_firstname
        customer_lastname
        email
        itemdata {
          name
          thumbnail
          row_total
          qty_ordered
          qty_canceled
          qty_invoiced
          qty_ordered
          qty_refunded
          qty_shipped
          item_id
        }
        shippingaddress {
          firstname
          lastname
          street
          city
          region
          country_id
          postcode
          telephone
        }
        billingaddress {
          firstname
          lastname
          street
          city
          region
          country_id
          postcode
          telephone
        }
        subtotal {
          title
          value
        }
        shippingMethodData {
          title
          value
        }
        paymentMethodData {
          title
          value
        }
        shipping {
          title
          value
        }
        tax {
          title
          value
        }
        totalOrderedAmount {
          title
          value
        }
        totalVendorAmount {
          title
          value
        }
        totalAdminComission {
          title
          value
        }
      }
      total_processing
      total_pending
      total_complete
      total_canceled
      total_count
      total_filter_count
      page_info {
        current_page
        page_size
        total_pages
        total_record_on_page
      }
    }
  }
`;

export const SELLER_ORDER_DETAIL = gql`
  query (
    $status: String
    $customer: String
    $increment_id: String
    $start_date: String
    $end_date: String
    $searchText: String
    $pageSize: Int = 10
    $currentPage: Int = 1
  ) {
    sellerCustomOrderList(
      status: $status
      customer: $customer
      increment_id: $increment_id
      start_date: $start_date
      end_date: $end_date
      searchtext: $searchText
      pageSize: $pageSize
      currentPage: $currentPage
    ) {
      items {
        entity_id
        increment_id
        status
        grand_total
        order_currency_code
        created_at
        customer_firstname
        customer_lastname
        email
        itemdata {
          name
          thumbnail
          row_total
          qty_ordered
          qty_canceled
          qty_invoiced
          qty_ordered
          qty_refunded
          qty_shipped
          item_id
        }
        shippingaddress {
          firstname
          lastname
          street
          city
          region
          country_id
          postcode
          telephone
        }
        billingaddress {
          firstname
          lastname
          street
          city
          region
          country_id
          postcode
          telephone
        }
        subtotal {
          title
          value
        }
        totalcopuondiscount {
          value
        }
        shippingMethodData {
          title
          value
        }
        paymentMethodData {
          title
          value
        }
        shipping {
          title
          value
        }
        tax {
          title
          value
        }
        totalOrderedAmount {
          title
          value
        }
        totalVendorAmount {
          title
          value
        }
        totalAdminComission {
          title
          value
        }
      }
      total_count
    }
  }
`;

export const SELLER_INVOICE_LIST = gql`
  query ($orderId: Int) {
    sellerGetInvoiceList(orderId: $orderId) {
      item {
        order_id
        invoice_id
        invoice_increment_id
        name
        created_at
        total
      }
    }
  }
`;

export const SELLER_INVOICE_DETAIL = gql`
  query ($orderId: Int, $invoiceId: Int) {
    sellerGetInvoiceDetails(orderId: $orderId, invoiceId: $invoiceId) {
      billingAddressData {
        title
        address {
          name
          street
          state
          country
          telephone
        }
      }
      buyerData {
        emailLabel
        emailValue
        nameLabel
        nameValue
        title
      }
      items {
        adminComission
        price
        productName
        qty {
          Ordered
          Invoiced
          Shipped
          Canceled
          Refunded
        }
        subTotal
        vendorTotal
      }
      mainHeading
      orderData {
        dateLabel
        dateValue
        label
        statusLabel
        statusValue
        title
      }
      paymentMethodData {
        method
        title
      }
      sendmailAction
      sendmailWarning
      shipping {
        title
        value
      }
      shippingAddressData {
        title
        address {
          name
          street
          state
          country
          telephone
        }
      }
      shippingMethodData {
        method
        title
      }
      subHeading
      subtotal {
        title
        value
      }
      tax {
        title
        value
      }
      totalAdminComission {
        title
        value
      }
      totalOrderedAmount {
        title
        value
      }
      totalVendorAmount {
        title
        value
      }
    }
  }
`;

export const SELLER_SHIPMENT_LIST = gql`
  query ($orderId: Int) {
    sellerGetShipmentList(orderId: $orderId) {
      status
      can_shipment
      item {
        order_id
        shipment_id
        shipment_increment_id
        name
        created_at
        qty
      }
    }
  }
`;
export const SELLER_SHIPMENT_DETAIL = gql`
  query ($orderId: Int, $shipmentId: Int) {
    sellerGetShipmentDetails(orderId: $orderId, shipmentId: $shipmentId) {
      billingAddressData {
        address {
          country
          name
          state
          street
          telephone
        }
        title
      }
      buyerData {
        emailLabel
        emailValue
        nameLabel
        nameValue
        title
      }
      items {
        productName
        qty
        sku
      }
      mainHeading
      orderData {
        dateLabel
        dateValue
        label
        statusLabel
        statusValue
        title
      }
      paymentMethodData {
        method
        title
      }
      sendmailAction
      sendmailWarning
      shippingAddressData {
        address {
          country
          name
          state
          street
          telephone
        }
        title
      }
      shippingCarriers {
        carrier
        number
        title
        date
      }
      shippingMethodData {
        method
        title
      }
      subHeading
    }
  }
`;

export const SELLER_TRANSACTION_LIST = gql`
  query ($interval: String) {
    sellerTransaction(interval: $interval) {
      total_count
      pendingpercent
      totalpercent
      pending
      orders_total
      complete_total
      pending_total
      canceled_total
      processing_total
      ordercurrencycode
      totalSale
      totalTax
      totalPayout
      remainingPayout
      commissionPaid
      items {
        increment_id
        carrier_name
        coupon_amount
        created_at
        creditmemo_id
        entity_id
        invoice_id
        is_canceled
        order_id
        order_status
        product_ids
        refunded_coupon_amount
        refunded_shipping_charges
        seller_id
        seller_pending_notification
        shipment_id
        shipping_charges
        tax_to_seller
        total_tax
        tracking_number
        updated_at
        order_total
        order_currency_code
      }
    }
  }
`;

export const SELLER_ADD_TRACKING = gql`
  mutation (
    $orderId: Int!
    $shipmentId: Int!
    $trackingId: String!
    $carrier: String
  ) {
    sellerAddTracking(
      orderId: $orderId
      shipmentId: $shipmentId
      trackingId: $trackingId
      carrier: $carrier
    ) {
      message
    }
  }
`;

export const SELLER_CREATE_SHIPMENT = gql`
  mutation (
    $orderId: Int!
    $trackingId: String!
    $carrier: String
    $comment: String
    $sendemail: String
    $items: [ShipmentItemInput]
  ) {
    sellerCreateShipment(
      orderId: $orderId
      trackingId: $trackingId
      carrier: $carrier
      comment: $comment
      sendemail: $sendemail
      items: $items
    ) {
      message
    }
  }
`;

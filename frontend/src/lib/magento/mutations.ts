// Magento GraphQL Mutations

export const CREATE_EMPTY_CART = `
  mutation CreateEmptyCart {
    createEmptyCart
  }
`;

export const ADD_SIMPLE_PRODUCT_TO_CART = `
  mutation AddSimpleProductToCart($cartId: String!, $sku: String!, $quantity: Float!) {
    addSimpleProductsToCart(
      input: {
        cart_id: $cartId
        cart_items: [{ data: { sku: $sku, quantity: $quantity } }]
      }
    ) {
      cart {
        id
        items {
          id
          product { sku name }
          quantity
        }
      }
    }
  }
`;

export const ADD_CONFIGURABLE_PRODUCT_TO_CART = `
  mutation AddConfigurableProductToCart(
    $cartId: String!
    $parentSku: String!
    $sku: String!
    $quantity: Float!
  ) {
    addConfigurableProductsToCart(
      input: {
        cart_id: $cartId
        cart_items: [{
          parent_sku: $parentSku
          data: { sku: $sku, quantity: $quantity }
        }]
      }
    ) {
      cart {
        id
        items {
          id
          product { sku name }
          quantity
        }
      }
    }
  }
`;

export const UPDATE_CART_ITEMS = `
  mutation UpdateCartItems($cartId: String!, $cartItemId: Int!, $quantity: Float!) {
    updateCartItems(
      input: {
        cart_id: $cartId
        cart_items: [{ cart_item_id: $cartItemId, quantity: $quantity }]
      }
    ) {
      cart {
        items {
          id
          quantity
        }
      }
    }
  }
`;

export const REMOVE_CART_ITEM = `
  mutation RemoveCartItem($cartId: String!, $cartItemId: Int!) {
    removeItemFromCart(input: { cart_id: $cartId, cart_item_id: $cartItemId }) {
      cart {
        items {
          id
        }
      }
    }
  }
`;

export const APPLY_COUPON = `
  mutation ApplyCoupon($cartId: String!, $couponCode: String!) {
    applyCouponToCart(input: { cart_id: $cartId, coupon_code: $couponCode }) {
      cart {
        applied_coupons { code }
        prices {
          grand_total { value currency }
          discounts { amount { value } label }
        }
      }
    }
  }
`;

export const REMOVE_COUPON = `
  mutation RemoveCoupon($cartId: String!) {
    removeCouponFromCart(input: { cart_id: $cartId }) {
      cart {
        applied_coupons { code }
        prices {
          grand_total { value currency }
        }
      }
    }
  }
`;

export const GENERATE_CUSTOMER_TOKEN = `
  mutation GenerateCustomerToken($email: String!, $password: String!) {
    generateCustomerToken(email: $email, password: $password) {
      token
    }
  }
`;

export const CREATE_CUSTOMER = `
  mutation CreateCustomer($input: CustomerCreateInput!) {
    createCustomerV2(input: $input) {
      customer {
        id
        email
        firstname
        lastname
      }
    }
  }
`;

export const UPDATE_CUSTOMER = `
  mutation UpdateCustomer($input: CustomerUpdateInput!) {
    updateCustomerV2(input: $input) {
      customer {
        email
        firstname
        lastname
      }
    }
  }
`;

export const SET_SHIPPING_ADDRESS = `
  mutation SetShippingAddress($cartId: String!, $address: ShippingAddressInput!) {
    setShippingAddressesOnCart(
      input: { cart_id: $cartId, shipping_addresses: [$address] }
    ) {
      cart {
        shipping_addresses {
          available_shipping_methods {
            carrier_code
            carrier_title
            method_code
            method_title
            amount { value currency }
          }
        }
      }
    }
  }
`;

export const SET_BILLING_ADDRESS = `
  mutation SetBillingAddress($cartId: String!, $address: BillingAddressInput!) {
    setBillingAddressOnCart(input: { cart_id: $cartId, billing_address: $address }) {
      cart {
        billing_address {
          firstname
          lastname
          street
          city
          postcode
          country { code }
        }
      }
    }
  }
`;

export const SET_SHIPPING_METHOD = `
  mutation SetShippingMethod($cartId: String!, $carrierCode: String!, $methodCode: String!) {
    setShippingMethodsOnCart(
      input: {
        cart_id: $cartId
        shipping_methods: [{ carrier_code: $carrierCode, method_code: $methodCode }]
      }
    ) {
      cart {
        shipping_addresses {
          selected_shipping_method {
            carrier_title
            method_title
            amount { value currency }
          }
        }
      }
    }
  }
`;

export const SET_PAYMENT_METHOD = `
  mutation SetPaymentMethod($cartId: String!, $paymentCode: String!) {
    setPaymentMethodOnCart(
      input: { cart_id: $cartId, payment_method: { code: $paymentCode } }
    ) {
      cart {
        selected_payment_method { code title }
      }
    }
  }
`;

export const PLACE_ORDER = `
  mutation PlaceOrder($cartId: String!) {
    placeOrder(input: { cart_id: $cartId }) {
      order {
        order_number
      }
    }
  }
`;

export const SUBSCRIBE_TO_NEWSLETTER = `
  mutation SubscribeToNewsletter($email: String!) {
    subscribeEmailToNewsletter(email: $email) {
      status
    }
  }
`;

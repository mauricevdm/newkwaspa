// Magento GraphQL Queries

export const GET_PRODUCTS = `
  query GetProducts(
    $pageSize: Int
    $currentPage: Int
    $filter: ProductAttributeFilterInput
    $sort: ProductAttributeSortInput
  ) {
    products(
      pageSize: $pageSize
      currentPage: $currentPage
      filter: $filter
      sort: $sort
    ) {
      total_count
      items {
        id
        sku
        name
        url_key
        price_range {
          minimum_price {
            regular_price { value currency }
            final_price { value currency }
            discount { amount_off percent_off }
          }
        }
        image { url label }
        thumbnail { url label }
        rating_summary
        review_count
        stock_status
      }
      page_info {
        current_page
        page_size
        total_pages
      }
    }
  }
`;

export const GET_PRODUCT_BY_SLUG = `
  query GetProduct($urlKey: String!) {
    products(filter: { url_key: { eq: $urlKey } }) {
      items {
        id
        sku
        name
        url_key
        description { html }
        short_description { html }
        price_range {
          minimum_price {
            regular_price { value currency }
            final_price { value currency }
            discount { amount_off percent_off }
          }
        }
        media_gallery {
          url
          label
          position
        }
        rating_summary
        review_count
        reviews {
          items {
            summary
            text
            nickname
            created_at
            average_rating
          }
        }
        stock_status
        meta_title
        meta_description
        categories { id name url_key }
      }
    }
  }
`;

export const GET_CATEGORIES = `
  query GetCategories {
    categories {
      items {
        id
        name
        url_key
        image
        product_count
        children {
          id
          name
          url_key
          image
          product_count
        }
      }
    }
  }
`;

export const GET_CART = `
  query GetCart($cartId: String!) {
    cart(cart_id: $cartId) {
      id
      email
      items {
        id
        product {
          id
          sku
          name
          url_key
          thumbnail { url }
        }
        quantity
        prices {
          row_total { value currency }
          price { value currency }
        }
      }
      prices {
        subtotal_excluding_tax { value currency }
        subtotal_including_tax { value currency }
        grand_total { value currency }
        discounts { amount { value } label }
      }
      applied_coupons { code }
      shipping_addresses {
        selected_shipping_method {
          carrier_title
          method_title
          amount { value currency }
        }
      }
    }
  }
`;

export const GET_CUSTOMER = `
  query GetCustomer {
    customer {
      id
      email
      firstname
      lastname
      is_subscribed
      addresses {
        id
        firstname
        lastname
        street
        city
        region { region_code region }
        postcode
        country_code
        telephone
        default_billing
        default_shipping
      }
      orders(pageSize: 5) {
        items {
          id
          order_number
          created_at
          status
          grand_total
        }
      }
    }
  }
`;

export const SEARCH_PRODUCTS = `
  query SearchProducts($searchTerm: String!, $pageSize: Int, $currentPage: Int) {
    products(
      search: $searchTerm
      pageSize: $pageSize
      currentPage: $currentPage
    ) {
      total_count
      items {
        id
        sku
        name
        url_key
        price_range {
          minimum_price {
            final_price { value currency }
          }
        }
        thumbnail { url label }
        rating_summary
      }
      page_info {
        total_pages
      }
    }
  }
`;

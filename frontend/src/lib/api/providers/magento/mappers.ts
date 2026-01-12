/**
 * Magento Provider - Type Mappers
 * 
 * Transforms Magento GraphQL responses to our unified API types.
 */

import type {
  Product,
  Category,
  Brand,
  Cart,
  CartItem,
  User,
  Address,
  Order,
  Price,
  ProductAttribute,
  ProductImage,
  PaginatedResult,
} from '../../types';

// ============================================================================
// Magento GraphQL Response Types
// ============================================================================

interface MagentoPrice {
  value: number;
  currency: string;
}

interface MagentoPriceRange {
  minimum_price: {
    regular_price: MagentoPrice;
    final_price: MagentoPrice;
    discount?: {
      amount_off: number;
      percent_off: number;
    };
  };
}

interface MagentoImage {
  url: string;
  label?: string;
  position?: number;
}

interface MagentoProductItem {
  id: string | number;
  sku: string;
  name: string;
  url_key: string;
  description?: { html: string };
  short_description?: { html: string };
  price_range: MagentoPriceRange;
  image?: MagentoImage;
  thumbnail?: MagentoImage;
  small_image?: MagentoImage;
  media_gallery?: MagentoImage[];
  rating_summary?: number;
  review_count?: number;
  stock_status: string;
  meta_title?: string;
  meta_description?: string;
  categories?: Array<{
    id: string;
    name: string;
    url_key: string;
  }>;
  custom_attributes?: Array<{
    attribute_code: string;
    value: string;
  }>;
}

interface MagentoCategoryItem {
  id: string;
  name: string;
  url_key: string;
  image?: string;
  description?: string;
  product_count?: number;
  level?: number;
  path?: string;
  children?: MagentoCategoryItem[];
}

interface MagentoCartItem {
  id: string;
  product: {
    id: string;
    sku: string;
    name: string;
    url_key: string;
    thumbnail?: MagentoImage;
  };
  quantity: number;
  prices: {
    row_total: MagentoPrice;
    price: MagentoPrice;
  };
}

interface MagentoCart {
  id: string;
  email?: string;
  items: MagentoCartItem[];
  prices: {
    subtotal_excluding_tax: MagentoPrice;
    subtotal_including_tax: MagentoPrice;
    grand_total: MagentoPrice;
    discounts?: Array<{
      amount: MagentoPrice;
      label: string;
    }>;
  };
  applied_coupons?: Array<{ code: string }>;
  shipping_addresses?: Array<{
    selected_shipping_method?: {
      carrier_title: string;
      method_title: string;
      amount: MagentoPrice;
    };
  }>;
}

interface MagentoAddress {
  id: string;
  firstname: string;
  lastname: string;
  company?: string;
  street: string[];
  city: string;
  region?: { region_code: string; region: string };
  postcode: string;
  country_code: string;
  telephone: string;
  default_billing?: boolean;
  default_shipping?: boolean;
}

interface MagentoCustomer {
  id?: string;
  email: string;
  firstname: string;
  lastname: string;
  middlename?: string;
  prefix?: string;
  suffix?: string;
  date_of_birth?: string;
  taxvat?: string;
  gender?: number;
  addresses?: MagentoAddress[];
}

interface MagentoOrderItem {
  id: string;
  product_sku: string;
  product_name: string;
  product_url_key?: string;
  quantity_ordered: number;
  status: string;
  product_sale_price: MagentoPrice;
}

interface MagentoOrder {
  id: string;
  order_number: string;
  order_date: string;
  status: string;
  items: MagentoOrderItem[];
  total: {
    subtotal: MagentoPrice;
    taxes?: Array<{ amount: MagentoPrice; title: string }>;
    discounts?: Array<{ amount: MagentoPrice; label: string }>;
    shipping_handling: MagentoPrice;
    grand_total: MagentoPrice;
  };
  shipping_address: MagentoAddress;
  billing_address: MagentoAddress;
  payment_methods: Array<{ name: string; type: string }>;
  shipping_method?: string;
}

// ============================================================================
// Mapper Functions
// ============================================================================

/**
 * Format price for display
 */
function formatPrice(amount: number, currency = 'ZAR'): string {
  if (currency === 'ZAR') {
    return `R${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  }
  return new Intl.NumberFormat('en-ZA', { style: 'currency', currency }).format(amount);
}

/**
 * Convert Magento price to our Price type
 */
export function mapPrice(magentoPrice?: MagentoPrice): Price {
  if (!magentoPrice) {
    return { amount: 0, currency: 'ZAR', formatted: 'R0.00' };
  }
  return {
    amount: magentoPrice.value,
    currency: magentoPrice.currency || 'ZAR',
    formatted: formatPrice(magentoPrice.value, magentoPrice.currency),
  };
}

/**
 * Map Magento product to our Product type
 */
export function mapProduct(item: MagentoProductItem): Product {
  const priceRange = item.price_range?.minimum_price;
  const regularPrice = mapPrice(priceRange?.regular_price);
  const finalPrice = mapPrice(priceRange?.final_price);
  const hasDiscount =
    Boolean(priceRange?.discount && priceRange.discount.amount_off > 0) &&
    finalPrice.amount > 0 &&
    finalPrice.amount < regularPrice.amount;

  // Extract brand from custom attributes if available
  const brandAttr = item.custom_attributes?.find(
    (attr) => attr.attribute_code === 'brand' || attr.attribute_code === 'manufacturer'
  );

  const brand: Brand = brandAttr
    ? {
        id: String(brandAttr.value),
        slug: String(brandAttr.value).toLowerCase().replace(/\s+/g, '-'),
        name: String(brandAttr.value),
      }
    : {
        id: 'unknown',
        slug: 'unknown',
        name: 'Unknown',
      };

  // Build images array
  const images: ProductImage[] =
    item.media_gallery?.map((img, index) => ({
      id: `img-${index}`,
      url: img.url,
      alt: img.label || item.name,
      isDefault: (img.position ?? index) === 0,
    })) || [];

  // If no media gallery, use thumbnail/image
  if (images.length === 0 && (item.thumbnail?.url || item.image?.url)) {
    images.push({
      id: 'img-0',
      url: item.thumbnail?.url || item.image?.url || '',
      alt: item.thumbnail?.label || item.image?.label || item.name,
      isDefault: true,
    });
  }

  if (images.length > 0 && !images.some((img) => img.isDefault)) {
    images[0].isDefault = true;
  }

  const attributes: ProductAttribute[] =
    item.custom_attributes?.map((attr) => ({
      name: attr.attribute_code,
      code: attr.attribute_code,
      value: String(attr.value),
    })) || [];

  const categories: Category[] =
    item.categories?.map((cat) => ({
      id: String(cat.id),
      slug: cat.url_key,
      name: cat.name,
      level: 0,
      path: [cat.url_key],
    })) || [];

  const price: Price = hasDiscount
    ? {
        ...finalPrice,
        compareAtAmount: regularPrice.amount,
        compareAtFormatted: regularPrice.formatted,
      }
    : regularPrice;

  return {
    id: item.id?.toString() || item.sku,
    sku: item.sku,
    slug: item.url_key,
    name: item.name,
    description: item.description?.html || item.short_description?.html || '',
    shortDescription: item.short_description?.html,
    price,
    images,
    brand,
    categories,
    attributes,
    stock: {
      inStock: item.stock_status === 'IN_STOCK',
      quantity: item.stock_status === 'IN_STOCK' ? 100 : 0,
    },
    rating: item.rating_summary
      ? {
          average: item.rating_summary / 20, // Convert 0-100 to 0-5
          count: item.review_count || 0,
        }
      : undefined,
    metaTitle: item.meta_title || item.name,
    metaDescription: item.meta_description || item.short_description?.html || '',
    createdAt: new Date().toISOString(), // Magento doesn't expose this in default queries
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Map Magento category to our Category type
 */
export function mapCategory(item: MagentoCategoryItem, level = 0, parentPath: string[] = []): Category {
  const path = [...parentPath, item.url_key];
  
  return {
    id: item.id,
    slug: item.url_key,
    name: item.name,
    description: item.description,
    image: item.image,
    level,
    path,
    productCount: item.product_count,
    children: item.children?.map((child) => mapCategory(child, level + 1, path)),
  };
}

/**
 * Map Magento cart to our Cart type
 */
export function mapCart(magentoCart: MagentoCart): Cart {
  const items: CartItem[] = magentoCart.items.map((item) => ({
    id: item.id,
    productId: String(item.product.id),
    sku: item.product.sku,
    name: item.product.name,
    slug: item.product.url_key,
    image: item.product.thumbnail?.url || '',
    quantity: item.quantity,
    price: mapPrice(item.prices.price),
    subtotal: mapPrice(item.prices.row_total),
  }));

  const subtotal = mapPrice(magentoCart.prices.subtotal_excluding_tax);
  const total = mapPrice(magentoCart.prices.grand_total);
  
  // Calculate tax
  const taxAmount = magentoCart.prices.subtotal_including_tax.value - 
    magentoCart.prices.subtotal_excluding_tax.value;
  const tax: Price = {
    amount: taxAmount,
    currency: magentoCart.prices.subtotal_including_tax.currency || 'ZAR',
    formatted: formatPrice(taxAmount),
  };

  // Get shipping
  const shippingMethod = magentoCart.shipping_addresses?.[0]?.selected_shipping_method;
  const shipping = shippingMethod ? mapPrice(shippingMethod.amount) : mapPrice();

  // Calculate discount
  const discountAmount = magentoCart.prices.discounts?.reduce(
    (sum, d) => sum + d.amount.value,
    0
  ) || 0;
  const discount: Price = {
    amount: discountAmount,
    currency: 'ZAR',
    formatted: formatPrice(discountAmount),
  };

  return {
    id: magentoCart.id,
    items,
    totals: {
      subtotal,
      discount,
      shipping,
      tax,
      total,
    },
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Map Magento address to our Address type
 */
export function mapAddress(magentoAddress: MagentoAddress): Address {
  const region = magentoAddress.region?.region || magentoAddress.region?.region_code || '';

  return {
    id: magentoAddress.id,
    firstName: magentoAddress.firstname,
    lastName: magentoAddress.lastname,
    company: magentoAddress.company,
    street: magentoAddress.street,
    city: magentoAddress.city,
    region,
    regionCode: magentoAddress.region?.region_code,
    postcode: magentoAddress.postcode,
    country: magentoAddress.country_code,
    countryCode: magentoAddress.country_code,
    phone: magentoAddress.telephone,
    isDefaultShipping: Boolean(magentoAddress.default_shipping),
    isDefaultBilling: Boolean(magentoAddress.default_billing),
  };
}

/**
 * Map Magento customer to our User type
 */
export function mapUser(customer: MagentoCustomer): User {
  const firstName = customer.firstname;
  const lastName = customer.lastname;

  return {
    id: customer.id || customer.email,
    email: customer.email,
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`.trim(),
    addresses: customer.addresses?.map(mapAddress) || [],
    defaultBillingAddressId: customer.addresses?.find((a) => a.default_billing)?.id,
    defaultShippingAddressId: customer.addresses?.find((a) => a.default_shipping)?.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Map Magento order to our Order type
 */
export function mapOrder(magentoOrder: MagentoOrder): Order {
  // Calculate tax from taxes array
  const taxAmount = magentoOrder.total.taxes?.reduce((sum, t) => sum + t.amount.value, 0) || 0;
  
  // Calculate discount from discounts array
  const discountAmount = magentoOrder.total.discounts?.reduce(
    (sum, d) => sum + d.amount.value,
    0
  ) || 0;

  const subtotal = mapPrice(magentoOrder.total.subtotal);
  const shipping = mapPrice(magentoOrder.total.shipping_handling);
  const total = mapPrice(magentoOrder.total.grand_total);
  const discount: Price = {
    amount: discountAmount,
    currency: 'ZAR',
    formatted: formatPrice(discountAmount),
  };
  const tax: Price = {
    amount: taxAmount,
    currency: 'ZAR',
    formatted: formatPrice(taxAmount),
  };

  const paymentMethod = magentoOrder.payment_methods[0]
    ? {
        code: magentoOrder.payment_methods[0].type,
        name: magentoOrder.payment_methods[0].name,
      }
    : { code: 'unknown', name: 'Unknown' };

  const shippingMethod = magentoOrder.shipping_method
    ? {
        code: 'shipping',
        name: magentoOrder.shipping_method,
        price: shipping,
      }
    : { code: 'shipping', name: 'Shipping', price: shipping };

  return {
    id: magentoOrder.id,
    orderNumber: magentoOrder.order_number,
    status: mapOrderStatus(magentoOrder.status),
    items: magentoOrder.items.map((item) => ({
      id: item.id,
      productId: item.product_sku,
      sku: item.product_sku,
      name: item.product_name,
      image: '',
      quantity: item.quantity_ordered,
      price: mapPrice(item.product_sale_price),
      subtotal: {
        amount: item.product_sale_price.value * item.quantity_ordered,
        currency: item.product_sale_price.currency || 'ZAR',
        formatted: formatPrice(item.product_sale_price.value * item.quantity_ordered),
      },
    })),
    shippingAddress: mapAddress(magentoOrder.shipping_address),
    billingAddress: mapAddress(magentoOrder.billing_address),
    shippingMethod,
    paymentMethod,
    totals: {
      subtotal,
      discount,
      shipping,
      tax,
      total,
    },
    createdAt: magentoOrder.order_date,
    updatedAt: magentoOrder.order_date,
  };
}

/**
 * Map Magento order status to our status type
 */
function mapOrderStatus(
  magentoStatus: string
): 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded' {
  const statusMap: Record<string, Order['status']> = {
    pending: 'pending',
    pending_payment: 'pending',
    processing: 'processing',
    complete: 'delivered',
    closed: 'refunded',
    canceled: 'cancelled',
    holded: 'pending',
    payment_review: 'pending',
    fraud: 'cancelled',
  };

  return statusMap[magentoStatus.toLowerCase()] || 'pending';
}

/**
 * Map paginated response
 */
export function mapPaginatedProducts(
  data: {
    items: MagentoProductItem[];
    total_count: number;
    page_info: {
      current_page: number;
      page_size: number;
      total_pages: number;
    };
  }
): PaginatedResult<Product> {
  return {
    items: data.items.map(mapProduct),
    total: data.total_count,
    page: data.page_info.current_page,
    pageSize: data.page_info.page_size,
    totalPages: data.page_info.total_pages,
    hasNextPage: data.page_info.current_page < data.page_info.total_pages,
    hasPreviousPage: data.page_info.current_page > 1,
  };
}

export default {
  mapPrice,
  mapProduct,
  mapCategory,
  mapCart,
  mapAddress,
  mapUser,
  mapOrder,
  mapPaginatedProducts,
};

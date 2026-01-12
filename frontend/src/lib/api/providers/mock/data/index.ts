/**
 * Mock Data Index
 * Re-exports all mock data for easy imports
 */

export { mockProducts } from './products.generated';
export { mockCategories } from './categories';
export { mockBrands } from './brands';
export {
  mockUsers,
  mockCredentials,
  verifyMockPassword,
  getMockUserByEmail,
  getMockUserById,
  type MockUserCredentials,
  type MockUserWithCredentials,
} from './users';

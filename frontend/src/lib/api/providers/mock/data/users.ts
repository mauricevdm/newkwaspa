/**
 * Mock Users Data
 */

import type { User, Address } from '../../../types';

export interface MockUserCredentials {
  email: string;
  password: string;
}

export interface MockUserWithCredentials extends User {
  passwordHash: string;
}

// Test user addresses
const testAddresses: Address[] = [
  {
    id: 'addr-001',
    firstName: 'John',
    lastName: 'Doe',
    company: 'Dermastore Test',
    street: ['123 Main Road', 'Unit 4'],
    city: 'Cape Town',
    region: 'Western Cape',
    postcode: '8001',
    country: 'South Africa',
    countryCode: 'ZA',
    phone: '+27 21 123 4567',
    isDefaultShipping: true,
    isDefaultBilling: true,
  },
  {
    id: 'addr-002',
    firstName: 'John',
    lastName: 'Doe',
    street: ['456 Beach Road'],
    city: 'Durban',
    region: 'KwaZulu-Natal',
    postcode: '4001',
    country: 'South Africa',
    countryCode: 'ZA',
    phone: '+27 31 123 4567',
    isDefaultShipping: false,
    isDefaultBilling: false,
  },
];

const testAddresses2: Address[] = [
  {
    id: 'addr-003',
    firstName: 'Jane',
    lastName: 'Smith',
    company: 'Beauty Co',
    street: ['789 Sandton Drive'],
    city: 'Johannesburg',
    region: 'Gauteng',
    postcode: '2196',
    country: 'South Africa',
    countryCode: 'ZA',
    phone: '+27 11 123 4567',
    isDefaultShipping: true,
    isDefaultBilling: true,
  },
];

// Mock users with hashed passwords (in real app, use bcrypt)
// Password for all test users is: Test@123
export const mockUsers: MockUserWithCredentials[] = [
  {
    id: 'user-001',
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    fullName: 'John Doe',
    phone: '+27 82 123 4567',
    addresses: testAddresses,
    defaultBillingAddressId: 'addr-001',
    defaultShippingAddressId: 'addr-001',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-06-01T15:30:00Z',
    passwordHash: 'mock_hash_Test@123', // In real implementation, this would be bcrypt hash
  },
  {
    id: 'user-002',
    email: 'jane.smith@example.com',
    firstName: 'Jane',
    lastName: 'Smith',
    fullName: 'Jane Smith',
    phone: '+27 83 987 6543',
    addresses: testAddresses2,
    defaultBillingAddressId: 'addr-003',
    defaultShippingAddressId: 'addr-003',
    createdAt: '2024-02-20T14:00:00Z',
    updatedAt: '2024-05-15T09:15:00Z',
    passwordHash: 'mock_hash_Test@123',
  },
  {
    id: 'user-003',
    email: 'test@dermastore.co.za',
    firstName: 'Test',
    lastName: 'User',
    fullName: 'Test User',
    phone: '+27 84 555 1234',
    addresses: [],
    createdAt: '2024-06-01T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z',
    passwordHash: 'mock_hash_Test@123',
  },
];

// Test credentials for login
export const mockCredentials: MockUserCredentials[] = [
  { email: 'john.doe@example.com', password: 'Test@123' },
  { email: 'jane.smith@example.com', password: 'Test@123' },
  { email: 'test@dermastore.co.za', password: 'Test@123' },
];

// Helper to verify password (mock implementation)
export function verifyMockPassword(email: string, password: string): boolean {
  const creds = mockCredentials.find((c) => c.email === email);
  return creds?.password === password;
}

// Helper to get user by email
export function getMockUserByEmail(email: string): MockUserWithCredentials | undefined {
  return mockUsers.find((u) => u.email === email);
}

// Helper to get user by ID (returns User without password hash)
export function getMockUserById(id: string): User | undefined {
  const user = mockUsers.find((u) => u.id === id);
  if (!user) return undefined;
  
  // Strip password hash before returning
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export default mockUsers;

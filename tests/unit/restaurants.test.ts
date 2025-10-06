import { test, expect } from '@jest/globals';
import { api } from '../../../convex/_generated/api';
import { createConvexClient } from '../../../src/utils/convexHelpers';

const convex = createConvexClient();

describe('Restaurants Functions', () => {
  let restaurantId;

  beforeAll(async () => {
    // Setup: Create a test restaurant
    const restaurant = await convex.mutation(api.restaurants.create, {
      name: 'Test Restaurant',
      address: '123 Test St',
      phone: '123-456-7890',
      email: 'test@example.com',
      ownerId: 'test-owner-id',
      tier: 'free',
      subscriptionStatus: 'active',
      settings: {
        timezone: 'UTC',
        currency: 'USD',
        language: 'en',
      },
      limits: {
        maxInventoryItems: 100,
        maxSuppliers: 5,
        maxEmployees: 10,
        maxCampaigns: 5,
      },
      isActive: true,
      createdAt: Date.now(),
    });
    restaurantId = restaurant.id;
  });

  afterAll(async () => {
    // Cleanup: Delete the test restaurant
    await convex.mutation(api.restaurants.delete, { id: restaurantId });
  });

  test('getDashboardMetrics returns correct metrics', async () => {
    const metrics = await convex.query(api.restaurants.getDashboardMetrics, {
      restaurantId,
    });

    expect(metrics).toHaveProperty('restaurant');
    expect(metrics).toHaveProperty('metrics');
    expect(metrics.metrics).toHaveProperty('todaysOrders');
    expect(metrics.metrics).toHaveProperty('todaysRevenue');
  });

  test('create new restaurant', async () => {
    const newRestaurant = await convex.mutation(api.restaurants.create, {
      name: 'New Test Restaurant',
      address: '456 New St',
      phone: '987-654-3210',
      email: 'newtest@example.com',
      ownerId: 'test-owner-id',
      tier: 'paid',
      subscriptionStatus: 'active',
      settings: {
        timezone: 'UTC',
        currency: 'USD',
        language: 'en',
      },
      limits: {
        maxInventoryItems: 200,
        maxSuppliers: 10,
        maxEmployees: 20,
        maxCampaigns: 10,
      },
      isActive: true,
      createdAt: Date.now(),
    });

    expect(newRestaurant).toHaveProperty('id');
    expect(newRestaurant.name).toBe('New Test Restaurant');
  });
});
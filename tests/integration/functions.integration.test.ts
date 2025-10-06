import { expect, test } from '@jest/globals';
import { api } from '../../convex/_generated/api';
import { ConvexHttpClient } from 'convex/browser';

const convex = new ConvexHttpClient(process.env.VITE_CONVEX_URL!);

describe('Integration Tests for Convex Functions', () => {
  let restaurantId;

  beforeAll(async () => {
    // Setup: Create a test restaurant
    const restaurant = await convex.mutate(api.restaurants.create, {
      name: 'Test Restaurant',
      address: '123 Test St',
      phone: '123-456-7890',
      email: 'test@restaurant.com',
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
    await convex.mutate(api.restaurants.delete, { id: restaurantId });
  });

  test('should retrieve dashboard metrics', async () => {
    const metrics = await convex.query(api.restaurants.getDashboardMetrics, {
      restaurantId,
    });

    expect(metrics).toHaveProperty('restaurant');
    expect(metrics).toHaveProperty('metrics');
    expect(metrics.metrics).toHaveProperty('todaysOrders');
    expect(metrics.metrics).toHaveProperty('todaysRevenue');
  });

  test('should get inventory with AI predictions', async () => {
    const inventory = await convex.query(api.inventory.getInventoryWithAI, {
      restaurantId,
    });

    expect(Array.isArray(inventory)).toBe(true);
  });

  test('should create a purchase order', async () => {
    const order = await convex.mutate(api.inventory.generatePurchaseOrder, {
      restaurantId,
      supplierId: 'test-supplier-id',
      autoGenerate: true,
    });

    expect(order).toHaveProperty('success', true);
    expect(order).toHaveProperty('orderId');
  });

  test('should process a WhatsApp order', async () => {
    const order = await convex.mutate(api.integrations.whatsapp.processWhatsAppOrder, {
      restaurantId,
      fromNumber: '1234567890',
      message: 'Order 2 pizzas',
      threadId: 'whatsapp-thread-id',
    });

    expect(order).toHaveProperty('success', true);
    expect(order).toHaveProperty('orderId');
  });
});
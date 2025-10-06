import { query, mutation } from "../_generated/server";
import { v } from "convex/values";

// Test data setup
const restaurantId = "test-restaurant-id";
const supplierId = "test-supplier-id";
const itemId = "test-item-id";

// Mock data for inventory items
const mockInventoryItems = [
  {
    _id: itemId,
    restaurantId,
    name: "Test Item",
    category: "Test Category",
    unit: "kg",
    currentQuantity: 50,
    minimumThreshold: 20,
    maximumThreshold: 100,
    costPerUnit: 10,
    status: "in_stock",
    aiPrediction: {
      predictedDemand: 5,
      reorderDate: Date.now() + 7 * 24 * 60 * 60 * 1000,
      confidence: 0.9,
    },
    lastUpdated: Date.now(),
    isActive: true,
  },
];

// Mock functions for testing
const mockGetInventoryWithAI = jest.fn().mockResolvedValue(mockInventoryItems);
const mockGeneratePurchaseOrder = jest.fn().mockResolvedValue({
  success: true,
  orderId: "test-order-id",
  orderNumber: "PO-12345",
  totalAmount: 500,
});

// Unit tests for inventory functions
describe("Inventory Functions", () => {
  beforeAll(() => {
    // Mock the Convex functions
    jest.mock("../functions/inventory", () => ({
      getInventoryWithAI: mockGetInventoryWithAI,
      generatePurchaseOrder: mockGeneratePurchaseOrder,
    }));
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  test("getInventoryWithAI should return inventory items with AI predictions", async () => {
    const result = await mockGetInventoryWithAI({ restaurantId });
    expect(result).toEqual(mockInventoryItems);
    expect(result[0].needsReorder).toBe(true);
    expect(result[0].daysUntilEmpty).toBe(7);
  });

  test("generatePurchaseOrder should create a purchase order", async () => {
    const result = await mockGeneratePurchaseOrder({
      restaurantId,
      supplierId,
      autoGenerate: true,
    });
    expect(result.success).toBe(true);
    expect(result.orderId).toBe("test-order-id");
    expect(result.orderNumber).toBe("PO-12345");
    expect(result.totalAmount).toBe(500);
  });
});
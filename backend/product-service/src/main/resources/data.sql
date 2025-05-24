-- Insert product categories first
INSERT INTO product_category (id, category_name)
VALUES 
('3e5b1f29-d4e8-4972-b64a-cc103086bd91', 'Electronics'),
('d1229c71-9e3e-4f35-9c2d-5c19fc9931a4', 'Home & Kitchen'),
('a7b82e2e-4d7c-4662-b8b9-0c9f14a75994', 'Fashion'),
('6f4dc56f-e33b-45c2-bc10-77234c6fc9a3', 'Books & Media'),
('5e4d3c2b-1a9e-4f7d-8c6b-9a8e7d6c5b4a', 'Sports & Outdoors'),
('7f6e5d4c-3b2a-6f8e-0d1c-3a2b1c0d9e8f', 'Health & Beauty'),
('9a8b7c6d-5e4f-8a9b-2c1d-5e4f3a2b1c0d', 'Automotive'),
('0b1c2d3e-4f5a-6b7c-8d9e-0f1a2b3c4d5e', 'Garden & Tools');

-- Insert products with proper seller_ids referencing users from identity service
INSERT INTO product (id, title, description, price, stock, image_url, seller_id)
VALUES 
-- Electronics products (seller: electronics_store)
('1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', 
 'Wireless Bluetooth Headphones',
 'Premium noise-cancelling wireless headphones with 30-hour battery life and superior sound quality.',
 129.99, 45, 
 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
 '9c6d5b4a-3e2f-5e9d-8a6b-7f6e5d4c3b2a'),

('2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e', 
 'Smartphone with 128GB Storage',
 'Latest model smartphone with advanced camera system, 5G connectivity, and all-day battery life.',
 699.99, 23, 
 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
 '9c6d5b4a-3e2f-5e9d-8a6b-7f6e5d4c3b2a'),

('3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f', 
 'Gaming Laptop with RTX Graphics',
 'High-performance gaming laptop with 16GB RAM, 1TB SSD, and dedicated graphics card for ultimate gaming experience.',
 1299.99, 12, 
 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
 '4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a'),

-- Home & Kitchen products (seller: home_goods_seller)
('4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a', 
 'Stainless Steel Coffee Maker',
 'Programmable 12-cup coffee maker with thermal carafe and auto-brew feature for perfect coffee every morning.',
 89.99, 35, 
 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop',
 '2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e'),

('5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b', 
 'Kitchen Knife Set with Block',
 'Professional 15-piece knife set with wooden block, including chef knife, bread knife, and utility knives.',
 159.99, 28, 
 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=400&fit=crop',
 '2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e'),

('6f7a8b9c-0d1e-2f3a-4b5c-6d7e8f9a0b1c', 
 'Non-Stick Cookware Set',
 '10-piece non-stick cookware set including pots, pans, and utensils. Dishwasher safe and PFOA-free coating.',
 199.99, 20, 
 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
 '2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e'),

-- Fashion products (seller: fashion_boutique)
('7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d', 
 'Designer Leather Jacket',
 'Premium genuine leather jacket with modern cut and classic styling. Perfect for any season.',
 249.99, 15, 
 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop',
 '5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b'),

('8b9c0d1e-2f3a-4b5c-6d7e-8f9a0b1c2d3e', 
 'Luxury Handbag Collection',
 'Elegant designer handbag with multiple compartments and adjustable strap. Made from premium materials.',
 179.99, 25, 
 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop',
 '5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b'),

-- Sports & Outdoors products (seller: sports_gear)
('9c0d1e2f-3a4b-5c6d-7e8f-9a0b1c2d3e4f', 
 'Professional Tennis Racket',
 'Tournament-grade tennis racket with graphite frame and perfect balance for competitive play.',
 159.99, 18, 
 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop',
 '6f7a8b9c-0d1e-2f3a-4b5c-6d7e8f9a0b1c'),

('0d1e2f3a-4b5c-6d7e-8f9a-0b1c2d3e4f5a', 
 'Camping Backpack 65L',
 'Heavy-duty hiking backpack with multiple compartments, rain cover, and ergonomic design for long treks.',
 119.99, 30, 
 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
 '6f7a8b9c-0d1e-2f3a-4b5c-6d7e8f9a0b1c'),

-- Books & Media products (seller: tech_vendor)
('1e2f3a4b-5c6d-7e8f-9a0b-1c2d3e4f5a6b', 
 'Programming Fundamentals Book',
 'Comprehensive guide to programming fundamentals with practical examples and exercises.',
 49.99, 50, 
 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
 '4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a'),

-- Health & Beauty products (seller: home_goods_seller)
('2f3a4b5c-6d7e-8f9a-0b1c-2d3e4f5a6b7c', 
 'Organic Skincare Set',
 'Complete organic skincare routine with cleanser, toner, serum, and moisturizer for all skin types.',
 79.99, 40, 
 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop',
 '2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e');

-- Insert product-category relationships
INSERT INTO product_categories (product_id, categories_id)
VALUES 
-- Electronics
('1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', '3e5b1f29-d4e8-4972-b64a-cc103086bd91'),
('2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e', '3e5b1f29-d4e8-4972-b64a-cc103086bd91'),
('3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f', '3e5b1f29-d4e8-4972-b64a-cc103086bd91'),

-- Home & Kitchen
('4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a', 'd1229c71-9e3e-4f35-9c2d-5c19fc9931a4'),
('5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b', 'd1229c71-9e3e-4f35-9c2d-5c19fc9931a4'),
('6f7a8b9c-0d1e-2f3a-4b5c-6d7e8f9a0b1c', 'd1229c71-9e3e-4f35-9c2d-5c19fc9931a4'),

-- Fashion
('7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d', 'a7b82e2e-4d7c-4662-b8b9-0c9f14a75994'),
('8b9c0d1e-2f3a-4b5c-6d7e-8f9a0b1c2d3e', 'a7b82e2e-4d7c-4662-b8b9-0c9f14a75994'),

-- Sports & Outdoors
('9c0d1e2f-3a4b-5c6d-7e8f-9a0b1c2d3e4f', '5e4d3c2b-1a9e-4f7d-8c6b-9a8e7d6c5b4a'),
('0d1e2f3a-4b5c-6d7e-8f9a-0b1c2d3e4f5a', '5e4d3c2b-1a9e-4f7d-8c6b-9a8e7d6c5b4a'),

-- Books & Media
('1e2f3a4b-5c6d-7e8f-9a0b-1c2d3e4f5a6b', '6f4dc56f-e33b-45c2-bc10-77234c6fc9a3'),

-- Health & Beauty
('2f3a4b5c-6d7e-8f9a-0b1c-2d3e4f5a6b7c', '7f6e5d4c-3b2a-6f8e-0d1c-3a2b1c0d9e8f');

-- Insert orders (all completed)
INSERT INTO "order" (id, buyer_id, status)
VALUES 
('3a4b5c6d-7e8f-9a0b-1c2d-3e4f5a6b7c8d', 'a7b82e2e-4d7c-4662-b8b9-0c9f14a75994', 'DONE'),
('4b5c6d7e-8f9a-0b1c-2d3e-4f5a6b7c8d9e', '6f4dc56f-e33b-45c2-bc10-77234c6fc9a3', 'DONE'),
('5c6d7e8f-9a0b-1c2d-3e4f-5a6b7c8d9e0f', '8b5c4a3e-2f1e-4d8c-9a7b-6e5f4c3d2e1a', 'DONE'),
('6d7e8f9a-0b1c-2d3e-4f5a-6b7c8d9e0f1a', '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', 'DONE'),
('7e8f9a0b-1c2d-3e4f-5a6b-7c8d9e0f1a2b', '3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f', 'DONE'),
('8f9a0b1c-2d3e-4f5a-6b7c-8d9e0f1a2b3c', '7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d', 'DONE'),
('9a0b1c2d-3e4f-5a6b-7c8d-9e0f1a2b3c4d', '8b9c0d1e-2f3a-4b5c-6d7e-8f9a0b1c2d3e', 'DONE'),
('0b1c2d3e-4f5a-6b7c-8d9e-0f1a2b3c4d5e', 'a7b82e2e-4d7c-4662-b8b9-0c9f14a75994', 'DONE'),
('1c2d3e4f-5a6b-7c8d-9e0f-1a2b3c4d5e6f', '6f4dc56f-e33b-45c2-bc10-77234c6fc9a3', 'DONE'),
('2d3e4f5a-6b7c-8d9e-0f1a-2b3c4d5e6f7a', '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', 'DONE');

-- Insert order items
INSERT INTO order_item (id, quantity, product_id, order_id)
VALUES 
-- Order 1 items (alfonso_customer)
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 2, '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', '3a4b5c6d-7e8f-9a0b-1c2d-3e4f5a6b7c8d'),

-- Order 2 items (michael_customer)
('b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', 1, '4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a', '4b5c6d7e-8f9a-0b1c-2d3e-4f5a6b7c8d9e'),
('c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', 1, '6f7a8b9c-0d1e-2f3a-4b5c-6d7e8f9a0b1c', '4b5c6d7e-8f9a-0b1c-2d3e-4f5a6b7c8d9e'),

-- Order 3 items (sarah_customer)
('d4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 1, '2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e', '5c6d7e8f-9a0b-1c2d-3e4f-5a6b7c8d9e0f'),
('e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 1, '7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d', '5c6d7e8f-9a0b-1c2d-3e4f-5a6b7c8d9e0f'),

-- Order 4 items (alex_customer)
('f6a7b8c9-d0e1-2f3a-4b5c-6d7e8f9a0b1c', 1, '8b9c0d1e-2f3a-4b5c-6d7e-8f9a0b1c2d3e', '6d7e8f9a-0b1c-2d3e-4f5a-6b7c8d9e0f1a'),
('a7b8c9d0-e1f2-3a4b-5c6d-7e8f9a0b1c2d', 1, '7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d', '6d7e8f9a-0b1c-2d3e-4f5a-6b7c8d9e0f1a'),

-- Order 5 items (emma_customer)
('b8c9d0e1-f2a3-4b5c-6d7e-8f9a0b1c2d3e', 1, '9c0d1e2f-3a4b-5c6d-7e8f-9a0b1c2d3e4f', '7e8f9a0b-1c2d-3e4f-5a6b-7c8d9e0f1a2b'),
('c9d0e1f2-a3b4-5c6d-7e8f-9a0b1c2d3e4f', 1, '8b9c0d1e-2f3a-4b5c-6d7e-8f9a0b1c2d3e', '7e8f9a0b-1c2d-3e4f-5a6b-7c8d9e0f1a2b'),

-- Order 6 items (david_customer)
('d0e1f2a3-b4c5-6d7e-8f9a-0b1c2d3e4f5a', 1, '0d1e2f3a-4b5c-6d7e-8f9a-0b1c2d3e4f5a', '8f9a0b1c-2d3e-4f5a-6b7c-8d9e0f1a2b3c'),
('e1f2a3b4-c5d6-7e8f-9a0b-1c2d3e4f5a6b', 1, '5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b', '8f9a0b1c-2d3e-4f5a-6b7c-8d9e0f1a2b3c'),

-- Order 7 items (lisa_customer)  
('f2a3b4c5-d6e7-8f9a-0b1c-2d3e4f5a6b7c', 1, '3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f', '9a0b1c2d-3e4f-5a6b-7c8d-9e0f1a2b3c4d'),
('a3b4c5d6-e7f8-9a0b-1c2d-3e4f5a6b7c8d', 1, '2f3a4b5c-6d7e-8f9a-0b1c-2d3e4f5a6b7c', '9a0b1c2d-3e4f-5a6b-7c8d-9e0f1a2b3c4d'),

-- Order 8 items (alfonso_customer second order)
('b4c5d6e7-f8a9-0b1c-2d3e-4f5a6b7c8d9e', 2, '1e2f3a4b-5c6d-7e8f-9a0b-1c2d3e4f5a6b', '0b1c2d3e-4f5a-6b7c-8d9e-0f1a2b3c4d5e'),
('c5d6e7f8-a9b0-1c2d-3e4f-5a6b7c8d9e0f', 3, '4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a', '0b1c2d3e-4f5a-6b7c-8d9e-0f1a2b3c4d5e'),

-- Order 9 items (michael_customer second order)
('d6e7f8a9-b0c1-2d3e-4f5a-6b7c8d9e0f1a', 1, '6f7a8b9c-0d1e-2f3a-4b5c-6d7e8f9a0b1c', '1c2d3e4f-5a6b-7c8d-9e0f-1a2b3c4d5e6f'),

-- Order 10 items (alex_customer second order)
('e7f8a9b0-c1d2-3e4f-5a6b-7c8d9e0f1a2b', 1, '9c0d1e2f-3a4b-5c6d-7e8f-9a0b1c2d3e4f', '2d3e4f5a-6b7c-8d9e-0f1a-2b3c4d5e6f7a');
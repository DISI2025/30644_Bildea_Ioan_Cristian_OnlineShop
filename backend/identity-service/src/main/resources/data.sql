-- Insert users with complete profile information
INSERT INTO "user" (id, username, email, created_at, password, role, full_name, address, city, country, postal_code, phone_number, profile_url, store_address)
VALUES 
-- ADMIN USERS
('3e5b1f29-d4e8-4972-b64a-cc103086bd91',
 'admin_john',
 'john.admin@deal.com',
 '2024-01-15 08:30:00.000000',
 '$2a$10$y5GZucPtR2j7kH3cm4yTeeppWhiZwTujkzHl6XUUBi5E1Fblf3zlu',
 'ADMIN',
 'John Anderson',
 '123 Admin Street',
 'New York',
 'USA',
 '10001',
 '+1-555-0123',
 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
 NULL),

('d1229c71-9e3e-4f35-9c2d-5c19fc9931a4',
 'admin_jane',
 'jane.admin@deal.com',
 '2024-01-15 08:30:00.000000',
 '$2a$10$y5GZucPtR2j7kH3cm4yTeeppWhiZwTujkzHl6XUUBi5E1Fblf3zlu',
 'ADMIN',
 'Jane Doe',
 '456 Management Blvd',
 'Los Angeles',
 'USA',
 '90210',
 '+1-555-0456',
 'https://images.unsplash.com/photo-1494790108755-2616b612b1e0?w=150&h=150&fit=crop&crop=face',
 NULL),

-- SELLER USERS (with store addresses)
('9c6d5b4a-3e2f-5e9d-8a6b-7f6e5d4c3b2a',
 'electronics_store',
 'store@electronics.com',
 '2024-02-01 09:15:42.987654',
 '$2a$10$y5GZucPtR2j7kH3cm4yTeeppWhiZwTujkzHl6XUUBi5E1Fblf3zlu',
 'USER',
 'Electronics Store Manager',
 '890 Electronics Plaza',
 'Seattle',
 'USA',
 '98101',
 '+1-555-0890',
 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
 '890 Electronics Plaza, Suite 100, Seattle, WA 98101'),

('2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e',
 'home_goods_seller',
 'seller@homegoods.com',
 '2024-02-05 11:30:25.567890',
 '$2a$10$y5GZucPtR2j7kH3cm4yTeeppWhiZwTujkzHl6XUUBi5E1Fblf3zlu',
 'USER',
 'Home Goods Co.',
 '123 Home Goods Street',
 'Phoenix',
 'USA',
 '85001',
 '+1-555-0123',
 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',
 '123 Home Goods Street, Warehouse B, Phoenix, AZ 85001'),

('4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a',
 'tech_vendor',
 'vendor@techgadgets.com',
 '2024-02-10 08:45:33.789012',
 '$2a$10$y5GZucPtR2j7kH3cm4yTeeppWhiZwTujkzHl6XUUBi5E1Fblf3zlu',
 'USER',
 'Tech Gadgets Inc.',
 '456 Innovation Drive',
 'Austin',
 'USA',
 '73301',
 '+1-555-0456',
 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
 '456 Innovation Drive, Building C, Austin, TX 73301'),

('5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b',
 'fashion_boutique',
 'owner@fashionboutique.com',
 '2024-02-12 14:20:18.234567',
 '$2a$10$y5GZucPtR2j7kH3cm4yTeeppWhiZwTujkzHl6XUUBi5E1Fblf3zlu',
 'USER',
 'Fashion Boutique Owner',
 '789 Style Avenue',
 'Miami',
 'USA',
 '33101',
 '+1-555-0789',
 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
 '789 Style Avenue, Floor 2, Miami, FL 33101'),

('6f7a8b9c-0d1e-2f3a-4b5c-6d7e8f9a0b1c',
 'sports_gear',
 'contact@sportsgear.com',
 '2024-02-15 10:33:12.345678',
 '$2a$10$y5GZucPtR2j7kH3cm4yTeeppWhiZwTujkzHl6XUUBi5E1Fblf3zlu',
 'USER',
 'Sports Gear Shop',
 '321 Athletic Boulevard',
 'Denver',
 'USA',
 '80201',
 '+1-555-0321',
 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
 '321 Athletic Boulevard, Store 15, Denver, CO 80201'),

-- CUSTOMER USERS
('a7b82e2e-4d7c-4662-b8b9-0c9f14a75994',
 'alfonso_customer',
 'alfonso@gmail.com',
 '2024-03-01 03:11:55.611171',
 '$2a$10$y5GZucPtR2j7kH3cm4yTeeppWhiZwTujkzHl6XUUBi5E1Fblf3zlu',
 'USER',
 'Alfonso Rodriguez',
 '789 User Lane',
 'Chicago',
 'USA',
 '60601',
 '+1-555-0789',
 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
 NULL),

('6f4dc56f-e33b-45c2-bc10-77234c6fc9a3',
 'michael_customer',
 'michael.davies@gmail.com',
 '2024-03-05 03:11:55.611171',
 '$2a$10$y5GZucPtR2j7kH3cm4yTeeppWhiZwTujkzHl6XUUBi5E1Fblf3zlu',
 'USER',
 'Michael Davies',
 '321 Customer Road',
 'Houston',
 'USA',
 '77001',
 '+1-555-0321',
 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
 NULL),

('8b5c4a3e-2f1e-4d8c-9a7b-6e5f4c3d2e1a',
 'sarah_customer',
 'sarah.miller@gmail.com',
 '2024-03-10 14:22:33.123456',
 '$2a$10$y5GZucPtR2j7kH3cm4yTeeppWhiZwTujkzHl6XUUBi5E1Fblf3zlu',
 'USER',
 'Sarah Miller',
 '567 Maple Street',
 'Boston',
 'USA',
 '02101',
 '+1-555-0567',
 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
 NULL),

('1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
 'alex_customer',
 'alex.buyer@yahoo.com',
 '2024-03-15 16:45:12.345678',
 '$2a$10$y5GZucPtR2j7kH3cm4yTeeppWhiZwTujkzHl6XUUBi5E1Fblf3zlu',
 'USER',
 'Alex Thompson',
 '456 Residential Ave',
 'Miami',
 'USA',
 '33101',
 '+1-555-0456',
 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face',
 NULL),

('3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f',
 'emma_customer',
 'emma.shopper@hotmail.com',
 '2024-03-20 13:20:18.234567',
 '$2a$10$y5GZucPtR2j7kH3cm4yTeeppWhiZwTujkzHl6XUUBi5E1Fblf3zlu',
 'USER',
 'Emma Wilson',
 '789 Shopping Boulevard',
 'Denver',
 'USA',
 '80201',
 '+1-555-0789',
 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
 NULL),

('7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d',
 'david_customer',
 'david.smith@outlook.com',
 '2024-03-25 11:15:30.456789',
 '$2a$10$y5GZucPtR2j7kH3cm4yTeeppWhiZwTujkzHl6XUUBi5E1Fblf3zlu',
 'USER',
 'David Smith',
 '654 Suburban Lane',
 'Portland',
 'USA',
 '97201',
 '+1-555-0654',
 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
 NULL),

('8b9c0d1e-2f3a-4b5c-6d7e-8f9a0b1c2d3e',
 'lisa_customer',
 'lisa.jones@gmail.com',
 '2024-03-30 09:40:55.789012',
 '$2a$10$y5GZucPtR2j7kH3cm4yTeeppWhiZwTujkzHl6XUUBi5E1Fblf3zlu',
 'USER',
 'Lisa Jones',
 '987 Residential Circle',
 'Atlanta',
 'USA',
 '30301',
 '+1-555-0987',
 'https://images.unsplash.com/photo-1494790108755-2616b612b1e0?w=150&h=150&fit=crop&crop=face',
 NULL);

-- Insert user product category relationships
INSERT INTO "user_product_categories" (user_id, product_category_id)
VALUES 
-- Electronics Store interests
('9c6d5b4a-3e2f-5e9d-8a6b-7f6e5d4c3b2a', '3e5b1f29-d4e8-4972-b64a-cc103086bd91'), -- Electronics

-- Home Goods Seller interests  
('2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e', 'd1229c71-9e3e-4f35-9c2d-5c19fc9931a4'), -- Home & Kitchen
('2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e', '7f6e5d4c-3b2a-6f8e-0d1c-3a2b1c0d9e8f'), -- Health & Beauty

-- Tech Vendor interests
('4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a', '3e5b1f29-d4e8-4972-b64a-cc103086bd91'), -- Electronics

-- Fashion Boutique interests
('5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b', 'a7b82e2e-4d7c-4662-b8b9-0c9f14a75994'), -- Fashion

-- Sports Gear interests
('6f7a8b9c-0d1e-2f3a-4b5c-6d7e8f9a0b1c', '5e4d3c2b-1a9e-4f7d-8c6b-9a8e7d6c5b4a'), -- Sports & Outdoors

-- Customer interests
('a7b82e2e-4d7c-4662-b8b9-0c9f14a75994', '3e5b1f29-d4e8-4972-b64a-cc103086bd91'), -- Electronics
('a7b82e2e-4d7c-4662-b8b9-0c9f14a75994', 'd1229c71-9e3e-4f35-9c2d-5c19fc9931a4'), -- Home & Kitchen

('6f4dc56f-e33b-45c2-bc10-77234c6fc9a3', 'd1229c71-9e3e-4f35-9c2d-5c19fc9931a4'), -- Home & Kitchen
('6f4dc56f-e33b-45c2-bc10-77234c6fc9a3', '6f4dc56f-e33b-45c2-bc10-77234c6fc9a3'), -- Books & Media

('8b5c4a3e-2f1e-4d8c-9a7b-6e5f4c3d2e1a', '3e5b1f29-d4e8-4972-b64a-cc103086bd91'), -- Electronics
('8b5c4a3e-2f1e-4d8c-9a7b-6e5f4c3d2e1a', '7f6e5d4c-3b2a-6f8e-0d1c-3a2b1c0d9e8f'), -- Health & Beauty

('1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', 'a7b82e2e-4d7c-4662-b8b9-0c9f14a75994'), -- Fashion
('1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', '5e4d3c2b-1a9e-4f7d-8c6b-9a8e7d6c5b4a'), -- Sports & Outdoors

('3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f', '3e5b1f29-d4e8-4972-b64a-cc103086bd91'), -- Electronics
('3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f', '6f4dc56f-e33b-45c2-bc10-77234c6fc9a3'), -- Books & Media

('7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d', 'd1229c71-9e3e-4f35-9c2d-5c19fc9931a4'), -- Home & Kitchen
('7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d', '9a8b7c6d-5e4f-8a9b-2c1d-5e4f3a2b1c0d'), -- Automotive

('8b9c0d1e-2f3a-4b5c-6d7e-8f9a0b1c2d3e', 'a7b82e2e-4d7c-4662-b8b9-0c9f14a75994'), -- Fashion
('8b9c0d1e-2f3a-4b5c-6d7e-8f9a0b1c2d3e', '7f6e5d4c-3b2a-6f8e-0d1c-3a2b1c0d9e8f'); -- Health & Beauty

-- Password for all test users: 'Picatur@1212'
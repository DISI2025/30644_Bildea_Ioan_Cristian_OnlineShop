// Create product categories
CREATE (electronics:ProductCategory {productCategoryId: '3e5b1f29-d4e8-4972-b64a-cc103086bd91'})
CREATE (homeKitchen:ProductCategory {productCategoryId: 'd1229c71-9e3e-4f35-9c2d-5c19fc9931a4'})
CREATE (fashion:ProductCategory {productCategoryId: 'a7b82e2e-4d7c-4662-b8b9-0c9f14a75994'})
CREATE (booksMedia:ProductCategory {productCategoryId: '6f4dc56f-e33b-45c2-bc10-77234c6fc9a3'})
CREATE (sportsOutdoors:ProductCategory {productCategoryId: '5e4d3c2b-1a9e-4f7d-8c6b-9a8e7d6c5b4a'})
CREATE (healthBeauty:ProductCategory {productCategoryId: '7f6e5d4c-3b2a-6f8e-0d1c-3a2b1c0d9e8f'})
CREATE (automotive:ProductCategory {productCategoryId: '9a8b7c6d-5e4f-8a9b-2c1d-5e4f3a2b1c0d'})
CREATE (gardenTools:ProductCategory {productCategoryId: '0b1c2d3e-4f5a-6b7c-8d9e-0f1a2b3c4d5e'});

// Create users (sellers and buyers from orders)
CREATE (electronicsStore:User {userId: '9c6d5b4a-3e2f-5e9d-8a6b-7f6e5d4c3b2a'})
CREATE (homeGoodsSeller:User {userId: '2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e'})
CREATE (techVendor:User {userId: '4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a'})
CREATE (fashionBoutique:User {userId: '5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b'})
CREATE (sportsGear:User {userId: '6f7a8b9c-0d1e-2f3a-4b5c-6d7e8f9a0b1c'})

// Create buyers from orders
CREATE (alfonsoCustomer:User {userId: 'a7b82e2e-4d7c-4662-b8b9-0c9f14a75994'})
CREATE (michaelCustomer:User {userId: '6f4dc56f-e33b-45c2-bc10-77234c6fc9a3'})
CREATE (sarahCustomer:User {userId: '8b5c4a3e-2f1e-4d8c-9a7b-6e5f4c3d2e1a'})
CREATE (alexCustomer:User {userId: '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d'})
CREATE (emmaCustomer:User {userId: '3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f'})
CREATE (davidCustomer:User {userId: '7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d'})
CREATE (lisaCustomer:User {userId: '8b9c0d1e-2f3a-4b5c-6d7e-8f9a0b1c2d3e'});

// Create products with only IDs
CREATE (headphones:Product {productId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479'})
CREATE (smartphone:Product {productId: 'a8098c1a-f86e-11da-bd1a-00112444be1e'})
CREATE (gamingLaptop:Product {productId: 'b9a2f37c-42d5-4a24-baee-48a7e12f3ddb'})
CREATE (coffeeMaker:Product {productId: 'c6e8f1d2-3b7a-4c59-9d1e-8f5a9b7c6d3e'})
CREATE (knifeSet:Product {productId: 'd7f9e2c3-4a8b-5d1c-6e2f-3b2a1c0d9e8f'})
CREATE (cookwareSet:Product {productId: 'e8f9d2c1-5a8b-4c7d-9e6f-1a2b3c4d5e6f'})
CREATE (leatherJacket:Product {productId: 'f9e8d7c6-b5a4-3c2d-1e0f-9a8b7c6d5e4f'})
CREATE (handbag:Product {productId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'})
CREATE (tennisRacket:Product {productId: 'b2c3d4e5-f6a7-8901-bcde-f23456789012'})
CREATE (backpack:Product {productId: 'c3d4e5f6-a7b8-9012-cdef-345678901234'})
CREATE (programmingBook:Product {productId: 'd4e5f6a7-b8c9-1234-5678-456789012345'})
CREATE (skincare:Product {productId: 'e5f6a7b8-c9d0-1234-5678-567890123456'});

// Create relationships for products
CREATE (electronicsStore)-[:SELLS]->(headphones)
CREATE (electronicsStore)-[:SELLS]->(smartphone)
CREATE (techVendor)-[:SELLS]->(gamingLaptop)
CREATE (headphones)-[:HAS_CATEGORY]->(electronics)
CREATE (smartphone)-[:HAS_CATEGORY]->(electronics)
CREATE (gamingLaptop)-[:HAS_CATEGORY]->(electronics)

CREATE (homeGoodsSeller)-[:SELLS]->(coffeeMaker)
CREATE (homeGoodsSeller)-[:SELLS]->(knifeSet)
CREATE (homeGoodsSeller)-[:SELLS]->(cookwareSet)
CREATE (coffeeMaker)-[:HAS_CATEGORY]->(homeKitchen)
CREATE (knifeSet)-[:HAS_CATEGORY]->(homeKitchen)
CREATE (cookwareSet)-[:HAS_CATEGORY]->(homeKitchen)

CREATE (fashionBoutique)-[:SELLS]->(leatherJacket)
CREATE (fashionBoutique)-[:SELLS]->(handbag)
CREATE (leatherJacket)-[:HAS_CATEGORY]->(fashion)
CREATE (handbag)-[:HAS_CATEGORY]->(fashion)

CREATE (sportsGear)-[:SELLS]->(tennisRacket)
CREATE (sportsGear)-[:SELLS]->(backpack)
CREATE (tennisRacket)-[:HAS_CATEGORY]->(sportsOutdoors)
CREATE (backpack)-[:HAS_CATEGORY]->(sportsOutdoors)

CREATE (techVendor)-[:SELLS]->(programmingBook)
CREATE (programmingBook)-[:HAS_CATEGORY]->(booksMedia)

CREATE (homeGoodsSeller)-[:SELLS]->(skincare)
CREATE (skincare)-[:HAS_CATEGORY]->(healthBeauty)

// Create seller-category relationships based on their products
CREATE (electronicsStore)-[:HAS_CATEGORY]->(electronics)
CREATE (homeGoodsSeller)-[:HAS_CATEGORY]->(homeKitchen)
CREATE (homeGoodsSeller)-[:HAS_CATEGORY]->(healthBeauty)
CREATE (techVendor)-[:HAS_CATEGORY]->(electronics)
CREATE (techVendor)-[:HAS_CATEGORY]->(booksMedia)
CREATE (fashionBoutique)-[:HAS_CATEGORY]->(fashion)
CREATE (sportsGear)-[:HAS_CATEGORY]->(sportsOutdoors)

// Create viewed and purchased relationships based on order data
// Alfonso's orders (2 orders)
CREATE (alfonsoCustomer)-[:VIEWED {lastViewedAt: datetime('2024-05-25T10:00:00')}]->(headphones)
CREATE (alfonsoCustomer)-[:PURCHASED {purchasedAt: datetime('2024-05-25T10:15:00')}]->(headphones)
CREATE (alfonsoCustomer)-[:VIEWED {lastViewedAt: datetime('2024-05-25T14:00:00')}]->(programmingBook)
CREATE (alfonsoCustomer)-[:VIEWED {lastViewedAt: datetime('2024-05-25T14:05:00')}]->(coffeeMaker)
CREATE (alfonsoCustomer)-[:PURCHASED {purchasedAt: datetime('2024-05-25T14:30:00')}]->(programmingBook)
CREATE (alfonsoCustomer)-[:PURCHASED {purchasedAt: datetime('2024-05-25T14:35:00')}]->(coffeeMaker)

// Michael's orders (2 orders)
CREATE (michaelCustomer)-[:VIEWED {lastViewedAt: datetime('2024-05-25T11:00:00')}]->(coffeeMaker)
CREATE (michaelCustomer)-[:VIEWED {lastViewedAt: datetime('2024-05-25T11:05:00')}]->(cookwareSet)
CREATE (michaelCustomer)-[:PURCHASED {purchasedAt: datetime('2024-05-25T11:15:00')}]->(coffeeMaker)
CREATE (michaelCustomer)-[:PURCHASED {purchasedAt: datetime('2024-05-25T11:20:00')}]->(cookwareSet)
CREATE (michaelCustomer)-[:VIEWED {lastViewedAt: datetime('2024-05-25T15:00:00')}]->(cookwareSet)
CREATE (michaelCustomer)-[:PURCHASED {purchasedAt: datetime('2024-05-25T15:15:00')}]->(cookwareSet)

// Sarah's order
CREATE (sarahCustomer)-[:VIEWED {lastViewedAt: datetime('2024-05-25T12:00:00')}]->(smartphone)
CREATE (sarahCustomer)-[:VIEWED {lastViewedAt: datetime('2024-05-25T12:05:00')}]->(leatherJacket)
CREATE (sarahCustomer)-[:PURCHASED {purchasedAt: datetime('2024-05-25T12:15:00')}]->(smartphone)
CREATE (sarahCustomer)-[:PURCHASED {purchasedAt: datetime('2024-05-25T12:20:00')}]->(leatherJacket)

// Alex's orders (2 orders)
CREATE (alexCustomer)-[:VIEWED {lastViewedAt: datetime('2024-05-25T13:00:00')}]->(handbag)
CREATE (alexCustomer)-[:VIEWED {lastViewedAt: datetime('2024-05-25T13:05:00')}]->(leatherJacket)
CREATE (alexCustomer)-[:PURCHASED {purchasedAt: datetime('2024-05-25T13:15:00')}]->(handbag)
CREATE (alexCustomer)-[:PURCHASED {purchasedAt: datetime('2024-05-25T13:20:00')}]->(leatherJacket)
CREATE (alexCustomer)-[:VIEWED {lastViewedAt: datetime('2024-05-25T16:00:00')}]->(tennisRacket)
CREATE (alexCustomer)-[:PURCHASED {purchasedAt: datetime('2024-05-25T16:15:00')}]->(tennisRacket)

// Emma's order
CREATE (emmaCustomer)-[:VIEWED {lastViewedAt: datetime('2024-05-25T14:00:00')}]->(tennisRacket)
CREATE (emmaCustomer)-[:VIEWED {lastViewedAt: datetime('2024-05-25T14:05:00')}]->(handbag)
CREATE (emmaCustomer)-[:PURCHASED {purchasedAt: datetime('2024-05-25T14:15:00')}]->(tennisRacket)
CREATE (emmaCustomer)-[:PURCHASED {purchasedAt: datetime('2024-05-25T14:20:00')}]->(handbag)

// David's order
CREATE (davidCustomer)-[:VIEWED {lastViewedAt: datetime('2024-05-25T15:00:00')}]->(backpack)
CREATE (davidCustomer)-[:VIEWED {lastViewedAt: datetime('2024-05-25T15:05:00')}]->(knifeSet)
CREATE (davidCustomer)-[:PURCHASED {purchasedAt: datetime('2024-05-25T15:15:00')}]->(backpack)
CREATE (davidCustomer)-[:PURCHASED {purchasedAt: datetime('2024-05-25T15:20:00')}]->(knifeSet)

// Lisa's order
CREATE (lisaCustomer)-[:VIEWED {lastViewedAt: datetime('2024-05-25T16:00:00')}]->(gamingLaptop)
CREATE (lisaCustomer)-[:VIEWED {lastViewedAt: datetime('2024-05-25T16:05:00')}]->(skincare)
CREATE (lisaCustomer)-[:PURCHASED {purchasedAt: datetime('2024-05-25T16:15:00')}]->(gamingLaptop)
CREATE (lisaCustomer)-[:PURCHASED {purchasedAt: datetime('2024-05-25T16:20:00')}]->(skincare)

// Add user category preferences based on their purchases
CREATE (alfonsoCustomer)-[:HAS_CATEGORY]->(electronics)
CREATE (alfonsoCustomer)-[:HAS_CATEGORY]->(booksMedia)
CREATE (alfonsoCustomer)-[:HAS_CATEGORY]->(homeKitchen)

CREATE (michaelCustomer)-[:HAS_CATEGORY]->(homeKitchen)

CREATE (sarahCustomer)-[:HAS_CATEGORY]->(electronics)
CREATE (sarahCustomer)-[:HAS_CATEGORY]->(fashion)

CREATE (alexCustomer)-[:HAS_CATEGORY]->(fashion)
CREATE (alexCustomer)-[:HAS_CATEGORY]->(sportsOutdoors)

CREATE (emmaCustomer)-[:HAS_CATEGORY]->(sportsOutdoors)
CREATE (emmaCustomer)-[:HAS_CATEGORY]->(fashion)

CREATE (davidCustomer)-[:HAS_CATEGORY]->(sportsOutdoors)
CREATE (davidCustomer)-[:HAS_CATEGORY]->(homeKitchen)

CREATE (lisaCustomer)-[:HAS_CATEGORY]->(electronics)
CREATE (lisaCustomer)-[:HAS_CATEGORY]->(healthBeauty) 
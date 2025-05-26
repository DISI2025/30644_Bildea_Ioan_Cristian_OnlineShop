CREATE (:User {userId: '3e5b1f29-d4e8-4972-b64a-cc103086bd91'})
CREATE (:User {userId: 'd1229c71-9e3e-4f35-9c2d-5c19fc9931a4'})
CREATE (:User {userId: '9c6d5b4a-3e2f-5e9d-8a6b-7f6e5d4c3b2a'})
CREATE (:User {userId: '2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e'})
CREATE (:User {userId: '4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a'})
CREATE (:User {userId: '5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b'})
CREATE (:User {userId: '6f7a8b9c-0d1e-2f3a-4b5c-6d7e8f9a0b1c'})
CREATE (:User {userId: 'a7b82e2e-4d7c-4662-b8b9-0c9f14a75994'})
CREATE (:User {userId: '6f4dc56f-e33b-45c2-bc10-77234c6fc9a3'})
CREATE (:User {userId: '8b5c4a3e-2f1e-4d8c-9a7b-6e5f4c3d2e1a'})
CREATE (:User {userId: '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d'})
CREATE (:User {userId: '3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f'})
CREATE (:User {userId: '7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d'})
CREATE (:User {userId: '8b9c0d1e-2f3a-4b5c-6d7e-8f9a0b1c2d3e'});


CREATE (:Product {productId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479'})
CREATE (:Product {productId: 'a8098c1a-f86e-11da-bd1a-00112444be1e'})
CREATE (:Product {productId: 'b9a2f37c-42d5-4a24-baee-48a7e12f3ddb'})
CREATE (:Product {productId: 'c6e8f1d2-3b7a-4c59-9d1e-8f5a9b7c6d3e'})
CREATE (:Product {productId: 'd7f9e2c3-4a8b-5d1c-6e2f-3b2a1c0d9e8f'})
CREATE (:Product {productId: 'e8f9d2c1-5a8b-4c7d-9e6f-1a2b3c4d5e6f'})
CREATE (:Product {productId: 'f9e8d7c6-b5a4-3c2d-1e0f-9a8b7c6d5e4f'})
CREATE (:Product {productId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'})
CREATE (:Product {productId: 'b2c3d4e5-f6a7-8901-bcde-f23456789012'})
CREATE (:Product {productId: 'c3d4e5f6-a7b8-9012-cdef-345678901234'})
CREATE (:Product {productId: 'd4e5f6a7-b8c9-1234-5678-456789012345'})
CREATE (:Product {productId: 'e5f6a7b8-c9d0-1234-5678-567890123456'});


CREATE (:ProductCategory {productCategoryId: '3e5b1f29-d4e8-4972-b64a-cc103086bd91'})
CREATE (:ProductCategory {productCategoryId: 'd1229c71-9e3e-4f35-9c2d-5c19fc9931a4'})
CREATE (:ProductCategory {productCategoryId: 'a7b82e2e-4d7c-4662-b8b9-0c9f14a75994'})
CREATE (:ProductCategory {productCategoryId: '6f4dc56f-e33b-45c2-bc10-77234c6fc9a3'})
CREATE (:ProductCategory {productCategoryId: '5e4d3c2b-1a9e-4f7d-8c6b-9a8e7d6c5b4a'})
CREATE (:ProductCategory {productCategoryId: '7f6e5d4c-3b2a-6f8e-0d1c-3a2b1c0d9e8f'})
CREATE (:ProductCategory {productCategoryId: '9a8b7c6d-5e4f-8a9b-2c1d-5e4f3a2b1c0d'})
CREATE (:ProductCategory {productCategoryId: '0b1c2d3e-4f5a-6b7c-8d9e-0f1a2b3c4d5e'});


MATCH (p:Product {productId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479'}), (c:ProductCategory {productCategoryId: '3e5b1f29-d4e8-4972-b64a-cc103086bd91'})
CREATE (p)-[:HAS_CATEGORY]->(c);

MATCH (p:Product {productId: 'a8098c1a-f86e-11da-bd1a-00112444be1e'}), (c:ProductCategory {productCategoryId: '3e5b1f29-d4e8-4972-b64a-cc103086bd91'})
CREATE (p)-[:HAS_CATEGORY]->(c);

MATCH (p:Product {productId: 'b9a2f37c-42d5-4a24-baee-48a7e12f3ddb'}), (c:ProductCategory {productCategoryId: '3e5b1f29-d4e8-4972-b64a-cc103086bd91'})
CREATE (p)-[:HAS_CATEGORY]->(c);

MATCH (p:Product {productId: 'c6e8f1d2-3b7a-4c59-9d1e-8f5a9b7c6d3e'}), (c:ProductCategory {productCategoryId: 'd1229c71-9e3e-4f35-9c2d-5c19fc9931a4'})
CREATE (p)-[:HAS_CATEGORY]->(c);

MATCH (p:Product {productId: 'd7f9e2c3-4a8b-5d1c-6e2f-3b2a1c0d9e8f'}), (c:ProductCategory {productCategoryId: 'd1229c71-9e3e-4f35-9c2d-5c19fc9931a4'})
CREATE (p)-[:HAS_CATEGORY]->(c);

MATCH (p:Product {productId: 'e8f9d2c1-5a8b-4c7d-9e6f-1a2b3c4d5e6f'}), (c:ProductCategory {productCategoryId: 'd1229c71-9e3e-4f35-9c2d-5c19fc9931a4'})
CREATE (p)-[:HAS_CATEGORY]->(c);

MATCH (p:Product {productId: 'f9e8d7c6-b5a4-3c2d-1e0f-9a8b7c6d5e4f'}), (c:ProductCategory {productCategoryId: 'a7b82e2e-4d7c-4662-b8b9-0c9f14a75994'})
CREATE (p)-[:HAS_CATEGORY]->(c);

MATCH (p:Product {productId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'}), (c:ProductCategory {productCategoryId: 'a7b82e2e-4d7c-4662-b8b9-0c9f14a75994'})
CREATE (p)-[:HAS_CATEGORY]->(c);

MATCH (p:Product {productId: 'b2c3d4e5-f6a7-8901-bcde-f23456789012'}), (c:ProductCategory {productCategoryId: '5e4d3c2b-1a9e-4f7d-8c6b-9a8e7d6c5b4a'})
CREATE (p)-[:HAS_CATEGORY]->(c);

MATCH (p:Product {productId: 'c3d4e5f6-a7b8-9012-cdef-345678901234'}), (c:ProductCategory {productCategoryId: '5e4d3c2b-1a9e-4f7d-8c6b-9a8e7d6c5b4a'})
CREATE (p)-[:HAS_CATEGORY]->(c);

MATCH (p:Product {productId: 'd4e5f6a7-b8c9-1234-5678-456789012345'}), (c:ProductCategory {productCategoryId: '6f4dc56f-e33b-45c2-bc10-77234c6fc9a3'})
CREATE (p)-[:HAS_CATEGORY]->(c);

MATCH (p:Product {productId: 'e5f6a7b8-c9d0-1234-5678-567890123456'}), (c:ProductCategory {productCategoryId: '7f6e5d4c-3b2a-6f8e-0d1c-3a2b1c0d9e8f'})
CREATE (p)-[:HAS_CATEGORY]->(c);


MATCH (u:User {userId: 'a7b82e2e-4d7c-4662-b8b9-0c9f14a75994'}), (p:Product {productId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479'})
CREATE (u)-[:PURCHASED]->(p);

MATCH (u:User {userId: 'a7b82e2e-4d7c-4662-b8b9-0c9f14a75994'}), (p:Product {productId: 'd4e5f6a7-b8c9-1234-5678-456789012345'})
CREATE (u)-[:VIEWED]->(p);

MATCH (u:User {userId: 'a7b82e2e-4d7c-4662-b8b9-0c9f14a75994'}), (p:Product {productId: 'c6e8f1d2-3b7a-4c59-9d1e-8f5a9b7c6d3e'})
CREATE (u)-[:VIEWED]->(p);

MATCH (u:User {userId: '6f4dc56f-e33b-45c2-bc10-77234c6fc9a3'}), (p:Product {productId: 'c6e8f1d2-3b7a-4c59-9d1e-8f5a9b7c6d3e'})
CREATE (u)-[:PURCHASED]->(p);

MATCH (u:User {userId: '6f4dc56f-e33b-45c2-bc10-77234c6fc9a3'}), (p:Product {productId: 'e8f9d2c1-5a8b-4c7d-9e6f-1a2b3c4d5e6f'})
CREATE (u)-[:PURCHASED]->(p);

MATCH (u:User {userId: '6f4dc56f-e33b-45c2-bc10-77234c6fc9a3'}), (p:Product {productId: 'b2c3d4e5-f6a7-8901-bcde-f23456789012'})
CREATE (u)-[:VIEWED]->(p);

MATCH (u:User {userId: '8b5c4a3e-2f1e-4d8c-9a7b-6e5f4c3d2e1a'}), (p:Product {productId: 'a8098c1a-f86e-11da-bd1a-00112444be1e'})
CREATE (u)-[:PURCHASED]->(p);

MATCH (u:User {userId: '8b5c4a3e-2f1e-4d8c-9a7b-6e5f4c3d2e1a'}), (p:Product {productId: 'f9e8d7c6-b5a4-3c2d-1e0f-9a8b7c6d5e4f'})
CREATE (u)-[:PURCHASED]->(p);

MATCH (u:User {userId: '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d'}), (p:Product {productId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'})
CREATE (u)-[:PURCHASED]->(p);

MATCH (u:User {userId: '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d'}), (p:Product {productId: 'f9e8d7c6-b5a4-3c2d-1e0f-9a8b7c6d5e4f'})
CREATE (u)-[:PURCHASED]->(p);

MATCH (u:User {userId: '3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f'}), (p:Product {productId: 'b2c3d4e5-f6a7-8901-bcde-f23456789012'})
CREATE (u)-[:PURCHASED]->(p);

MATCH (u:User {userId: '3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f'}), (p:Product {productId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'})
CREATE (u)-[:PURCHASED]->(p);

MATCH (u:User {userId: '7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d'}), (p:Product {productId: 'c3d4e5f6-a7b8-9012-cdef-345678901234'})
CREATE (u)-[:PURCHASED]->(p);

MATCH (u:User {userId: '7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d'}), (p:Product {productId: 'd7f9e2c3-4a8b-5d1c-6e2f-3b2a1c0d9e8f'})
CREATE (u)-[:PURCHASED]->(p);

MATCH (u:User {userId: '8b9c0d1e-2f3a-4b5c-6d7e-8f9a0b1c2d3e'}), (p:Product {productId: 'b9a2f37c-42d5-4a24-baee-48a7e12f3ddb'})
CREATE (u)-[:PURCHASED]->(p);

MATCH (u:User {userId: '8b9c0d1e-2f3a-4b5c-6d7e-8f9a0b1c2d3e'}), (p:Product {productId: 'e5f6a7b8-c9d0-1234-5678-567890123456'})
CREATE (u)-[:PURCHASED]->(p);
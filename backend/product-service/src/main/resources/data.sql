INSERT INTO "product_category" (id, category_name)
VALUES ('3e5b1f29-d4e8-4972-b64a-cc103086bd91', 'CAT1'),
       ('d1229c71-9e3e-4f35-9c2d-5c19fc9931a4', 'CAT2'),
       ('a7b82e2e-4d7c-4662-b8b9-0c9f14a75994', 'CAT3'),
       ('6f4dc56f-e33b-45c2-bc10-77234c6fc9a3', 'CAT4');

INSERT INTO "product" (id, title, description, price, stock, image_url, seller_id, created_at)
VALUES ('d113878b-c8f9-493d-89ca-ee6f5fd12162',
        'JBL Headphones V3',
        'Surround sound JBL headphones',
        70.34,
        150,
        'http://placeholder.com',
        'a7b82e2e-4d7c-4662-b8b9-0c9f14a75994',
        '2024-10-30 03:11:55.611171'),

       ('d38e60f5-9090-49f0-96f3-82808d676829',
        'Plita smart Huawei',
        'Plita electrica smart',
        25.84,
        2305,
        'http://placeholder-plita.com',
        'd1229c71-9e3e-4f35-9c2d-5c19fc9931a4',
        '2024-10-30 03:11:55.611171');

INSERT INTO "product_categories" (product_id, categories_id)
VALUES ('d113878b-c8f9-493d-89ca-ee6f5fd12162', '3e5b1f29-d4e8-4972-b64a-cc103086bd91'),
       ('d113878b-c8f9-493d-89ca-ee6f5fd12162', 'd1229c71-9e3e-4f35-9c2d-5c19fc9931a4');
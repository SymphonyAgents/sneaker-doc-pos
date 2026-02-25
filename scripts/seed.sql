-- PostgreSQL seed script generated from sneakerpos MySQL backup
-- Run against your Supabase database

-- -------------------------------------------------------
-- CLEAR EXISTING DATA
-- -------------------------------------------------------
TRUNCATE TABLE claim_payments CASCADE;
TRUNCATE TABLE transaction_items CASCADE;
TRUNCATE TABLE transactions CASCADE;
TRUNCATE TABLE expenses CASCADE;
TRUNCATE TABLE promos CASCADE;
TRUNCATE TABLE services CASCADE;

-- Reset sequences
ALTER SEQUENCE services_id_seq RESTART WITH 1;
ALTER SEQUENCE promos_id_seq RESTART WITH 1;
ALTER SEQUENCE transactions_id_seq RESTART WITH 1;
ALTER SEQUENCE transaction_items_id_seq RESTART WITH 1;
ALTER SEQUENCE claim_payments_id_seq RESTART WITH 1;
ALTER SEQUENCE expenses_id_seq RESTART WITH 1;

-- -------------------------------------------------------
-- SERVICES (7 records)
-- -------------------------------------------------------
INSERT INTO services (name, type, price, is_active, created_at) VALUES
  ('Signature D', 'primary', 600.00, true, NOW()),
  ('Classic D', 'primary', 500.00, true, NOW()),
  ('Premium Care A', 'primary', 700.00, true, NOW()),
  ('Premium Care B', 'primary', 800.00, true, NOW()),
  ('Kids', 'primary', 400.00, true, NOW()),
  ('D'' Yellowing', 'add_on', 600.00, true, NOW()),
  ('Rush', 'add_on', 400.00, true, NOW());

-- -------------------------------------------------------
-- PROMOS (3 records)
-- -------------------------------------------------------
INSERT INTO promos (name, code, percent, date_from, date_to, is_active, created_at) VALUES
  ('Friends and Family', 'FRIENDS&FAM', 100.00, '2026-01-12', '2030-12-31', true, NOW()),
  ('Test 1', 'TEST1', 10.00, NULL, NULL, false, NOW()),
  ('Test', 'TEST2', 10.00, '2026-01-13', '2026-01-16', true, NOW());

-- -------------------------------------------------------
-- EXPENSES (2 records)
-- -------------------------------------------------------
INSERT INTO expenses (date_key, category, note, amount, created_at) VALUES
  ('2026-01-01', 'Rent', 'GCash', 500.00, NOW()),
  ('2026-01-06', 'Rent', 'Cash', 500.00, NOW());

-- -------------------------------------------------------
-- TRANSACTIONS + ITEMS + PAYMENTS
-- -------------------------------------------------------
INSERT INTO transactions (number, customer_name, customer_phone, pickup_date, status, total, paid, created_at) VALUES
  ('0001', 'Hannah Maria Macarasig', '09171773986', '2025-12-31', 'claimed', 600.00, 300.00, '2025-12-27T05:25:06.944000+00:00'),
  ('0002', 'Steve Terrence Sapilan', '09391812893', '2025-12-31', 'claimed', 1200.00, 600.00, '2025-12-28T09:11:01.487000+00:00'),
  ('0003', 'Steve Terrence Sapilan', '09391812893', '2025-12-31', 'claimed', 600.00, 300.00, '2025-12-28T10:48:13.641000+00:00'),
  ('0004', 'Matt Greiner', '09391812893', '2026-01-05', 'pending', 1100.00, 100.00, '2025-12-28T17:58:30.085000+00:00'),
  ('0007', 'Arther Cabardo', '09391812893', '2025-12-31', 'claimed', 5000.00, 3000.00, '2025-12-31T06:41:18.904000+00:00'),
  ('0009', 'Arvin Antony', '09391812893', '2026-01-09', 'pending', 1900.00, 400.00, '2025-12-31T07:11:36.629000+00:00'),
  ('0010', 'Joey Dinoy', '09391812893', '2026-01-06', 'pending', 500.00, 0.00, '2025-12-31T08:19:32.010000+00:00'),
  ('0011', 'Hayley Williams', '09391812893', '2026-01-07', 'pending', 500.00, 0.00, '2025-12-31T10:14:52.380000+00:00'),
  ('0014', 'Jimboy', '09391812893', '2026-01-04', 'pending', 500.00, 0.00, '2025-12-31T19:45:00.418000+00:00'),
  ('0015', 'Rolesa Erederos Quintana', '09298778294', '2026-01-05', 'pending', 500.00, 0.00, '2026-01-01T06:55:26.456000+00:00'),
  ('0016', 'Matthew Greiner', '09391812893', '2026-01-03', 'pending', 500.00, 0.00, '2026-01-01T11:11:18.308000+00:00'),
  ('0019', 'Hannah Mac', '09391812893', '2026-01-03', 'pending', 500.00, 0.00, '2026-01-01T12:20:21.211000+00:00'),
  ('0020', 'JohnJob', '09391812893', '2026-01-03', 'pending', 500.00, 0.00, '2026-01-01T12:22:02.215000+00:00'),
  ('0023', 'Bentley', '09391812893', '2026-01-12', 'pending', 300.00, 0.00, '2026-01-05T09:06:17.117000+00:00'),
  ('0040', 'Steve Terrence Sapilan', '09391812893', '2026-01-14', 'pending', 500.00, 0.00, '2026-01-05T14:02:11.119000+00:00'),
  ('0045', 'Sneaker Doctor', '09274928232', '2026-01-14', 'pending', 500.00, 0.00, '2026-01-05T15:05:49.290000+00:00'),
  ('0056', 'Steve', '09274928232', '2026-01-25', 'pending', 500.00, 0.00, '2026-01-05T15:39:19.668000+00:00'),
  ('0057', 'Sneaker Doctor', '09274928232', '2026-01-16', 'pending', 500.00, 0.00, '2026-01-05T15:44:56.781000+00:00'),
  ('0059', 'Joey Dinoy', '09274928232', '2026-01-24', 'pending', 500.00, 0.00, '2026-01-05T16:10:41.086000+00:00'),
  ('0070', 'Gabby', '09391812893', '2026-01-07', 'pending', 500.00, 0.00, '2026-01-06T09:51:13.323000+00:00'),
  ('0071', 'Williams', '09391812893', '2026-01-07', 'pending', 2100.00, 100.00, '2026-01-06T14:07:19.581000+00:00'),
  ('0072', 'Charlie', '09268952120', '2026-01-15', 'pending', 3200.00, 200.00, '2026-01-08T13:23:16.763000+00:00'),
  ('0073', 'Ella', '09268952120', '2026-01-14', 'pending', 500.00, 0.00, '2026-01-09T06:40:54.720000+00:00');

-- TRANSACTION ITEMS
-- Uses a DO block to look up transaction_id by number and service_id by name
DO $$
DECLARE
  txn_id INTEGER;
  svc_id INTEGER;
BEGIN
  SELECT id INTO txn_id FROM transactions WHERE number = '0001';
  SELECT id INTO svc_id FROM services WHERE LOWER(name) = LOWER('Signature D');
  INSERT INTO transaction_items (transaction_id, shoe_description, service_id, status, price)
    VALUES (txn_id, 'asdasdas', svc_id, 'claimed', 600);
  SELECT id INTO txn_id FROM transactions WHERE number = '0002';
  SELECT id INTO svc_id FROM services WHERE LOWER(name) = LOWER('Signature D');
  INSERT INTO transaction_items (transaction_id, shoe_description, service_id, status, price)
    VALUES (txn_id, 'Hakan', svc_id, 'claimed', 600);
  SELECT id INTO txn_id FROM transactions WHERE number = '0003';
  SELECT id INTO svc_id FROM services WHERE LOWER(name) = LOWER('Signature D');
  INSERT INTO transaction_items (transaction_id, shoe_description, service_id, status, price)
    VALUES (txn_id, 'asdas', svc_id, 'claimed', 600);
  SELECT id INTO txn_id FROM transactions WHERE number = '0004';
  SELECT id INTO svc_id FROM services WHERE LOWER(name) = LOWER('Signature D');
  INSERT INTO transaction_items (transaction_id, shoe_description, service_id, status, price)
    VALUES (txn_id, 'Hahdn', svc_id, 'done', 600);
  SELECT id INTO txn_id FROM transactions WHERE number = '0004';
  SELECT id INTO svc_id FROM services WHERE LOWER(name) = LOWER('Signature D');
  INSERT INTO transaction_items (transaction_id, shoe_description, service_id, status, price)
    VALUES (txn_id, 'Gahab', svc_id, 'claimed', 600);
  SELECT id INTO txn_id FROM transactions WHERE number = '0004';
  SELECT id INTO svc_id FROM services WHERE LOWER(name) = LOWER('Signature D');
  INSERT INTO transaction_items (transaction_id, shoe_description, service_id, status, price)
    VALUES (txn_id, 'Babab', svc_id, 'pending', 600);
  SELECT id INTO txn_id FROM transactions WHERE number = '0007';
  SELECT id INTO svc_id FROM services WHERE LOWER(name) = LOWER('Signature D');
  INSERT INTO transaction_items (transaction_id, shoe_description, service_id, status, price)
    VALUES (txn_id, 'asdas', svc_id, 'claimed', 1000);
  SELECT id INTO txn_id FROM transactions WHERE number = '0007';
  SELECT id INTO svc_id FROM services WHERE LOWER(name) = LOWER('Signature D');
  INSERT INTO transaction_items (transaction_id, shoe_description, service_id, status, price)
    VALUES (txn_id, 'asdadasd', svc_id, 'claimed', 1000);
  SELECT id INTO txn_id FROM transactions WHERE number = '0007';
  SELECT id INTO svc_id FROM services WHERE LOWER(name) = LOWER('Signature D');
  INSERT INTO transaction_items (transaction_id, shoe_description, service_id, status, price)
    VALUES (txn_id, 'asdasdas', svc_id, 'claimed', 1000);
  SELECT id INTO txn_id FROM transactions WHERE number = '0007';
  SELECT id INTO svc_id FROM services WHERE LOWER(name) = LOWER('Signature D');
  INSERT INTO transaction_items (transaction_id, shoe_description, service_id, status, price)
    VALUES (txn_id, 'asdasda', svc_id, 'claimed', 1000);
  SELECT id INTO txn_id FROM transactions WHERE number = '0007';
  SELECT id INTO svc_id FROM services WHERE LOWER(name) = LOWER('Signature D');
  INSERT INTO transaction_items (transaction_id, shoe_description, service_id, status, price)
    VALUES (txn_id, 'asdasd', svc_id, 'claimed', 1000);
  SELECT id INTO txn_id FROM transactions WHERE number = '0009';
  SELECT id INTO svc_id FROM services WHERE LOWER(name) = LOWER('Signature D');
  INSERT INTO transaction_items (transaction_id, shoe_description, service_id, status, price)
    VALUES (txn_id, 'Puma', svc_id, 'in_progress', 1000);
  SELECT id INTO txn_id FROM transactions WHERE number = '0009';
  SELECT id INTO svc_id FROM services WHERE LOWER(name) = LOWER('Signature D');
  INSERT INTO transaction_items (transaction_id, shoe_description, service_id, status, price)
    VALUES (txn_id, 'Nike', svc_id, 'claimed', 1000);
  SELECT id INTO txn_id FROM transactions WHERE number = '0009';
  SELECT id INTO svc_id FROM services WHERE LOWER(name) = LOWER('Signature D');
  INSERT INTO transaction_items (transaction_id, shoe_description, service_id, status, price)
    VALUES (txn_id, 'New Balance', svc_id, 'claimed', 1000);
  SELECT id INTO txn_id FROM transactions WHERE number = '0010';
  SELECT id INTO svc_id FROM services WHERE LOWER(name) = LOWER('Signature D');
  INSERT INTO transaction_items (transaction_id, shoe_description, service_id, status, price)
    VALUES (txn_id, 'qweqwe', svc_id, 'pending', 1000);
  SELECT id INTO txn_id FROM transactions WHERE number = '0011';
  SELECT id INTO svc_id FROM services WHERE LOWER(name) = LOWER('Signature D');
  INSERT INTO transaction_items (transaction_id, shoe_description, service_id, status, price)
    VALUES (txn_id, 'asdas', svc_id, 'pending', 1000);
  SELECT id INTO txn_id FROM transactions WHERE number = '0014';
  SELECT id INTO svc_id FROM services WHERE LOWER(name) = LOWER('Signature D');
  INSERT INTO transaction_items (transaction_id, shoe_description, service_id, status, price)
    VALUES (txn_id, 'Converse', svc_id, 'pending', 1000);
  SELECT id INTO txn_id FROM transactions WHERE number = '0015';
  SELECT id INTO svc_id FROM services WHERE LOWER(name) = LOWER('Signature D');
  INSERT INTO transaction_items (transaction_id, shoe_description, service_id, status, price)
    VALUES (txn_id, 'asdasda', svc_id, 'in_progress', 1000);
  SELECT id INTO txn_id FROM transactions WHERE number = '0016';
  SELECT id INTO svc_id FROM services WHERE LOWER(name) = LOWER('Signature D');
  INSERT INTO transaction_items (transaction_id, shoe_description, service_id, status, price)
    VALUES (txn_id, 'asdasd', svc_id, 'in_progress', 600);
  SELECT id INTO txn_id FROM transactions WHERE number = '0019';
  SELECT id INTO svc_id FROM services WHERE LOWER(name) = LOWER('Signature D');
  INSERT INTO transaction_items (transaction_id, shoe_description, service_id, status, price)
    VALUES (txn_id, 'asdasd', svc_id, 'in_progress', 1000);
  SELECT id INTO txn_id FROM transactions WHERE number = '0020';
  SELECT id INTO svc_id FROM services WHERE LOWER(name) = LOWER('Signature D');
  INSERT INTO transaction_items (transaction_id, shoe_description, service_id, status, price)
    VALUES (txn_id, 'asdasd', svc_id, 'pending', 1000);
  SELECT id INTO txn_id FROM transactions WHERE number = '0023';
  SELECT id INTO svc_id FROM services WHERE LOWER(name) = LOWER('Signature D');
  INSERT INTO transaction_items (transaction_id, shoe_description, service_id, status, price)
    VALUES (txn_id, 'New Balance', svc_id, 'pending', 600);
  SELECT id INTO txn_id FROM transactions WHERE number = '0040';
  SELECT id INTO svc_id FROM services WHERE LOWER(name) = LOWER('Signature D');
  INSERT INTO transaction_items (transaction_id, shoe_description, service_id, status, price)
    VALUES (txn_id, 'Puma', svc_id, 'pending', 1000);
  SELECT id INTO txn_id FROM transactions WHERE number = '0045';
  SELECT id INTO svc_id FROM services WHERE LOWER(name) = LOWER('Signature D');
  INSERT INTO transaction_items (transaction_id, shoe_description, service_id, status, price)
    VALUES (txn_id, 'Nahaja', svc_id, 'pending', 1000);
  SELECT id INTO txn_id FROM transactions WHERE number = '0056';
  SELECT id INTO svc_id FROM services WHERE LOWER(name) = LOWER('Signature D');
  INSERT INTO transaction_items (transaction_id, shoe_description, service_id, status, price)
    VALUES (txn_id, 'Puma', svc_id, 'pending', 1000);
  SELECT id INTO txn_id FROM transactions WHERE number = '0057';
  SELECT id INTO svc_id FROM services WHERE LOWER(name) = LOWER('Signature D');
  INSERT INTO transaction_items (transaction_id, shoe_description, service_id, status, price)
    VALUES (txn_id, 'Jsbe', svc_id, 'done', 1000);
  SELECT id INTO txn_id FROM transactions WHERE number = '0059';
  SELECT id INTO svc_id FROM services WHERE LOWER(name) = LOWER('Signature D');
  INSERT INTO transaction_items (transaction_id, shoe_description, service_id, status, price)
    VALUES (txn_id, 'NB', svc_id, 'done', 1000);
  SELECT id INTO txn_id FROM transactions WHERE number = '0070';
  SELECT id INTO svc_id FROM services WHERE LOWER(name) = LOWER('Signature D');
  INSERT INTO transaction_items (transaction_id, shoe_description, service_id, status, price)
    VALUES (txn_id, 'Puma', svc_id, 'done', 1000);
  SELECT id INTO txn_id FROM transactions WHERE number = '0071';
  SELECT id INTO svc_id FROM services WHERE LOWER(name) = LOWER('Signature D');
  INSERT INTO transaction_items (transaction_id, shoe_description, service_id, status, price)
    VALUES (txn_id, 'Puma', svc_id, 'in_progress', 1000);
  SELECT id INTO txn_id FROM transactions WHERE number = '0071';
  SELECT id INTO svc_id FROM services WHERE LOWER(name) = LOWER('Signature D');
  INSERT INTO transaction_items (transaction_id, shoe_description, service_id, status, price)
    VALUES (txn_id, 'On Cloud', svc_id, 'done', 1000);
  SELECT id INTO txn_id FROM transactions WHERE number = '0071';
  SELECT id INTO svc_id FROM services WHERE LOWER(name) = LOWER('Signature D');
  INSERT INTO transaction_items (transaction_id, shoe_description, service_id, status, price)
    VALUES (txn_id, 'Nike', svc_id, 'claimed', 1000);
  SELECT id INTO txn_id FROM transactions WHERE number = '0072';
  SELECT id INTO svc_id FROM services WHERE LOWER(name) = LOWER('Signature D');
  INSERT INTO transaction_items (transaction_id, shoe_description, service_id, status, price)
    VALUES (txn_id, 'adasda', svc_id, 'pending', 1000);
  SELECT id INTO txn_id FROM transactions WHERE number = '0072';
  SELECT id INTO svc_id FROM services WHERE LOWER(name) = LOWER('Signature D');
  INSERT INTO transaction_items (transaction_id, shoe_description, service_id, status, price)
    VALUES (txn_id, 'asdasd', svc_id, 'done', 1000);
  SELECT id INTO txn_id FROM transactions WHERE number = '0072';
  SELECT id INTO svc_id FROM services WHERE LOWER(name) = LOWER('Signature D');
  INSERT INTO transaction_items (transaction_id, shoe_description, service_id, status, price)
    VALUES (txn_id, 'asdasd', svc_id, 'in_progress', 1000);
  SELECT id INTO txn_id FROM transactions WHERE number = '0072';
  SELECT id INTO svc_id FROM services WHERE LOWER(name) = LOWER('Signature D');
  INSERT INTO transaction_items (transaction_id, shoe_description, service_id, status, price)
    VALUES (txn_id, 'asdasdw', svc_id, 'pending', 1000);
  SELECT id INTO txn_id FROM transactions WHERE number = '0072';
  SELECT id INTO svc_id FROM services WHERE LOWER(name) = LOWER('Signature D');
  INSERT INTO transaction_items (transaction_id, shoe_description, service_id, status, price)
    VALUES (txn_id, 'awdasd', svc_id, 'claimed', 1000);
  SELECT id INTO txn_id FROM transactions WHERE number = '0073';
  SELECT id INTO svc_id FROM services WHERE LOWER(name) = LOWER('Signature D');
  INSERT INTO transaction_items (transaction_id, shoe_description, service_id, status, price)
    VALUES (txn_id, 'adasda', svc_id, 'done', 1000);
END $$;

-- CLAIM PAYMENTS
DO $$
DECLARE
  txn_id INTEGER;
BEGIN
  SELECT id INTO txn_id FROM transactions WHERE number = '0001';
  INSERT INTO claim_payments (transaction_id, amount, method, paid_at)
    VALUES (txn_id, 300, 'cash', '2025-12-28T17:29:07.413000+00:00');
  SELECT id INTO txn_id FROM transactions WHERE number = '0002';
  INSERT INTO claim_payments (transaction_id, amount, method, paid_at)
    VALUES (txn_id, 600, 'gcash', '2025-12-31T11:57:10.639000+00:00');
  SELECT id INTO txn_id FROM transactions WHERE number = '0003';
  INSERT INTO claim_payments (transaction_id, amount, method, paid_at)
    VALUES (txn_id, 300, 'gcash', '2026-01-01T07:22:00.688000+00:00');
  SELECT id INTO txn_id FROM transactions WHERE number = '0004';
  INSERT INTO claim_payments (transaction_id, amount, method, paid_at)
    VALUES (txn_id, 100, 'cash', '2025-12-29T06:34:13.634000+00:00');
  SELECT id INTO txn_id FROM transactions WHERE number = '0007';
  INSERT INTO claim_payments (transaction_id, amount, method, paid_at)
    VALUES (txn_id, 100, 'card', '2025-12-31T06:41:50.995000+00:00');
  SELECT id INTO txn_id FROM transactions WHERE number = '0007';
  INSERT INTO claim_payments (transaction_id, amount, method, paid_at)
    VALUES (txn_id, 200, 'card', '2025-12-31T07:17:51.298000+00:00');
  SELECT id INTO txn_id FROM transactions WHERE number = '0007';
  INSERT INTO claim_payments (transaction_id, amount, method, paid_at)
    VALUES (txn_id, 500, 'cash', '2025-12-31T07:58:53.506000+00:00');
  SELECT id INTO txn_id FROM transactions WHERE number = '0007';
  INSERT INTO claim_payments (transaction_id, amount, method, paid_at)
    VALUES (txn_id, 2200, 'gcash', '2026-01-06T17:13:47.289000+00:00');
  SELECT id INTO txn_id FROM transactions WHERE number = '0009';
  INSERT INTO claim_payments (transaction_id, amount, method, paid_at)
    VALUES (txn_id, 200, 'bank_deposit', '2025-12-31T07:14:17.373000+00:00');
  SELECT id INTO txn_id FROM transactions WHERE number = '0009';
  INSERT INTO claim_payments (transaction_id, amount, method, paid_at)
    VALUES (txn_id, 200, 'bank_deposit', '2025-12-31T07:52:13.684000+00:00');
  SELECT id INTO txn_id FROM transactions WHERE number = '0071';
  INSERT INTO claim_payments (transaction_id, amount, method, paid_at)
    VALUES (txn_id, 100, 'cash', '2026-01-09T06:32:50.826000+00:00');
  SELECT id INTO txn_id FROM transactions WHERE number = '0072';
  INSERT INTO claim_payments (transaction_id, amount, method, paid_at)
    VALUES (txn_id, 200, 'card', '2026-01-12T16:54:23.209000+00:00');
END $$;

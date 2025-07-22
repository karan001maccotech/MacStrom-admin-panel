INSERT INTO financial_overview (total_revenue, monthly_growth, total_payouts, pending_payouts, processing_fees, net_profit)
VALUES (127450.00, 12.50, 89320.00, 15670.00, 3240.00, 34890.00)
ON CONFLICT (id) DO UPDATE SET
    total_revenue = EXCLUDED.total_revenue,
    monthly_growth = EXCLUDED.monthly_growth,
    total_payouts = EXCLUDED.total_payouts,
    pending_payouts = EXCLUDED.pending_payouts,
    processing_fees = EXCLUDED.processing_fees,
    net_profit = EXCLUDED.net_profit,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO recent_transactions (transaction_id, type, "user", tournament, amount, status, timestamp, payment_method) VALUES
('TXN-001', 'entry_fee', 'ProGamer123', 'Mobile Legends Championship', 25.00, 'completed', '2024-01-08 14:32:15', 'Credit Card'),
('TXN-002', 'payout', 'EliteSniper', 'PUBG Squad Battle', -1250.00, 'pending', '2024-01-08 13:45:22', 'PayPal'),
('TXN-003', 'entry_fee', 'MobileKing', 'Free Fire Clash', 15.00, 'completed', '2024-01-08 12:18:45', 'Digital Wallet'),
('TXN-004', 'refund', 'GameMaster', 'Call of Duty Championship', -30.00, 'processing', '2024-01-08 11:22:33', 'Credit Card'),
('TXN-005', 'payout', 'SkillShot', 'Clash Royale Masters', -850.00, 'failed', '2024-01-08 10:15:18', 'Bank Transfer')
ON CONFLICT (transaction_id) DO UPDATE SET
    type = EXCLUDED.type,
    "user" = EXCLUDED."user",
    tournament = EXCLUDED.tournament,
    amount = EXCLUDED.amount,
    status = EXCLUDED.status,
    timestamp = EXCLUDED.timestamp,
    payment_method = EXCLUDED.payment_method;

INSERT INTO payment_methods (method_name, transactions_count, percentage, revenue) VALUES
('Credit Card', 1245, 45.20, 57650.00),
('PayPal', 892, 32.40, 41230.00),
('Digital Wallet', 456, 16.60, 21180.00),
('Bank Transfer', 167, 6.10, 7390.00),
('Cryptocurrency', 45, 1.60, 2100.00)
ON CONFLICT (method_name) DO UPDATE SET
    transactions_count = EXCLUDED.transactions_count,
    percentage = EXCLUDED.percentage,
    revenue = EXCLUDED.revenue;

INSERT INTO monthly_revenue (month_year, revenue, growth) VALUES
('Jul 2023', 89420.00, 8.20),
('Aug 2023', 95680.00, 7.00),
('Sep 2023', 102340.00, 6.90),
('Oct 2023', 108920.00, 6.40),
('Nov 2023', 115670.00, 6.20),
('Dec 2023', 123450.00, 6.70),
('Jan 2024', 127450.00, 3.20)
ON CONFLICT (month_year) DO UPDATE SET
    revenue = EXCLUDED.revenue,
    growth = EXCLUDED.growth;

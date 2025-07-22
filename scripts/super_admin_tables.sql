-- Create the pl_summary_daily table for P&L data
CREATE TABLE IF NOT EXISTS pl_summary_daily (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    period VARCHAR(20) NOT NULL, -- 'today', 'thisWeek', 'thisMonth'
    revenue DECIMAL(12, 2) NOT NULL DEFAULT 0,
    costs DECIMAL(12, 2) NOT NULL DEFAULT 0,
    net_profit DECIMAL(12, 2) NOT NULL DEFAULT 0,
    profit_margin DECIMAL(5, 2) NOT NULL DEFAULT 0,
    revenue_comparison DECIMAL(5, 2) DEFAULT 0,
    costs_comparison DECIMAL(5, 2) DEFAULT 0,
    profit_comparison DECIMAL(5, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the admin_sessions table for tracking admin sessions
CREATE TABLE IF NOT EXISTS admin_sessions (
    id SERIAL PRIMARY KEY,
    admin_id INTEGER REFERENCES admins(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    location VARCHAR(255),
    device_info VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the system_health table for monitoring system metrics
CREATE TABLE IF NOT EXISTS system_health (
    id SERIAL PRIMARY KEY,
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(10, 2) NOT NULL,
    threshold_value DECIMAL(10, 2),
    status VARCHAR(20) NOT NULL, -- 'healthy', 'warning', 'critical'
    additional_data JSONB,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the admin_audit table for audit logging
CREATE TABLE IF NOT EXISTS admin_audit (
    id SERIAL PRIMARY KEY,
    admin_id INTEGER REFERENCES admins(id) ON DELETE SET NULL,
    admin_name VARCHAR(255) NOT NULL,
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(255),
    details TEXT,
    ip_address INET,
    user_agent TEXT,
    severity VARCHAR(20) NOT NULL DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the platform_ledger table for manual adjustments
CREATE TABLE IF NOT EXISTS platform_ledger (
    id SERIAL PRIMARY KEY,
    current_balance DECIMAL(15, 2) NOT NULL DEFAULT 0,
    pending_transactions DECIMAL(15, 2) NOT NULL DEFAULT 0,
    last_adjustment_amount DECIMAL(15, 2),
    last_adjustment_type VARCHAR(20), -- 'credit', 'debit'
    last_adjustment_reason TEXT,
    last_adjustment_admin VARCHAR(255),
    last_adjustment_timestamp TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial data
INSERT INTO pl_summary_daily (date, period, revenue, costs, net_profit, profit_margin, revenue_comparison, costs_comparison, profit_comparison) VALUES
(CURRENT_DATE, 'today', 45230.00, 28940.00, 16290.00, 36.0, 8.5, 12.3, 2.1),
(CURRENT_DATE - INTERVAL '7 days', 'thisWeek', 298450.00, 189320.00, 109130.00, 36.6, 0, 0, 0),
(CURRENT_DATE - INTERVAL '30 days', 'thisMonth', 1284750.00, 823400.00, 461350.00, 35.9, 0, 0, 0);

INSERT INTO system_health (metric_name, metric_value, threshold_value, status, additional_data) VALUES
('cpu_usage', 23.5, 80.0, 'healthy', '{}'),
('memory_usage', 67.2, 85.0, 'warning', '{}'),
('database_connections', 45.0, 100.0, 'healthy', '{"max_connections": 100}'),
('redis_hit_rate', 94.8, 90.0, 'healthy', '{}'),
('disk_usage', 45.3, 90.0, 'healthy', '{}'),
('api_response_time_avg', 245.0, 1000.0, 'healthy', '{}'),
('api_response_time_p95', 890.0, 2000.0, 'healthy', '{}'),
('error_rate', 0.02, 1.0, 'healthy', '{}');

INSERT INTO admin_audit (admin_id, admin_name, action, resource, details, ip_address, user_agent, severity) VALUES
(1, 'John Smith', 'USER_BANNED', 'user:12345', 'Banned user ProGamer123 for cheating violation', '192.168.1.100', 'Chrome 120.0', 'high'),
(2, 'Sarah Johnson', 'TOURNAMENT_CREATED', 'tournament:789', 'Created Mobile Legends Championship tournament', '10.0.0.45', 'Safari 17.0', 'medium'),
(3, 'Mike Chen', 'PAYOUT_APPROVED', 'payout:4521', 'Approved $1,250 payout to EliteSniper', '172.16.0.23', 'Firefox 121.0', 'high'),
(1, 'John Smith', 'LEDGER_ADJUSTMENT', 'ledger:platform', 'Manual credit adjustment: +$500 - Tournament prize correction', '192.168.1.100', 'Chrome 120.0', 'critical');

INSERT INTO platform_ledger (current_balance, pending_transactions, last_adjustment_amount, last_adjustment_type, last_adjustment_reason, last_adjustment_admin, last_adjustment_timestamp) VALUES
(2847650.45, 15670.00, 500.00, 'credit', 'Tournament prize correction', 'John Smith', '2024-01-08 11:22:33');

-- Update admins table with session info
UPDATE admins SET 
    last_login = CASE 
        WHEN id = 1 THEN '2024-01-08 14:32:15'::timestamp
        WHEN id = 2 THEN '2024-01-07 09:45:22'::timestamp
        WHEN id = 3 THEN '2024-01-08 11:22:33'::timestamp
        ELSE last_login
    END;

-- Insert admin sessions
INSERT INTO admin_sessions (admin_id, session_token, ip_address, user_agent, location, device_info, is_active) VALUES
(1, 'session_token_1', '192.168.1.100', 'Chrome 120.0 on Windows 11', 'New York, USA', 'Chrome 120.0 on Windows 11', true),
(2, 'session_token_2', '10.0.0.45', 'Safari 17.0 on macOS', 'Los Angeles, USA', 'Safari 17.0 on macOS', false),
(3, 'session_token_3', '172.16.0.23', 'Firefox 121.0 on Ubuntu', 'Seattle, USA', 'Firefox 121.0 on Ubuntu', true);

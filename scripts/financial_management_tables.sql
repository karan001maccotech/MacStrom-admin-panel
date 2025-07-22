CREATE TABLE IF NOT EXISTS financial_overview (
    id SERIAL PRIMARY KEY,
    total_revenue DECIMAL(18, 2) NOT NULL,
    monthly_growth DECIMAL(5, 2) NOT NULL,
    total_payouts DECIMAL(18, 2) NOT NULL,
    pending_payouts DECIMAL(18, 2) NOT NULL,
    processing_fees DECIMAL(18, 2) NOT NULL,
    net_profit DECIMAL(18, 2) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS recent_transactions (
    id SERIAL PRIMARY KEY,
    transaction_id VARCHAR(255) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL,
    "user" VARCHAR(255) NOT NULL,
    tournament VARCHAR(255),
    amount DECIMAL(18, 2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    payment_method VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS payment_methods (
    id SERIAL PRIMARY KEY,
    method_name VARCHAR(100) UNIQUE NOT NULL,
    transactions_count INT NOT NULL,
    percentage DECIMAL(5, 2) NOT NULL,
    revenue DECIMAL(18, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS monthly_revenue (
    id SERIAL PRIMARY KEY,
    month_year VARCHAR(20) UNIQUE NOT NULL,
    revenue DECIMAL(18, 2) NOT NULL,
    growth DECIMAL(5, 2) NOT NULL
);

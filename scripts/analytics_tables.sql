-- Create the kpis table
CREATE TABLE IF NOT EXISTS kpis (
    id SERIAL PRIMARY KEY,
    users_total INTEGER,
    users_active INTEGER,
    users_change DECIMAL(5, 2),
    revenue_total DECIMAL(15, 2),
    revenue_change DECIMAL(5, 2),
    active_teams_total INTEGER,
    active_teams_change DECIMAL(5, 2),
    votes_state INTEGER,
    votes_national INTEGER,
    votes_change DECIMAL(5, 2),
    open_problems_total INTEGER,
    open_problems_critical INTEGER,
    open_problems_high INTEGER,
    open_problems_medium INTEGER,
    open_problems_change DECIMAL(5, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the pl_data table
CREATE TABLE IF NOT EXISTS pl_data (
    id SERIAL PRIMARY KEY,
    gross_revenue DECIMAL(15, 2),
    total_costs DECIMAL(15, 2),
    net_profit_loss DECIMAL(15, 2),
    profit_margin DECIMAL(5, 2),
    comparison_revenue DECIMAL(5, 2),
    comparison_costs DECIMAL(5, 2),
    comparison_profit DECIMAL(5, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the live_matches table
CREATE TABLE IF NOT EXISTS live_matches (
    id SERIAL PRIMARY KEY,
    match_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    game VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    timer VARCHAR(50),
    spectators INTEGER,
    team1_name VARCHAR(255),
    team1_tag VARCHAR(50),
    team1_score INTEGER,
    team2_name VARCHAR(255),
    team2_tag VARCHAR(50),
    team2_score INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the ad_banners table
CREATE TABLE IF NOT EXISTS ad_banners (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    image_url VARCHAR(255),
    click_url VARCHAR(255),
    sponsor VARCHAR(255),
    duration INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the match_results table
CREATE TABLE IF NOT EXISTS match_results (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    game VARCHAR(255) NOT NULL,
    stage VARCHAR(255),
    date DATE,
    status VARCHAR(50) NOT NULL,
    spectators INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the settings table
CREATE TABLE IF NOT EXISTS settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(255) NOT NULL UNIQUE,
    setting_value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the team_performance table
CREATE TABLE IF NOT EXISTS team_performance (
    id SERIAL PRIMARY KEY,
    team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
    total_matches INTEGER,
    wins INTEGER,
    losses INTEGER,
    win_rate DECIMAL(5, 2),
    average_kills DECIMAL(5, 2),
    total_earnings DECIMAL(15, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the voting_data table
CREATE TABLE IF NOT EXISTS voting_data (
    id SERIAL PRIMARY KEY,
    state VARCHAR(255) NOT NULL,
    total_votes INTEGER,
    is_locked BOOLEAN DEFAULT FALSE,
    fraud_alerts INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the daily_duels table
CREATE TABLE IF NOT EXISTS daily_duels (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    entry_fee DECIMAL(10, 2),
    prize_pool DECIMAL(15, 2),
    max_participants INTEGER,
    current_participants INTEGER,
    status VARCHAR(50) NOT NULL,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    commission DECIMAL(5, 2),
    platform_earnings DECIMAL(15, 2),
    winner VARCHAR(255),
    webhook_received BOOLEAN DEFAULT FALSE,
    verified BOOLEAN DEFAULT FALSE,
    payout_triggered BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the daily_bets table
CREATE TABLE IF NOT EXISTS daily_bets (
    id SERIAL PRIMARY KEY,
    match_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    start_time TIMESTAMP,
    status VARCHAR(50) NOT NULL,
    total_stake DECIMAL(15, 2),
    total_exposure DECIMAL(15, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

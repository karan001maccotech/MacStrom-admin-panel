-- Create the admins table
CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'admin',
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the admin_permissions table
CREATE TABLE IF NOT EXISTS admin_permissions (
    admin_id INTEGER REFERENCES admins(id) ON DELETE CASCADE,
    permission VARCHAR(255) NOT NULL,
    PRIMARY KEY (admin_id, permission)
);

-- Create the general_settings table
CREATE TABLE IF NOT EXISTS general_settings (
    id SERIAL PRIMARY KEY,
    league_name VARCHAR(255),
    app_name VARCHAR(255),
    support_email VARCHAR(255),
    support_phone VARCHAR(50),
    timezone VARCHAR(100)
);

-- Create the social_links table
CREATE TABLE IF NOT EXISTS social_links (
    id SERIAL PRIMARY KEY,
    youtube_url VARCHAR(255),
    instagram_url VARCHAR(255),
    facebook_url VARCHAR(255),
    twitter_url VARCHAR(255),
    discord_invite VARCHAR(255)
);

-- Create the legal_docs table
CREATE TABLE IF NOT EXISTS legal_docs (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    version VARCHAR(50) NOT NULL,
    content TEXT,
    is_live BOOLEAN DEFAULT FALSE,
    last_updated TIMESTAMP,
    updated_by VARCHAR(255)
);

-- Create the howto_steps table
CREATE TABLE IF NOT EXISTS howto_steps (
    id SERIAL PRIMARY KEY,
    step VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    gif_url VARCHAR(255),
    order_num INTEGER NOT NULL
);

-- Create the faqs table
CREATE TABLE IF NOT EXISTS faqs (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT
);

-- Create the betting_markets table
CREATE TABLE IF NOT EXISTS betting_markets (
    id SERIAL PRIMARY KEY,
    match_id INTEGER,
    name VARCHAR(255) NOT NULL,
    odds_team_a DECIMAL(10, 2),
    odds_team_b DECIMAL(10, 2),
    line DECIMAL(10, 2),
    status VARCHAR(50) NOT NULL DEFAULT 'active'
);

-- Create the matches table
CREATE TABLE IF NOT EXISTS matches (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    game VARCHAR(255) NOT NULL,
    type VARCHAR(255),
    status VARCHAR(50) NOT NULL,
    scheduled_time TIMESTAMP,
    actual_start_time TIMESTAMP,
    estimated_duration INTEGER,
    current_duration INTEGER,
    room_id VARCHAR(50),
    spectators INTEGER,
    stream_url VARCHAR(255),
    referee VARCHAR(255)
);

-- Create the teams table
CREATE TABLE IF NOT EXISTS teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    tag VARCHAR(50) NOT NULL,
    logo VARCHAR(255),
    captain VARCHAR(255),
    created_date TIMESTAMP,
    last_active TIMESTAMP
);

-- Create the team_members table
CREATE TABLE IF NOT EXISTS team_members (
    id SERIAL PRIMARY KEY,
    team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
    username VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    rating INTEGER,
    status VARCHAR(50) NOT NULL,
    position INTEGER NOT NULL
);

-- Create the votes table
CREATE TABLE IF NOT EXISTS votes (
    id SERIAL PRIMARY KEY,
    team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
    state VARCHAR(255) NOT NULL,
    total_votes INTEGER NOT NULL
);

-- Create the problems table
CREATE TABLE IF NOT EXISTS problems (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    severity VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    category VARCHAR(255),
    user_id INTEGER,
    user_name VARCHAR(255),
    assigned_to VARCHAR(255),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    sla_timer DECIMAL(10, 2)
);

-- Create the notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    time TIMESTAMP
);

-- Create the sponsor_ads table
CREATE TABLE IF NOT EXISTS sponsor_ads (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    image_url VARCHAR(255),
    click_url VARCHAR(255),
    sponsor VARCHAR(255),
    duration INTEGER
);

-- Create the platform_earnings table
CREATE TABLE IF NOT EXISTS platform_earnings (
    id SERIAL PRIMARY KEY,
    source VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    timestamp TIMESTAMP
);

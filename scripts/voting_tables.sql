CREATE TABLE IF NOT EXISTS voting_stats (
    id SERIAL PRIMARY KEY,
    total_votes BIGINT NOT NULL DEFAULT 0,
    active_polls INT NOT NULL DEFAULT 0,
    suspicious_activity INT NOT NULL DEFAULT 0,
    fraud_detected INT NOT NULL DEFAULT 0,
    participation_rate NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    top_voted_team VARCHAR(255) NOT NULL DEFAULT 'N/A'
);

CREATE TABLE IF NOT EXISTS state_voting_data (
    id SERIAL PRIMARY KEY,
    state_name VARCHAR(255) UNIQUE NOT NULL,
    total_votes BIGINT NOT NULL DEFAULT 0,
    is_locked BOOLEAN NOT NULL DEFAULT FALSE,
    fraud_alerts INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS state_team_votes (
    id SERIAL PRIMARY KEY,
    state_id INT NOT NULL REFERENCES state_voting_data(id) ON DELETE CASCADE,
    team_name VARCHAR(255) NOT NULL,
    votes BIGINT NOT NULL DEFAULT 0,
    percentage NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    fraud_flags INT NOT NULL DEFAULT 0,
    UNIQUE(state_id, team_name) -- This composite unique constraint is crucial for ON CONFLICT
);

CREATE TABLE IF NOT EXISTS national_voting_data (
    id SERIAL PRIMARY KEY,
    total_votes BIGINT NOT NULL DEFAULT 0,
    is_locked BOOLEAN NOT NULL DEFAULT FALSE,
    fraud_alerts INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS national_team_votes (
    id SERIAL PRIMARY KEY,
    national_id INT NOT NULL REFERENCES national_voting_data(id) ON DELETE CASCADE,
    team_name VARCHAR(255) NOT NULL,
    votes BIGINT NOT NULL DEFAULT 0,
    percentage NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    fraud_flags INT NOT NULL DEFAULT 0,
    UNIQUE(national_id, team_name) -- This composite unique constraint is crucial for ON CONFLICT
);

CREATE TABLE IF NOT EXISTS fraud_heuristics (
    id SERIAL PRIMARY KEY,
    type VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    severity VARCHAR(50) NOT NULL,
    affected_votes INT NOT NULL DEFAULT 0,
    teams TEXT[] NOT NULL DEFAULT '{}',
    reason TEXT
);

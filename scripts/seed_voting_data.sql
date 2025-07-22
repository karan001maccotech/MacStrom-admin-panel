-- voting_stats
INSERT INTO voting_stats (id, total_votes, active_polls, suspicious_activity, fraud_detected, participation_rate, top_voted_team)
VALUES (1, 45230, 5, 12, 4, 78.50, 'Thunder Bolts')
ON CONFLICT (id) DO UPDATE SET
    total_votes = EXCLUDED.total_votes,
    active_polls = EXCLUDED.active_polls,
    suspicious_activity = EXCLUDED.suspicious_activity,
    fraud_detected = EXCLUDED.fraud_detected,
    participation_rate = EXCLUDED.participation_rate,
    top_voted_team = EXCLUDED.top_voted_team;

-- state_voting_data
INSERT INTO state_voting_data (id, state_name, total_votes, is_locked, fraud_alerts) VALUES
(1, 'California', 8450, FALSE, 2),
(2, 'Texas', 7000, FALSE, 1),
(3, 'New York', 9200, TRUE, 3),
(4, 'Florida', 6100, FALSE, 0),
(5, 'Illinois', 5200, TRUE, 1)
ON CONFLICT (id) DO UPDATE SET
    state_name = EXCLUDED.state_name,
    total_votes = EXCLUDED.total_votes,
    is_locked = EXCLUDED.is_locked,
    fraud_alerts = EXCLUDED.fraud_alerts;

-- state_team_votes
INSERT INTO state_team_votes (state_id, team_name, votes, percentage, fraud_flags) VALUES
-- California (id = 1)
(1, 'Thunder Bolts', 4000, 47.34, 1),
(1, 'Shadow Ninjas', 2000, 23.67, 0),
(1, 'Phoenix Blaze', 2450, 28.99, 1),
-- Texas (id = 2)
(2, 'Thunder Bolts', 3500, 50.00, 0),
(2, 'Shadow Ninjas', 2000, 28.57, 0),
(2, 'Phoenix Blaze', 1500, 21.43, 0),
-- New York (id = 3)
(3, 'Thunder Bolts', 4500, 48.91, 1),
(3, 'Shadow Ninjas', 3000, 32.61, 2),
(3, 'Phoenix Blaze', 1700, 18.48, 0)
ON CONFLICT (state_id, team_name) DO UPDATE SET
    votes = EXCLUDED.votes,
    percentage = EXCLUDED.percentage,
    fraud_flags = EXCLUDED.fraud_flags;

-- national_voting_data
INSERT INTO national_voting_data (id, total_votes, is_locked, fraud_alerts)
VALUES (1, 37750, FALSE, 6)
ON CONFLICT (id) DO UPDATE SET
    total_votes = EXCLUDED.total_votes,
    is_locked = EXCLUDED.is_locked,
    fraud_alerts = EXCLUDED.fraud_alerts;

-- national_team_votes
INSERT INTO national_team_votes (national_id, team_name, votes, percentage, fraud_flags) VALUES
(1, 'Thunder Bolts', 17000, 45.04, 2),
(1, 'Shadow Ninjas', 11500, 30.47, 3),
(1, 'Phoenix Blaze', 9250, 24.49, 1)
ON CONFLICT (national_id, team_name) DO UPDATE SET
    votes = EXCLUDED.votes,
    percentage = EXCLUDED.percentage,
    fraud_flags = EXCLUDED.fraud_flags;

-- fraud_heuristics
INSERT INTO fraud_heuristics (id, type, description, severity, affected_votes, teams, reason) VALUES
(1, 'IP_DUPLICATE', 'Multiple votes from same IP range within short period', 'High', 1300, ARRAY['Shadow Ninjas', 'Phoenix Blaze'], 'IP duplication detected in New York & California'),
(2, 'VOTE_BURST', 'Abnormal voting spike in short timeframe', 'Medium', 850, ARRAY['Thunder Bolts'], 'Spike noted during midnight in Texas'),
(3, 'BOT_PATTERN', 'Voting pattern resembles automation/bot activity', 'High', 500, ARRAY['Shadow Ninjas'], 'Sequential identical votes'),
(4, 'GEO_MISMATCH', 'Votes originated from non-residential regions', 'Low', 400, ARRAY['Phoenix Blaze'], 'Votes cast from overseas proxies')
ON CONFLICT (id) DO UPDATE SET
    type = EXCLUDED.type,
    description = EXCLUDED.description,
    severity = EXCLUDED.severity,
    affected_votes = EXCLUDED.affected_votes,
    teams = EXCLUDED.teams,
    reason = EXCLUDED.reason;

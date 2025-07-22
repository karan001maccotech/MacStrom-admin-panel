-- Seed data for kpis table
INSERT INTO kpis (users_total, users_active, users_change, revenue_total, revenue_change, active_teams_total, active_teams_change, votes_state, votes_national, votes_change, open_problems_total, open_problems_critical, open_problems_high, open_problems_medium, open_problems_change) VALUES
(18247, 12847, 8.2, 127450.00, 12.5, 156, 15.3, 45230, 89450, 6.7, 7, 2, 3, 2, -2.1);

-- Seed data for pl_data table
INSERT INTO pl_data (gross_revenue, total_costs, net_profit_loss, profit_margin, comparison_revenue, comparison_costs, comparison_profit) VALUES
(45230.00, 28940.00, 16290.00, 36.0, 8.5, 12.3, 2.1);

-- Seed data for live_matches table
INSERT INTO live_matches (match_id, title, game, status, timer, spectators, team1_name, team1_tag, team1_score, team2_name, team2_tag, team2_score) VALUES
('MATCH-789', 'Phoenix Warriors vs Thunder Bolts', 'Mobile Legends', 'live', '23:45', 1250, 'Phoenix Warriors', 'PHX', 1, 'Thunder Bolts', 'TBT', 2);

-- Seed data for ad_banners table
INSERT INTO ad_banners (title, image_url, click_url, sponsor, duration) VALUES
('Gaming Gear Sale', '/placeholder.svg?height=120&width=400', 'https://sponsor.example.com/gaming-gear', 'TechGear Pro', 30000);

-- Seed data for match_results table
INSERT INTO match_results (title, game, stage, date, status, spectators) VALUES
('Phoenix Warriors vs Thunder Bolts', 'Mobile Legends', 'State', '2025-07-07', 'completed', 1250),
('Shadow Hunters vs Storm Riders', 'PUBG Mobile', 'State', '2025-07-07', 'completed', 890),
('Elite Squad vs Pro Gamers', 'Free Fire', 'National', '2025-07-06', 'disputed', 2100);

-- Seed data for settings table
INSERT INTO settings (setting_key, setting_value) VALUES
('app_name', 'BattleNation'),
('theme', 'dark');

-- Seed data for team_performance table
INSERT INTO team_performance (team_id, total_matches, wins, losses, win_rate, average_kills, total_earnings) VALUES
(1, 45, 32, 13, 71.1, 8.5, 2450.50),
(2, 67, 48, 19, 71.6, 12.3, 5670.00);

-- Seed data for voting_data table
INSERT INTO voting_data (state, total_votes, is_locked, fraud_alerts) VALUES
('California', 8450, FALSE, 3),
('Texas', 7230, FALSE, 1),
('New York', 6890, TRUE, 2);

-- Seed data for daily_duels table
INSERT INTO daily_duels (title, type, entry_fee, prize_pool, max_participants, current_participants, status, start_time, end_time, commission, platform_earnings, winner, webhook_received, verified, payout_triggered) VALUES
('BGMI Squad Showdown', 'Squad', 50.00, 400.00, 10, 8, 'Pending', '2024-01-15 18:00:00', '2024-01-15 19:30:00', 20.00, 100.00, NULL, FALSE, FALSE, FALSE),
('Free Fire Solo Challenge', 'Solo', 25.00, 200.00, 12, 12, 'Completed', '2024-01-14 16:00:00', '2024-01-14 17:00:00', 20.00, 50.00, 'Player123', TRUE, TRUE, TRUE);

-- Seed data for daily_bets table
INSERT INTO daily_bets (match_id, title, start_time, status, total_stake, total_exposure) VALUES
('M001', 'Team Alpha vs Team Beta', '2024-01-15 18:00:00', 'Live', 15000.00, 12000.00),
('M002', 'Team Gamma vs Team Delta', '2024-01-15 20:00:00', 'Upcoming', 8500.00, 7200.00);

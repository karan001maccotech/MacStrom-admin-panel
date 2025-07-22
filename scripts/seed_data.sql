-- Insert initial data into the admins table
INSERT INTO admins (name, email, password, role) VALUES
('John Smith', 'superadmin@battlenation.com', 'SuperAdmin123!', 'super_admin'),
('Sarah Johnson', 'admin@battlenation.com', 'Admin123!', 'admin'),
('Mike Chen', 'moderator@battlenation.com', 'Moderator123!', 'moderator');

-- Insert permissions for the super_admin
INSERT INTO admin_permissions (admin_id, permission) VALUES
(1, 'super_only'),
(1, 'view_dashboard'),
(1, 'manage_users'),
(1, 'manage_teams'),
(1, 'view_votes'),
(1, 'manage_matches'),
(1, 'manage_results'),
(1, 'manage_duels'),
(1, 'manage_bets'),
(1, 'view_problems'),
(1, 'send_notifications'),
(1, 'manage_ads'),
(1, 'manage_finance'),
(1, 'view_reports'),
(1, 'manage_support'),
(1, 'manage_settings');

-- Insert permissions for the admin
INSERT INTO admin_permissions (admin_id, permission) VALUES
(2, 'view_dashboard'),
(2, 'manage_users'),
(2, 'manage_teams'),
(2, 'view_votes'),
(2, 'manage_matches'),
(2, 'manage_results'),
(2, 'view_problems'),
(2, 'send_notifications'),
(2, 'view_reports'),
(2, 'manage_support'),
(2, 'manage_settings');

-- Insert permissions for the moderator
INSERT INTO admin_permissions (admin_id, permission) VALUES
(3, 'view_dashboard'),
(3, 'manage_users'),
(3, 'view_votes'),
(3, 'view_problems'),
(3, 'manage_support');

-- Insert data into the general_settings table
INSERT INTO general_settings (league_name, app_name, support_email, support_phone, timezone) VALUES
('BattleNation Championship', 'BattleNation', 'support@battlenation.com', '+1-800-BATTLE', 'America/New_York');

-- Insert data into the social_links table
INSERT INTO social_links (youtube_url, instagram_url, facebook_url, twitter_url, discord_invite) VALUES
('https://youtube.com/@battlenation', 'https://instagram.com/battlenation', 'https://facebook.com/battlenation', 'https://twitter.com/battlenation', 'https://discord.gg/battlenation');

-- Insert data into the legal_docs table
INSERT INTO legal_docs (type, title, version, content, is_live, last_updated, updated_by) VALUES
('terms', 'Terms & Conditions', '2.1', '# Terms & Conditions\n\nWelcome to BattleNation...', TRUE, '2024-01-08 14:32:15', 'John Smith'),
('privacy', 'Privacy Policy', '1.8', '# Privacy Policy\n\nYour privacy is important to us...', TRUE, '2024-01-05 11:22:33', 'Sarah Johnson'),
('refund', 'Refund Policy', '1.3', '# Refund Policy\n\nRefunds are processed according to...', TRUE, '2023-12-20 09:15:45', 'Mike Chen'),
('responsible_gaming', 'Responsible Gaming Policy', '1.1', '# Responsible Gaming\n\nWe promote responsible gaming practices...', TRUE, '2023-11-15 16:45:22', 'Lisa Wong');

-- Insert data into the howto_steps table
INSERT INTO howto_steps (step, title, content, gif_url, order_num) VALUES
('Register', 'Create Your Account', 'Download the app and create your BattleNation account with email verification.', '/placeholder.svg?height=200&width=300', 1),
('Join Team', 'Join or Create a Team', 'Browse available teams or create your own team with friends.', '/placeholder.svg?height=200&width=300', 2),
('Pay Entry Fee', 'Pay Tournament Entry', 'Pay the entry fee using UPI, cards, or wallet balance.', '/placeholder.svg?height=200&width=300', 3),
('Receive Match Code', 'Get Your Match Code', 'Receive unique match codes for each tournament round.', '/placeholder.svg?height=200&width=300', 4),
('Play & Upload Results', 'Play and Submit Results', 'Play your matches and upload screenshots for verification.', '/placeholder.svg?height=200&width=300', 5);

-- Insert data into the faqs table
INSERT INTO faqs (question, answer) VALUES
('How do I join a tournament?', 'Navigate to the tournaments section, select a tournament, and click ''Join'' after paying the entry fee.'),
('What happens if I lose my match code?', 'Contact support immediately. We can regenerate match codes before the match starts.'),
('How are winners determined?', 'Winners are determined based on match results verified through screenshots and game APIs.');

-- Insert data into the betting_markets table
INSERT INTO betting_markets (match_id, name, odds_team_a, odds_team_b, line, status) VALUES
(1, 'Match Winner', 1.85, 1.95, NULL, 'active'),
(1, 'Total Kills Over/Under', 2.1, 1.7, 25, 'active');

-- Insert data into the matches table
INSERT INTO matches (title, game, type, status, scheduled_time, actual_start_time, estimated_duration, current_duration, room_id, spectators, stream_url, referee) VALUES
('Phoenix Warriors vs Thunder Bolts', 'Mobile Legends', 'Tournament Semi-Final', 'live', '2024-01-08 15:00', '2024-01-08 15:02', 45, 23, 'ROOM-789', 1250, 'https://stream.battlenation.com/match-789', 'RefMaster01'),
('Shadow Hunters vs Storm Riders', 'PUBG Mobile', 'Daily Duel', 'scheduled', '2024-01-08 16:30', NULL, 30, 0, 'ROOM-790', 0, NULL, 'RefMaster02');

-- Insert data into the teams table
INSERT INTO teams (name, tag, logo, captain, created_date, last_active) VALUES
('Phoenix Warriors', 'PHX', '/placeholder.svg?height=60&width=60', 'ProGamer123', '2023-08-15', '2024-01-08 14:32:15'),
('Thunder Bolts', 'TBT', '/placeholder.svg?height=60&width=60', 'LightningFast', '2023-07-22', '2024-01-07 09:45:22');

-- Insert data into the team_members table
INSERT INTO team_members (team_id, username, role, rating, status, position) VALUES
(1, 'ProGamer123', 'captain', 2450, 'active', 0),
(1, 'EliteSniper', 'player', 2380, 'active', 1),
(2, 'LightningFast', 'captain', 2520, 'active', 0),
(2, 'StormBreaker', 'player', 2410, 'active', 1);

-- Insert data into the votes table
INSERT INTO votes (team_id, state, total_votes) VALUES
(1, 'California', 1250),
(2, 'Texas', 1580);

-- Insert data into the problems table
INSERT INTO problems (title, description, severity, status, category, user_id, user_name, assigned_to, created_at, updated_at, sla_timer) VALUES
('Unable to withdraw winnings', 'User reports withdrawal request stuck for 3 days', 'High', 'Open', 'Payment', 12345, 'john_doe', NULL, '2024-01-08 14:32:15', '2024-01-08 14:32:15', 4.5),
('Match result dispute', 'Team claims incorrect kill count recorded', 'Medium', 'In Progress', 'Gameplay', 67890, 'team_alpha', 'admin_sarah', '2024-01-08 13:45:22', '2024-01-08 13:45:22', 18.2);

-- Insert data into the notifications table
INSERT INTO notifications (message, type, time) VALUES
('High betting liability detected on Match #4521', 'warning', '2024-01-08 14:32:15'),
('KYC verification pending for 15 users', 'info', '2024-01-08 13:45:22');

-- Insert data into the sponsor_ads table
INSERT INTO sponsor_ads (title, image_url, click_url, sponsor, duration) VALUES
('Gaming Gear Sale', '/placeholder.svg?height=120&width=400', 'https://sponsor.example.com/gaming-gear', 'TechGear Pro', 30000);

-- Insert data into the platform_earnings table
INSERT INTO platform_earnings (source, amount, timestamp) VALUES
('daily_duel', 50.00, '2024-01-08 14:32:15');

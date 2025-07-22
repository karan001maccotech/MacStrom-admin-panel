INSERT INTO games (name, type, image_url)
VALUES
    ('Valorant', 'FPS', '/placeholder.svg?height=64&width=64'),
    ('League of Legends', 'MOBA', '/placeholder.svg?height=64&width=64'),
    ('Dota 2', 'MOBA', '/placeholder.svg?height=64&width=64'),
    ('Counter-Strike 2', 'FPS', '/placeholder.svg?height=64&width=64'),
    ('Fortnite', 'Battle Royale', '/placeholder.svg?height=64&width=64')
ON CONFLICT (name) DO NOTHING;

INSERT INTO tournaments (game_id, title, type, start_date, end_date, status, entry_fee, prize_pool, current_participants, max_participants, current_round, organizer, featured, progress)
VALUES
    ((SELECT id FROM games WHERE name = 'Valorant'), 'Valorant Champions Tour 2025', 'Major', '2025-08-01 10:00:00+00', '2025-08-15 18:00:00+00', 'scheduled', 50.00, 100000.00, 12, 32, 'Group Stage', 'Riot Games', TRUE, 0),
    ((SELECT id FROM games WHERE name = 'League of Legends'), 'Worlds 2025 Qualifiers', 'Qualifier', '2025-09-01 12:00:00+00', '2025-09-10 20:00:00+00', 'live', 25.00, 50000.00, 28, 64, 'Round of 16', 'Riot Games', TRUE, 50),
    ((SELECT id FROM games WHERE name = 'Dota 2'), 'The International 2025', 'Major', '2025-10-10 09:00:00+00', '2025-10-25 22:00:00+00', 'completed', 100.00, 500000.00, 64, 64, 'Finals', 'Valve', TRUE, 100),
    ((SELECT id FROM games WHERE name = 'Counter-Strike 2'), 'ESL Pro League Season 21', 'League', '2025-07-20 14:00:00+00', '2025-08-05 23:00:00+00', 'live', 30.00, 75000.00, 18, 24, 'Playoffs', 'ESL', FALSE, 75),
    ((SELECT id FROM games WHERE name = 'Fortnite'), 'Fortnite World Cup 2025', 'Major', '2025-11-01 11:00:00+00', '2025-11-03 19:00:00+00', 'scheduled', 0.00, 200000.00, 0, 100, 'Registration', 'Epic Games', TRUE, 0)
ON CONFLICT (title) DO NOTHING;

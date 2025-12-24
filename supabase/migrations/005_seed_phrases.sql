-- FastFrench Essential Paris Travel Phrases
-- Seeding ~50 essential phrases for travelers to Paris

-- ============================================================================
-- GREETINGS & BASIC POLITENESS
-- ============================================================================
INSERT INTO phrases (french_phrase, english_translation, phonetic, category, difficulty, usage_context) VALUES
  ('Bonjour', 'Hello / Good morning', 'bɔ̃.ʒuʁ', 'greetings', 1, 'Use during the day until evening'),
  ('Bonsoir', 'Good evening', 'bɔ̃.swaʁ', 'greetings', 1, 'Use after 6 PM'),
  ('Bonne nuit', 'Good night', 'bɔn nɥi', 'greetings', 1, 'When going to bed or saying goodbye late at night'),
  ('Au revoir', 'Goodbye', 'o ʁə.vwaʁ', 'greetings', 1, 'Formal goodbye'),
  ('Salut', 'Hi / Bye (informal)', 'sa.ly', 'greetings', 1, 'Casual greeting or goodbye with friends'),
  ('S''il vous plaît', 'Please (formal)', 'sil vu plɛ', 'greetings', 1, 'Polite form, use with strangers and elders'),
  ('S''il te plaît', 'Please (informal)', 'sil tə plɛ', 'greetings', 2, 'Use with friends and children'),
  ('Merci', 'Thank you', 'mɛʁ.si', 'greetings', 1, 'Essential politeness'),
  ('Merci beaucoup', 'Thank you very much', 'mɛʁ.si bo.ku', 'greetings', 1, 'More emphatic thanks'),
  ('De rien', 'You''re welcome', 'də ʁjɛ̃', 'greetings', 1, 'Standard response to thanks'),
  ('Excusez-moi', 'Excuse me (formal)', 'ɛk.sky.ze mwa', 'greetings', 1, 'To get attention or apologize'),
  ('Pardon', 'Sorry / Pardon me', 'paʁ.dɔ̃', 'greetings', 1, 'Quick apology or to pass by someone'),
  ('Je suis désolé(e)', 'I am sorry', 'ʒə sɥi de.zɔ.le', 'greetings', 2, 'More formal apology');

-- ============================================================================
-- BASIC CONVERSATION
-- ============================================================================
INSERT INTO phrases (french_phrase, english_translation, phonetic, category, difficulty, usage_context) VALUES
  ('Oui', 'Yes', 'wi', 'social', 1, 'Affirmative response'),
  ('Non', 'No', 'nɔ̃', 'social', 1, 'Negative response'),
  ('Comment allez-vous?', 'How are you? (formal)', 'kɔ.mɑ̃.t‿a.le vu', 'social', 2, 'Polite greeting question'),
  ('Ça va?', 'How are you? (informal)', 'sa va', 'social', 1, 'Casual greeting question'),
  ('Ça va bien, merci', 'I''m fine, thank you', 'sa va bjɛ̃ mɛʁ.si', 'social', 1, 'Standard positive response'),
  ('Je ne parle pas français', 'I don''t speak French', 'ʒə nə paʁl pa fʁɑ̃.sɛ', 'social', 2, 'Useful when struggling'),
  ('Parlez-vous anglais?', 'Do you speak English?', 'paʁ.le vu ɑ̃.glɛ', 'social', 2, 'Looking for English speakers'),
  ('Je ne comprends pas', 'I don''t understand', 'ʒə nə kɔ̃.pʁɑ̃ pa', 'social', 2, 'When confused'),
  ('Pouvez-vous répéter?', 'Can you repeat?', 'pu.ve vu ʁe.pe.te', 'social', 2, 'Asking for repetition'),
  ('Comment dit-on...?', 'How do you say...?', 'kɔ.mɑ̃ di.t‿ɔ̃', 'social', 3, 'Learning new words');

-- ============================================================================
-- RESTAURANT & FOOD
-- ============================================================================
INSERT INTO phrases (french_phrase, english_translation, phonetic, category, difficulty, usage_context) VALUES
  ('Une table pour deux, s''il vous plaît', 'A table for two, please', 'yn tabl puʁ dø sil vu plɛ', 'restaurant', 2, 'Requesting a table'),
  ('Le menu, s''il vous plaît', 'The menu, please', 'lə mə.ny sil vu plɛ', 'restaurant', 1, 'Asking for menu'),
  ('L''addition, s''il vous plaît', 'The check, please', 'la.di.sjɔ̃ sil vu plɛ', 'restaurant', 2, 'Requesting the bill'),
  ('Je voudrais...', 'I would like...', 'ʒə vu.dʁɛ', 'restaurant', 2, 'Ordering food/drinks'),
  ('Un café, s''il vous plaît', 'A coffee, please', 'œ̃ ka.fe sil vu plɛ', 'restaurant', 1, 'Ordering coffee'),
  ('Un verre d''eau', 'A glass of water', 'œ̃ vɛʁ do', 'restaurant', 1, 'Requesting water'),
  ('C''est délicieux', 'It''s delicious', 'sɛ de.li.sjø', 'restaurant', 2, 'Complimenting food'),
  ('Bon appétit', 'Enjoy your meal', 'bɔ.n‿a.pe.ti', 'restaurant', 1, 'Said before eating');

-- ============================================================================
-- DIRECTIONS & TRANSPORTATION
-- ============================================================================
INSERT INTO phrases (french_phrase, english_translation, phonetic, category, difficulty, usage_context) VALUES
  ('Où est...?', 'Where is...?', 'u ɛ', 'directions', 1, 'Asking for location'),
  ('La gare', 'The train station', 'la ɡaʁ', 'transportation', 1, 'Train station'),
  ('Le métro', 'The subway/metro', 'lə me.tʁo', 'transportation', 1, 'Paris metro system'),
  ('L''aéroport', 'The airport', 'la.e.ʁɔ.pɔʁ', 'transportation', 1, 'Airport'),
  ('Un billet, s''il vous plaît', 'A ticket, please', 'œ̃ bi.jɛ sil vu plɛ', 'transportation', 2, 'Buying a ticket'),
  ('À gauche', 'To the left', 'a ɡoʃ', 'directions', 1, 'Direction left'),
  ('À droite', 'To the right', 'a dʁwat', 'directions', 1, 'Direction right'),
  ('Tout droit', 'Straight ahead', 'tu dʁwa', 'directions', 1, 'Direction straight'),
  ('C''est loin?', 'Is it far?', 'sɛ lwɛ̃', 'directions', 2, 'Asking about distance'),
  ('C''est près', 'It''s close/nearby', 'sɛ pʁɛ', 'directions', 1, 'Describing proximity');

-- ============================================================================
-- SHOPPING
-- ============================================================================
INSERT INTO phrases (french_phrase, english_translation, phonetic, category, difficulty, usage_context) VALUES
  ('Combien ça coûte?', 'How much does it cost?', 'kɔ̃.bjɛ̃ sa kut', 'shopping', 2, 'Asking price'),
  ('C''est trop cher', 'It''s too expensive', 'sɛ tʁo ʃɛʁ', 'shopping', 2, 'Negotiating or declining'),
  ('Je regarde seulement', 'I''m just looking', 'ʒə ʁə.ɡaʁd sœl.mɑ̃', 'shopping', 3, 'Browsing without buying'),
  ('Quelle taille?', 'What size?', 'kɛl taj', 'shopping', 2, 'Asking about size'),
  ('Puis-je essayer?', 'Can I try it on?', 'pɥi.ʒ‿ɛ.sɛ.je', 'shopping', 3, 'Trying on clothes');

-- ============================================================================
-- ACCOMMODATION
-- ============================================================================
INSERT INTO phrases (french_phrase, english_translation, phonetic, category, difficulty, usage_context) VALUES
  ('J''ai une réservation', 'I have a reservation', 'ʒe yn ʁe.zɛʁ.va.sjɔ̃', 'accommodation', 3, 'Hotel check-in'),
  ('La clé, s''il vous plaît', 'The key, please', 'la kle sil vu plɛ', 'accommodation', 2, 'Requesting room key'),
  ('Quelle heure est le petit-déjeuner?', 'What time is breakfast?', 'kɛ.l‿œʁ ɛ lə pə.ti de.ʒø.ne', 'accommodation', 3, 'Asking about breakfast'),
  ('Le wifi fonctionne?', 'Does the wifi work?', 'lə wi.fi fɔ̃k.sjɔn', 'accommodation', 2, 'Asking about internet');

-- ============================================================================
-- EMERGENCIES
-- ============================================================================
INSERT INTO phrases (french_phrase, english_translation, phonetic, category, difficulty, usage_context) VALUES
  ('Au secours!', 'Help!', 'o səkuʁ', 'emergencies', 2, 'Emergency cry for help'),
  ('Appelez la police', 'Call the police', 'ap.le la pɔ.lis', 'emergencies', 2, 'Emergency situation'),
  ('J''ai besoin d''un médecin', 'I need a doctor', 'ʒe bə.zwɛ̃ dœ̃ med.sɛ̃', 'emergencies', 3, 'Medical emergency'),
  ('Où sont les toilettes?', 'Where are the restrooms?', 'u sɔ̃ le twa.lɛt', 'emergencies', 2, 'Finding bathroom');

-- ============================================================================
-- NUMBERS & TIME (Essential)
-- ============================================================================
INSERT INTO phrases (french_phrase, english_translation, phonetic, category, difficulty, usage_context) VALUES
  ('Un, deux, trois', 'One, two, three', 'œ̃ dø tʁwa', 'numbers', 1, 'First three numbers'),
  ('Quelle heure est-il?', 'What time is it?', 'kɛ.l‿œʁ ɛ.t‿il', 'time', 2, 'Asking for time'),
  ('Aujourd''hui', 'Today', 'o.ʒuʁ.dɥi', 'time', 2, 'Current day'),
  ('Demain', 'Tomorrow', 'də.mɛ̃', 'time', 1, 'Next day'),
  ('Hier', 'Yesterday', 'jɛʁ', 'time', 1, 'Previous day');

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Show count of phrases created by category
DO $$
DECLARE
  total_phrases INTEGER;
  category_record RECORD;
BEGIN
  SELECT COUNT(*) INTO total_phrases FROM phrases;
  RAISE NOTICE '================================';
  RAISE NOTICE 'Total phrases created: %', total_phrases;
  RAISE NOTICE '================================';
  RAISE NOTICE 'Phrases by category:';

  FOR category_record IN
    SELECT category, COUNT(*) as count
    FROM phrases
    GROUP BY category
    ORDER BY category
  LOOP
    RAISE NOTICE '  %: %', category_record.category, category_record.count;
  END LOOP;

  RAISE NOTICE '================================';
END $$;

-- ============================================================================
-- COMMENTS
-- ============================================================================
COMMENT ON TABLE phrases IS 'Essential Paris travel phrases with IPA pronunciation, seeded with 60+ commonly used phrases';

# FastFrench Database Schema Diagram

## Entity Relationship Diagram

```mermaid
erDiagram
    auth_users ||--|| profiles : "has"
    profiles ||--o{ vocabulary : "owns"
    profiles ||--o{ user_phrase_progress : "tracks"
    profiles ||--o{ user_achievements : "earns"
    profiles ||--o{ daily_progress : "records"
    profiles ||--o{ user_challenges : "participates"

    phrases ||--o{ user_phrase_progress : "used-by"
    achievements ||--o{ user_achievements : "awarded-as"
    challenges ||--o{ user_challenges : "assigned-to"

    auth_users {
        uuid id PK
        string email
        timestamp created_at
    }

    profiles {
        uuid id PK "FK->auth.users"
        string display_name
        int current_level "1-50"
        user_rank current_rank "enum"
        int total_xp
        int current_streak
        int longest_streak
        bool streak_freeze_available
        date last_practice_date
        int daily_xp_goal "10|20|50"
        date paris_trip_date "optional"
        int preferred_difficulty "1-5"
        timestamp created_at
        timestamp updated_at
    }

    vocabulary {
        uuid id PK
        uuid user_id FK
        string french_word
        string english_translation
        string phonetic "IPA"
        phrase_category category "enum"
        string example_sentence
        timestamp next_review_date "SM-2"
        decimal easiness_factor "SM-2"
        int repetitions "SM-2"
        int interval "SM-2"
        int times_correct
        int times_incorrect
        bool mastered
        timestamp created_at
        timestamp updated_at
    }

    phrases {
        uuid id PK
        string french_phrase UNIQUE
        string english_translation
        string phonetic "IPA"
        phrase_category category "enum"
        int difficulty "1-5"
        string usage_context
        string audio_url "optional"
        timestamp created_at
    }

    user_phrase_progress {
        uuid id PK
        uuid user_id FK
        uuid phrase_id FK
        int practiced_count
        timestamp last_practiced
        int comfort_level "1-5"
    }

    achievements {
        uuid id PK
        string name UNIQUE
        string description
        string icon_name
        int xp_reward
        requirement_type requirement_type "enum"
        int requirement_value
        timestamp created_at
    }

    user_achievements {
        uuid id PK
        uuid user_id FK
        uuid achievement_id FK
        timestamp earned_at
    }

    daily_progress {
        uuid id PK
        uuid user_id FK
        date date UNIQUE-per-user
        int xp_earned
        int words_learned
        int words_reviewed
        int phrases_practiced
        int time_spent_minutes
        timestamp created_at
    }

    challenges {
        uuid id PK
        challenge_type challenge_type "enum"
        string description
        int xp_reward
        requirement_type requirement_type "enum"
        int requirement_value
        date start_date
        date end_date
        timestamp created_at
    }

    user_challenges {
        uuid id PK
        uuid user_id FK
        uuid challenge_id FK
        int progress
        bool completed
        timestamp completed_at
    }
```

## Custom Types (Enums)

```mermaid
graph LR
    subgraph "user_rank"
        A1[debutant<br/>Levels 1-9]
        A2[touriste<br/>Levels 10-19]
        A3[voyageur<br/>Levels 20-29]
        A4[parisien<br/>Levels 30-39]
        A5[maitre<br/>Levels 40-50]
        A1 --> A2 --> A3 --> A4 --> A5
    end

    subgraph "phrase_category"
        B1[greetings]
        B2[restaurant]
        B3[directions]
        B4[shopping]
        B5[transportation]
        B6[accommodation]
        B7[emergencies]
        B8[social]
        B9[numbers]
        B10[time]
        B11[weather]
        B12[culture]
    end

    subgraph "challenge_type"
        C1[daily]
        C2[weekly]
    end

    subgraph "requirement_type"
        D1[xp_earned]
        D2[words_learned]
        D3[words_reviewed]
        D4[phrases_practiced]
        D5[streak_days]
        D6[practice_sessions]
        D7[perfect_lessons]
        D8[time_spent_minutes]
    end
```

## Key Functions Flow

```mermaid
flowchart TD
    A[User Practices] --> B{First Practice Today?}
    B -->|Yes| C[update_user_streak]
    B -->|No| D[Continue Session]

    C --> E{Streak Maintained?}
    E -->|Yes| F[Increment Streak]
    E -->|No| G{Has Freeze?}
    G -->|Yes| H[Use Freeze]
    G -->|No| I[Reset Streak to 1]

    F --> J[Award XP]
    H --> J
    I --> J
    D --> J

    J --> K[add_user_xp]
    K --> L{Calculate New Level}
    L --> M{Level Up?}
    M -->|Yes| N[Update Rank if Needed]
    M -->|No| O[Continue]
    N --> O

    O --> P[record_daily_progress]
    P --> Q[check_and_award_achievements]

    Q --> R{New Achievements?}
    R -->|Yes| S[Award Achievement XP]
    R -->|No| T[End Session]
    S --> T

    style A fill:#e1f5ff
    style J fill:#fff4e1
    style K fill:#ffe1e1
    style Q fill:#e1ffe1
    style S fill:#f5e1ff
```

## Spaced Repetition (SM-2) Flow

```mermaid
flowchart TD
    A[Review Vocabulary] --> B[User Rates Quality 0-5]
    B --> C[update_vocabulary_review]

    C --> D{Quality >= 3?}
    D -->|Yes - Correct| E[Increment Repetitions]
    D -->|No - Incorrect| F[Reset Repetitions to 0]

    E --> G{Repetitions Count?}
    G -->|0 reps| H[Next: 1 day]
    G -->|1 rep| I[Next: 6 days]
    G -->|2+ reps| J[Next: interval × easiness]

    F --> K[Next: 1 day]

    H --> L[Update Easiness Factor]
    I --> L
    J --> L
    K --> L

    L --> M{Reps >= 5 AND<br/>Easiness >= 2.5?}
    M -->|Yes| N[Mark as Mastered]
    M -->|No| O[Keep Reviewing]

    N --> P[Stop Showing in Reviews]
    O --> Q[Add to Review Queue]

    style B fill:#e1f5ff
    style D fill:#fff4e1
    style M fill:#e1ffe1
    style N fill:#ffe1e1
```

## Data Access Patterns

```mermaid
graph TD
    subgraph "User Dashboard"
        A1[Get Profile] --> DB[(Supabase)]
        A2[Get Stats] --> RPC[get_user_stats RPC]
        A3[Get Achievements] --> DB
        A4[Get Progress Chart] --> DB
    end

    subgraph "Practice Session"
        B1[Get Due Words] --> RPC2[get_due_vocabulary RPC]
        B2[Review Word] --> RPC3[update_vocabulary_review RPC]
        B3[Complete Session] --> RPC4[update_user_streak RPC]
        RPC4 --> RPC5[add_user_xp RPC]
        RPC5 --> RPC6[record_daily_progress RPC]
        RPC6 --> RPC7[check_and_award_achievements RPC]
    end

    subgraph "Learning Content"
        C1[Get Phrases] --> DB
        C2[Track Progress] --> DB
        C3[Get Challenges] --> DB
    end

    style RPC fill:#e1f5ff
    style RPC2 fill:#e1f5ff
    style RPC3 fill:#e1f5ff
    style RPC4 fill:#fff4e1
    style RPC5 fill:#fff4e1
    style RPC6 fill:#e1ffe1
    style RPC7 fill:#f5e1ff
```

## Index Strategy

```mermaid
graph LR
    subgraph "User-Specific Queries"
        A1[user_id indexes] --> A2[Fast user data retrieval]
        A3[date indexes] --> A4[Progress history queries]
        A5[composite indexes] --> A6[Filtered user queries]
    end

    subgraph "Content Queries"
        B1[category indexes] --> B2[Browse by category]
        B3[difficulty indexes] --> B3[Filter by level]
    end

    subgraph "Review System"
        C1[next_review_date index] --> C2[Due words queue]
        C2 --> C3[Only non-mastered words]
    end

    style A1 fill:#e1f5ff
    style B1 fill:#fff4e1
    style C1 fill:#e1ffe1
```

## Security Model (RLS)

```mermaid
graph TD
    A[User Request] --> B{Authenticated?}
    B -->|No| C[Reject]
    B -->|Yes| D{Table Type?}

    D -->|User Data| E{auth.uid = user_id?}
    E -->|Yes| F[Allow]
    E -->|No| G[Deny]

    D -->|Shared Content| H[Allow Read]

    D -->|Public Profiles| I{Own Profile?}
    I -->|Yes| J[Allow All]
    I -->|No| K[Allow Read Only]

    style B fill:#ffe1e1
    style E fill:#fff4e1
    style F fill:#e1ffe1
    style G fill:#ffe1e1
    style H fill:#e1ffe1
```

## Tables Summary

| Table | Type | Purpose | Row Count (Expected) |
|-------|------|---------|---------------------|
| profiles | User Data | User account & gamification | 1 per user |
| vocabulary | User Data | Personal vocabulary list | 100-1000 per user |
| phrases | Shared | Pre-loaded phrase library | ~60 (seeded) |
| user_phrase_progress | User Data | Phrase practice tracking | 0-60 per user |
| achievements | Shared | Achievement definitions | ~60 (seeded) |
| user_achievements | User Data | Earned achievements | 0-60 per user |
| daily_progress | User Data | Daily activity stats | 1 per day per user |
| challenges | Shared | Daily/weekly challenges | ~50 active |
| user_challenges | User Data | Challenge participation | Variable |

## Performance Characteristics

- **Read-Heavy Tables**: phrases, achievements, challenges
  - Cache these on frontend
  - Rarely change after initial seed

- **Write-Heavy Tables**: daily_progress, vocabulary, user_phrase_progress
  - Optimized with indexes
  - Use batch operations where possible

- **Balanced Tables**: profiles, user_achievements, user_challenges
  - Regular reads and periodic writes
  - RPC functions handle complex updates

## Scaling Considerations

1. **Vocabulary Table**: Can grow large (1000+ rows per active user)
   - Indexed on user_id and next_review_date
   - Consider archiving mastered words after long periods

2. **Daily Progress**: Grows continuously
   - One row per user per day
   - Consider aggregating old data monthly

3. **RPC Functions**: Efficient for complex operations
   - Use instead of multiple client-side queries
   - Reduce network round trips

4. **Real-time Subscriptions**: Use sparingly
   - Best for achievements and social features
   - Not needed for most queries

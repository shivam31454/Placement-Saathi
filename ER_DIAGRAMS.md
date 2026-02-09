# Placement Saathi - ER Diagrams

This document contains Entity-Relationship (ER) diagrams for the Placement Saathi application, showing the database structure for each portal and how they integrate together.

---

## Table of Contents
1. [Student Portal ER Diagram](#1-student-portal-er-diagram)
2. [Admin Portal ER Diagram](#2-admin-portal-er-diagram)
3. [Complete System ER Diagram](#3-complete-system-er-diagram)

---

## 1. Student Portal ER Diagram

The Student Portal focuses on entities that students interact with during their placement preparation journey.

```mermaid
erDiagram
    USER ||--o{ RESULT : "takes tests"
    USER ||--o{ PROGRESS : "tracks learning"
    USER ||--o{ TEST_ATTEMPT : "attempts topic tests"
    USER ||--o{ EXPERIENCE : "shares experiences"
    
    USER {
        ObjectId _id PK
        string name
        string email UK
        string password
        string role "student"
        string leetcodeUsername
        boolean leetcodeVerified
        string leetcodeVerificationCode
        date leetcodeVerificationExpiry
        object aiInsights
        string resetPasswordToken
        date resetPasswordExpire
        date createdAt
    }
    
    RESULT {
        ObjectId _id PK
        ObjectId user FK
        ObjectId test FK
        number score
        number totalMarks
        number accuracy
        string status "Pass/Fail"
        number timeTaken
        array answers
        date completedAt
    }
    
    PROGRESS {
        ObjectId _id PK
        ObjectId user FK
        ObjectId topic FK
        string status "Not Started/In Progress/Completed"
        date lastAccessed
        date completedAt
    }
    
    TEST_ATTEMPT {
        ObjectId _id PK
        ObjectId user FK
        ObjectId topic FK
        number score
        number totalQuestions
        number timeTaken
        array questionsAttempted
        date completedAt
    }
    
    EXPERIENCE {
        ObjectId _id PK
        ObjectId user FK
        string company
        string role
        string author
        string batch
        date date
        string difficulty
        string offerStatus "Selected/Rejected/Pending"
        string content
        array tags
        number likes
        date createdAt
        date updatedAt
    }

    TEST ||--|{ RESULT : "generates"
    TEST {
        ObjectId _id PK
        string title
        string description
        number duration
        number totalMarks
        number passingMarks
        array questions
        string category
        string difficulty
        date createdAt
    }

    TOPIC ||--o{ PROGRESS : "tracked in"
    TOPIC ||--o{ TEST_ATTEMPT : "tested via"
    TOPIC {
        ObjectId _id PK
        string title
        ObjectId subject FK
        string content
        number order
        string difficulty
        date createdAt
    }

    SUBJECT ||--|{ TOPIC : "contains"
    SUBJECT {
        ObjectId _id PK
        string name UK
        string description
        string icon
        date createdAt
    }

    PRACTICE_QUESTION ||--o{ TEST_ATTEMPT : "included in"
    PRACTICE_QUESTION {
        ObjectId _id PK
        ObjectId topic FK
        ObjectId subject FK
        string questionText
        array options
        string correctAnswer
        string explanation
        string difficulty
        boolean generatedByAI
        date createdAt
    }
```

### Student Portal Entity Descriptions

| Entity | Purpose |
|--------|---------|
| **USER** | Stores student profile, authentication, LeetCode integration, and AI insights |
| **RESULT** | Records test results with scores, answers, and performance metrics |
| **PROGRESS** | Tracks learning progress for each topic |
| **TEST_ATTEMPT** | Records topic-wise practice test attempts |
| **EXPERIENCE** | Stores interview experiences shared by students |
| **TEST** | Mock tests available for students |
| **TOPIC** | Learning topics with markdown content |
| **SUBJECT** | Subject categories (DSA, DBMS, etc.) |
| **PRACTICE_QUESTION** | AI-generated practice questions for topics |

---

## 2. Admin Portal ER Diagram

The Admin Portal focuses on content management entities that administrators use to create and manage the learning platform.

```mermaid
erDiagram
    ADMIN_USER ||--o{ SUBJECT : "creates"
    ADMIN_USER ||--o{ TOPIC : "creates"
    ADMIN_USER ||--o{ QUESTION : "creates"
    ADMIN_USER ||--o{ TEST : "creates"
    ADMIN_USER ||--o{ PRACTICE_QUESTION : "creates"
    
    ADMIN_USER {
        ObjectId _id PK
        string name
        string email UK
        string password
        string role "admin"
        date createdAt
    }

    SUBJECT ||--|{ TOPIC : "has many"
    SUBJECT ||--|{ PRACTICE_QUESTION : "categorizes"
    SUBJECT {
        ObjectId _id PK
        string name UK
        string description
        string icon
        date createdAt
    }

    TOPIC ||--|{ PRACTICE_QUESTION : "contains"
    TOPIC {
        ObjectId _id PK
        string title
        ObjectId subject FK
        string content
        number order
        string difficulty
        date createdAt
    }

    QUESTION ||--o{ TEST : "included in"
    QUESTION {
        ObjectId _id PK
        string type "MCQ/CODING"
        string subject
        string topic
        string difficulty
        array companies
        object content
        date createdAt
    }

    TEST {
        ObjectId _id PK
        string title
        string description
        number duration
        number totalMarks
        number passingMarks
        array questions
        string category
        string difficulty
        date createdAt
    }

    PRACTICE_QUESTION {
        ObjectId _id PK
        ObjectId topic FK
        ObjectId subject FK
        string questionText
        array options
        string correctAnswer
        string explanation
        string difficulty
        boolean generatedByAI
        date createdAt
    }

    EXPERIENCE {
        ObjectId _id PK
        ObjectId user FK
        string company
        string role
        string author
        string batch
        string difficulty
        string offerStatus
        string content
        array tags
        number likes
        date createdAt
    }
```

### Admin Portal Entity Descriptions

| Entity | Purpose |
|--------|---------|
| **ADMIN_USER** | Admin users who manage the platform content |
| **SUBJECT** | Create/manage subject categories |
| **TOPIC** | Create/manage learning topics with content |
| **QUESTION** | Create MCQ and Coding questions for tests |
| **TEST** | Create and configure mock tests |
| **PRACTICE_QUESTION** | Create/manage practice questions (AI or manual) |
| **EXPERIENCE** | Moderate interview experiences |

---

## 3. Complete System ER Diagram

This diagram shows how all entities in the Placement Saathi system work together, with clear separation between Admin-managed content and Student interactions.

```mermaid
erDiagram
    %% ==================== USER ENTITY ====================
    USER {
        ObjectId _id PK
        string name
        string email UK
        string password
        string role "student/admin"
        string leetcodeUsername
        boolean leetcodeVerified
        string leetcodeVerificationCode
        date leetcodeVerificationExpiry
        object aiInsights
        string resetPasswordToken
        date resetPasswordExpire
        date createdAt
    }

    %% ==================== CONTENT ENTITIES (Admin Managed) ====================
    SUBJECT {
        ObjectId _id PK
        string name UK
        string description
        string icon
        date createdAt
    }

    TOPIC {
        ObjectId _id PK
        string title
        ObjectId subject FK
        string content
        number order
        string difficulty
        date createdAt
    }

    QUESTION {
        ObjectId _id PK
        string type "MCQ/CODING"
        string subject
        string topic
        string difficulty
        array companies
        object content
        date createdAt
    }

    TEST {
        ObjectId _id PK
        string title
        string description
        number duration
        number totalMarks
        number passingMarks
        array questions
        string category
        string difficulty
        date createdAt
    }

    PRACTICE_QUESTION {
        ObjectId _id PK
        ObjectId topic FK
        ObjectId subject FK
        string questionText
        array options
        string correctAnswer
        string explanation
        string difficulty
        boolean generatedByAI
        date createdAt
    }

    %% ==================== STUDENT ACTIVITY ENTITIES ====================
    RESULT {
        ObjectId _id PK
        ObjectId user FK
        ObjectId test FK
        number score
        number totalMarks
        number accuracy
        string status
        number timeTaken
        array answers
        date completedAt
    }

    PROGRESS {
        ObjectId _id PK
        ObjectId user FK
        ObjectId topic FK
        string status
        date lastAccessed
        date completedAt
    }

    TEST_ATTEMPT {
        ObjectId _id PK
        ObjectId user FK
        ObjectId topic FK
        number score
        number totalQuestions
        number timeTaken
        array questionsAttempted
        date completedAt
    }

    EXPERIENCE {
        ObjectId _id PK
        ObjectId user FK
        string company
        string role
        string author
        string batch
        date date
        string difficulty
        string offerStatus
        string content
        array tags
        number likes
        date createdAt
        date updatedAt
    }

    %% ==================== RELATIONSHIPS ====================
    %% Content Structure (Admin Creates)
    SUBJECT ||--|{ TOPIC : "contains"
    SUBJECT ||--o{ PRACTICE_QUESTION : "categorizes"
    TOPIC ||--|{ PRACTICE_QUESTION : "contains"
    TEST ||--|{ QUESTION : "includes"

    %% Student Interactions
    USER ||--o{ RESULT : "completes tests"
    USER ||--o{ PROGRESS : "tracks topics"
    USER ||--o{ TEST_ATTEMPT : "practices topics"
    USER ||--o{ EXPERIENCE : "shares"
    
    %% Content to Activity Links
    TEST ||--o{ RESULT : "generates"
    TOPIC ||--o{ PROGRESS : "tracked in"
    TOPIC ||--o{ TEST_ATTEMPT : "tested via"
    PRACTICE_QUESTION ||--o{ TEST_ATTEMPT : "answered in"
```

---

## System Architecture Flow

```mermaid
flowchart TB
    subgraph Admin_Portal["🛡️ Admin Portal"]
        A1[Create Subjects]
        A2[Create Topics]
        A3[Create Questions]
        A4[Create Tests]
        A5[Generate Practice Questions]
        A6[Moderate Experiences]
    end

    subgraph Content_Layer["📚 Content Layer"]
        C1[(Subject)]
        C2[(Topic)]
        C3[(Question)]
        C4[(Test)]
        C5[(PracticeQuestion)]
        C6[(Experience)]
    end

    subgraph Student_Portal["👨‍🎓 Student Portal"]
        S1[Take Mock Tests]
        S2[Learn Topics]
        S3[Practice Questions]
        S4[View Experiences]
        S5[Share Experience]
        S6[Track Progress]
        S7[LeetCode Integration]
    end

    subgraph Activity_Layer["📊 Activity Layer"]
        D1[(Result)]
        D2[(Progress)]
        D3[(TestAttempt)]
        D4[(User)]
    end

    %% Admin Creates Content
    A1 --> C1
    A2 --> C2
    A3 --> C3
    A4 --> C4
    A5 --> C5
    A6 --> C6

    %% Content Relationships
    C1 --> C2
    C2 --> C5
    C3 --> C4

    %% Student Uses Content
    C4 --> S1
    C2 --> S2
    C5 --> S3
    C6 --> S4

    %% Student Creates Activity
    S1 --> D1
    S2 --> D2
    S3 --> D3
    S5 --> C6
    D4 --> S6
    D4 --> S7

    %% Activity Links
    D4 --> D1
    D4 --> D2
    D4 --> D3
```

---

## Entity Summary Table

| Entity | Type | Created By | Used By | Description |
|--------|------|------------|---------|-------------|
| **User** | Core | System | Both | Authentication & user profiles |
| **Subject** | Content | Admin | Student | Subject categories (DSA, DBMS, etc.) |
| **Topic** | Content | Admin | Student | Learning topics with markdown content |
| **Question** | Content | Admin | Student | MCQ/Coding questions for tests |
| **Test** | Content | Admin | Student | Mock tests with multiple questions |
| **PracticeQuestion** | Content | Admin/AI | Student | Practice questions per topic |
| **Result** | Activity | Student | Student | Test completion records |
| **Progress** | Activity | Student | Student | Topic learning progress |
| **TestAttempt** | Activity | Student | Student | Topic practice test records |
| **Experience** | Content | Student | Both | Interview experiences shared |

---

## Key Relationships

### One-to-Many Relationships
- **Subject → Topic**: One subject contains many topics
- **Topic → PracticeQuestion**: One topic has many practice questions
- **Test → Result**: One test generates many results (different users)
- **User → Result/Progress/TestAttempt**: One user has many activity records

### Many-to-Many Relationships
- **Test ↔ Question**: Tests include multiple questions, questions can be in multiple tests (embedded array)

### Foreign Key References
| Entity | References | Field |
|--------|------------|-------|
| Topic | Subject | `subject` |
| PracticeQuestion | Topic, Subject | `topic`, `subject` |
| Result | User, Test | `user`, `test` |
| Progress | User, Topic | `user`, `topic` |
| TestAttempt | User, Topic | `user`, `topic` |
| Experience | User | `user` |

---

## Database: MongoDB

All entities are stored as MongoDB collections using Mongoose ODM. The relationships shown use ObjectId references for foreign keys.

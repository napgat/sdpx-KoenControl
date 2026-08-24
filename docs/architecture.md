# Architecture Diagram

```mermaid
flowchart TB
    subgraph Client
        Browser[Web Browser (Mobile-First)]
    end

    subgraph "Next.js (Vercel)"
        API[Web/REST API (Route Handlers)]
        
        Auth[Authentication & Authorization]
        Classroom[Classroom/Assignment Service]
        Pairing[Pairing Service]
        Eval[Evaluation Service]
        Scoring[Scoring Service]
        Report[Report/Export Service]
        Audit[Audit Writer]
        
        PairingEngine((Pairing Engine))
        ScoringEngine((Scoring Engine))
    end
    
    subgraph "Background & Data (PostgreSQL)"
        Worker[Job Queue/Worker]
        OpDB[(Operational DB)]
        AuditDB[(Audit DB)]
    end

    %% Interactions
    Browser -->|HTTPS / REST| API
    
    API --> Auth
    API --> Classroom
    API --> Eval
    API --> Report
    
    API --> Pairing
    Pairing --> PairingEngine
    
    API --> Scoring
    Scoring --> ScoringEngine
    
    API --> Audit
    
    %% Database connections
    Classroom --> OpDB
    Pairing --> OpDB
    Eval --> OpDB
    Scoring --> OpDB
    Report --> OpDB
    
    Audit --> AuditDB
    
    Worker --> OpDB
    Worker --> AuditDB
```

# AurumStk Platform

AurumStk is a comprehensive platform that enables seamless cryptocurrency payments and rewards for international travelers. The platform consists of multiple components that work together to provide a complete payment and rewards solution.

## Use Case: International Travel Payment

Alice, a traveler in Thailand, wants to pay 500 THB at a local restaurant using cryptocurrency through Aurum:



```mermaid
sequenceDiagram
    actor Alice
    actor Restaurant
    participant AI as AI Voice Assistant
    participant USDC as AurumUsdc
    participant Reward as AurumReward
    participant Points as AurumRewardPoints
    participant Exchange as Crypto-Fiat Exchange

    Note over Alice,Exchange: Scenario: Alice wants to pay 500 THB using Aurum
    Alice->>AI: "Hey Aurum, I want to pay 500 THB to the restaurant"
    AI->>Exchange: Check THB/USDC exchange rate
    Exchange-->>AI: 1 USDC = 35 THB
    AI-->>Alice: Payment will be 14.29 USDC<br/>(500 THB at current rate)
    
    Note over Alice,Exchange: Verification and Approval
    Alice->>AI: Confirm payment
    AI->>USDC: balanceOf(alice_address)
    USDC-->>AI: 100 USDC available
    AI->>Reward: approve(reward_contract,<br/>14.29 USDC)
    
    Note over Alice,Exchange: Payment Processing
    AI->>Reward: process_transaction(alice_address,<br/>restaurant_address, 14.29 USDC)
    Note over Reward: Calculation/Fee:<br/>14.29/100 = 0.1429<br/>USDC/Fee Amount =<br/>14.15 USDC/0.1429 =<br/>0.1429 * 10 = 1.429 points
    Reward->>USDC: transferFrom(alice_address,<br/>restaurant_address, 14.15 USDC)
    Reward->>Points: mint_points(alice_address,<br/>1.429 points)
    
    Note over Alice,Exchange: Final Conversion and Confirmation
    Exchange->>Restaurant: Convert 14.15 USDC to THB
    Exchange->>Restaurant: Deposit 495 THB
    AI-->>Alice: "Payment completed. You earned 1.429<br/>Aurum points"
    AI-->>Restaurant: "Payment received 495<br/>THB"
    
    Note over Alice,Exchange: Traveler Benefits
    Note over AI: Alice can see in the app:<br/>1. Transaction history<br/>2. Accumulated points<br/>3. Savings vs exchange rate<br/>4. Record of visited countries
```

## Project Components

```mermaid
graph TB
    subgraph Frontend
        App[AurumApp]
        style App fill:#f9f,stroke:#333,stroke-width:2px
    end

    subgraph Blockchain
        Contracts[AurumContracts]
        style Contracts fill:#bbf,stroke:#333,stroke-width:2px
    end

    subgraph AI Assistant
        Eliza[AurumEliza]
        style Eliza fill:#bfb,stroke:#333,stroke-width:2px
    end

    subgraph Indexing
        Subgraph[AurumSubgraph]
        style Subgraph fill:#fbb,stroke:#333,stroke-width:2px
    end

    App -->|User Interface| Eliza
    Eliza -->|Voice Commands| App
    App -->|Transactions| Contracts
    Contracts -->|Events| Subgraph
    Subgraph -->|Data| App
    Eliza -->|Payment Processing| Contracts
```

## Project Documentation Index

### 1. AurumApp (Frontend)
- [Documentation](AurumApp/README.md)
- **Key Features**:
  - Customer Portal
  - Merchant Dashboard
  - AI Chat Interface
  - Payment Processing
  - Rewards Tracking

### 2. AurumContracts (Smart Contracts)
- [Documentation](AurumContracts/README.md)
- **Components**:
  - AurumUsdc: Stablecoin Implementation
  - AurumReward: Transaction & Fee Processing
  - AurumRewardPoints: Loyalty Points System

### 3. AurumEliza (AI Assistant)
- [Documentation](AurumEliza/README.md)
- **Features**:
  - Voice Command Processing
  - Multi-language Support
  - Payment Assistant
  - Location Services
  - Rewards Management

### 4. AurumSubgraph (Data Indexing)
- [Documentation](AurumSubgraph/README.md)
- **Functionality**:
  - Event Tracking
  - Transaction History
  - Rewards Analytics
  - Performance Metrics

## System Interaction Flow

1. **User Interaction**
   - User speaks to AI Assistant through AurumApp
   - Voice commands are processed by AurumEliza
   - Payment requests are validated and formatted

2. **Payment Processing**
   - AurumContracts handle transaction execution
   - Fees are calculated and collected
   - Reward points are minted automatically
   - Fiat conversion is processed

3. **Data Management**
   - AurumSubgraph indexes all transactions
   - Events are processed and stored
   - Analytics are generated
   - Frontend is updated in real-time

4. **User Feedback**
   - Transaction confirmation
   - Points balance update
   - Exchange rate information
   - Travel benefits tracking

## Development Setup

Each component has its own setup requirements. Please refer to individual project READMEs for detailed instructions:

- [AurumApp Setup](AurumApp/README.md#setup-instructions)
- [AurumContracts Setup](AurumContracts/README.md#development-setup)
- [AurumEliza Setup](AurumEliza/README.md#development-setup)
- [AurumSubgraph Setup](AurumSubgraph/README.md#setup-and-development)

export interface Agent {
    id: string
    name: string
    clients: any[] // Update this type based on actual client data structure
  }
  
  export interface AgentsResponse {
    agents: Agent[]
  }
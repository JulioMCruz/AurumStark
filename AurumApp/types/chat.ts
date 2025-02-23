export interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: string
  attachments?: Attachment[]
}

export interface Attachment {
  url: string
  contentType: string
  title: string
}

export interface ChatResponse {
  messages: Message[]
  error?: string
} 
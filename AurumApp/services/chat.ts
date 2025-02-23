import { Message } from "@/types/chat"

export const chatService = {
  async sendMessage({ message, attachments }: { message: string, attachments?: File[] }) {
    try {
      const formData = new FormData()
      formData.append("text", message)
      formData.append("user", "user")

      if (attachments?.length) {
        attachments.forEach(file => {
          formData.append("file", file)
        })
      }

      const response = await fetch("/api/chat", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Failed to send message")

      const data = await response.json()
      return data as Message[]
    } catch (error) {
      console.error("Error sending message:", error)
      throw error
    }
  },

  async getChatHistory(): Promise<Message[]> {
    try {
      const response = await fetch("/api/chat")
      if (!response.ok) throw new Error("Failed to fetch chat history")
      
      const data = await response.json()
      return data.messages
    } catch (error) {
      console.error("Error fetching chat history:", error)
      throw error
    }
  }
} 
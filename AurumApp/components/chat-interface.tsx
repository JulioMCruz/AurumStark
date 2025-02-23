"use client"

import { useState, useRef, useEffect } from "react"
import { Bot, User, Send } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Message {
  role: "assistant" | "user"
  content: string
}

function MessageList({ messages }: { messages: Message[] }) {
  return (
    <div className="space-y-4">
      {messages.map((message, i) => (
        <div 
          key={i} 
          className={cn(
            "flex items-start gap-3",
            message.role === "user" && "flex-row-reverse"
          )}
        >
          <div className={cn(
            "flex items-center justify-center w-8 h-8 rounded-full",
            "bg-[#9c72fe]"
          )}>
            {message.role === "assistant" ? (
              <Bot className="w-5 h-5 text-white" />
            ) : (
              <User className="w-5 h-5 text-white" />
            )}
          </div>
          <div className={cn(
            "rounded-lg px-4 py-2 max-w-[80%]",
            message.role === "assistant" ? "bg-[#9c72fe]" : "bg-purple-700"
          )}>
            <p className="text-white">{message.content}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

const initialMessages: Message[] = [
  {
    role: "assistant",
    content: "Hello! I'm here to help. What would you like to know?",
  },
]

export function ChatInterface({ agentId }: { agentId: string }) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const user = "0x1234567890123456789012345678901234567890"

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (message: string) => {
    try {
      const response = await fetch(
        `/api/agents/${agentId}/message`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: message,
            user: user,
          }),
        }
      )

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      const data = await response.json()
      return data[0] // Get first response from array
    } catch (error) {
      console.error("Error sending message:", error)
      throw error
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const newMessages = [...messages, { role: "user" as const, content: input }]
    setMessages(newMessages)
    setInput("")
    setIsLoading(true)

    try {
      const response = await sendMessage(input)
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content: response.text,
        },
      ])
    } catch (error) {
      console.error("Error handling message:", error)
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content: "Sorry, I encountered an error processing your message.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="flex flex-col h-[calc(100vh-13rem)] bg-card-gradient">
      <CardHeader className="border-b">
        <CardTitle className="text-gradient">Chat with Agent</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-4">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          <MessageList messages={messages} />
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-secondary/50 min-h-[44px] max-h-[120px]"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e)
              }
            }}
            disabled={isLoading}
          />
          <Button 
            type="submit"
            className="button-gradient"
            disabled={!input.trim() || isLoading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
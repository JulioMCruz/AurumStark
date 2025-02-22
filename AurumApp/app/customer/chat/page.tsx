"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Mic, Send } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Message {
  id: number
  content: string
  sender: "user" | "ai"
  timestamp: Date
}

export default function CustomerChat() {
  const [message, setMessage] = useState("")
  const [chatHistory, setChatHistory] = useState<Message[]>([
    { id: 1, content: "Welcome to AurumStark! How can I assist you today?", sender: "ai", timestamp: new Date() },
  ])
  const [isRecording, setIsRecording] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  const handleSend = async () => {
    if (message.trim() === "") return

    const userMessage: Message = {
      id: chatHistory.length + 1,
      content: message,
      sender: "user",
      timestamp: new Date(),
    }

    setChatHistory((prev) => [...prev, userMessage])
    setMessage("")

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: chatHistory.length + 2,
        content: `I understand you said: "${message}". How can I help you with that?`,
        sender: "ai",
        timestamp: new Date(),
      }
      setChatHistory((prev) => [...prev, aiResponse])
    }, 1000)
  }

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording)
    // Implement voice recording logic here
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <Card className="flex-1 bg-card-gradient overflow-hidden flex flex-col">
        <CardHeader>
          <CardTitle className="text-gradient">Chat with AurumStark AI</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto p-4">
          {chatHistory.map((msg) => (
            <div key={msg.id} className={`mb-4 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
              <div
                className={`inline-block p-2 rounded-lg ${
                  msg.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                {msg.content}
              </div>
              <div className="text-xs text-muted-foreground mt-1">{msg.timestamp.toLocaleTimeString()}</div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </CardContent>
      </Card>
      <div className="p-4 bg-card-gradient border-t border-border">
        <div className="flex space-x-2">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            className="flex-1 bg-secondary/50"
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
          />
          <Button onClick={handleVoiceRecord} variant={isRecording ? "destructive" : "secondary"}>
            <Mic className="h-4 w-4" />
          </Button>
          <Button onClick={handleSend} className="button-gradient">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}


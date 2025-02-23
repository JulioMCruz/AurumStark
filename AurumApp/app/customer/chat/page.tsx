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
  timestamp: string
}

export default function CustomerChat() {
  const [message, setMessage] = useState("")
  const [chatHistory, setChatHistory] = useState<Message[]>([
    { id: 1, content: "Welcome to AurumStark! How can I assist you today?", sender: "ai", timestamp: new Date().toISOString() },
  ])
  const [isRecording, setIsRecording] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatHistory])

  const handleSend = async () => {
    if (message.trim() === "") return

    const userMessage: Message = {
      id: chatHistory.length + 1,
      content: message,
      sender: "user",
      timestamp: new Date().toISOString(),
    }

    setChatHistory((prev) => [...prev, userMessage])
    setMessage("")

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: chatHistory.length + 2,
        content: `I understand you said: "${message}". How can I help you with that?`,
        sender: "ai",
        timestamp: new Date().toISOString(),
      }
      setChatHistory((prev) => [...prev, aiResponse])
    }, 1000)
  }

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording)
    // Implement voice recording logic here
  }

  return (
    <div className="flex flex-col h-[calc(100vh-300px)]">
      <Card className="flex-1 bg-card-gradient flex flex-col overflow-hidden">
        <CardHeader className="flex-none">
          <CardTitle className="text-gradient">Chat with AurumStark AI</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
          <div className="flex flex-col space-y-4">
            {chatHistory.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className="flex flex-col max-w-[80%]">
                  <div
                    className={`p-2 rounded-lg ${
                      msg.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {msg.content}
                  </div>
                  <span className="text-xs text-muted-foreground mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div ref={chatEndRef} />
        </CardContent>
      </Card>
      <div className="flex-none p-4 bg-card-gradient border-t border-border">
        <div className="flex gap-2">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            className="flex-1 bg-secondary/50 min-h-[44px] max-h-[120px]"
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


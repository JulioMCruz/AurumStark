import { useRef, useEffect } from "react"

interface UseAutoScrollProps {
  smooth?: boolean
}

export function useAutoScroll({ smooth = true }: UseAutoScrollProps = {}) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: smooth ? "smooth" : "auto"
      })
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [])

  return {
    scrollRef,
    scrollToBottom
  }
} 
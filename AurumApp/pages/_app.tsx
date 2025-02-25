import type { AppProps } from "next/app"
import { useAuth } from "@/hooks/useAuth"

function MyApp({ Component, pageProps }: AppProps) {
  const { user, loading } = useAuth()

  return (
      <Component {...pageProps} />
  )
}

export default MyApp


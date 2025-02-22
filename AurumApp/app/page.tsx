import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LandingHeader } from "@/components/landing-header"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-hero-gradient">
      <LandingHeader />

      {/* Hero Section with increased padding */}
      <section className="relative flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 sm:py-24 md:py-32 lg:py-40">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left space-y-8">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gradient">
                Welcome to AurumStark
              </h1>
              <p className="text-xl text-muted-foreground">
                Revolutionizing Crypto Transactions with Secure Scaling Technology
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button asChild size="lg" className="button-gradient">
                  <Link href="/customer/chat">Enter Customer Portal</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/merchant/dashboard">Enter Merchant Portal</Link>
                </Button>
              </div>
            </div>
            <div className="hidden lg:block">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-lQqKh6jp1NyHoyW6Ub4WBJrlLKXmlX.png"
                alt="AurumStark Hero"
                width={600}
                height={400}
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-secondary/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gradient">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              title="Secure Transactions"
              description="State-of-the-art encryption ensures your transactions are always safe and private."
            />
            <FeatureCard
              title="Lightning Fast"
              description="Experience near-instantaneous transaction speeds, regardless of network congestion."
            />
            <FeatureCard
              title="Reward System"
              description="Earn tokens with every transaction, building value within the AurumStark ecosystem."
            />
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-card-gradient">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4 text-gradient">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground mb-8">Join the future of crypto transactions today.</p>
          <Button asChild size="lg" className="button-gradient">
            <Link href="/customer/chat">Create Your Account</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-card-gradient rounded-lg p-6 shadow-lg">
      <h3 className="text-xl font-semibold mb-4 text-gradient">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}


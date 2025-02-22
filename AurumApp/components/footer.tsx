import type React from "react"
import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Github } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-secondary/50 backdrop-blur-sm border-t border-border">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link href="/" className="text-2xl font-bold text-gradient">
              AurumStark
            </Link>
            <p className="text-sm text-muted-foreground mt-2">
              © {new Date().getFullYear()} AurumStark. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-4">
            <SocialLink href="https://facebook.com" icon={<Facebook size={20} />} label="Facebook" />
            <SocialLink href="https://twitter.com" icon={<Twitter size={20} />} label="Twitter" />
            <SocialLink href="https://instagram.com" icon={<Instagram size={20} />} label="Instagram" />
            <SocialLink href="https://linkedin.com" icon={<Linkedin size={20} />} label="LinkedIn" />
            <SocialLink href="https://github.com" icon={<Github size={20} />} label="GitHub" />
          </div>
        </div>
      </div>
    </footer>
  )
}

function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-muted-foreground hover:text-foreground transition-colors"
    >
      <span className="sr-only">{label}</span>
      {icon}
    </Link>
  )
}


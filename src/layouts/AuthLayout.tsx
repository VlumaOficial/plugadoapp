import { ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ backgroundColor: '#0B1520' }}>
      <div className="mb-8">
        <h1 className="text-white font-bold tracking-widest text-3xl">PLUGADO</h1>
      </div>
      <div className="w-full max-w-md p-8 rounded-lg" style={{ backgroundColor: '#16202C' }}>
        {children}
      </div>
    </div>
  )
}

"use client"

import { useState } from 'react'
import { AppHeader } from '@/components/layout/AppHeader'
import { AppSidebar } from '@/components/layout/AppSidebar'
import { VideoGenerator } from '@/components/video-generator/VideoGenerator'
import { VideoHistory } from '@/components/history/VideoHistory'

export default function Home() {
  const [activeView, setActiveView] = useState<'generator' | 'history'>('generator')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <AppSidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeView={activeView}
        onViewChange={setActiveView}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <AppHeader 
          onMenuClick={() => setSidebarOpen(true)}
          activeView={activeView}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 py-6 max-w-7xl">
            {activeView === 'generator' ? (
              <div className="space-y-8">
                <div className="text-center space-y-4">
                  <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                    AI Video Generator
                  </h1>
                  <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    Buat video menakjubkan dengan kualitas profesional menggunakan teknologi AI VEO-3
                  </p>
                </div>
                <VideoGenerator />
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Riwayat Video
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    Kelola dan unduh video yang telah dibuat
                  </p>
                </div>
                <VideoHistory />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
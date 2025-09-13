"use client"

import { useState } from 'react'
import { GenerationForm } from './GenerationForm'
import { ProgressIndicator } from './ProgressIndicator'
import { VideoPreview } from './VideoPreview'

export interface VideoGenerationParams {
  prompt: string
  duration: number
  aspectRatio: '16:9' | '9:16' | '1:1'
  quality: 'HD' | '4K'
  style: 'realistic' | 'cinematic' | 'animated' | 'artistic'
}

export interface GeneratedVideo {
  id: string
  url: string
  thumbnail?: string
  params: VideoGenerationParams
  createdAt: Date
  status: 'generating' | 'completed' | 'failed'
  progress?: number
}

export function VideoGenerator() {
  const [currentVideo, setCurrentVideo] = useState<GeneratedVideo | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async (params: VideoGenerationParams) => {
    setIsGenerating(true)
    
    const videoId = `video_${Date.now()}`
    const newVideo: GeneratedVideo = {
      id: videoId,
      url: '',
      params,
      createdAt: new Date(),
      status: 'generating',
      progress: 0
    }
    
    setCurrentVideo(newVideo)

    try {
      // Call API to generate video
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      })

      if (!response.ok) {
        throw new Error('Gagal memulai generasi video')
      }

      const result = await response.json()
      
      // Update video with result
      const updatedVideo: GeneratedVideo = {
        ...newVideo,
        url: result.url || '',
        status: 'completed',
        progress: 100
      }
      
      setCurrentVideo(updatedVideo)
      
      // Save to history
      const history = JSON.parse(localStorage.getItem('videoHistory') || '[]')
      history.unshift(updatedVideo)
      localStorage.setItem('videoHistory', JSON.stringify(history))
      
    } catch (error) {
      console.error('Error generating video:', error)
      setCurrentVideo(prev => prev ? { ...prev, status: 'failed' } : null)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleReset = () => {
    setCurrentVideo(null)
    setIsGenerating(false)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4 py-8">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 px-4 py-2 rounded-full">
          <div className="w-2 h-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-purple-800 dark:text-purple-200">
            Powered by VEO-3 AI Model
          </span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Buat Video AI Berkualitas Tinggi
        </h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Deskripsikan video yang Anda inginkan dan biarkan AI VEO-3 menciptakan karya visual yang menakjubkan dengan kualitas profesional
        </p>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Form */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Parameter Generasi Video
            </h3>
            <GenerationForm 
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
            />
          </div>

          {/* Progress Indicator */}
          {isGenerating && currentVideo && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
              <ProgressIndicator 
                video={currentVideo}
                onCancel={handleReset}
              />
            </div>
          )}
        </div>

        {/* Right Column - Preview */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Preview Video
              </h3>
              {currentVideo && (
                <button
                  onClick={handleReset}
                  className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  Reset
                </button>
              )}
            </div>
            
            <VideoPreview 
              video={currentVideo}
              isGenerating={isGenerating}
            />
          </div>

          {/* Tips Section */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800">
            <h4 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-4">
              💡 Tips untuk Hasil Terbaik
            </h4>
            <ul className="space-y-2 text-sm text-purple-800 dark:text-purple-200">
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2"></span>
                <span>Gunakan deskripsi yang detail dan spesifik untuk hasil yang akurat</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2"></span>
                <span>Sebutkan elemen visual seperti pencahayaan, warna, dan gerakan</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2"></span>
                <span>Pilih rasio aspek yang sesuai dengan platform target Anda</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2"></span>
                <span>Video berkualitas 4K memerlukan waktu processing lebih lama</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
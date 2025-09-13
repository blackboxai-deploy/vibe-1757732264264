"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { VideoGenerationParams } from './VideoGenerator'

interface GenerationFormProps {
  onGenerate: (params: VideoGenerationParams) => void
  isGenerating: boolean
}

export function GenerationForm({ onGenerate, isGenerating }: GenerationFormProps) {
  const [params, setParams] = useState<VideoGenerationParams>({
    prompt: '',
    duration: 5,
    aspectRatio: '16:9',
    quality: 'HD',
    style: 'realistic'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (params.prompt.trim()) {
      onGenerate(params)
    }
  }

  const isFormValid = params.prompt.trim().length > 0

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Prompt Input */}
      <div className="space-y-3">
        <Label htmlFor="prompt" className="text-base font-medium">
          Deskripsi Video *
        </Label>
        <Textarea
          id="prompt"
          placeholder="Deskripsikan video yang ingin Anda buat...
          
Contoh: 'Seorang wanita muda berjalan di pantai saat matahari terbenam, dengan ombak laut yang tenang dan cahaya emas yang memantul di air. Kamera mengikuti dari belakang dengan gerakan yang halus.'"
          value={params.prompt}
          onChange={(e) => setParams(prev => ({ ...prev, prompt: e.target.value }))}
          className="min-h-[120px] resize-none"
          disabled={isGenerating}
        />
        <div className="text-right text-sm text-gray-500">
          {params.prompt.length}/1000 karakter
        </div>
      </div>

      {/* Duration Slider */}
      <div className="space-y-3">
        <Label className="text-base font-medium">
          Durasi Video: {params.duration} detik
        </Label>
        <div className="px-2">
          <Slider
            value={[params.duration]}
            onValueChange={(value) => setParams(prev => ({ ...prev, duration: value[0] }))}
            min={2}
            max={10}
            step={1}
            disabled={isGenerating}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>2s</span>
            <span>5s</span>
            <span>10s</span>
          </div>
        </div>
      </div>

      {/* Aspect Ratio */}
      <div className="space-y-3">
        <Label className="text-base font-medium">
          Rasio Aspek
        </Label>
        <Select
          value={params.aspectRatio}
          onValueChange={(value: '16:9' | '9:16' | '1:1') => 
            setParams(prev => ({ ...prev, aspectRatio: value }))}
          disabled={isGenerating}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="16:9">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-3 bg-gray-300 rounded"></div>
                <span>16:9 (Landscape) - YouTube, TV</span>
              </div>
            </SelectItem>
            <SelectItem value="9:16">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-6 bg-gray-300 rounded"></div>
                <span>9:16 (Portrait) - TikTok, Instagram</span>
              </div>
            </SelectItem>
            <SelectItem value="1:1">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-300 rounded"></div>
                <span>1:1 (Square) - Instagram Post</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Quality */}
      <div className="space-y-3">
        <Label className="text-base font-medium">
          Kualitas Video
        </Label>
        <Select
          value={params.quality}
          onValueChange={(value: 'HD' | '4K') => 
            setParams(prev => ({ ...prev, quality: value }))}
          disabled={isGenerating}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="HD">
              <div className="space-y-1">
                <div className="font-medium">HD (1080p)</div>
                <div className="text-xs text-gray-500">Cepat, cocok untuk preview</div>
              </div>
            </SelectItem>
            <SelectItem value="4K">
              <div className="space-y-1">
                <div className="font-medium">4K (Ultra HD)</div>
                <div className="text-xs text-gray-500">Kualitas terbaik, lebih lama</div>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Style */}
      <div className="space-y-3">
        <Label className="text-base font-medium">
          Gaya Visual
        </Label>
        <Select
          value={params.style}
          onValueChange={(value: 'realistic' | 'cinematic' | 'animated' | 'artistic') => 
            setParams(prev => ({ ...prev, style: value }))}
          disabled={isGenerating}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="realistic">
              <div className="space-y-1">
                <div className="font-medium">Realistis</div>
                <div className="text-xs text-gray-500">Natural, seperti rekaman nyata</div>
              </div>
            </SelectItem>
            <SelectItem value="cinematic">
              <div className="space-y-1">
                <div className="font-medium">Sinematik</div>
                <div className="text-xs text-gray-500">Dramatic, movie-style</div>
              </div>
            </SelectItem>
            <SelectItem value="animated">
              <div className="space-y-1">
                <div className="font-medium">Animasi</div>
                <div className="text-xs text-gray-500">Gaya kartun atau 3D</div>
              </div>
            </SelectItem>
            <SelectItem value="artistic">
              <div className="space-y-1">
                <div className="font-medium">Artistik</div>
                <div className="text-xs text-gray-500">Creative, abstract style</div>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Generate Button */}
      <Button
        type="submit"
        disabled={!isFormValid || isGenerating}
        className="w-full h-12 text-base font-medium bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50"
      >
        {isGenerating ? (
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Sedang Membuat Video...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Buat Video AI</span>
          </div>
        )}
      </Button>

      {/* Form Info */}
      <div className="text-xs text-gray-500 text-center">
        Video akan diproses menggunakan model VEO-3. Waktu generasi: 2-5 menit tergantung kompleksitas.
      </div>
    </form>
  )
}
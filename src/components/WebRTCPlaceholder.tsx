"use client"

import { Video, Mic, MicOff, VideoOff, Monitor, PhoneOff } from "lucide-react"
import { useState } from "react"

interface WebRTCPlaceholderProps {
  roomId?: string
  participantName?: string
}

export default function WebRTCPlaceholder({ roomId, participantName }: WebRTCPlaceholderProps) {
  const [videoEnabled, setVideoEnabled] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(false)
  const [screenSharing, setScreenSharing] = useState(false)

  return (
    <div className="glass rounded-2xl p-6 border-2 border-primary/20 cyber-frame">
      <div className="flex items-center gap-3 mb-6">
        <Video className="w-6 h-6 text-primary animate-pulse" />
        <h3 className="text-xl font-bold">Communication Vidéo / Audio</h3>
        <span className="ml-auto text-xs font-mono text-muted-foreground tech-bracket">
          WEBRTC_READY
        </span>
      </div>

      {/* Video Preview Area */}
      <div className="relative mb-6 rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-[oklch(0.65_0.2_200)]/10 aspect-video flex items-center justify-center border-2 border-dashed border-primary/30">
        <div className="text-center">
          <Video className="w-16 h-16 text-muted-foreground mx-auto mb-3 opacity-50" />
          <p className="text-muted-foreground font-semibold">
            Fonction vidéo disponible prochainement
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            WebRTC pour partage vidéo et écran en temps réel
          </p>
        </div>

        {/* Participant Badge */}
        {participantName && (
          <div className="absolute bottom-4 left-4 glass rounded-lg px-3 py-2 border border-primary/30">
            <span className="text-sm font-semibold">{participantName}</span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-3">
        <button
          onClick={() => setVideoEnabled(!videoEnabled)}
          disabled
          className={`p-4 rounded-xl font-semibold transition-all cursor-not-allowed opacity-50 ${
            videoEnabled
              ? "bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] text-white"
              : "glass border-2 border-border"
          }`}
          title="Vidéo - Bientôt disponible"
        >
          {videoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
        </button>

        <button
          onClick={() => setAudioEnabled(!audioEnabled)}
          disabled
          className={`p-4 rounded-xl font-semibold transition-all cursor-not-allowed opacity-50 ${
            audioEnabled
              ? "bg-gradient-to-r from-[oklch(0.75_0.22_150)] to-[oklch(0.65_0.2_200)] text-white"
              : "glass border-2 border-border"
          }`}
          title="Audio - Bientôt disponible"
        >
          {audioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </button>

        <button
          onClick={() => setScreenSharing(!screenSharing)}
          disabled
          className={`p-4 rounded-xl font-semibold transition-all cursor-not-allowed opacity-50 ${
            screenSharing
              ? "bg-gradient-to-r from-[oklch(0.6_0.25_290)] to-[oklch(0.55_0.25_240)] text-white"
              : "glass border-2 border-border"
          }`}
          title="Partage d'écran - Bientôt disponible"
        >
          <Monitor className="w-5 h-5" />
        </button>

        <button
          disabled
          className="p-4 rounded-xl font-semibold transition-all cursor-not-allowed opacity-50 bg-destructive/20 border-2 border-destructive/30 text-destructive"
          title="Raccrocher - Bientôt disponible"
        >
          <PhoneOff className="w-5 h-5" />
        </button>
      </div>

      {/* Feature List */}
      <div className="mt-6 glass rounded-lg p-4 border border-primary/20">
        <p className="text-xs font-bold text-primary uppercase mb-3">Fonctionnalités à venir :</p>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
            Communication vidéo peer-to-peer
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
            Partage d'écran en temps réel
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
            Audio de haute qualité
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
            Enregistrement des sessions
          </li>
        </ul>
      </div>
    </div>
  )
}

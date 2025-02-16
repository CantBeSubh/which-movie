import "globals.css"

import { useEffect, useState } from "react"

import { AlertMessage } from "~components/alert-message"
import { ModeToggle } from "~components/mode-toggle"
import { ThemeProvider } from "~components/theme-provider"
import { Button } from "~components/ui/button"
import { Input } from "~components/ui/input"
import { ValidMessage } from "~components/valid-message"
import { ytShortsRegex } from "~lib/constants"

const ApiValidation = ({ apiKey }: { apiKey: string }) => {
  if (!apiKey) {
    return <AlertMessage message="Please enter your OPENAI API key" />
  }
  if (!apiKey.startsWith("sk-")) {
    return <AlertMessage message="OPENAI API key must start with 'sk-'" />
  }
  return <ValidMessage message="OPENAI API key is valid" />
}

const VideoIdValidation = ({ videoId }: { videoId: string | null }) => {
  if (!videoId) {
    return <AlertMessage message="No valid YouTube video detected" />
  }
  return <ValidMessage message={`Video ID: ${videoId}`} />
}

const IndexPopup = () => {
  const [movieName, setMovieName] = useState<string>("")
  const [apiKey, setApiKey] = useState<string>("")
  const [videoId, setVideoId] = useState<string | null>(null)

  useEffect(() => {
    function getVideoId() {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentUrl = tabs[0]?.url
        if (currentUrl) {
          const url = new URL(currentUrl)
          const videoId = url.searchParams.get("v")
          if (videoId) {
            setVideoId(videoId)
          } else if (currentUrl.match(ytShortsRegex)) {
            setVideoId(currentUrl.match(ytShortsRegex)?.[1])
          } else {
            setVideoId(null)
          }
        }
      })
    }
    getVideoId()
  }, [])

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="flex h-full w-72 flex-col gap-4 p-4">
        <Input
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter your OpenAI API key"
        />
        <Input value={movieName} placeholder="Movie name" disabled />
        <div className="flex gap-2">
          <Button className="w-fit" disabled={!videoId || !apiKey}>
            Submit
          </Button>
          <ModeToggle />
        </div>
        <VideoIdValidation videoId={videoId} />
        {videoId && <ApiValidation apiKey={apiKey} />}
      </div>
    </ThemeProvider>
  )
}

export default IndexPopup

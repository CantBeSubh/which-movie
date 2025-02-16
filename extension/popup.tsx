import "globals.css"

import { useEffect, useState } from "react"

import { ModeToggle } from "~components/mode-toggle"
import { ThemeProvider } from "~components/theme-provider"
import { Button } from "~components/ui/button"
import { Input } from "~components/ui/input"
import { ytShortsRegex } from "~lib/constants"

const IndexPopup = () => {
  const [movieName, setMovieName] = useState<string>("")
  const [apiKey, setApiKey] = useState<string>("")
  const [videoId, setVideoId] = useState<string | null>(null)

  useEffect(() => {
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
  }, [])

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="flex h-full w-[25rem] flex-col gap-4 p-4">
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
        {videoId && (
          <p className="text-xs font-extralight text-muted-foreground">
            Video ID: {videoId}
          </p>
        )}
      </div>
    </ThemeProvider>
  )
}

export default IndexPopup

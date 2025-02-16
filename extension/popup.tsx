import "globals.css"

import { useEffect, useState } from "react"

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
    <div className="flex h-full w-[25rem] flex-col gap-4 p-4">
      {videoId && <p className="mb-4 text-sm">Video ID: {videoId}</p>}
      <Input
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        placeholder="Enter your OpenAI API key"
      />
      <Input value={movieName} placeholder="Movie name" disabled />
      <Button className="w-fit">Submit</Button>
    </div>
  )
}

export default IndexPopup

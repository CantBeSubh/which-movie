import "globals.css"

import { useEffect, useState } from "react"

import { Button } from "~components/ui/button"

const IndexPopup = () => {
  const ytShortsRegex =
    /(?:https:\/\/www\.youtube\.com\/shorts\/)([a-zA-Z0-9_-]+)/
  const [movieName, setMovieName] = useState("")
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
    <div className="flex h-[25rem] w-[25rem] flex-col p-4">
      {videoId && <p className="mb-4 text-sm">Video ID: {videoId}</p>}
      <Button>Hello</Button>
    </div>
  )
}

export default IndexPopup

import "globals.css"

import { useEffect, useState } from "react"

import { Skeleton } from "~/components/ui/skeleton"
import { AlertMessage } from "~components/alert-message"
import { ScriptCopyBtn } from "~components/magicui/script-copy-btn"
import { SparklesText } from "~components/magicui/sparkles-text"
import { ModeToggle } from "~components/mode-toggle"
import { ThemeProvider } from "~components/theme-provider"
import { Button } from "~components/ui/button"
import { Input } from "~components/ui/input"
import { ValidMessage } from "~components/valid-message"
import { ytShortsRegex } from "~lib/constants"

const WHICH_MOVIE_API_ENDPOINT =
  process.env.PLASMO_PUBLIC_WHICH_MOVIE_API_ENDPOINT
if (!WHICH_MOVIE_API_ENDPOINT) {
  throw new Error("WHICH_MOVIE_API_ENDPOINT is not set")
}

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
  const [isSubmitting, setIsSubmitting] = useState(false)
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

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setMovieName("")
    try {
      const url = `${WHICH_MOVIE_API_ENDPOINT}/movie`
      const payload = {
        video_id: videoId,
        openai_key: apiKey
      }
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })
      if (response.status == 429) {
        throw new Error("5 reqs per min.")
      }
      const data = await response.json()
      setMovieName(data.movie_name)
    } catch (error) {
      console.error("Error fetching movie name:", error)
      setMovieName(error.message ?? "Error fetching movie name")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="flex flex-col h-full gap-4 p-4 w-96">
        <div className="flex items-center justify-between">
          <SparklesText
            text="WHICH MOVIE"
            className="text-2xl text-center"
            sparklesCount={5}
          />
          <ModeToggle />
        </div>
        <Input
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter your OpenAI API key"
          disabled={!videoId}
        />
        <div className="grid h-8 grid-rows-2 gap-2">
          <VideoIdValidation videoId={videoId} />
          <ApiValidation apiKey={apiKey} />
        </div>

        <div className="flex items-center justify-between gap-2">
          <Button
            className="w-fit"
            disabled={!videoId || !apiKey || isSubmitting}
            onClick={handleSubmit}>
            Submit
          </Button>

          {isSubmitting && (
            <div className="flex items-center gap-2">
              <Skeleton className="h-[38px] w-[200px] rounded-lg" />
              <Skeleton className="h-[38px] w-[38px] rounded-lg" />
            </div>
          )}

          {movieName && (
            <ScriptCopyBtn
              showMultiplePackageOptions={false}
              codeLanguage="shell"
              lightTheme="nord"
              darkTheme="vitesse-dark"
              commandMap={{ name: movieName }}
            />
          )}
        </div>
      </div>
    </ThemeProvider>
  )
}

export default IndexPopup

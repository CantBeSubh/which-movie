"use client"

import { Check, Copy } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState, type HTMLAttributes } from "react"

import { Button } from "~/components/ui/button"
import { cn } from "~/lib/utils"

interface ScriptCopyBtnProps extends HTMLAttributes<HTMLDivElement> {
  showMultiplePackageOptions?: boolean
  codeLanguage: string
  lightTheme: string
  darkTheme: string
  commandMap: Record<string, string>
  className?: string
}

export function ScriptCopyBtn({
  showMultiplePackageOptions = true,
  codeLanguage,
  lightTheme,
  darkTheme,
  commandMap,
  className
}: ScriptCopyBtnProps) {
  const packageManagers = Object.keys(commandMap)
  const [packageManager, setPackageManager] = useState(packageManagers[0])
  const [copied, setCopied] = useState(false)
  const [highlightedCode, setHighlightedCode] = useState("")
  const { theme } = useTheme()
  const command = commandMap[packageManager]

  useEffect(() => {
    async function loadHighlightedCode() {
      try {
        const { codeToHtml } = await import("shiki")
        const highlighted = await codeToHtml(command, {
          lang: codeLanguage,
          themes: {
            light: lightTheme,
            dark: darkTheme
          },
          defaultColor: theme === "dark" ? "dark" : "light"
        })
        setHighlightedCode(highlighted)
      } catch (error) {
        console.error("Error highlighting code:", error)
        setHighlightedCode(`<pre>${command}</pre>`)
      }
    }

    loadHighlightedCode()
  }, [command, theme, codeLanguage, lightTheme, darkTheme])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(command)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn("flex max-w-md items-center justify-center", className)}>
      <div className="w-full space-y-2">
        <div className="relative flex items-center">
          <div className="min-w-[200px] max-w-[210px] grow font-mono">
            {highlightedCode ? (
              <div
                className={`rounded-lg border-2 bg-neutral-200 dark:bg-neutral-900 [&>pre]:overflow-x-auto [&>pre]:rounded-md [&>pre]:p-2 [&>pre]:px-4 [&>pre]:font-mono ${
                  theme === "dark" ? "dark" : "light"
                }`}
                dangerouslySetInnerHTML={{ __html: highlightedCode }}
              />
            ) : (
              <pre className="p-2 px-4 font-mono bg-white border rounded-md border-border dark:bg-black">
                {command}
              </pre>
            )}
          </div>
          <Button
            variant="outline"
            size="icon"
            className="relative ml-2 rounded-md"
            onClick={copyToClipboard}
            aria-label={copied ? "Copied" : "Copy to clipboard"}>
            <span className="sr-only">{copied ? "Copied" : "Copy"}</span>
            <Copy
              className={`h-4 w-4 transition-all duration-300 ${
                copied ? "scale-0" : "scale-100"
              }`}
            />
            <Check
              className={`absolute inset-0 m-auto h-4 w-4 transition-all duration-300 ${
                copied ? "scale-100" : "scale-0"
              }`}
            />
          </Button>
        </div>
      </div>
    </div>
  )
}

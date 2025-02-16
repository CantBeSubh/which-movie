import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"

export function ModeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      <Sun className="dark:-rotate-360 h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-500 dark:scale-0" />
      <Moon className="rotate-360 absolute h-[1.2rem] w-[1.2rem] scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

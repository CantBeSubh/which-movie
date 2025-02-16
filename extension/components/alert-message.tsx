import { AlertTriangleIcon } from "lucide-react"

export const AlertMessage = ({ message }: { message: string }) => {
  return (
    <div className="flex items-center justify-start gap-1 text-xs font-medium text-destructive">
      <AlertTriangleIcon className="size-3" />
      <span> {message} </span>
    </div>
  )
}

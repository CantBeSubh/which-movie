import { CheckIcon } from "lucide-react"

export const ValidMessage = ({ message }: { message: string }) => {
  return (
    <div className="flex items-center justify-start gap-1 text-xs font-medium text-green-500">
      <CheckIcon className="size-3" />
      <span> {message} </span>
    </div>
  )
}

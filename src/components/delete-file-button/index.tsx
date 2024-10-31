import { Loader, X } from 'lucide-react'
import { useFormStatus } from 'react-dom'

import { Button } from '../ui/button'

function DeleteFileButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" size="icon" variant="destructive" disabled={pending}>
      {pending ? (
        <Loader className="size-4 animate-spin" />
      ) : (
        <X className="size-4" />
      )}
    </Button>
  )
}

export default DeleteFileButton

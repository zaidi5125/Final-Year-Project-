import { toast } from 'sonner'

export function showSuccess(message) {
  toast.success(message)
}

export function showError(message) {
  toast.error(message)
}

export function showInfo(message) {
  toast.info(message)
}

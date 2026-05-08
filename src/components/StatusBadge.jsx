import { Badge } from '@/components/ui/badge'
import { STATUS_BADGE_VARIANT, STATUS_STYLES } from '../constants'
import { cn } from '@/lib/utils'

export function StatusBadge({ status }) {
  const styles = STATUS_STYLES[status]
  const variant = STATUS_BADGE_VARIANT[status]
  if (!styles || !variant) return null
  return (
    <Badge variant={variant} className="gap-1.5 font-normal tabular-nums">
      <span className={cn('size-1.5 shrink-0 rounded-full', styles.dot)} />
      {styles.label}
    </Badge>
  )
}

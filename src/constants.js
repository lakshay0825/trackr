export const APPLICATION_STATUSES = [
  'Applied',
  'Interview',
  'Offer',
  'Rejected',
]

/** Tailwind classes per status */
export const STATUS_STYLES = {
  Applied: {
    label: 'Applied',
    dot: 'bg-blue-500',
    badge:
      'bg-blue-500/10 text-blue-700 ring-1 ring-inset ring-blue-500/25 dark:text-blue-300',
    column: 'border-blue-500/20 bg-blue-500/[0.03]',
  },
  Interview: {
    label: 'Interview',
    dot: 'bg-amber-500',
    badge:
      'bg-amber-500/10 text-amber-800 ring-1 ring-inset ring-amber-500/25 dark:text-amber-200',
    column: 'border-amber-500/20 bg-amber-500/[0.03]',
  },
  Offer: {
    label: 'Offer',
    dot: 'bg-emerald-500',
    badge:
      'bg-emerald-500/10 text-emerald-800 ring-1 ring-inset ring-emerald-500/25 dark:text-emerald-200',
    column: 'border-emerald-500/20 bg-emerald-500/[0.03]',
  },
  Rejected: {
    label: 'Rejected',
    dot: 'bg-red-500',
    badge:
      'bg-red-500/10 text-red-700 ring-1 ring-inset ring-red-500/25 dark:text-red-300',
    column: 'border-red-500/20 bg-red-500/[0.03]',
  },
}

export const STORAGE_KEY = 'trackr-demo-applications'

/** Maps pipeline status → shadcn-style Badge variant */
export const STATUS_BADGE_VARIANT = {
  Applied: 'applied',
  Interview: 'interview',
  Offer: 'offer',
  Rejected: 'rejected',
}

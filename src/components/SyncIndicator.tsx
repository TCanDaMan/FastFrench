import { useSyncIndicator, useSync } from '../hooks/useSync'

interface SyncIndicatorProps {
  showDetails?: boolean
  className?: string
}

export function SyncIndicator({ showDetails = false, className = '' }: SyncIndicatorProps) {
  const { message, color, isOnline, isSyncing, hasError } = useSyncIndicator()
  const { forceSync } = useSync({ autoSync: true })

  const getColorClass = () => {
    switch (color) {
      case 'green':
        return 'text-green-600 bg-green-50'
      case 'blue':
        return 'text-blue-600 bg-blue-50'
      case 'yellow':
        return 'text-yellow-600 bg-yellow-50'
      case 'red':
        return 'text-red-600 bg-red-50'
      case 'gray':
        return 'text-gray-600 bg-gray-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const getIcon = () => {
    if (isSyncing) {
      return (
        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )
    }

    if (!isOnline) {
      return (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
        </svg>
      )
    }

    if (hasError) {
      return (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
    }

    return (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    )
  }

  if (!showDetails) {
    return (
      <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs ${getColorClass()} ${className}`}>
        {getIcon()}
        <span>{message}</span>
      </div>
    )
  }

  return (
    <div className={`flex items-center justify-between px-4 py-2 rounded-lg ${getColorClass()} ${className}`}>
      <div className="flex items-center gap-3">
        {getIcon()}
        <div>
          <div className="text-sm font-medium">{message}</div>
          {!isOnline && (
            <div className="text-xs opacity-75">Changes will sync when you're back online</div>
          )}
        </div>
      </div>

      {hasError && (
        <button
          onClick={() => forceSync()}
          className="px-3 py-1 text-xs font-medium bg-white rounded hover:bg-gray-50 transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  )
}

// Minimal version for status bar
export function SyncStatusBadge() {
  const { isSyncing, hasError, isOnline } = useSyncIndicator()

  if (isSyncing) {
    return (
      <div className="flex items-center gap-1 text-blue-600">
        <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    )
  }

  if (hasError) {
    return (
      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" title="Sync error" />
    )
  }

  if (!isOnline) {
    return (
      <div className="w-2 h-2 bg-gray-500 rounded-full" title="Offline" />
    )
  }

  return (
    <div className="w-2 h-2 bg-green-500 rounded-full" title="Synced" />
  )
}

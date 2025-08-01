# Firebase Hooks Documentation

## Overview

This directory contains type-safe Firebase Firestore hooks for the MomentumX Dashboard. All hooks provide real-time sync, offline persistence, and comprehensive error handling.

## Available Hooks

### `useHabits(userId)`
Manages habit data with real-time sync.

```typescript
const { habits, loading, error, addHabit, updateHabit, toggleHabit, deleteHabit } = useHabits(userId)

// Add a new habit
await addHabit({
  title: 'Morning Exercise',
  description: '30 minutes cardio',
  category: 'Health',
  frequency: 'daily',
  target: 1,
  currentStreak: 0,
  longestStreak: 0,
  completedDates: [],
  isActive: true
})

// Toggle habit completion for today
await toggleHabit(habitId, '2024-01-17')
```

### `useTasks(userId)`
Manages task data with real-time sync.

```typescript
const { tasks, loading, error, addTask, updateTask, toggleTask, deleteTask } = useTasks(userId)

// Add a new task
await addTask({
  title: 'Complete project proposal',
  description: 'Finish Q1 proposal document',
  priority: 'high',
  status: 'pending',
  dueDate: new Date('2024-01-20'),
  tags: ['work', 'urgent']
})

// Toggle task completion
await toggleTask(taskId)
```

### `useJournal(userId)`
Manages journal entries with real-time sync.

```typescript
const { entries, loading, error, saveJournal, updateJournal, deleteJournal } = useJournal(userId)

// Save a journal entry
await saveJournal({
  type: 'daily',
  title: 'Today\'s Reflection',
  content: 'Today was productive...',
  mood: 8,
  tags: ['productive', 'learning']
})
```

### `useReviews(userId)`
Manages weekly/monthly reviews with real-time sync.

```typescript
const { reviews, loading, error, saveReview, updateReview, deleteReview } = useReviews(userId)

// Save a weekly review
await saveReview({
  type: 'weekly',
  period: '2024-W03',
  habits: [
    { habitId: 'habit1', completed: true, notes: 'Great progress' }
  ],
  tasks: [
    { taskId: 'task1', completed: true, notes: 'Completed on time' }
  ],
  overallScore: 8,
  notes: 'This week was very productive'
})
```

### `useBatchOperations()`
Performs multiple operations atomically.

```typescript
const { batchUpdate } = useBatchOperations()

// Update multiple items at once
await batchUpdate([
  { type: 'update', collection: 'habits', id: 'habit1', data: { isActive: false } },
  { type: 'update', collection: 'tasks', id: 'task1', data: { status: 'completed' } },
  { type: 'delete', collection: 'tasks', id: 'task2' }
])
```

### `useNetworkStatus()`
Monitors network connectivity and manages offline mode.

```typescript
const { isOnline, enableOffline, enableOnline } = useNetworkStatus()

// Enable offline mode for testing
await enableOffline()

// Re-enable online mode
await enableOnline()
```

## Error Handling

All hooks include comprehensive error handling with localized messages:

- **English**: Default error messages
- **Arabic**: Arabic translations for all error types
- **Network Errors**: Automatic detection and user-friendly messages
- **Permission Errors**: Clear authentication guidance
- **Validation Errors**: Helpful feedback for invalid data

## Features

### Real-time Sync
- All data updates in real-time across devices
- Automatic reconnection on network restore
- Optimistic updates for better UX

### Offline Persistence
- Data cached locally for offline access
- Automatic sync when connection restored
- No data loss during network interruptions

### Type Safety
- Full TypeScript support
- Compile-time error checking
- IntelliSense support in IDEs

### Performance
- Efficient queries with proper indexing
- Minimal re-renders with React hooks
- Optimized batch operations

## Usage Example

```typescript
import { useHabits, useTasks, useJournal } from '@/hooks/useFirestore'

function Dashboard({ user }) {
  const { habits, loading: habitsLoading, addHabit } = useHabits(user?.uid)
  const { tasks, loading: tasksLoading, addTask } = useTasks(user?.uid)
  const { entries, loading: journalLoading, saveJournal } = useJournal(user?.uid)

  if (habitsLoading || tasksLoading || journalLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      {/* Your dashboard content */}
    </div>
  )
}
```

## Security

- All operations require valid `userId`
- Automatic permission checking
- Data isolation per user
- Secure error messages (no sensitive data exposed)

## Best Practices

1. **Always check loading states** before rendering data
2. **Handle errors gracefully** with user-friendly messages
3. **Use batch operations** for multiple updates
4. **Monitor network status** for offline functionality
5. **Validate data** before saving to Firestore 
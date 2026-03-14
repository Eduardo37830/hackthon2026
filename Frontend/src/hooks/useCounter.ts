import { useCallback, useState } from "react"

interface UseCounterResult {
  count: number
  increment: () => void
}

export const useCounter = (initialValue: number = 0): UseCounterResult => {
  const [count, setCount] = useState<number>(initialValue)

  const increment = useCallback(() => {
    setCount((currentValue) => currentValue + 1)
  }, [])

  return {
    count,
    increment
  }
}

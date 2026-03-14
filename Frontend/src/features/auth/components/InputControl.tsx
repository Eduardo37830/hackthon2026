import type { ChangeEventHandler, FC } from 'react'

import '../auth.css'

interface InputControlProps {
  readonly id: string
  readonly value: string
  readonly placeholder: string
  readonly type: 'text' | 'password'
  readonly autoComplete?: string
  readonly className?: string
  readonly onChange: ChangeEventHandler<HTMLInputElement>
}

export const InputControl: FC<InputControlProps> = ({
  id,
  value,
  placeholder,
  type,
  autoComplete,
  className,
  onChange,
}) => {
  const inputClassName = className ? `auth-input ${className}` : 'auth-input'

  return (
    <input
      id={id}
      className={inputClassName}
      value={value}
      placeholder={placeholder}
      type={type}
      autoComplete={autoComplete}
      onChange={onChange}
    />
  )
}

import type { ChangeEventHandler, FC } from 'react'

import '../auth.css'
import { InputControl } from './InputControl'

interface TextFieldProps {
  readonly id: string
  readonly label: string
  readonly placeholder: string
  readonly value: string
  readonly onChange: ChangeEventHandler<HTMLInputElement>
  readonly type?: 'text' | 'password'
  readonly autoComplete?: string
}

export const TextField: FC<TextFieldProps> = ({
  id,
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  autoComplete,
}) => {
  return (
    <div className="auth-field">
      <label className="auth-label" htmlFor={id}>
        {label}
      </label>
      <InputControl
        id={id}
        value={value}
        placeholder={placeholder}
        type={type}
        autoComplete={autoComplete}
        onChange={onChange}
      />
    </div>
  )
}

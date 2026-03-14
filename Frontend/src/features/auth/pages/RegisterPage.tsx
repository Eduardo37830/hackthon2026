import { useEffect, useState, type FC } from 'react'

import { labels } from '../../../constants/labels'
import { AuthLayout } from '../components/AuthLayout'
import { PasswordField } from '../components/PasswordField'
import { TextField } from '../components/TextField'
import type { RegisterFormValues } from '../types/auth'

const initialValues: RegisterFormValues = {
  username: '',
  password: '',
  confirmPassword: '',
}

export const RegisterPage: FC = () => {
  const [formValues, setFormValues] = useState(initialValues)

  useEffect(() => {
    document.title = labels.registerPageTitle
  }, [])

  return (
    <AuthLayout
      title={labels.registerHeading}
      subtitle={labels.registerSubtitle}
      logoAlt={labels.logoAlt}
      submitLabel={labels.registerSubmit}
      footerPrefix={labels.registerFooterPrefix}
      footerActionLabel={labels.registerFooterAction}
      footerActionPath="/login"
      onSubmit={() => {
        return
      }}
    >
      <TextField
        id="register-username"
        label={labels.usernameLabel}
        placeholder={labels.usernamePlaceholder}
        value={formValues.username}
        autoComplete="username"
        onChange={(event) =>
          setFormValues((currentValues) => ({
            ...currentValues,
            username: event.target.value,
          }))
        }
      />

      <PasswordField
        id="register-password"
        label={labels.passwordLabel}
        placeholder={labels.passwordRulesPlaceholder}
        value={formValues.password}
        autoComplete="new-password"
        toggleLabel={labels.passwordToggle}
        onChange={(event) =>
          setFormValues((currentValues) => ({
            ...currentValues,
            password: event.target.value,
          }))
        }
      />

      <PasswordField
        id="register-confirm-password"
        label={labels.confirmPasswordLabel}
        placeholder={labels.passwordRulesPlaceholder}
        value={formValues.confirmPassword}
        autoComplete="new-password"
        toggleLabel={labels.passwordToggle}
        onChange={(event) =>
          setFormValues((currentValues) => ({
            ...currentValues,
            confirmPassword: event.target.value,
          }))
        }
      />
    </AuthLayout>
  )
}

import { useEffect, useState, type FC } from 'react'

import { labels } from '../../../constants/labels'
import { AuthLink } from '../components/AuthLink'
import { AuthLayout } from '../components/AuthLayout'
import { PasswordField } from '../components/PasswordField'
import { TextField } from '../components/TextField'
import type { LoginFormValues } from '../types/auth'

const initialValues: LoginFormValues = {
  username: '',
  password: '',
}

export const LoginPage: FC = () => {
  const [formValues, setFormValues] = useState(initialValues)

  useEffect(() => {
    document.title = labels.loginPageTitle
  }, [])

  return (
    <AuthLayout
      title={labels.loginHeading}
      subtitle={labels.loginSubtitle}
      logoAlt={labels.logoAlt}
      submitLabel={labels.loginSubmit}
      footerPrefix={labels.loginFooterPrefix}
      footerActionLabel={labels.loginFooterAction}
      footerActionPath="/register"
      onSubmit={() => {
        return
      }}
    >
      <TextField
        id="login-username"
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
        id="login-password"
        label={labels.passwordLabel}
        placeholder={labels.passwordPlaceholder}
        value={formValues.password}
        autoComplete="current-password"
        toggleLabel={labels.passwordToggle}
        onChange={(event) =>
          setFormValues((currentValues) => ({
            ...currentValues,
            password: event.target.value,
          }))
        }
      />

      <AuthLink variant="inline" label={labels.forgotPassword} />
    </AuthLayout>
  )
}

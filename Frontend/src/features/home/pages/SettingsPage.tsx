import { useEffect, type FC } from 'react'

import { Spinner } from '../../../components/Spinner'
import { labels } from '../../../constants/labels'
import { HomeShell } from '../components/HomeShell'

interface SettingsPageProps {
  readonly __noProps?: never
}

export const SettingsPage: FC<SettingsPageProps> = () => {
  useEffect(() => {
    document.title = labels.settingsPageTitle
  }, [])

  return (
    <HomeShell activeTab="settings">
      <div className="home-sandbox-loader-wrap">
        <Spinner ariaHidden={false} ariaLabel={labels.settingsLoaderAria} size="lg" tone="dark" />
      </div>
    </HomeShell>
  )
}

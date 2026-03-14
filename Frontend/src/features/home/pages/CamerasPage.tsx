import { useEffect, type FC } from 'react'

import { Spinner } from '../../../components/Spinner'
import { labels } from '../../../constants/labels'
import { HomeShell } from '../components/HomeShell'

interface CamerasPageProps {
  readonly __noProps?: never
}

export const CamerasPage: FC<CamerasPageProps> = () => {
  useEffect(() => {
    document.title = labels.camerasPageTitle
  }, [])

  return (
    <HomeShell activeTab="cameras">
      <div className="home-sandbox-loader-wrap">
        <Spinner ariaHidden={false} ariaLabel={labels.camerasLoaderAria} size="lg" tone="dark" />
      </div>
    </HomeShell>
  )
}

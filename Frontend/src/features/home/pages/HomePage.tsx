import { useEffect, type FC } from 'react'

import { Spinner } from '../../../components/Spinner'
import { labels } from '../../../constants/labels'
import { HomeShell } from '../components/HomeShell'

interface HomePageProps {
  readonly __noProps?: never
}

export const HomePage: FC<HomePageProps> = () => {
  useEffect(() => {
    document.title = labels.homePageTitle
  }, [])

  return (
    <HomeShell activeTab="home">
      <div className="home-sandbox-loader-wrap">
        <Spinner ariaHidden={false} ariaLabel={labels.homeLoaderAria} size="lg" tone="dark" />
      </div>
    </HomeShell>
  )
}

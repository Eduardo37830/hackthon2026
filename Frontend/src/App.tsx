import type { FC } from "react"

import "./App.css"
import { DocumentationSection } from "./features/home/components/DocumentationSection"
import { HeroSection } from "./features/home/components/HeroSection"
import { SocialSection } from "./features/home/components/SocialSection"
import { useCounter } from "./hooks/useCounter"

interface AppProps {
  readonly __noProps?: never
}

const App: FC<AppProps> = () => {
  const { count, increment } = useCounter()

  return (
    <>
      <HeroSection count={count} onIncrement={increment} />

      <div className="ticks"></div>

      <section id="next-steps">
        <DocumentationSection />
        <SocialSection />
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App

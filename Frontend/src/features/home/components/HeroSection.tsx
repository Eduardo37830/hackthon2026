import type { FC } from "react"

import heroImg from "../../../assets/hero.png"
import reactLogo from "../../../assets/react.svg"
import viteLogo from "../../../assets/vite.svg"
import { labels } from "../../../constants/labels"

interface HeroSectionProps {
  count: number
  onIncrement: () => void
}

export const HeroSection: FC<HeroSectionProps> = ({ count, onIncrement }) => {
  return (
    <section id="center">
      <div className="hero">
        <img src={heroImg} className="base" width="170" height="179" alt="" />
        <img src={reactLogo} className="framework" alt={labels.reactLogoAlt} />
        <img src={viteLogo} className="vite" alt={labels.viteLogoAlt} />
      </div>
      <div>
        <h1>{labels.getStarted}</h1>
        <p>
          {labels.editInstructionPrefix} <code>{labels.editInstructionFile}</code>{" "}
          {labels.editInstructionMiddle} <code>{labels.editInstructionSuffix}</code>
        </p>
      </div>
      <button className="counter" onClick={onIncrement}>
        {labels.countIsPrefix} {count}
      </button>
    </section>
  )
}

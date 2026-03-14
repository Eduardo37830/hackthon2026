import type { FC } from "react"

import reactLogo from "../../../assets/react.svg"
import viteLogo from "../../../assets/vite.svg"
import { ResourceLinksList } from "../../../components/ResourceLinksList"
import { labels } from "../../../constants/labels"
import { links } from "../../../constants/links"
import type { ResourceLink } from "../../../types/home"

interface DocumentationSectionProps {
  readonly __noProps?: never
}

const documentationLinks: ReadonlyArray<ResourceLink> = [
  {
    href: links.vite,
    label: labels.exploreVite,
    iconType: "image",
    iconPath: "vite",
    iconClassName: "logo"
  },
  {
    href: links.react,
    label: labels.learnMore,
    iconType: "image",
    iconPath: "react",
    iconClassName: "button-icon"
  }
]

const imageSources: Readonly<Record<string, string>> = {
  vite: viteLogo,
  react: reactLogo
}

export const DocumentationSection: FC<DocumentationSectionProps> = () => {
  return (
    <div id="docs">
      <svg className="icon" role="presentation" aria-hidden="true">
        <use href="/icons.svg#documentation-icon"></use>
      </svg>
      <h2>{labels.documentationTitle}</h2>
      <p>{labels.documentationSubtitle}</p>
      <ResourceLinksList links={documentationLinks} imageSources={imageSources} />
    </div>
  )
}

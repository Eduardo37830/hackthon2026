import type { FC } from "react"

import { ResourceLinksList } from "../../../components/ResourceLinksList"
import { labels } from "../../../constants/labels"
import { links } from "../../../constants/links"
import type { ResourceLink } from "../../../types/home"

interface SocialSectionProps {
  readonly __noProps?: never
}

const socialLinks: ReadonlyArray<ResourceLink> = [
  {
    href: links.github,
    label: labels.github,
    iconType: "svg",
    iconPath: "/icons.svg#github-icon",
    iconClassName: "button-icon"
  },
  {
    href: links.discord,
    label: labels.discord,
    iconType: "svg",
    iconPath: "/icons.svg#discord-icon",
    iconClassName: "button-icon"
  },
  {
    href: links.xCom,
    label: labels.xCom,
    iconType: "svg",
    iconPath: "/icons.svg#x-icon",
    iconClassName: "button-icon"
  },
  {
    href: links.bluesky,
    label: labels.bluesky,
    iconType: "svg",
    iconPath: "/icons.svg#bluesky-icon",
    iconClassName: "button-icon"
  }
]

export const SocialSection: FC<SocialSectionProps> = () => {
  return (
    <div id="social">
      <svg className="icon" role="presentation" aria-hidden="true">
        <use href="/icons.svg#social-icon"></use>
      </svg>
      <h2>{labels.socialTitle}</h2>
      <p>{labels.socialSubtitle}</p>
      <ResourceLinksList links={socialLinks} />
    </div>
  )
}

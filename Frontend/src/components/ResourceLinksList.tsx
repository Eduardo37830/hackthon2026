import type { FC } from "react"

import type { ResourceLink } from "../types/home"

interface ResourceLinksListProps {
  links: ReadonlyArray<ResourceLink>
  imageSources?: Readonly<Record<string, string>>
}

export const ResourceLinksList: FC<ResourceLinksListProps> = ({
  links,
  imageSources = {}
}) => {
  return (
    <ul>
      {links.map((link) => (
        <li key={link.href}>
          <a href={link.href} target="_blank" rel="noreferrer">
            {link.iconType === "image" ? (
              <img
                className={link.iconClassName}
                src={imageSources[link.iconPath]}
                alt=""
              />
            ) : (
              <svg className={link.iconClassName} role="presentation" aria-hidden="true">
                <use href={link.iconPath}></use>
              </svg>
            )}
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  )
}

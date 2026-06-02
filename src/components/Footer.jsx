import { appName, legalNavItems } from '../constants/nav'
import { getPublicPath } from '../utils/routing'
import './Footer.css'

export default function Footer({ onNavigate }) {
  return (
    <footer className="site-footer">
      <p>{appName}</p>
      <div>
        {legalNavItems.map((item) => (
          <a
            href={getPublicPath(item.path)}
            key={item.key}
            onClick={(event) => onNavigate(event, item.path)}
          >
            {item.label}
          </a>
        ))}
      </div>
    </footer>
  )
}

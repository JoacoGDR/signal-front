import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Sidebar.css'

const links = [
  { to: '/inbox', label: 'Inbox' },
  { to: '/leads', label: 'Leads' },
  { to: '/connections', label: 'Connections' },
] as const

export function Sidebar() {
  const { user, logout } = useAuth()

  return (
    <aside className="sidebar" aria-label="Main navigation">
      <div className="sidebar-brand">
        <span className="sidebar-logo">BoxLead</span>
      </div>
      <nav className="sidebar-nav">
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `sidebar-link${isActive ? ' sidebar-link-active' : ''}`
            }
            end={to === '/inbox'}
          >
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="sidebar-user" title={user?.email}>
          {user?.email}
        </div>
        <button type="button" className="sidebar-logout" onClick={logout}>
          Log out
        </button>
      </div>
    </aside>
  )
}

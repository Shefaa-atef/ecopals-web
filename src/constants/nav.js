import { Gamepad2, Home, ShieldCheck, Sparkles, Trash2, Trophy } from 'lucide-react'

export const appName = 'Ecopals'
export const supportEmail = 'shefaalhendi@gmail.com'

export const mainNavItems = [
  {
    key: 'home',
    label: 'Home',
    path: '/',
    icon: Home,
    color: 'var(--challenge-plants)',
    soft: 'var(--challenge-plants-soft)',
  },
  {
    key: 'game',
    label: 'Game',
    path: '/',
    hash: 'game',
    icon: Gamepad2,
    color: 'var(--challenge-community)',
    soft: 'var(--challenge-community-soft)',
  },
  {
    key: 'challenges',
    label: 'Challenges',
    path: '/',
    hash: 'challenges',
    icon: Trophy,
    color: 'var(--challenge-energy)',
    soft: 'var(--challenge-energy-soft)',
  },
  {
    key: 'earthie',
    label: 'Earthie',
    path: '/',
    hash: 'earthie',
    icon: Sparkles,
    color: 'var(--challenge-water)',
    soft: 'var(--challenge-air-soft)',
  },
]

export const legalNavItems = [
  {
    key: 'privacy',
    label: 'Privacy',
    path: '/policies',
    icon: ShieldCheck,
    color: 'var(--challenge-air)',
    soft: 'var(--challenge-air-soft)',
  },
  {
    key: 'delete-account',
    label: 'Delete Account',
    path: '/delete-account',
    icon: Trash2,
    color: 'var(--challenge-animals)',
    soft: 'var(--challenge-animals-soft)',
  },
]

export const allNavItems = [...mainNavItems, ...legalNavItems]

import { Home, Info, ShieldCheck, Sparkles, Trash2, Users } from 'lucide-react'

export const appName = 'Ecopals'
export const appNameAr = 'إيكوبالز'
export const supportEmail = 'shefaalhendi@gmail.com'

export const mainNavItems = [
  {
    key: 'home',
    label: 'Home',
    labelAr: 'الرئيسية',
    path: '/',
    icon: Home,
    color: 'var(--challenge-plants)',
    soft: 'var(--challenge-plants-soft)',
  },
  {
    key: 'game',
    label: 'Idea',
    labelAr: 'اللعبة',
    path: '/',
    hash: 'game',
    icon: Info,
    color: 'var(--challenge-community)',
    soft: 'var(--challenge-community-soft)',
  },
  {
    key: 'community',
    label: 'Community',
    labelAr: 'المجتمع',
    path: '/',
    hash: 'community',
    icon: Users,
    color: 'var(--challenge-water)',
    soft: 'var(--challenge-water-soft)',
  },
  {
    key: 'earthie',
    label: 'Earthie',
    labelAr: 'إيرثي',
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
    labelAr: 'الخصوصية',
    path: '/policies',
    icon: ShieldCheck,
    color: 'var(--challenge-air)',
    soft: 'var(--challenge-air-soft)',
  },
  {
    key: 'delete-account',
    label: 'Delete Account',
    labelAr: 'حذف الحساب',
    path: '/delete-account',
    icon: Trash2,
    color: 'var(--challenge-animals)',
    soft: 'var(--challenge-animals-soft)',
  },
]

export const allNavItems = [...mainNavItems, ...legalNavItems]

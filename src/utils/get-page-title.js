import defaultSettings from '@/settings'

const title = defaultSettings.title || '翼飞智能科技'

export default function getPageTitle(pageTitle) {
    if (pageTitle) {
        return `${pageTitle} - ${title}`
    }
    return `${title}`
}
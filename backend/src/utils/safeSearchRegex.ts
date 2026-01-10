export const safeSearchRegex = (str: string) => {
    const escaped = str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    if (str.length > 50) return new RegExp(escaped.substring(0, 50), 'i')
    return new RegExp(escaped, 'i')
}

const normalize = (val: string): string => {
    const cleaned = val
        .replace(/[\r\n]+/g, " ")
        .replace(/\s+/g, " ")
        .trim()

    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase()
}

export default normalize

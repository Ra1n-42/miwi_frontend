export function getCustomThumbnailUrl(thumbnailUrl: string, width: string, height: string) {
    // Regulärer Ausdruck, der nach 'preview-' gefolgt von Zahlen und 'x' sucht
    const regex = /preview-\d+x\d+\.jpg$/;

    // Ersetzungsstring mit den gewünschten Breiten- und Höhenwerten
    const replacement = `preview-${width}x${height}.jpg`;

    // Überprüfen, ob die URL dem erwarteten Muster entspricht
    if (regex.test(thumbnailUrl)) {
        // Ersetzen des vorhandenen 'preview-' Teils durch den neuen mit den gewünschten Abmessungen
        return thumbnailUrl.replace(regex, replacement);
    } else {
        // Wenn die URL nicht dem erwarteten Muster entspricht, die gewünschten Abmessungen anhängen
        return `${thumbnailUrl.split('.jpg')[0]}-${replacement}`;
    }
}

export function isDirectThumbnail(thumbnailUrl: string): boolean {
    return thumbnailUrl.startsWith("https://static-cdn.jtvnw.net/");
}
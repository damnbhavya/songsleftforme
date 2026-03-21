// custom svg cursors that match the active theme
// re-generated whenever the user switches colors

function encodeSvgCursor(svg: string): string {
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

function defaultCursor(stroke: string): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="${stroke}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z"/></svg>`
}

function textCursor(stroke: string): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 2v20"/><path d="M2 5h6"/><path d="M2 19h6"/></svg>`
}

function pointerCursor(stroke: string): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="${stroke}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 9.5V4a2 2 0 0 0-4 0v10l-1.41-1.41A2 2 0 0 0 1.76 15.4l3.6 3.6C6.93 20.58 8.7 21.5 11.5 21.5H14a8 8 0 0 0 8-8v-3a2 2 0 0 0-4 0v1M14 10V9a2 2 0 0 0-4 0v1M18 11v-1a2 2 0 0 0-4 0"/></svg>`
}

export function applyCursors(accentColor: string) {
    const root = document.documentElement
    const style = root.style

    const def = `${encodeSvgCursor(defaultCursor(accentColor))} 4 4, default`
    const text = `${encodeSvgCursor(textCursor(accentColor))} 5 12, text`
    const pointer = `${encodeSvgCursor(pointerCursor(accentColor))} 10 4, pointer`

    style.setProperty('--cursor-default', def)
    style.setProperty('--cursor-text', text)
    style.setProperty('--cursor-pointer', pointer)
}

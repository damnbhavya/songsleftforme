import { useState, useRef, useCallback, useEffect } from 'react'

interface HoverBoldTextProps {
    text: string
    className?: string
    baseWeight?: number
    hoverWeight?: number
    radius?: number
}

/**
 * per-character font-weight animation that follows the mouse cursor.
 * on touch devices, it plays an automatic left-to-right wave instead.
 */
export default function HoverBoldText({
    text,
    className = '',
    baseWeight = 300,
    hoverWeight = 900,
    radius = 3,
}: HoverBoldTextProps) {
    const [charWeights, setCharWeights] = useState<number[]>(
        new Array(text.length).fill(baseWeight)
    )
    const containerRef = useRef<HTMLSpanElement>(null)
    const charRefs = useRef<(HTMLSpanElement | null)[]>([])
    const animFrameRef = useRef<number | null>(null)
    const targetWeightsRef = useRef<number[]>(new Array(text.length).fill(baseWeight))
    const isHoveringRef = useRef(false)
    const isMobileRef = useRef(false)
    const mobileAnimRef = useRef<number | null>(null)

    // coarse pointer = touch device — skip mouse tracking, use wave animation
    useEffect(() => {
        const mq = window.matchMedia('(pointer: coarse)')
        isMobileRef.current = mq.matches
        const handler = (e: MediaQueryListEvent) => { isMobileRef.current = e.matches }
        mq.addEventListener('change', handler)
        return () => mq.removeEventListener('change', handler)
    }, [])

    // smooth interpolation loop — runs until weights match targets
    const startLerp = useCallback(() => {
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)

        const tick = () => {
            setCharWeights(prev => {
                const targets = targetWeightsRef.current
                const allDone = prev.every((w, i) => Math.abs(w - targets[i]) < 2)
                if (allDone) return targets.map(t => Math.round(t))

                const next = prev.map((w, i) => {
                    const diff = targets[i] - w
                    if (Math.abs(diff) < 2) return targets[i]
                    return w + diff * 0.18 // lerp factor
                })
                animFrameRef.current = requestAnimationFrame(tick)
                return next
            })
        }

        animFrameRef.current = requestAnimationFrame(tick)
    }, [])

    // mobile: looping left-to-right wave that sweeps across the text
    useEffect(() => {
        const mq = window.matchMedia('(pointer: coarse)')
        if (!mq.matches) return

        const chars = text.length
        const duration = 2500
        const pauseBetween = 800
        let startTime: number | null = null
        let pausing = false
        let pauseStart = 0

        const wave = (timestamp: number) => {
            if (pausing) {
                if (timestamp - pauseStart >= pauseBetween) {
                    pausing = false
                    startTime = timestamp
                }
                mobileAnimRef.current = requestAnimationFrame(wave)
                return
            }

            if (!startTime) startTime = timestamp
            const elapsed = timestamp - startTime
            const progress = elapsed / duration

            if (progress > 1.3) {
                // sweep finished, pause then loop
                pausing = true
                pauseStart = timestamp
                targetWeightsRef.current = new Array(chars).fill(baseWeight)
                startLerp()
                mobileAnimRef.current = requestAnimationFrame(wave)
                return
            }

            const waveCenter = progress * chars
            const waveRadius = radius

            const targets = new Array(chars).fill(0).map((_, i) => {
                const distance = Math.abs(i - waveCenter)
                if (distance > waveRadius) return baseWeight
                const t = 1 - distance / waveRadius
                const eased = 1 - Math.pow(1 - t, 3) // cubic ease-out
                return Math.round(baseWeight + (hoverWeight - baseWeight) * eased)
            })

            targetWeightsRef.current = targets
            startLerp()
            mobileAnimRef.current = requestAnimationFrame(wave)
        }

        mobileAnimRef.current = requestAnimationFrame(wave)

        return () => {
            if (mobileAnimRef.current) cancelAnimationFrame(mobileAnimRef.current)
        }
    }, [text, baseWeight, hoverWeight, radius, startLerp])

    const handleMouseMove = useCallback(
        (e: React.MouseEvent) => {
            if (isMobileRef.current) return
            isHoveringRef.current = true
            if (!containerRef.current) return

            const mouseX = e.clientX

            // figure out how close the mouse is to each character and set weights accordingly
            const newTargets = text.split('').map((_, i) => {
                const charEl = charRefs.current[i]
                if (!charEl) return baseWeight

                const rect = charEl.getBoundingClientRect()
                const charCenterX = rect.left + rect.width / 2
                const avgCharWidth = rect.width || 12
                const distance = Math.abs(mouseX - charCenterX) / avgCharWidth

                if (distance > radius) return baseWeight

                const t = 1 - distance / radius
                const eased = 1 - Math.pow(1 - t, 3)
                return Math.round(baseWeight + (hoverWeight - baseWeight) * eased)
            })

            targetWeightsRef.current = newTargets
            startLerp()
        },
        [text, baseWeight, hoverWeight, radius, startLerp]
    )

    const handleMouseLeave = useCallback(() => {
        if (isMobileRef.current) return
        isHoveringRef.current = false
        targetWeightsRef.current = new Array(text.length).fill(baseWeight)
        startLerp()
    }, [text, baseWeight, startLerp])

    useEffect(() => {
        return () => {
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
            if (mobileAnimRef.current) cancelAnimationFrame(mobileAnimRef.current)
        }
    }, [])

    // group chars into words so they wrap together at line breaks
    const words = text.split(' ')
    let charIndex = 0

    return (
        <span
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`inline cursor-default ${className}`}
            style={{ wordBreak: 'keep-all', overflowWrap: 'break-word' }}
            aria-label={text}
        >
            {words.map((word, wi) => {
                const startIdx = charIndex
                charIndex += word.length + 1

                return (
                    <span key={wi} style={{ whiteSpace: 'nowrap' }}>
                        {word.split('').map((char, ci) => {
                            const i = startIdx + ci
                            return (
                                <span
                                    key={i}
                                    ref={(el) => { charRefs.current[i] = el }}
                                    style={{
                                        fontWeight: charWeights[i],
                                        display: 'inline-block',
                                    }}
                                >
                                    {char}
                                </span>
                            )
                        })}
                        {wi < words.length - 1 && (
                            <span
                                ref={(el) => { charRefs.current[startIdx + word.length] = el }}
                                style={{
                                    fontWeight: charWeights[startIdx + word.length],
                                    display: 'inline-block',
                                    width: '0.3em',
                                }}
                            >
                                {'\u00A0'}
                            </span>
                        )}
                    </span>
                )
            })}
        </span>
    )
}

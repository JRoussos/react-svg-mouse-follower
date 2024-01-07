import React, { useRef, useLayoutEffect, useCallback, useMemo } from 'react';
import { gsap } from 'gsap';

/**
 * Creates an SVG rect element that follows your mouse.
 * 
 * @param disable       Whether or not the scroll effect will be enabled.
 * @param trailLength   How much the circle would extends
 * @param radius        The radius of the circle 
 */
const MouseFollower = ({ disable=false, trailLength=40, radius=60 }) => {
    const {current: mousePreviousPosition} = useRef({x: 0, y: 0})
    const {current: mouseCurrentPosition } = useRef({x: 0, y: 0})

    const {current: quickSet} = useRef({x: null, y: null, rotate: null, scaleX: null, scaleY: null})
    
    const isMouseOffScreen = useRef(true)
    const rect = useMemo(() => ({ coords: 110 - radius/2, corner: radius/2 }), [radius])
    
    const render = useCallback(() => {
        const getRotation = (x, y) => Math.atan2(y, x) * 180 / Math.PI // return the angle converted in degrees from radians
        const getDistance = (x, y) => Math.min(Math.sqrt(x*x + y*y), trailLength) // return the distance between the x and y value of the previous position 

        const rotation = getRotation(mousePreviousPosition.x, mousePreviousPosition.y)
        const distance = getDistance(mousePreviousPosition.x, mousePreviousPosition.y)

        quickSet.x(mouseCurrentPosition.x)
        quickSet.y(mouseCurrentPosition.y)

        quickSet.width(radius + distance)
        quickSet.rotate(rotation)
    }, [radius, trailLength])

    const handleMouseLeave = event => {
        event.stopPropagation()

        isMouseOffScreen.current = true
        gsap.to('#cursor', { id: 'hideCursor', duration: 0.5, delay: 1, opacity: 0 })
    }

    const handleMouseMove = ({ clientX, clientY }) => {
        if( isMouseOffScreen.current ) {
            mouseCurrentPosition.x = clientX
            mouseCurrentPosition.y = clientY
            
            isMouseOffScreen.current = false 
            
            gsap.getById('hideCursor')?.kill()
            gsap.to('#cursor', { duration: 0.5, opacity: 1 })
            return
        }

        gsap.to(mouseCurrentPosition, { duration: 1.2, x: clientX, y: clientY, ease: 'expo.out', onUpdate: () => {
            mousePreviousPosition.x = clientX - mouseCurrentPosition.x // distance from the actual x position to the current position one
            mousePreviousPosition.y = clientY - mouseCurrentPosition.y // distance from the actual y position to the current position one
        }})
    }

    useLayoutEffect(() => {
        if (disable) {
            isMouseOffScreen.current = true
            return gsap.ticker.remove(render)
        }

        quickSet.x = gsap.quickSetter('#cursor', 'x', 'px')
        quickSet.y = gsap.quickSetter('#cursor', 'y', 'px')

        quickSet.rotate = gsap.quickSetter('#cursor', 'rotate', 'deg')
        quickSet.width  = gsap.quickSetter('#rect', 'width')

        gsap.ticker.add(render)
        
        document.body.addEventListener('mousemove', handleMouseMove)
        document.body.addEventListener('mouseleave', handleMouseLeave)

        return () => {
            document.body.removeEventListener('mousemove', handleMouseMove)
            document.body.removeEventListener('mouseleave', handleMouseLeave)
        }

    }, [disable, render, handleMouseMove, handleMouseLeave])

    return disable ? null : (
        <svg id="cursor" width="220" height="220" viewBox="0 0 220 220" fill="none" style={{ position: 'fixed', top: '-109px', left: '-109px', opacity: 0, pointerEvents: 'none', willChange: 'transform', mixBlendMode: 'difference', zIndex: 200 }}>
            <rect id="rect" x={rect.coords} y={rect.coords} width={radius} height={radius} rx={rect.corner} stroke="white" strokeOpacity="0.8" strokeWidth="2px" fillOpacity="0" fill="white"/>
        </svg>
    )
}

export default MouseFollower
import React, { useRef, useLayoutEffect, useCallback } from 'react';
import { gsap } from 'gsap';

const cursor_styles = {
    position: 'fixed',
    top: '-109px',
    left: '-109px',
    opacity: 0,
    pointerEvents: 'none',
    willChange: 'transform',
    mixBlendMode: 'difference',
    zIndex: 200
}

const MorphingMouse = ({ style={}, disable=false }) => {
    const {current: mousePreviousPosition} = useRef({x: 0, y: 0})
    const {current: mouseCurrentPosition}  = useRef({x: 0, y: 0})

    const {current: isMouseOffScreen} = useRef(true)

    const {current: quickSet} = useRef({x: null, y: null, rotate: null, scaleX: null, scaleY: null})
    
    const onTick = useCallback(() => {
        const getRotation = (x, y) => Math.atan2(y, x) * 180 / Math.PI // return the angle converted in degrees from radians
        const getDistance = (x, y) => Math.min(Math.sqrt(x*x + y*y), 40) // return the distance between the x and y value of the previous position 
        // Math.hypot(x, y)

        const rotation = getRotation(mousePreviousPosition.x, mousePreviousPosition.y)
        const distance = getDistance(mousePreviousPosition.x, mousePreviousPosition.y)

        quickSet.x(mouseCurrentPosition.x)
        quickSet.y(mouseCurrentPosition.y)

        quickSet.width(60 + distance)
        quickSet.rotate(rotation)
    }, [])

    const handleMouseLeave = event => {
        event.stopPropagation()

        isMouseOffScreen = true
        gsap.to('#cursor', { id: 'hideCursor', duration: 0.5, delay: 1, opacity: 0 })
    }

    const handleMouseMove = ({ clientX, clientY }) => {
        if( isMouseOffScreen ) {
            mouseCurrentPosition.x = clientX
            mouseCurrentPosition.y = clientY
            
            isMouseOffScreen = false 
            
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
        quickSet.x      = gsap.quickSetter('#cursor', 'x', 'px')
        quickSet.y      = gsap.quickSetter('#cursor', 'y', 'px')

        quickSet.rotate = gsap.quickSetter('#cursor', 'rotate', 'deg')
        quickSet.width  = gsap.quickSetter('#rect', 'width')

        gsap.ticker.add(onTick)
        
        document.documentElement.addEventListener('mousemove', handleMouseMove)
        document.documentElement.addEventListener('mouseleave', handleMouseLeave)

        return () => {
            document.documentElement.removeEventListener('mousemove', handleMouseMove)
            document.documentElement.removeEventListener('mouseleave', handleMouseLeave)                
        }

    }, [onTick, handleMouseMove, handleMouseLeave])

    return disable ? null : (
        <svg id="cursor" width="220" height="220" viewBox="0 0 220 220" fill="none" style={{...cursor_styles, ...style}}>
            <rect id="rect" x="80" y="80" width="60" height="60" rx="30" stroke="white" strokeOpacity="0.8" strokeWidth="2px" fillOpacity="0" fill="white"/>
        </svg>
    )
}

export default MorphingMouse
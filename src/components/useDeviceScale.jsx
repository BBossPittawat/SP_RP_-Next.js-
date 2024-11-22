'use client'
import { useState, useEffect } from 'react'

export default function useDeviceScale() {

    const [zoomLevel, setZoomLevel] = useState(1)

    useEffect(() => {
        const devicePixelRatio = window.devicePixelRatio
        console.log(devicePixelRatio)
        if (devicePixelRatio === 1.25) {
            setZoomLevel(1)
            // console.log(setZoomLevel)
        } else if (devicePixelRatio === 1) {
            setZoomLevel(1.25)
            // console.log(setZoomLevel)
        }
    }, [])

    return zoomLevel
}

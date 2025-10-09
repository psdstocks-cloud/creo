import { useState, useEffect } from 'react'

export function useResponsive() {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  })

  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth
      const height = window.innerHeight
      
      setWindowSize({ width, height })
      setIsMobile(width < 768)
      setIsTablet(width >= 768 && width < 1024)
      setIsDesktop(width >= 1024)
    }

    // Call handler immediately to get initial size
    handleResize()

    // Add event listener
    window.addEventListener('resize', handleResize)
    
    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return {
    windowSize,
    isMobile,
    isTablet,
    isDesktop,
  }
}

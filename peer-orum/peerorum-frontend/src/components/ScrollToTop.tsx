import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/* React Router doesn't reset scroll position on navigation. A page route
   change should always start at the top; hash links to a landing-page
   section are handled separately by LandingPage's own scroll effect. */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])

  return null
}

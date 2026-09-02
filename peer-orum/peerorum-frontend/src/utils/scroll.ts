const HEADER_SCROLL_OFFSET = 64

export function scrollToSection(id: string) {
  const element = document.getElementById(id)
  if (!element) return
  const top = element.getBoundingClientRect().top + window.scrollY - HEADER_SCROLL_OFFSET
  window.scrollTo({ top, behavior: 'smooth' })
}

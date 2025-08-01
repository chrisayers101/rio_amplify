export class ViewportHandler {
  private static instance: ViewportHandler | null = null
  private resizeObserver: ResizeObserver | null = null
  private visualViewport: VisualViewport | null = null

  private constructor() {
    this.initializeViewportHandler()
  }

  static getInstance(): ViewportHandler {
    if (!ViewportHandler.instance) {
      ViewportHandler.instance = new ViewportHandler()
    }
    return ViewportHandler.instance
  }

  static isMobile(): boolean {
    return window.innerWidth <= 768
  }

  private initializeViewportHandler() {
    // Handle mobile viewport issues (iOS Safari, etc.)
    if ('visualViewport' in window) {
      this.visualViewport = window.visualViewport
      this.visualViewport?.addEventListener('resize', this.handleViewportResize)
    }

    // Handle resize events
    this.resizeObserver = new ResizeObserver(this.handleResize)
    this.resizeObserver.observe(document.body)

    // Initial setup
    this.updateViewportHeight()
  }

  private handleViewportResize = () => {
    this.updateViewportHeight()
  }

  private handleResize = () => {
    this.updateViewportHeight()
  }

  private updateViewportHeight() {
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
  }

  destroy() {
    if (this.visualViewport) {
      this.visualViewport.removeEventListener('resize', this.handleViewportResize)
    }

    if (this.resizeObserver) {
      this.resizeObserver.disconnect()
    }

    ViewportHandler.instance = null
  }
}

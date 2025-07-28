import { DEFAULT_SPRING_ANIMATION } from './stick-to-bottom.constants'

export interface StickToBottomContextType {
  contentRef: React.RefObject<HTMLElement | null> & React.RefCallback<HTMLElement>
  scrollRef: React.RefObject<HTMLElement | null> & React.RefCallback<HTMLElement>
  scrollToBottom: ScrollToBottom
  stopScroll: StopScroll
  isAtBottom: boolean
  escapedFromLock: boolean
  get targetScrollTop(): GetTargetScrollTop | null
  set targetScrollTop(targetScrollTop: GetTargetScrollTop | null)
  state: StickToBottomState
}

export interface StickToBottomState {
  scrollTop: number
  lastScrollTop?: number
  ignoreScrollToTop?: number
  targetScrollTop: number
  calculatedTargetScrollTop: number
  scrollDifference: number
  resizeDifference: number

  animation?: {
    behavior: 'instant' | Required<SpringAnimation>
    ignoreEscapes: boolean
    promise: Promise<boolean>
  }
  lastTick?: number
  velocity: number
  accumulated: number

  escapedFromLock: boolean
  isAtBottom: boolean
  isNearBottom: boolean

  resizeObserver?: ResizeObserver
}

export interface SpringAnimation extends Partial<typeof DEFAULT_SPRING_ANIMATION> {}

export type Animation = ScrollBehavior | SpringAnimation

export interface ScrollElements {
  scrollElement: HTMLElement
  contentElement: HTMLElement
}

export type GetTargetScrollTop = (targetScrollTop: number, context: ScrollElements) => number

export interface StickToBottomOptions extends SpringAnimation {
  resize?: Animation
  initial?: Animation | boolean
  targetScrollTop?: GetTargetScrollTop
}

export type ScrollToBottomOptions =
  | ScrollBehavior
  | {
      animation?: Animation

      /**
       * Whether to wait for any existing scrolls to finish before
       * performing this one. Or if a millisecond is passed,
       * it will wait for that duration before performing the scroll.
       *
       * @default false
       */
      wait?: boolean | number

      /**
       * Whether to prevent the user from escaping the scroll,
       * by scrolling up with their mouse.
       */
      ignoreEscapes?: boolean

      /**
       * Only scroll to the bottom if we're already at the bottom.
       *
       * @default false
       */
      preserveScrollPosition?: boolean

      /**
       * The extra duration in ms that this scroll event should persist for.
       * (in addition to the time that it takes to get to the bottom)
       *
       * Not to be confused with the duration of the animation -
       * for that you should adjust the animation option.
       *
       * @default 0
       */
      duration?: number | Promise<void>
    }

export type ScrollToBottom = (scrollOptions?: ScrollToBottomOptions) => Promise<boolean> | boolean
export type StopScroll = () => void

export interface StickToBottomInstance {
  contentRef: React.RefObject<HTMLElement | null> & React.RefCallback<HTMLElement>
  scrollRef: React.RefObject<HTMLElement | null> & React.RefCallback<HTMLElement>
  scrollToBottom: ScrollToBottom
  stopScroll: StopScroll
  isAtBottom: boolean
  isNearBottom: boolean
  escapedFromLock: boolean
  state: StickToBottomState
}

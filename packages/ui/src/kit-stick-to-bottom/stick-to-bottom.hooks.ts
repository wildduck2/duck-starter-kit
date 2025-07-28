import React from 'react'
import {
  DEFAULT_SPRING_ANIMATION,
  RETAIN_ANIMATION_DURATION_MS,
  SIXTY_FPS_INTERVAL_MS,
  STICK_TO_BOTTOM_OFFSET_PX,
} from './stick-to-bottom.constants'
import {
  Animation,
  ScrollToBottom,
  SpringAnimation,
  StickToBottomInstance,
  StickToBottomOptions,
  StickToBottomState,
} from './stick-to-bottom.types'

let mouseDown = false

globalThis.document?.addEventListener('mousedown', () => {
  mouseDown = true
})

globalThis.document?.addEventListener('mouseup', () => {
  mouseDown = false
})

globalThis.document?.addEventListener('click', () => {
  mouseDown = false
})

export const useStickToBottom = (options: StickToBottomOptions = {}): StickToBottomInstance => {
  const [escapedFromLock, updateEscapedFromLock] = React.useState(false)
  const [isAtBottom, updateIsAtBottom] = React.useState(options.initial !== false)
  const [isNearBottom, setIsNearBottom] = React.useState(false)

  const optionsRef = React.useRef<StickToBottomOptions>(null!)
  optionsRef.current = options

  const isSelecting = React.useCallback(() => {
    if (!mouseDown) {
      return false
    }

    const selection = window.getSelection()
    if (!selection || !selection.rangeCount) {
      return false
    }

    const range = selection.getRangeAt(0)
    return (
      range.commonAncestorContainer.contains(scrollRef.current) ||
      scrollRef.current?.contains(range.commonAncestorContainer)
    )
  }, [])

  const setIsAtBottom = React.useCallback((isAtBottom: boolean) => {
    state.isAtBottom = isAtBottom
    updateIsAtBottom(isAtBottom)
  }, [])

  const setEscapedFromLock = React.useCallback((escapedFromLock: boolean) => {
    state.escapedFromLock = escapedFromLock
    updateEscapedFromLock(escapedFromLock)
  }, [])

  const state = React.useMemo<StickToBottomState>(() => {
    let lastCalculation: { targetScrollTop: number; calculatedScrollTop: number } | undefined

    return {
      escapedFromLock,
      isAtBottom,
      resizeDifference: 0,
      accumulated: 0,
      velocity: 0,
      listeners: new Set(),

      get scrollTop() {
        return scrollRef.current?.scrollTop ?? 0
      },
      set scrollTop(scrollTop: number) {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollTop
          state.ignoreScrollToTop = scrollRef.current.scrollTop
        }
      },

      get targetScrollTop() {
        if (!scrollRef.current || !contentRef.current) {
          return 0
        }

        return scrollRef.current.scrollHeight - 1 - scrollRef.current.clientHeight
      },
      get calculatedTargetScrollTop() {
        if (!scrollRef.current || !contentRef.current) {
          return 0
        }

        const { targetScrollTop } = this

        if (!options.targetScrollTop) {
          return targetScrollTop
        }

        if (lastCalculation?.targetScrollTop === targetScrollTop) {
          return lastCalculation.calculatedScrollTop
        }

        const calculatedScrollTop = Math.max(
          Math.min(
            options.targetScrollTop(targetScrollTop, {
              scrollElement: scrollRef.current,
              contentElement: contentRef.current,
            }),
            targetScrollTop,
          ),
          0,
        )

        lastCalculation = { targetScrollTop, calculatedScrollTop }

        requestAnimationFrame(() => {
          lastCalculation = undefined
        })

        return calculatedScrollTop
      },

      get scrollDifference() {
        return this.calculatedTargetScrollTop - this.scrollTop
      },

      get isNearBottom() {
        return this.scrollDifference <= STICK_TO_BOTTOM_OFFSET_PX
      },
    }
  }, [])

  const scrollToBottom = React.useCallback<ScrollToBottom>(
    (scrollOptions = {}) => {
      if (typeof scrollOptions === 'string') {
        scrollOptions = { animation: scrollOptions }
      }

      if (!scrollOptions.preserveScrollPosition) {
        setIsAtBottom(true)
      }

      const waitElapsed = Date.now() + (Number(scrollOptions.wait) || 0)
      const behavior = mergeAnimations(optionsRef.current, scrollOptions.animation)
      const { ignoreEscapes = false } = scrollOptions

      let durationElapsed: number
      let startTarget = state.calculatedTargetScrollTop

      if (scrollOptions.duration instanceof Promise) {
        scrollOptions.duration.finally(() => {
          durationElapsed = Date.now()
        })
      } else {
        durationElapsed = waitElapsed + (scrollOptions.duration ?? 0)
      }

      const next = async (): Promise<boolean> => {
        const promise = new Promise(requestAnimationFrame).then(() => {
          if (!state.isAtBottom) {
            state.animation = undefined

            return false
          }

          const { scrollTop } = state
          const tick = performance.now()
          const tickDelta = (tick - (state.lastTick ?? tick)) / SIXTY_FPS_INTERVAL_MS
          state.animation ||= { behavior, promise, ignoreEscapes }

          if (state.animation.behavior === behavior) {
            state.lastTick = tick
          }

          if (isSelecting()) {
            return next()
          }

          if (waitElapsed > Date.now()) {
            return next()
          }

          if (scrollTop < Math.min(startTarget, state.calculatedTargetScrollTop)) {
            if (state.animation?.behavior === behavior) {
              if (behavior === 'instant') {
                state.scrollTop = state.calculatedTargetScrollTop
                return next()
              }

              state.velocity =
                (behavior.damping * state.velocity + behavior.stiffness * state.scrollDifference) / behavior.mass
              state.accumulated += state.velocity * tickDelta
              state.scrollTop += state.accumulated

              if (state.scrollTop !== scrollTop) {
                state.accumulated = 0
              }
            }

            return next()
          }

          if (durationElapsed > Date.now()) {
            startTarget = state.calculatedTargetScrollTop

            return next()
          }

          state.animation = undefined

          /**
           * If we're still below the target, then queue
           * up another scroll to the bottom with the last
           * requested animatino.
           */
          if (state.scrollTop < state.calculatedTargetScrollTop) {
            return scrollToBottom({
              animation: mergeAnimations(optionsRef.current, optionsRef.current.resize),
              ignoreEscapes,
              duration: Math.max(0, durationElapsed - Date.now()) || undefined,
            })
          }

          return state.isAtBottom
        })

        return promise.then((isAtBottom) => {
          requestAnimationFrame(() => {
            if (!state.animation) {
              state.lastTick = undefined
              state.velocity = 0
            }
          })

          return isAtBottom
        })
      }

      if (scrollOptions.wait !== true) {
        state.animation = undefined
      }

      if (state.animation?.behavior === behavior) {
        return state.animation.promise
      }

      return next()
    },
    [setIsAtBottom, isSelecting, state],
  )

  const stopScroll = React.useCallback((): void => {
    setEscapedFromLock(true)
    setIsAtBottom(false)
  }, [setEscapedFromLock, setIsAtBottom])

  const handleScroll = React.useCallback(
    ({ target }: Event) => {
      if (target !== scrollRef.current) {
        return
      }

      const { scrollTop, ignoreScrollToTop } = state
      let { lastScrollTop = scrollTop } = state

      state.lastScrollTop = scrollTop
      state.ignoreScrollToTop = undefined

      if (ignoreScrollToTop && ignoreScrollToTop > scrollTop) {
        /**
         * When the user scrolls up while the animation plays, the `scrollTop` may
         * not come in separate events; if this happens, to make sure `isScrollingUp`
         * is correct, set the lastScrollTop to the ignored event.
         */
        lastScrollTop = ignoreScrollToTop
      }

      setIsNearBottom(state.isNearBottom)

      /**
       * Scroll events may come before a ResizeObserver event,
       * so in order to ignore resize events correctly we use a
       * timeout.
       *
       * @see https://github.com/WICG/resize-observer/issues/25#issuecomment-248757228
       */
      setTimeout(() => {
        /**
         * When theres a resize difference ignore the resize event.
         */
        if (state.resizeDifference || scrollTop === ignoreScrollToTop) {
          return
        }

        if (isSelecting()) {
          setEscapedFromLock(true)
          setIsAtBottom(false)
          return
        }

        const isScrollingDown = scrollTop > lastScrollTop
        const isScrollingUp = scrollTop < lastScrollTop

        if (state.animation?.ignoreEscapes) {
          state.scrollTop = lastScrollTop
          return
        }

        if (isScrollingUp) {
          setEscapedFromLock(true)
          setIsAtBottom(false)
        }

        if (isScrollingDown) {
          setEscapedFromLock(false)
        }

        if (!state.escapedFromLock && state.isNearBottom) {
          setIsAtBottom(true)
        }
      }, 1)
    },
    [setEscapedFromLock, setIsAtBottom, isSelecting, state],
  )

  const handleWheel = React.useCallback(
    ({ target, deltaY }: WheelEvent) => {
      let element = target as HTMLElement

      while (!['scroll', 'auto'].includes(getComputedStyle(element).overflow)) {
        if (!element.parentElement) {
          return
        }

        element = element.parentElement
      }

      /**
       * The browser may cancel the scrolling from the mouse wheel
       * if we update it from the animation in meantime.
       * To prevent this, always escape when the wheel is scrolled up.
       */
      if (
        element === scrollRef.current &&
        deltaY < 0 &&
        scrollRef.current.scrollHeight > scrollRef.current.clientHeight &&
        !state.animation?.ignoreEscapes
      ) {
        setEscapedFromLock(true)
        setIsAtBottom(false)
      }
    },
    [setEscapedFromLock, setIsAtBottom, state],
  )

  const scrollRef = useRefCallback((scroll) => {
    scrollRef.current?.removeEventListener('scroll', handleScroll)
    scrollRef.current?.removeEventListener('wheel', handleWheel)
    scroll?.addEventListener('scroll', handleScroll, { passive: true })
    scroll?.addEventListener('wheel', handleWheel, { passive: true })
  }, [])

  const contentRef = useRefCallback((content) => {
    state.resizeObserver?.disconnect()

    if (!content) {
      return
    }

    let previousHeight: number | undefined

    state.resizeObserver = new ResizeObserver(([entry]) => {
      const { height } = entry!.contentRect
      const difference = height - (previousHeight ?? height)

      state.resizeDifference = difference

      /**
       * Sometimes the browser can overscroll past the target,
       * so check for this and adjust appropriately.
       */
      if (state.scrollTop > state.targetScrollTop) {
        state.scrollTop = state.targetScrollTop
      }

      setIsNearBottom(state.isNearBottom)

      if (difference >= 0) {
        /**
         * If it's a positive resize, scroll to the bottom when
         * we're already at the bottom.
         */
        const animation = mergeAnimations(
          optionsRef.current,
          previousHeight ? optionsRef.current.resize : optionsRef.current.initial,
        )

        scrollToBottom({
          animation,
          wait: true,
          preserveScrollPosition: true,
          duration: animation === 'instant' ? undefined : RETAIN_ANIMATION_DURATION_MS,
        })
      } else {
        /**
         * Else if it's a negative resize, check if we're near the bottom
         * if we are want to un-escape from the lock, because the resize
         * could have caused the container to be at the bottom.
         */
        if (state.isNearBottom) {
          setEscapedFromLock(false)
          setIsAtBottom(true)
        }
      }

      previousHeight = height

      /**
       * Reset the resize difference after the scroll event
       * has fired. Requires a rAF to wait for the scroll event,
       * and a setTimeout to wait for the other timeout we have in
       * resizeObserver in case the scroll event happens after the
       * resize event.
       */
      requestAnimationFrame(() => {
        setTimeout(() => {
          if (state.resizeDifference === difference) {
            state.resizeDifference = 0
          }
        }, 1)
      })
    })

    state.resizeObserver?.observe(content)
  }, [])

  return {
    contentRef,
    scrollRef,
    scrollToBottom,
    stopScroll,
    isAtBottom: isAtBottom || isNearBottom,
    isNearBottom,
    escapedFromLock,
    state,
  }
}

function useRefCallback<T extends (ref: HTMLElement | null) => any>(callback: T, deps: React.DependencyList) {
  const result = React.useCallback((ref: HTMLElement | null) => {
    result.current = ref
    return callback(ref)
  }, deps) as any as React.RefObject<HTMLElement | null> & React.RefCallback<HTMLElement>

  return result
}

const animationCache = new Map<string, Readonly<Required<SpringAnimation>>>()

function mergeAnimations(...animations: (Animation | boolean | undefined)[]) {
  const result = { ...DEFAULT_SPRING_ANIMATION }
  let instant = false

  for (const animation of animations) {
    if (animation === 'instant') {
      instant = true
      continue
    }

    if (typeof animation !== 'object') {
      continue
    }

    instant = false

    result.damping = animation.damping ?? result.damping
    result.stiffness = animation.stiffness ?? result.stiffness
    result.mass = animation.mass ?? result.mass
  }

  const key = JSON.stringify(result)

  if (!animationCache.has(key)) {
    animationCache.set(key, Object.freeze(result))
  }

  return instant ? 'instant' : animationCache.get(key)!
}

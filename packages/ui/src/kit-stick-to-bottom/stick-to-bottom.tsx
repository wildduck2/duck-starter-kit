import * as React from 'react'
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react'
import { useStickToBottom } from './stick-to-bottom.hooks'
import {
  GetTargetScrollTop,
  StickToBottomContextType,
  StickToBottomInstance,
  StickToBottomOptions,
} from './stick-to-bottom.types'

const StickToBottomContext = createContext<StickToBottomContextType | null>(null)

export interface StickToBottomProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    StickToBottomOptions {
  contextRef?: React.Ref<StickToBottomContextType>
  instance?: StickToBottomInstance
  children: ((context: StickToBottomContextType) => ReactNode) | ReactNode
}

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

export function StickToBottom({
  instance,
  children,
  resize,
  initial,
  mass,
  damping,
  stiffness,
  targetScrollTop: currentTargetScrollTop,
  contextRef,
  ...props
}: StickToBottomProps): ReactNode {
  const customTargetScrollTop = useRef<GetTargetScrollTop | null>(null)

  const targetScrollTop = React.useCallback<GetTargetScrollTop>(
    (target, elements) => {
      const get = context?.targetScrollTop ?? currentTargetScrollTop
      return get?.(target, elements) ?? target
    },
    [currentTargetScrollTop],
  )

  const defaultInstance = useStickToBottom({
    mass,
    damping,
    stiffness,
    resize,
    initial,
    targetScrollTop,
  })

  const { scrollRef, contentRef, scrollToBottom, stopScroll, isAtBottom, escapedFromLock, state } =
    instance ?? defaultInstance

  const context = useMemo<StickToBottomContextType>(
    () => ({
      scrollToBottom,
      stopScroll,
      scrollRef,
      isAtBottom,
      escapedFromLock,
      contentRef,
      state,
      get targetScrollTop() {
        return customTargetScrollTop.current
      },
      set targetScrollTop(targetScrollTop: GetTargetScrollTop | null) {
        customTargetScrollTop.current = targetScrollTop
      },
    }),
    [scrollToBottom, isAtBottom, contentRef, scrollRef, stopScroll, escapedFromLock, state],
  )

  useImperativeHandle(contextRef, () => context, [context])

  useIsomorphicLayoutEffect(() => {
    if (!scrollRef.current) {
      return
    }

    if (getComputedStyle(scrollRef.current).overflow === 'visible') {
      scrollRef.current.style.overflow = 'auto'
    }
  }, [])

  return (
    <StickToBottomContext.Provider value={context}>
      <div {...props}>{typeof children === 'function' ? children(context) : children}</div>
    </StickToBottomContext.Provider>
  )
}

export namespace StickToBottom {
  export interface ContentProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
    children: ((context: StickToBottomContextType) => ReactNode) | ReactNode
  }

  export function Content({ children, ...props }: ContentProps): ReactNode {
    const context = useStickToBottomContext()

    return (
      <div
        ref={context.scrollRef}
        style={{
          height: '100%',
          width: '100%',
        }}>
        <div {...props} ref={context.contentRef}>
          {typeof children === 'function' ? children(context) : children}
        </div>
      </div>
    )
  }
}

/**
 * Use this hook inside a <StickToBottom> component to gain access to whether the component is at the bottom of the scrollable area.
 */
export function useStickToBottomContext(): StickToBottomContextType {
  const context = useContext(StickToBottomContext)
  if (!context) {
    throw new Error('use-stick-to-bottom component context must be used within a StickToBottom component')
  }

  return context
}

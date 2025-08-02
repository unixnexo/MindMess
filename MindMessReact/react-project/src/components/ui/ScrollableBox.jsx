import * as ScrollArea from '@radix-ui/react-scroll-area'

export default function ScrollableBox({ children }) {
  return (
    <ScrollArea.Root type="scroll" className="w-full h-[calc(100dvh-43px)]">

      <ScrollArea.Viewport className="w-full h-full rounded">
        <div className="space-y-4">
          {children}
        </div>
      </ScrollArea.Viewport>

      <ScrollArea.Scrollbar
        orientation="vertical"
        className="flex touch-none select-none p-1 radix-scrollbar"
>
        <ScrollArea.Thumb className="relative flex-1 p-0.5 rounded-full bg-black/40 hover:bg-black/50" />
      </ScrollArea.Scrollbar>

    </ScrollArea.Root>
  )
}

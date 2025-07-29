import * as Menubar from '@radix-ui/react-menubar'
import { useState } from 'react'

export default function Menubar({ trigger, children }) {
  const [open, setOpen] = useState(false)

  return (
    <Menubar.Root>
      <Menubar.Menu>
        <Menubar.Trigger asChild onClick={() => setOpen((o) => !o)}>
          {trigger}
        </Menubar.Trigger>

        {open && (
          <Menubar.Portal>
            <Menubar.Content
              sideOffset={5}
              align="start"
              className="min-w-[150px] rounded-md border border-zinc-200 bg-white shadow-md p-1"
              onEscapeKeyDown={() => setOpen(false)}
              onPointerDownOutside={() => setOpen(false)}
            >
              {children}
            </Menubar.Content>
          </Menubar.Portal>
        )}
      </Menubar.Menu>
    </Menubar.Root>
  )
}

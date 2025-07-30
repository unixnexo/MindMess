import * as Menubar from '@radix-ui/react-menubar'
import { useState, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export default function CustomMenubar({ trigger, children }) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef(null)

  return (
    <Menubar.Root>
      <Menubar.Menu>
        <Menubar.Trigger
          asChild
          ref={triggerRef}
          onClick={() => setOpen(prev => !prev)}
        >
          {trigger}
        </Menubar.Trigger>

        <AnimatePresence>
          {open && (
            <Menubar.Portal forceMount>
              <Menubar.Content
                sideOffset={0}
                align="end"
                className="w-[160px] rounded-md bg-white shadow-lg overflow-hidden"
                onEscapeKeyDown={() => setOpen(false)}
                onPointerDownOutside={(e) => {
                  if (!triggerRef.current?.contains(e.target)) {
                    setOpen(false)
                  }
                }}
                asChild
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -5 }}
                  transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                >
                  {children}
                </motion.div>
              </Menubar.Content>
            </Menubar.Portal>
          )}
        </AnimatePresence>
      </Menubar.Menu>
    </Menubar.Root>
  )
}

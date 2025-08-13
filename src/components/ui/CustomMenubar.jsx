  // import * as Menubar from '@radix-ui/react-menubar'
  // import { useState, useRef } from 'react'
  // import { AnimatePresence, motion } from 'framer-motion'

  // export default function CustomMenubar({ trigger, children }) {
  //   const [open, setOpen] = useState(false)
  //   const triggerRef = useRef(null)

  //   return (
  //     <Menubar.Root>
  //       <Menubar.Menu>
  //         <Menubar.Trigger
  //           asChild
  //           ref={triggerRef}
  //           onClick={() => setOpen(prev => !prev)}
  //         >
  //           {trigger}
  //         </Menubar.Trigger>

  //         <AnimatePresence>
  //           {open && (
  //             <Menubar.Portal forceMount>
  //               <Menubar.Content
  //                 sideOffset={0}
  //                 align="end"
  //                 className="w-[160px] rounded-md bg-white shadow-lg overflow-hidden"
  //                 onEscapeKeyDown={() => setOpen(false)}
  //                 onPointerDownOutside={(e) => {
  //                   if (!triggerRef.current?.contains(e.target)) {
  //                     setOpen(false)
  //                   }
  //                 }}
  //                 asChild
  //               >
  //                 <motion.div
  //                   initial={{ opacity: 0, scale: 0.95, y: -5 }}
  //                   animate={{ opacity: 1, scale: 1, y: 0 }}
  //                   exit={{ opacity: 0, scale: 0.95, y: -5 }}
  //                   transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
  //                 >
  //                   {children}
  //                 </motion.div>
  //               </Menubar.Content>
  //             </Menubar.Portal>
  //           )}
  //         </AnimatePresence>
  //       </Menubar.Menu>
  //     </Menubar.Root>
  //   )
  // }


import * as Menubar from '@radix-ui/react-menubar'
import { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

// Global state to track open menus
let openMenus = new Set()
let closeOtherMenus = () => {}

export default function CustomMenubar({ trigger, children }) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef(null)
  const menuId = useRef(Math.random().toString(36))

  useEffect(() => {
    // Register this menu's close function
    const currentMenuId = menuId.current
    
    closeOtherMenus = (exceptId) => {
      openMenus.forEach(id => {
        if (id !== exceptId) {
          // Find and close other menus
          const event = new CustomEvent('closeMenu', { detail: { id } })
          document.dispatchEvent(event)
        }
      })
    }

    const handleCloseMenu = (e) => {
      if (e.detail.id === currentMenuId) {
        setOpen(false)
      }
    }

    const handleScroll = () => setOpen(false)

    document.addEventListener('closeMenu', handleCloseMenu)
    document.addEventListener('scroll', handleScroll, true) // true for capture phase
    
    return () => {
      document.removeEventListener('closeMenu', handleCloseMenu)
      document.removeEventListener('scroll', handleScroll, true)
      openMenus.delete(currentMenuId)
    }
  }, [])

  useEffect(() => {
    if (open) {
      openMenus.add(menuId.current)
      closeOtherMenus(menuId.current)
    } else {
      openMenus.delete(menuId.current)
    }
  }, [open])

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
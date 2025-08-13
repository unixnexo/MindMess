import { Dialog } from "radix-ui";
import Spinner from "../ui/Spinner";

const Popup = ({ 
  trigger, 
  title, 
  description, 
  children,
  cancelText = "Cancel",
  confirmText = "OK",
  onCancel,
  onConfirm,
  confirmStyle = "primary",
  loading = false,
  variant = "confirm", // "confirm" | "alert"
  open,
  onOpenChange,
}) => (
  <Dialog.Root open={open} onOpenChange={onOpenChange}>
    {trigger && (
      <Dialog.Trigger asChild>
        {trigger}
      </Dialog.Trigger>
    )}
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      <Dialog.Content className="fixed left-1/2 top-1/2 w-[90vw] max-w-xs -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl overflow-hidden shadow-xl focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
        
        <div className="px-6 pt-6 pb-4 text-center">
          {title && (
            <Dialog.Title className="text-lg font-medium text-black mb-2">
              {title}
            </Dialog.Title>
          )}
          {description && (
            <Dialog.Description className="text-sm text-gray-600 leading-5 mb-4">
              {description}
            </Dialog.Description>
          )}
          {children}
        </div>
        
        <div className="border-t border-gray-300">
          <div className="flex">
            {variant === "alert" ? (
              <Dialog.Close asChild>
                <button 
                  className="w-full py-3 outline-none text-blue-500 font-semibold hover:bg-gray-50 active:bg-gray-100 transition-colors"
                  onClick={onConfirm}
                >
                  {confirmText}
                </button>
              </Dialog.Close>
            ) : (
              <>
                <Dialog.Close asChild>
                  <button 
                    className="flex-1 outline-none py-2 text-blue-500 font-medium border-r border-gray-300 hover:bg-gray-50 active:bg-gray-100 transition-colors max-h-[40px]"
                    onClick={onCancel}
                  >
                    {cancelText}
                  </button>
                </Dialog.Close>
                <button 
                  className={`flex-1 py-2 font-semibold hover:bg-gray-50 active:bg-gray-100 transition-colors max-h-[40px] outline-none ${
                    confirmStyle === "destructive" 
                      ? "text-red" 
                      : "text-blue-500"
                  }`}
                  onClick={onConfirm}
                  disabled={loading}
                >
                  {loading ? <Spinner /> : confirmText}
                </button>
              </>
            )}
          </div>
        </div>
        
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);

export default Popup;
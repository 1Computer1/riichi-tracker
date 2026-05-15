import { Dialog, DialogPanel } from "@headlessui/react";
import { type ReactNode, type RefObject } from "react";

import CircleButton from "../CircleButton";
import X from "../icons/heroicons/X";

export default function CustomDialog({
  onClose,
  initialFocus,
  title,
  children,
}: {
  onClose: () => void;
  initialFocus?: RefObject<HTMLElement | null>;
  title?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <Dialog open onClose={onClose} initialFocus={initialFocus}>
      <div className="fixed inset-0 z-20 bg-black/70" aria-hidden="true" />
      <div className="fixed inset-0 z-20 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <DialogPanel className="max-h-screen max-w-[100vw]">
            <div className="flex max-h-screen max-w-[100vw] flex-col px-4 py-8 text-black dark:text-white">
              <div className="flex w-full flex-row items-center justify-between rounded-t-xl bg-slate-400 p-2 dark:bg-gray-700">
                <div className="ml-1 text-xl font-bold lg:ml-2 lg:text-3xl">
                  {title}
                </div>
                <CircleButton onClick={onClose}>
                  <X />
                </CircleButton>
              </div>
              <div className="overflow-auto rounded-b-xl bg-slate-200 px-4 py-4 shadow lg:px-8 dark:bg-gray-900">
                {children}
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}

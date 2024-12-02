"use client";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { ReactElement } from "react";

function Modal({ children }: { children: ReactElement }) {
  const route = useRouter();
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) route.back();
      }}
    >
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
}

export default Modal;

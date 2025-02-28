"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface ModalContextType {
  showModal: (config: {
    title: ReactNode;
    body: ReactNode;
    footer?: ReactNode;
    modalClassName?: string;
    getter?: () => Promise<any>;
  }) => void;
  onClose: () => void;
  data: any | null;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [modalContent, setModalContent] = useState<{
    title?: ReactNode;
    body?: ReactNode;
    modalClassName?: string;
    footer?: ReactNode;
  } | null>(null);

  const [data, setData] = useState<any | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => setIsOpen(true);
  const onClose = () => {
    setIsOpen(false);
    setModalContent(null);
  };

  const showModal = async ({
    title,
    body,
    footer,
    modalClassName,
    getter,
  }: {
    title: ReactNode;
    body: ReactNode;
    footer?: ReactNode;
    modalClassName?: string;
    getter?: () => Promise<any>;
  }) => {
    setModalContent({ title, body, footer, modalClassName });

    if (getter) {
      try {
        const result = await getter();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
        setData(null);
      }
    } else {
      setData(null);
    }

    onOpen();
  };

  return (
    <ModalContext.Provider value={{ showModal, onClose, data }}>
      {children}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className={modalContent?.modalClassName || ""} aria-describedby="dialog-description">
          {modalContent && (
            <>
              {modalContent.title && (
                <DialogHeader>
                  <DialogTitle>{modalContent.title}</DialogTitle>
                  <DialogDescription id="dialog-description" className="sr-only">
                    {typeof modalContent.title === 'string' ? `Dialog for ${modalContent.title}` : 'Modal dialog'}
                  </DialogDescription>
                </DialogHeader>
              )}
              {!modalContent.title && (
                <DialogDescription id="dialog-description" className="sr-only">
                  Modal dialog
                </DialogDescription>
              )}
              {modalContent.body && (
                <div>{modalContent.body}</div>
              )}
              {modalContent.footer && (
                <DialogFooter>{modalContent.footer}</DialogFooter>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </ModalContext.Provider>
  );
};

// Hook to use modal context
export const useModalContext = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModalContext must be used within a ModalProvider");
  }
  return context;
};

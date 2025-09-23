import React, { ReactNode, createContext, useContext, useState, useCallback } from 'react';
import { ToastNotification, ToastType } from '../../components';

export interface ContextMessageProps {
  showError: (message: string) => void;
  showErrorWithLog: (message: string, error: any) => void;
  showSuccess: (message: string) => void;
  showInfo: (message: string) => void;
}

interface MessageItem {
  id: number;
  type: ToastType;
  message: string;
}

const ContextMessage = createContext<ContextMessageProps | undefined>(undefined);

export interface MessageProviderProps {
  children: ReactNode;
}

let idCounter = 0;

const ContextMessageProvider: React.FC<MessageProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<MessageItem[]>([]);

  const addMessage = useCallback((type: ToastType, message: string) => {
    const id = idCounter++;
    setMessages(prev => [...prev, { id, type, message }]);
    setTimeout(() => removeMessage(id), 5000);
  }, []);

  const removeMessage = useCallback((id: number) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  }, []);

  const showError = useCallback((message: string) => addMessage('error', message), [addMessage]);
  const showSuccess = useCallback((message: string) => addMessage('success', message), [addMessage]);
  const showInfo = useCallback((message: string) => addMessage('info', message), [addMessage]);
  const showErrorWithLog = useCallback((messageText: string, error: any) => {
    console.error(messageText, error);
    addMessage('error', `${messageText} Consulte o log para mais detalhes!`);
  }, [addMessage]);

  return (
    <ContextMessage.Provider value={{ showError, showErrorWithLog, showSuccess, showInfo }}>
      {children}
      {messages.map(msg => (
        <ToastNotification
          key={msg.id}
          type={msg.type}
          message={msg.message}
          onClose={() => removeMessage(msg.id)}
        />
      ))}
    </ContextMessage.Provider>
  );
};

export const useMessage = (): ContextMessageProps => {
  const context = useContext(ContextMessage);
  if (!context) throw new Error('useMessage must be used within a ContextMessageProvider');
  return context;
};

export default ContextMessageProvider;

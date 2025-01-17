import { Message } from "@/types/chat";

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  return (
    <div
      className={`${
        message.role === 'assistant' 
          ? 'bg-secondary/20 mr-4' 
          : 'bg-primary/10 ml-4'
      } rounded-lg p-3 text-right`}
    >
      <p className="text-sm whitespace-pre-line">
        {message.role === 'assistant' ? 'المساعد: ' : 'أنت: '}
        {message.content}
      </p>
    </div>
  );
};
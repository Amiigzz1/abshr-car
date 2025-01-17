import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ChatMessage } from "./chat/ChatMessage";
import { ChatSuggestions } from "./chat/ChatSuggestions";
import { ChatInput } from "./chat/ChatInput";
import { calculateEligibility } from "@/utils/eligibilityCalculator";
import { Message, UserData, dataFields } from "@/types/chat";
import { MinusCircle } from "lucide-react";
import { Button } from "./ui/button";

export const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [userData, setUserData] = useState<Partial<UserData>>({});
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    setIsOpen(true);
    setMessages([{
      role: 'assistant',
      content: 'مرحباً بك في أبشر كار! ' + dataFields[0].question
    }]);
  }, []);

  const validateInput = (input: string, fieldIndex: number) => {
    const field = dataFields[fieldIndex];
    
    if (field.key === 'phone' && field.validation) {
      if (!field.validation(input)) {
        return "الرجاء إدخال رقم جوال صحيح يبدأ بـ 05 ويتكون من 10 أرقام";
      }
    }
    
    if (field.key === 'salary' || field.key === 'obligations') {
      const value = parseFloat(input.replace(/[^0-9.]/g, ''));
      if (isNaN(value)) {
        return "الرجاء إدخال رقم صحيح";
      }
      if (field.key === 'salary' && value < 3000) {
        return "عذراً، الحد الأدنى للراتب هو 3000 ريال";
      }
      if (field.key === 'obligations' && value < 0) {
        return "لا يمكن أن تكون الالتزامات أقل من صفر";
      }
    }
    
    return null;
  };

  const reviewUserData = () => {
    let review = "مراجعة البيانات المدخلة:\n\n";
    Object.entries(userData).forEach(([key, value]) => {
      const field = dataFields.find(f => f.key === key as keyof UserData);
      if (field) {
        review += `${field.question} ${value}\n`;
      }
    });
    return review;
  };

  const processUserInput = (input: string) => {
    if (currentFieldIndex < dataFields.length) {
      const validationError = validateInput(input, currentFieldIndex);
      if (validationError) {
        return validationError;
      }

      const currentField = dataFields[currentFieldIndex];
      let value: any = input;
      
      if (currentField.key === 'salary' || currentField.key === 'obligations') {
        value = parseFloat(input.replace(/[^0-9.]/g, ''));
      }

      setUserData(prev => ({ ...prev, [currentField.key]: value }));
      
      if (currentFieldIndex === dataFields.length - 1) {
        const review = reviewUserData();
        const updatedUserData = { ...userData, [currentField.key]: value };
        
        if (typeof updatedUserData.salary === 'number' && typeof updatedUserData.obligations === 'number') {
          const { isEligible, availablePayment, details } = calculateEligibility(updatedUserData.salary, updatedUserData.obligations);
          return `${review}\n\n${
            isEligible
              ? `مبروك! أنت مؤهل للحصول على التمويل.\n\nتفاصيل الأهلية:\n` +
                `- الحد الأقصى للقسط الشهري: ${details.maxAllowedPayment} ريال\n` +
                `- الالتزامات الحالية: ${details.currentObligations} ريال\n` +
                `- المبلغ المتاح للقسط الشهري: ${details.remainingCapacity} ريال\n` +
                `- الحد الأدنى المطلوب للقسط: ${details.minRequiredPayment} ريال`
              : "عذراً، بناءً على المعلومات المقدمة، قد لا تكون مؤهلاً للتمويل في الوقت الحالي.\n\n" +
                `السبب: المبلغ المتاح للقسط (${availablePayment} ريال) أقل من الحد الأدنى المطلوب (${details.minRequiredPayment} ريال)`
          }`;
        }
      } else {
        setCurrentFieldIndex(prev => prev + 1);
        const nextField = dataFields[currentFieldIndex + 1];
        let response = nextField.question;
        
        if (nextField.suggestions) {
          response += "\nالاقتراحات المتاحة:";
        }
        
        return response;
      }
    }
    return "شكراً لك على المعلومات المقدمة. هل لديك أي استفسارات أخرى؟";
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
    sendMessage(suggestion);
  };

  const sendMessage = (customInput?: string) => {
    const messageToSend = customInput || inputMessage;
    if (!messageToSend.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: messageToSend
    };

    const aiResponse: Message = {
      role: 'assistant',
      content: processUserInput(messageToSend)
    };

    setMessages(prev => [...prev, userMessage, aiResponse]);
    setInputMessage('');
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="left" className={`w-[400px] sm:w-[540px] ${isMinimized ? 'h-20' : ''}`}>
        <SheetHeader className="flex flex-row items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMinimize}
            className="absolute left-4 top-4"
          >
            <MinusCircle className="h-6 w-6" />
          </Button>
          <SheetTitle className="text-right text-primary">مساعد أبشر كار الذكي</SheetTitle>
        </SheetHeader>
        
        {!isMinimized && (
          <>
            <ScrollArea className="h-[calc(100vh-200px)] mt-4">
              <div className="flex flex-col gap-4 p-4">
                {messages.map((message, index) => (
                  <ChatMessage key={index} message={message} />
                ))}
              </div>
            </ScrollArea>

            {currentFieldIndex < dataFields.length && dataFields[currentFieldIndex].suggestions && (
              <ChatSuggestions
                suggestions={dataFields[currentFieldIndex].suggestions || []}
                onSuggestionClick={handleSuggestionClick}
              />
            )}

            <ChatInput
              value={inputMessage}
              onChange={setInputMessage}
              onSend={() => sendMessage()}
            />
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};
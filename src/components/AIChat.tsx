import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  role: 'assistant' | 'user';
  content: string;
}

interface UserData {
  nationality: string;
  phone: string;
  city: string;
  salary: number;
  bank: string;
  obligations: number;
  workSector: string;
  employer: string;
  carType: string;
  modelAndColor: string;
}

export const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [userData, setUserData] = useState<Partial<UserData>>({});
  const { toast } = useToast();

  const calculateEligibility = (salary: number, obligations: number) => {
    const maxPayment = salary * 0.45;
    const availablePayment = maxPayment - (obligations || 0);
    return availablePayment >= 750;
  };

  const generateResponse = (userMessage: string): Message => {
    // Simple rule-based response generation
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('راتب')) {
      const salary = parseFloat(userMessage.replace(/[^0-9.]/g, ''));
      if (!isNaN(salary)) {
        setUserData(prev => ({ ...prev, salary }));
        return {
          role: 'assistant',
          content: 'شكراً على المعلومة. هل لديك أي التزامات شهرية؟'
        };
      }
    }
    
    if (lowerMessage.includes('التزام')) {
      const obligations = parseFloat(userMessage.replace(/[^0-9.]/g, ''));
      if (!isNaN(obligations)) {
        setUserData(prev => ({ ...prev, obligations }));
        const { salary = 0 } = userData;
        const isEligible = calculateEligibility(salary, obligations);
        
        return {
          role: 'assistant',
          content: isEligible 
            ? 'بناءً على المعلومات المقدمة، أنت مؤهل للحصول على التمويل! هل ترغب في معرفة المزيد عن خياراتنا التمويلية؟'
            : 'عذراً، بناءً على المعلومات المقدمة، قد لا تكون مؤهلاً للتمويل في الوقت الحالي. هل ترغب في مناقشة خيارات أخرى؟'
        };
      }
    }

    // Default responses based on missing information
    if (!userData.salary) {
      return {
        role: 'assistant',
        content: 'من فضلك، أخبرني عن راتبك الشهري؟'
      };
    }

    return {
      role: 'assistant',
      content: 'كيف يمكنني مساعدتك اليوم؟'
    };
  };

  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: inputMessage
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputMessage('');

    // Generate and add AI response
    const aiResponse = generateResponse(inputMessage);
    setMessages([...newMessages, aiResponse]);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg mt-10">
      <h2 className="text-2xl font-bold text-primary text-center mb-6">المساعد الذكي للتمويل</h2>
      
      <ScrollArea className="h-[400px] border rounded-md p-4 mb-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${
              message.role === 'assistant' 
                ? 'bg-primary/10 rounded-lg p-3' 
                : 'bg-secondary/10 rounded-lg p-3'
            }`}
          >
            <p className="text-sm">
              {message.role === 'assistant' ? 'المساعد: ' : 'أنت: '}
              {message.content}
            </p>
          </div>
        ))}
      </ScrollArea>

      <div className="flex gap-2">
        <Input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="اكتب رسالتك هنا..."
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <Button onClick={sendMessage}>إرسال</Button>
      </div>
    </div>
  );
};
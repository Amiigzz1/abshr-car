import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { MessageCircle } from "lucide-react";

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

const dataFields = [
  { key: 'nationality', question: 'ما هي جنسيتك؟' },
  { key: 'phone', question: 'ما هو رقم جوالك؟' },
  { key: 'city', question: 'في أي مدينة تسكن؟' },
  { key: 'salary', question: 'كم يبلغ راتبك الشهري؟' },
  { key: 'bank', question: 'ما هو اسم البنك الذي تتعامل معه؟' },
  { key: 'obligations', question: 'كم تبلغ التزاماتك الشهرية؟' },
  { key: 'workSector', question: 'ما هو قطاع عملك؟' },
  { key: 'employer', question: 'ما هي جهة عملك؟' },
  { key: 'carType', question: 'ما نوع السيارة المطلوبة؟' },
  { key: 'modelAndColor', question: 'ما هو الموديل واللون المفضل؟' }
];

export const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [userData, setUserData] = useState<Partial<UserData>>({});
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0);
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const calculateEligibility = (salary: number, obligations: number) => {
    const maxPayment = salary * 0.45;
    const availablePayment = maxPayment - (obligations || 0);
    return availablePayment >= 750;
  };

  const getCurrentQuestion = () => {
    if (currentFieldIndex >= dataFields.length) {
      const { salary, obligations } = userData;
      if (salary !== undefined && obligations !== undefined) {
        const isEligible = calculateEligibility(salary, obligations);
        return isEligible
          ? "مبروك! أنت مؤهل للحصول على التمويل. هل ترغب في المتابعة؟"
          : "عذراً، بناءً على المعلومات المقدمة، قد لا تكون مؤهلاً للتمويل في الوقت الحالي.";
      }
      return "شكراً لك على تقديم المعلومات. هل لديك أي استفسارات أخرى؟";
    }
    return dataFields[currentFieldIndex].question;
  };

  const processUserInput = (input: string) => {
    if (currentFieldIndex < dataFields.length) {
      const currentField = dataFields[currentFieldIndex].key;
      let value: any = input;
      
      if (currentField === 'salary' || currentField === 'obligations') {
        value = parseFloat(input.replace(/[^0-9.]/g, ''));
        if (isNaN(value)) {
          return "الرجاء إدخال رقم صحيح";
        }
      }

      setUserData(prev => ({ ...prev, [currentField]: value }));
      setCurrentFieldIndex(prev => prev + 1);
      return getCurrentQuestion();
    }
    return "شكراً لك على المعلومات المقدمة. هل لديك أي استفسارات أخرى؟";
  };

  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: inputMessage
    };

    const aiResponse: Message = {
      role: 'assistant',
      content: processUserInput(inputMessage)
    };

    setMessages(prev => [...prev, userMessage, aiResponse]);
    setInputMessage('');
  };

  const handleOpen = (open: boolean) => {
    setIsOpen(open);
    if (open && messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: 'مرحباً! أنا مساعدك الشخصي للتمويل. ' + getCurrentQuestion()
      }]);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpen}>
      <SheetTrigger asChild>
        <Button
          className="fixed bottom-4 left-4 rounded-full w-12 h-12 p-0"
          variant="secondary"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="text-right">المساعد الذكي للتمويل</SheetTitle>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-200px)] mt-4">
          <div className="flex flex-col gap-4 p-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`${
                  message.role === 'assistant' 
                    ? 'bg-secondary/20 mr-4' 
                    : 'bg-primary/10 ml-4'
                } rounded-lg p-3 text-right`}
              >
                <p className="text-sm">
                  {message.role === 'assistant' ? 'المساعد: ' : 'أنت: '}
                  {message.content}
                </p>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="flex gap-2 p-4 mt-2">
          <Button onClick={sendMessage}>إرسال</Button>
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="اكتب رسالتك هنا..."
            className="text-right"
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};
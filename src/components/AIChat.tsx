import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

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

const saudiCities = [
  "الرياض", "جدة", "مكة المكرمة", "المدينة المنورة", "الدمام",
  "الخبر", "الظهران", "تبوك", "خميس مشيط", "الطائف"
];

const saudiBanks = [
  "البنك الأهلي السعودي", "بنك الراجحي", "بنك الرياض",
  "البنك السعودي الفرنسي", "البنك السعودي البريطاني",
  "بنك الجزيرة", "البنك العربي الوطني", "بنك البلاد"
];

const workSectors = [
  "حكومي", "عسكري", "قطاع خاص", "أعمال حرة"
];

const dataFields = [
  { key: 'nationality', question: 'ما هي جنسيتك؟', suggestions: ["سعودي", "مقيم"] },
  { key: 'phone', question: 'ما هو رقم جوالك؟ (يجب أن يبدأ بـ 05)', validation: (value: string) => /^05\d{8}$/.test(value) },
  { key: 'city', question: 'في أي مدينة تسكن؟', suggestions: saudiCities },
  { key: 'salary', question: 'كم يبلغ راتبك الشهري؟', validation: (value: number) => value >= 3000 },
  { key: 'bank', question: 'ما هو اسم البنك الذي تتعامل معه؟', suggestions: saudiBanks },
  { key: 'obligations', question: 'كم تبلغ التزاماتك الشهرية؟', validation: (value: number) => value >= 0 },
  { key: 'workSector', question: 'ما هو قطاع عملك؟', suggestions: workSectors },
  { key: 'employer', question: 'ما هي جهة عملك؟' },
  { key: 'carType', question: 'ما نوع السيارة المطلوبة؟' },
  { key: 'modelAndColor', question: 'ما هو الموديل واللون المفضل؟' }
];

export const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [userData, setUserData] = useState<Partial<UserData>>({});
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // فتح الشات تلقائياً عند تحميل الصفحة
    setIsOpen(true);
    setMessages([{
      role: 'assistant',
      content: 'مرحباً! أنا مساعدك الشخصي للتمويل. ' + dataFields[0].question
    }]);
  }, []);

  const calculateEligibility = (salary: number, obligations: number) => {
    const maxPayment = salary * 0.45;
    const availablePayment = maxPayment - (obligations || 0);
    return {
      isEligible: availablePayment >= 750,
      availablePayment: Math.round(availablePayment)
    };
  };

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
      const field = dataFields.find(f => f.key === key);
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

      const currentField = dataFields[currentFieldIndex].key;
      let value: any = input;
      
      if (currentField === 'salary' || currentField === 'obligations') {
        value = parseFloat(input.replace(/[^0-9.]/g, ''));
      }

      setUserData(prev => ({ ...prev, [currentField]: value }));
      
      if (currentFieldIndex === dataFields.length - 1) {
        const review = reviewUserData();
        const { salary, obligations } = { ...userData, [currentField]: value };
        
        if (salary !== undefined && obligations !== undefined) {
          const { isEligible, availablePayment } = calculateEligibility(salary, obligations);
          return `${review}\n\n${
            isEligible
              ? `مبروك! أنت مؤهل للحصول على التمويل. المبلغ المتاح للقسط الشهري: ${availablePayment} ريال`
              : "عذراً، بناءً على المعلومات المقدمة، قد لا تكون مؤهلاً للتمويل في الوقت الحالي."
          }`;
        }
      } else {
        setCurrentFieldIndex(prev => prev + 1);
        const nextField = dataFields[currentFieldIndex + 1];
        let response = nextField.question;
        
        if (nextField.suggestions) {
          response += "\nالاقتراحات المتاحة:\n" + nextField.suggestions.join(" - ");
        }
        
        return response;
      }
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

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
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
                <p className="text-sm whitespace-pre-line">
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
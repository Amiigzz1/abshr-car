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
  const [apiKey, setApiKey] = useState('');
  const [showApiInput, setShowApiInput] = useState(true);
  const [userData, setUserData] = useState<Partial<UserData>>({});
  const { toast } = useToast();

  const calculateEligibility = (salary: number, obligations: number) => {
    const maxPayment = salary * 0.45;
    const availablePayment = maxPayment - (obligations || 0);
    return availablePayment >= 750;
  };

  const systemPrompt = `
    أنت مساعد ودود يساعد في تقييم طلبات تمويل السيارات. اطلب المعلومات التالية بشكل لطيف ومهني:
    - الجنسية
    - رقم الجوال
    - المدينة
    - الراتب
    - البنك
    - الالتزامات الشهرية (إن وجدت)
    - قطاع العمل
    - اسم جهة العمل
    - نوع السيارة المطلوبة
    - الموديل واللون المفضل

    اطلب معلومة واحدة في كل مرة. بعد جمع كل المعلومات، قم بتقييم الأهلية للتمويل.
  `;

  const sendMessage = async () => {
    if (!apiKey && showApiInput) {
      toast({
        title: "مطلوب",
        description: "الرجاء إدخال مفتاح API أولاً",
        variant: "destructive",
      });
      return;
    }

    if (!inputMessage.trim()) return;

    const newMessages = [...messages, { role: 'user', content: inputMessage }];
    setMessages(newMessages);
    setInputMessage('');

    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            ...newMessages
          ],
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error('فشل في الاتصال بالخدمة');
      }

      const data = await response.json();
      const assistantMessage = data.choices[0].message.content;

      setMessages([...newMessages, { role: 'assistant', content: assistantMessage }]);

      // Update userData based on the latest message
      // This is a simplified example - you'd want to add more sophisticated parsing
      if (inputMessage.includes('الراتب')) {
        const salary = parseFloat(inputMessage.replace(/[^0-9.]/g, ''));
        setUserData(prev => ({ ...prev, salary }));
      } else if (inputMessage.includes('التزامات')) {
        const obligations = parseFloat(inputMessage.replace(/[^0-9.]/g, ''));
        setUserData(prev => ({ ...prev, obligations }));
      }

    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ في الاتصال بالخدمة",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg mt-10">
      <h2 className="text-2xl font-bold text-primary text-center mb-6">المساعد الذكي للتمويل</h2>
      
      {showApiInput && (
        <div className="mb-4">
          <Input
            type="password"
            placeholder="أدخل مفتاح API الخاص بك"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="mb-2"
          />
          <Button 
            onClick={() => setShowApiInput(false)} 
            disabled={!apiKey}
            className="w-full"
          >
            تأكيد
          </Button>
        </div>
      )}

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
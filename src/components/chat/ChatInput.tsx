import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
}

export const ChatInput = ({ value, onChange, onSend }: ChatInputProps) => {
  return (
    <div className="flex gap-2 p-4 mt-2">
      <Button onClick={onSend} className="bg-primary hover:bg-primary/90">
        إرسال
      </Button>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="اكتب رسالتك هنا..."
        className="text-right"
        onKeyPress={(e) => e.key === 'Enter' && onSend()}
      />
    </div>
  );
};
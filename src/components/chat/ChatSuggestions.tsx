import { Button } from "@/components/ui/button";

interface ChatSuggestionsProps {
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
}

export const ChatSuggestions = ({ suggestions, onSuggestionClick }: ChatSuggestionsProps) => {
  return (
    <div className="flex flex-wrap gap-2 p-4 justify-end">
      {suggestions.map((suggestion, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          onClick={() => onSuggestionClick(suggestion)}
          className="text-primary hover:bg-primary/10"
        >
          {suggestion}
        </Button>
      ))}
    </div>
  );
};
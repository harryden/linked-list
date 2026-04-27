import { useState, useEffect, useRef } from "react";
import { logger } from "@/lib/logger";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { TEXT } from "@/constants/text";

interface LocationSuggestion {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  required?: boolean;
  error?: string;
}

export const LocationAutocomplete = ({
  value,
  onChange,
  placeholder = TEXT.locationAutocomplete.placeholder,
  id,
  required = false,
  error,
}: LocationAutocompleteProps) => {
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout>();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchLocations = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`,
        {
          headers: {
            Accept: "application/json",
          },
          signal: controller.signal,
        },
      );

      if (response.ok) {
        const data = await response.json();
        setSuggestions(data);
        setShowSuggestions(true);
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        setSuggestions([]);
        setShowSuggestions(false);
      } else if (error instanceof Error) {
        logger.error(error, { category: "UI" });
      }
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
    }
  };

  const handleInputChange = (newValue: string) => {
    onChange(newValue);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      void searchLocations(newValue);
    }, 300);
  };

  const handleSelectSuggestion = (suggestion: LocationSuggestion) => {
    onChange(suggestion.display_name);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const errorId = id ? `${id}-error` : undefined;

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        <MapPin
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          id={id}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          className={cn("pl-10", error && "border-destructive")}
          required={required}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
        />
        {isLoading && (
          <div
            className="absolute right-3 top-1/2 -translate-y-1/2"
            role="status"
          >
            <div className="w-4 h-0.5 bg-border-subtle rounded-full overflow-hidden relative">
              <div className="absolute inset-0 bg-text-primary animate-loader-slide" />
            </div>
            <span className="sr-only">Searching for locations...</span>
          </div>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-auto">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.place_id}
              aria-label={suggestion.display_name}
              type="button"
              onClick={() => handleSelectSuggestion(suggestion)}
              className={cn(
                "w-full text-left px-4 py-3 hover:bg-accent transition-colors",
                "flex items-start gap-3 border-b last:border-0",
              )}
            >
              <MapPin
                className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0"
                aria-hidden="true"
              />
              <span className="text-sm">{suggestion.display_name}</span>
            </button>
          ))}
        </div>
      )}

      {error && (
        <p
          id={errorId}
          className="mt-2 text-xs text-destructive font-medium"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
};

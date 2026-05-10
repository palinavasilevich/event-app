import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { SearchIcon, XIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import z from "zod";

type SearchFormProps = {
  isLoading: boolean;
  className?: string;
  onSubmit: (search?: string) => void;
  debounceMs?: number;
};

const searchEventSchema = z.object({
  search: z.string().trim(),
});

export function SearchForm({
  isLoading,
  className,
  onSubmit,
  debounceMs = 400,
}: SearchFormProps) {
  const form = useForm<z.infer<typeof searchEventSchema>>({
    resolver: zodResolver(searchEventSchema),
    defaultValues: { search: "" },
  });

  const searchValue = useWatch({ control: form.control, name: "search" });
  const onSubmitRef = useRef(onSubmit);
  const isFirstRender = useRef(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    onSubmitRef.current = onSubmit;
  });

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    timerRef.current = setTimeout(() => {
      onSubmitRef.current(searchValue.trim() || undefined);
    }, debounceMs);
    return () => clearTimeout(timerRef.current);
  }, [searchValue, debounceMs]);

  const formSubmit = form.handleSubmit((data) => {
    onSubmit(data.search || undefined);
  });

  const handleSubmit: typeof formSubmit = async (e) => {
    clearTimeout(timerRef.current);
    await formSubmit(e);
  };

  const handleClear = () => {
    clearTimeout(timerRef.current);
    form.reset();
    onSubmit(undefined);
  };

  return (
    <form onSubmit={handleSubmit} className={cn("w-full max-w-xl", className)}>
      <label htmlFor="event-search" className="sr-only">
        Search events
      </label>
      <Controller
        name="search"
        control={form.control}
        render={({ field }) => (
          <ButtonGroup className="w-full">
            <Input {...field} id="event-search" placeholder="Search..." />
            {field.value && (
              <Button
                variant="outline"
                type="button"
                aria-label="Clear search"
                onClick={handleClear}
                disabled={isLoading}
              >
                <XIcon />
              </Button>
            )}
            <Button
              variant="outline"
              aria-label="Search"
              type="submit"
              disabled={isLoading}
            >
              <SearchIcon />
            </Button>
          </ButtonGroup>
        )}
      />
    </form>
  );
}

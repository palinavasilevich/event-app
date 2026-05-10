import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { SearchIcon, XIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

type SearchFormProps = {
  isLoading: boolean;
  className?: string;
  onSubmit: (search?: string) => void;
};

const searchEventSchema = z.object({
  search: z.string().trim(),
});

export function SearchForm({
  isLoading,
  className,
  onSubmit,
}: SearchFormProps) {
  const form = useForm<z.infer<typeof searchEventSchema>>({
    resolver: zodResolver(searchEventSchema),
    defaultValues: { search: "" },
  });

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data.search || undefined);
  });

  const handleClear = () => {
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
            <Input
              {...field}
              id="event-search"
              disabled={isLoading}
              placeholder="Search..."
            />
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

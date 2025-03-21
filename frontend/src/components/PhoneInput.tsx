"use client";

import { CheckIcon, ChevronsUpDown } from "lucide-react";
import * as React from "react";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

/**
 * Renders a country flag based on country code
 */
const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
  const Flag = flags[country];

  return (
    <span className="flex h-4 w-6 overflow-hidden rounded-sm bg-foreground/20 [&_svg]:size-full">
      {Flag && <Flag title={countryName} />}
    </span>
  );
};

// Type definitions
type CountryEntry = { label: string; value: RPNInput.Country | undefined };

type CountrySelectProps = {
  disabled?: boolean;
  value: RPNInput.Country;
  options: CountryEntry[];
  onChange: (country: RPNInput.Country) => void;
};

type CountrySelectOptionProps = {
  selectedCountry: RPNInput.Country;
  onChange: (country: RPNInput.Country) => void;
} & RPNInput.FlagProps;

/**
 * Renders a selectable country option with flag, name, and dialing code
 * Replaces CommandItem with custom implementation to avoid dependency issues
 */
const CountrySelectOption = ({
  country,
  countryName,
  selectedCountry,
  onChange,
}: CountrySelectOptionProps) => {
  return (
    <div
      className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent"
      onClick={() => {
        onChange(country);
      }}
    >
      <FlagComponent country={country} countryName={countryName} />
      <span className="flex-1 text-sm">{countryName}</span>
      {/* Show country calling code */}
      <span className="text-sm text-foreground/50">{`+${RPNInput.getCountryCallingCode(
        country,
      )}`}</span>
      {/* Show check icon for selected country */}
      <CheckIcon
        className={`ml-auto size-4 ${country === selectedCountry ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
};

/**
 * Country selector dropdown component
 * Custom implementation that replaces Command components to avoid dependency issues
 */
const CountrySelect = ({
  disabled,
  value: selectedCountry,
  options: countryList,
  onChange,
}: CountrySelectProps) => {
  // State for dropdown and search
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  /**
   * Auto-focus search input when dropdown opens
   */
  React.useEffect(() => {
    if (open && inputRef.current) {
      // Use a nonzero timeout to ensure the input is rendered
      const timeoutId = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 50);

      // Clean up the timeout to avoid memory leaks
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [open]);

  /**
   * Filter countries based on search query
   */
  const filteredCountries = countryList.filter(
    ({ label, value }) => value && label.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="flex gap-1 rounded-e-none rounded-s-lg border-r-0 px-3 focus:z-10"
          disabled={disabled}
        >
          <FlagComponent country={selectedCountry} countryName={selectedCountry} />
          <ChevronsUpDown
            className={cn("-mr-2 size-4 opacity-50 ", disabled ? "hidden" : "opacity-100")}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-2">
        <div className="flex flex-col gap-2">
          {/* Search input */}
          <Input
            ref={inputRef}
            placeholder="Search country..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            className="h-9"
          />

          {/* Scrollable country list */}
          <ScrollArea className="h-72">
            {filteredCountries.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No country found.
              </div>
            ) : (
              <div className="space-y-1 py-1">
                {filteredCountries.map(({ value, label }) =>
                  value ? (
                    <CountrySelectOption
                      key={value}
                      country={value}
                      countryName={label}
                      selectedCountry={selectedCountry}
                      onChange={(selected) => {
                        onChange(selected);
                        setOpen(false);
                      }}
                    />
                  ) : null,
                )}
              </div>
            )}
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
};

/**
 * Custom input component with proper styling for phone field
 */
const InputComponent = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, ...props }, ref) => (
    <Input className={cn("rounded-e-lg rounded-s-none", className)} {...props} ref={ref} />
  ),
);
InputComponent.displayName = "InputComponent";

// PhoneInput props type
type PhoneInputProps = Omit<React.ComponentProps<"input">, "onChange" | "value" | "ref"> &
  Omit<RPNInput.Props<typeof RPNInput.default>, "onChange"> & {
    onChange?: (value: RPNInput.Value) => void;
  };

/**
 * PhoneInput component that combines country select and number input
 * Uses react-phone-number-input under the hood with custom UI components
 */
const PhoneInput: React.ForwardRefExoticComponent<PhoneInputProps> = React.forwardRef<
  React.ComponentRef<typeof RPNInput.default>,
  PhoneInputProps
>(({ className, onChange, ...props }, ref) => {
  return (
    <RPNInput.default
      ref={ref}
      className={cn("flex", className)}
      flagComponent={FlagComponent}
      countrySelectComponent={CountrySelect}
      inputComponent={InputComponent}
      smartCaret={false}
      /**
       * Handles the onChange event.
       *
       * react-phone-number-input might trigger the onChange event as undefined
       * when a valid phone number is not entered. To prevent this,
       * the value is coerced to an empty string.
       *
       * @param {E164Number | undefined} value - The entered value
       */
      onChange={(value) => onChange?.(value ?? ("" as RPNInput.Value))}
      {...props}
    />
  );
});
PhoneInput.displayName = "PhoneInput";

export { PhoneInput };

/*
This code uses a modified version of the Shadcn-phone-input
react code snippet by Omer Alpi.

Modifications:
- Removed Command component dependencies to fix type errors
- Replaced CommandItem with a custom div-based component
- Added custom search and filtering logic
- Added manual focus management for search input
- Added proper state management for search and dropdown
- Used standard React components instead of Command components
- Maintained the same visual styling and functionality

Demo of original component can be found at: https://shadcn-phone-input.vercel.app/
*/

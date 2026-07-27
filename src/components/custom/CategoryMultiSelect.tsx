"use client"

import { useMemo, useState } from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

type CategoryOption = {
  id: number
  name: string
}

type CategoryMultiSelectProps = {
  options: CategoryOption[]
  selectedValues: string[]
  onChangeAction: (values: string[]) => void
  name: string
  placeholder?: string
  error?: string | null
}

export function CategoryMultiSelect({
  options,
  selectedValues,
  onChangeAction,
  name,
  placeholder = "Selecciona una o varias categorías",
  error,
}: CategoryMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false)

  const selectedOptions = useMemo(
    () =>
      selectedValues
        .map((value) => options.find((option) => String(option.id) === value))
        .filter((option): option is CategoryOption => Boolean(option)),
    [options, selectedValues],
  )

  const toggleValue = (value: string) => {
    const hasValue = selectedValues.includes(value)
    const nextValues = hasValue
      ? selectedValues.filter((item) => item !== value)
      : [...selectedValues, value]

    onChangeAction(nextValues)
    setIsOpen(false)
  }

  const removeValue = (value: string) => {
    onChangeAction(selectedValues.filter((item) => item !== value))
  }

  return (
    <div className="space-y-3">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={isOpen}
            className={cn(
              "h-10 w-full justify-between px-3 text-left font-normal",
              !selectedValues.length && "text-muted-foreground",
              error && "border-destructive",
            )}
          >
            <span className="truncate">
              {selectedValues.length
                ? `${selectedValues.length} categor${selectedValues.length === 1 ? "ía" : "ías"} seleccionada${selectedValues.length === 1 ? "" : "s"}`
                : placeholder}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-[--radix-popover-trigger-width] p-0">
          <Command>
            <CommandInput placeholder="Buscar categoría..." />
            <CommandList>
              <CommandEmpty>No se encontraron categorías.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => {
                  const value = String(option.id)
                  const isSelected = selectedValues.includes(value)

                  return (
                    <CommandItem
                      key={option.id}
                      value={option.name}
                      onSelect={() => toggleValue(value)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          isSelected ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {option.name}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedOptions.map((option) => {
            const value = String(option.id)

            return (
              <Badge key={option.id} variant="secondary" className="gap-1 pl-2 pr-1 py-1">
                {option.name}
                <button
                  type="button"
                  onClick={() => removeValue(value)}
                  className="rounded p-0.5 hover:bg-black/10"
                  aria-label={`Eliminar ${option.name}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )
          })}
        </div>
      )}

      {selectedValues.map((value) => (
        <input key={value} type="hidden" name={name} value={value} />
      ))}

      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : (
        <p className="text-xs text-muted-foreground">
          Puedes buscar y seleccionar múltiples categorías.
        </p>
      )}
    </div>
  )
}


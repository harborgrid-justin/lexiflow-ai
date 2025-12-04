import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, UseFormReturn, FieldValues } from "react-hook-form"
import { ZodSchema } from "zod"

export function useZodForm<T extends FieldValues>(schema: ZodSchema<T>, defaultValues?: Partial<T>): UseFormReturn<T> {
  return useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as any,
  })
}

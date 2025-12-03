import { useState } from "react"
import { z } from "zod"
import { useZodForm } from "@/lib/form-utils"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"

/**
 * Example Form Schema using Zod
 *
 * This demonstrates validation rules for various field types:
 * - Required fields
 * - String length validation
 * - Email validation
 * - Enum validation
 * - Boolean validation
 * - Number validation
 */
const formSchema = z.object({
  // Text input with validation
  fullName: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }).max(100, {
    message: "Name must not exceed 100 characters.",
  }),

  // Email validation
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),

  // Textarea with optional character limit
  description: z.string().max(500, {
    message: "Description must not exceed 500 characters.",
  }).optional(),

  // Select dropdown
  role: z.enum(["admin", "user", "manager"], {
    required_error: "Please select a role.",
  }),

  // Radio group
  priority: z.enum(["low", "medium", "high"], {
    required_error: "Please select a priority level.",
  }),

  // Checkbox
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions.",
  }),

  // Switch
  emailNotifications: z.boolean().default(false),

  // Slider - stored as array but we'll handle it
  importance: z.number().min(0).max(100).default(50),
})

type FormValues = z.infer<typeof formSchema>

/**
 * ExampleForm Component
 *
 * This component demonstrates best practices for form handling in LexiFlow AI:
 *
 * 1. Schema-based validation using Zod
 * 2. Type-safe forms using react-hook-form
 * 3. Reusable form utilities (useZodForm)
 * 4. Proper error handling and display
 * 5. Accessible form fields using shadcn/ui components
 * 6. Form state management
 *
 * Usage:
 * ```tsx
 * import { ExampleForm } from "@/components/examples/ExampleForm"
 *
 * function MyPage() {
 *   return <ExampleForm />
 * }
 * ```
 */
export function ExampleForm() {
  const [submittedData, setSubmittedData] = useState<FormValues | null>(null)

  // Initialize form with Zod schema and default values
  const form = useZodForm(formSchema, {
    fullName: "",
    email: "",
    description: "",
    agreeToTerms: false,
    emailNotifications: false,
    importance: 50,
  })

  // Handle form submission
  function onSubmit(values: FormValues) {
    console.log("Form submitted:", values)
    setSubmittedData(values)

    // In a real application, you would:
    // - Call an API endpoint
    // - Update global state
    // - Show success notification
    // - Navigate to another page

    // Example:
    // await api.submitForm(values)
    // navigate('/success')
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Example Form</h1>
        <p className="text-muted-foreground">
          This form demonstrates all form components and validation patterns used in LexiFlow AI.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Text Input Example */}
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormDescription>
                  Enter your full name as it appears on official documents.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email Input Example */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="john@example.com" {...field} />
                </FormControl>
                <FormDescription>
                  We'll never share your email with anyone else.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Textarea Example */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us a little bit about yourself"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Maximum 500 characters. {field.value?.length || 0}/500
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Select Dropdown Example */}
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choose the role that best describes your position.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Radio Group Example */}
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Priority Level</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="low" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Low Priority
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="medium" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Medium Priority
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="high" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        High Priority
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Slider Example */}
          <FormField
            control={form.control}
            name="importance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Importance: {field.value}%</FormLabel>
                <FormControl>
                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={[field.value]}
                    onValueChange={(vals) => field.onChange(vals[0])}
                  />
                </FormControl>
                <FormDescription>
                  Adjust the slider to indicate importance level.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Checkbox Example */}
          <FormField
            control={form.control}
            name="agreeToTerms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    I agree to the terms and conditions
                  </FormLabel>
                  <FormDescription>
                    You must accept the terms and conditions to continue.
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* Switch Example */}
          <FormField
            control={form.control}
            name="emailNotifications"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    Email Notifications
                  </FormLabel>
                  <FormDescription>
                    Receive email notifications about your account activity.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex gap-4">
            <Button type="submit">Submit</Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              Reset
            </Button>
          </div>
        </form>
      </Form>

      {/* Display submitted data for demonstration */}
      {submittedData && (
        <div className="mt-8 p-4 rounded-md bg-muted">
          <h2 className="text-lg font-semibold mb-2">Submitted Data:</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(submittedData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

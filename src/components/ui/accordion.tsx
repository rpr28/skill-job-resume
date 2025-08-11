// File: components/ui/accordion.tsx
"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

export const Accordion = AccordionPrimitive.Root

export const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b", className)}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

export const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = "AccordionTrigger"

export const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
      className
    )}
    {...props}
  >
    <div className="pb-4 pt-0">{children}</div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = "AccordionContent"

// ------------------------------
// Usage example (App Router)
// File: app/page.tsx
//
// import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
//
// export default function Page() {
//   return (
//     <main className="mx-auto max-w-md py-10">
//       <Accordion type="single" collapsible className="w-full">
//         <AccordionItem value="item-1">
//           <AccordionTrigger>Is it accessible?</AccordionTrigger>
//           <AccordionContent>
//             Yes. It adheres to WAI-ARIA best practices.
//           </AccordionContent>
//         </AccordionItem>
//         <AccordionItem value="item-2">
//           <AccordionTrigger>Is it styled?</AccordionTrigger>
//           <AccordionContent>
//             It uses your Tailwind tokens. Tweak classes as you like.
//           </AccordionContent>
//         </AccordionItem>
//       </Accordion>
//     </main>
//   );
// }
//
// ------------------------------
// Tailwind animation helpers (add once)
// File: tailwind.config.ts -> theme.extend
//   extend: {
//     keyframes: {
//       "accordion-down": {
//         from: { height: "0" },
//         to: { height: "var(--radix-accordion-content-height)" },
//       },
//       "accordion-up": {
//         from: { height: "var(--radix-accordion-content-height)" },
//         to: { height: "0" },
//       },
//     },
//     animation: {
//       "accordion-down": "accordion-down 0.2s ease-out",
//       "accordion-up": "accordion-up 0.2s ease-out",
//     },
//   }
//
// Ensure you have lucide-react and @radix-ui/react-accordion installed:
//   npm i @radix-ui/react-accordion lucide-react
//
// Also confirm your project has the utility:
// File: lib/utils.tas
//   export function cn(...classes: Array<string | undefined | null | false>) {
//     return classes.filter(Boolean).join(" ");
//   }

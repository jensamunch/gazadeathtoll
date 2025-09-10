import { getDictionary } from '../dictionaries'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export default async function FAQPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const dict = await getDictionary(lang as 'ar' | 'en')

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-8 text-3xl font-bold">{dict.faq.title}</h1>

      <Accordion type="single" collapsible className="w-full">
        {dict.faq.questions.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}

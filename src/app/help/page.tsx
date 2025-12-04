import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
    {
        question: "What is EcoRetail Insight?",
        answer: "EcoRetail Insight is a sustainability management platform designed for retail businesses. We use AI to provide actionable insights into your carbon footprint, waste production, and supply chain efficiency, helping you make smarter, greener decisions."
    },
    {
        question: "How does the AI Waste Predictor work?",
        answer: "Our AI Waste Predictor analyzes historical sales data, weather forecasts, and seasonality to predict potential overstock and spoilage of products. This allows you to optimize inventory, reduce waste, and improve profitability."
    },
    {
        question: "Is my data secure?",
        answer: "Yes, data security is our top priority. We use industry-standard encryption and security protocols to ensure your business data is always protected."
    },
    {
        question: "How do I get started?",
        answer: "You can get started by registering for an account. Once logged in, you can begin exploring the dashboard and connecting your data sources to unlock AI-powered insights."
    },
    {
        question: "Can I generate marketing content for any product?",
        answer: "Yes, the AI Email Marketing tool can generate promotional content for any product. Simply provide a product name and a brief description of its features, and our AI will create a compelling email for your customers."
    }
]

export default function HelpPage() {
  return (
    <div className="flex flex-col gap-8">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Help & FAQ</h1>
            <p className="text-muted-foreground">Find answers to common questions about EcoRetail Insight.</p>
        </div>
        <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
                <AccordionItem value={`item-${index + 1}`} key={index}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>
                    {faq.answer}
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    </div>
  )
}

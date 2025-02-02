'use client';

import { useTranslations } from 'next-intl';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Section } from '@/features/landing/Section';

export const FAQ = () => {
  const t = useTranslations('FAQ');

  const faqItems = [
    { id: '1', question: t('question'), answer: t('answer') },
    { id: '2', question: t('question'), answer: t('answer') },
    { id: '3', question: t('question'), answer: t('answer') },
    { id: '4', question: t('question'), answer: t('answer') },
    { id: '5', question: t('question'), answer: t('answer') },
    { id: '6', question: t('question'), answer: t('answer') },
  ];

  return (
    <Section>
      <Accordion type="multiple" className="w-full">
        {faqItems.map(item => (
          <AccordionItem key={item.id} value={`item-${item.id}`}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Section>
  );
};

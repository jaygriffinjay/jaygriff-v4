"use client";

import { Accordion } from "@base-ui/react/accordion";
import { ChevronDownIcon } from "lucide-react";
import { Lead } from "@/components/typography";
import { cn } from "@/lib/utils";
import styles from "./question-list.module.css";

export type Question = { question: string; answer: React.ReactNode };

/** Questions as plain headings with a chevron; tapping one reveals its answer underneath. No cards or rules. */
export function QuestionList({
  items,
  open,
  onOpenChange,
  className,
}: {
  items: Question[];
  /** Which questions are open, by question text; leave out to let the list manage itself. */
  open?: string[];
  onOpenChange?: (open: string[]) => void;
  className?: string;
}) {
  return (
    <Accordion.Root
      multiple
      value={open}
      onValueChange={onOpenChange}
      // Closed answers stay in the server HTML for crawlers, and find-in-page opens them
      hiddenUntilFound
      className={cn(styles.list, className)}
    >
      {items.map(({ question, answer }) => (
        <Accordion.Item key={question} value={question}>
          <Accordion.Header className={styles.header}>
            <Accordion.Trigger className={styles.trigger}>
              <span className={styles.question}>{question}</span>
              <ChevronDownIcon aria-hidden="true" className={styles.chevron} />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel className={styles.panel}>
            <Lead className={styles.answer}>{answer}</Lead>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}

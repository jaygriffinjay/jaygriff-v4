import { ChevronRightIcon } from "lucide-react";
import { Small } from "@/components/typography";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { brighter } from "./candidates";
import styles from "./page.module.css";

const questions = [
  { question: "Who are you?", answer: "I'm Jay, a software developer on the internet." },
  { question: "What kind of development do you do?", answer: "Mostly full-stack web development with TypeScript." },
  { question: "What do you use to make software?", answer: "Many of the tools are listed on the my stack page." },
];

const tools = [
  { tool: "Next.js", status: "Active", note: "App Router, server components" },
  { tool: "TypeScript", status: "Active", note: "Everywhere" },
  { tool: "Tailwind CSS", status: "Active", note: "Only inside CSS modules" },
  { tool: "Drizzle", status: "Active", note: "For goatboat's database" },
];

/** Three question rows, the first open. Put it inside a `hoverable` or `pinned` wrapper. */
export function AccordionMock() {
  return (
    <div className={styles.accordion}>
      {questions.map(({ question, answer }, index) => (
        <details key={question} className={styles.item} open={index === 0}>
          <summary className={styles.summary}>
            <span className={styles.question}>{question}</span>
            <ChevronRightIcon aria-hidden="true" className={styles.chevron} />
          </summary>
          <p className={styles.answer}>{answer}</p>
        </details>
      ))}
    </div>
  );
}

/** The site's own table. Put it inside a `hoverable` or `pinned` wrapper. */
export function TableMock() {
  return (
    <div className={styles.table}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tool</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Note</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tools.map(({ tool, status, note }) => (
            <TableRow key={tool}>
              <TableCell>{tool}</TableCell>
              <TableCell>{status}</TableCell>
              <TableCell>{note}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

/** An accordion and a table, one under the other, reacting to the pointer or with their second row pinned. */
export function Demo({ pinned }: { pinned?: boolean }) {
  return (
    <div className={cn(styles.demo, pinned ? styles.pinned : styles.hoverable)}>
      <Small>Accordion</Small>
      <AccordionMock />
      <Small>Table</Small>
      <TableMock />
    </div>
  );
}

/** Every candidate as an accordion row held in its hover state, under one row with no highlight to compare against. */
export function AllAccordions() {
  return (
    <div className={cn(styles.section, styles.accordion)}>
      <details className={styles.item}>
        <summary className={styles.summary}>
          <span className={styles.question}>No highlight</span>
          <ChevronRightIcon aria-hidden="true" className={styles.chevron} />
        </summary>
      </details>
      {brighter.map(({ name, className }) => (
        <details key={name} className={cn(styles.item, className)}>
          <summary className={cn(styles.summary, styles.litItem)}>
            <span className={styles.question}>{name}</span>
            <ChevronRightIcon aria-hidden="true" className={styles.chevron} />
          </summary>
        </details>
      ))}
    </div>
  );
}

/** Every candidate as a table row held in its hover state, under one row with no highlight to compare against. */
export function AllTables() {
  return (
    <div className={styles.table}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Hover color</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Note</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>No highlight</TableCell>
            <TableCell>Active</TableCell>
            <TableCell>For comparing against</TableCell>
          </TableRow>
          {brighter.map(({ name, note, className }) => (
            <TableRow key={name} className={cn(styles.litRow, className)}>
              <TableCell>{name}</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>{note}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

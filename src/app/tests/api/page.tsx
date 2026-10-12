import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/code-block/CodeBlock";
import { H1, H2, InlineCode, Paragraph } from "@/components/typography";
import { PageLayout } from "@/components/site/page-layout";
import run from "./recorded-run.json";
import styles from "./page.module.css";

type Step = (typeof run.steps)[number];

const statusText: Record<number, string> = {
  200: "OK",
  201: "Created",
  204: "No Content",
  400: "Bad Request",
  401: "Unauthorized",
  404: "Not Found",
  409: "Conflict",
};

function requestText({ method, path, auth, body }: Step["request"]) {
  const lines = [`${method} ${path}`];
  if (auth) lines.push("Authorization: Bearer <token>");
  if (body) lines.push("Content-Type: application/json", "", JSON.stringify(body, null, 2));
  return lines.join("\n");
}

export default function ApiRunPage() {
  return (
    <PageLayout>
      <H1 className={styles.title}>Write API test run</H1>
      <Paragraph className={styles.intro}>
        Every write route in goatboat&apos;s content API, exercised on one scratch post that gets deleted at the
        end. Recorded {format(new Date(run.recordedAt), "MMM d, yyyy 'at' HH:mm")}. This site only reads, so
        this is a record of a run, not a live call.
      </Paragraph>

      <ol className={styles.steps}>
        {run.steps.map((step, i) => (
          <li key={i} className={styles.step}>
            <div className={styles.heading}>
              <H2 className={styles.stepTitle}>
                {i + 1}. {step.title}
              </H2>
              <Badge variant={step.response.status === step.expect ? "outline" : "destructive"}>
                {step.response.status} {statusText[step.response.status]}
              </Badge>
            </div>
            <Paragraph className={styles.note}>{step.note}</Paragraph>
            <CodeBlock
              className={styles.code}
              files={[
                { path: "request.http", language: "http", content: requestText(step.request) },
                {
                  path: "response.json",
                  language: "json",
                  content: step.response.body ? JSON.stringify(step.response.body, null, 2) : "(empty body)",
                },
              ]}
            />
          </li>
        ))}
      </ol>

      <Paragraph className={styles.footer}>
        Produced by a script that sends each request to a local goatboat and saves the responses to{" "}
        <InlineCode>recorded-run.json</InlineCode>. The token is sent but never saved.
      </Paragraph>
    </PageLayout>
  );
}

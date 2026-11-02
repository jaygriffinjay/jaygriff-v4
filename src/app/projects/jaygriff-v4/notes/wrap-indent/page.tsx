// goatboat: 4338a08d-2fd7-4604-bbb9-86bb276f38e4
import { CapsLabel, H2, Paragraph } from "@/components/typography";
import { PageHeader } from "@/components/site/page-header";
import { PageLayout } from "@/components/site/page-layout";
import { CodeBlock } from "@/components/code-block/CodeBlock";
import type { CodeFile } from "@/components/code-block/types";
import { deepNesting } from "../code-stress/samples";
import { IndentTrial } from "./indent-trial";
import styles from "./page.module.css";

const jsx: CodeFile = {
  path: "src/app/settings/page.tsx",
  content: `export default function SettingsPage({ user, workspaces }: Props) {
  return (
    <PageLayout>
      <section className={styles.section}>
        {workspaces.map((workspace) => (
          <Card key={workspace.id} className={cn(styles.card, workspace.archived && styles.archived)}>
            <CardHeader>
              <CardTitle>{workspace.name} · {workspace.members.length} members · created {formatDate(workspace.createdAt)}</CardTitle>
            </CardHeader>
            <CardContent>
              <NotificationPreferences userId={user.id} workspaceId={workspace.id} defaults={workspace.notificationDefaults} />
            </CardContent>
          </Card>
        ))}
      </section>
    </PageLayout>
  );
}`,
};

const python: CodeFile = {
  path: "scripts/report.py",
  content: `def build_report(rows, *, include_archived=False, group_by="workspace"):
    groups = {}
    for row in rows:
        if row.archived and not include_archived:
            continue
        for key in (row.workspace_id, row.project_id, row.environment_name):
            if key is not None:
                groups.setdefault(key, []).append({"id": row.id, "title": row.title, "updated": row.updated_at.isoformat(), "owner": row.owner.email})
                if len(groups[key]) > 1000:
                    raise ValueError(f"group {key} has more than 1000 rows; narrow the query with a date range or a project filter before building the report")
    return groups`,
};

const samples = [
  { title: "Deep nesting", file: deepNesting },
  { title: "JSX", file: jsx },
  { title: "Python", file: python },
];

export default function WrapIndentPage() {
  return (
    <PageLayout>
      <PageHeader intro="Trial: wrapped rows keep their line's indentation plus 2 characters, capped at 40% of the block's width. Each sample is shown wrapped, as the site does it today and with the trial." />

      {samples.map(({ title, file }) => (
        <section key={title}>
          <H2>{title}</H2>
          <div className={styles.pair}>
            <div className={styles.column}>
              <CapsLabel>Today</CapsLabel>
              <div className={styles.wrapped}>
                <CodeBlock files={[file]} />
              </div>
            </div>
            <div className={styles.column}>
              <CapsLabel>Trial</CapsLabel>
              <div className={styles.wrapped}>
                <IndentTrial>
                  <CodeBlock files={[file]} />
                </IndentTrial>
              </div>
            </div>
          </div>
        </section>
      ))}

      <Paragraph>Narrow the window to see the cap kick in: on a phone, deep lines stop at 40% instead of squeezing into a sliver.</Paragraph>
    </PageLayout>
  );
}

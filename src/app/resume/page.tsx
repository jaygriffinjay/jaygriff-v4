// goatboat: 28bc7ae3-fe0e-4af8-804d-c105bbea568e
import NextLink from "next/link";
import { H3, H4, List, ListItem, NameTitle, Small } from "@/components/typography";
import { PageLayout } from "@/components/site/page-layout";
import { CONTACT, EDUCATION, EXPERIENCE, NAME, PROJECTS, SKILLS } from "./resume-data";
import styles from "./page.module.css";

/** The resume: projects, skills, experience and education on one page. */
export default function ResumePage() {
  return (
    <PageLayout hideRelated hideToc>
      <header className={styles.header}>
        <NameTitle>{NAME}</NameTitle>
        <div className={styles.contact}>
          {CONTACT.map(({ label, href }, index) => (
            <span key={href} className={styles.contactItem}>
              {index > 0 && (
                <span className={styles.dot} aria-hidden="true">
                  •
                </span>
              )}
              <NextLink href={href} className={styles.contactLink}>
                {label}
              </NextLink>
            </span>
          ))}
        </div>
      </header>

      <section>
        <div className={styles.sectionHeader}>
          <H3>Projects</H3>
          <NextLink href="/projects" className={styles.sectionLink}>
            jaygriff.com/projects
          </NextLink>
        </div>
        {PROJECTS.map(({ name, tagline, bullets }) => (
          <article key={name} className={styles.entry}>
            <H4>
              {name}
              <span className={styles.tagline}> — {tagline}</span>
            </H4>
            <Bullets items={bullets} />
          </article>
        ))}
      </section>

      <section>
        <div className={styles.sectionHeader}>
          <H3>Core Skills</H3>
          <NextLink href="/my-stack" className={styles.sectionLink}>
            jaygriff.com/my-stack
          </NextLink>
        </div>
        <dl className={styles.skills}>
          {SKILLS.map(({ label, items }) => (
            <div key={label} className={styles.skillRow}>
              <dt className={styles.skillLabel}>{label}</dt>
              <dd className={styles.skillItems}>{items}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section>
        <div className={styles.sectionHeader}>
          <H3>Experience</H3>
        </div>
        {EXPERIENCE.map(({ role, org, dates, bullets }) => (
          <article key={role} className={styles.entry}>
            <div className={styles.entryHeader}>
              <H4>
                {role}
                <span className={styles.tagline}> — {org}</span>
              </H4>
              <Small className={styles.dates}>{dates}</Small>
            </div>
            <Bullets items={bullets} />
          </article>
        ))}
      </section>

      <section>
        <div className={styles.sectionHeader}>
          <H3>Education</H3>
        </div>
        {EDUCATION.map(({ degree, school, dates, honor }) => (
          <article key={degree} className={styles.entry}>
            <div className={styles.entryHeader}>
              <H4>
                {degree}
                <span className={styles.tagline}> — {school}</span>
              </H4>
              <Small className={styles.dates}>{dates}</Small>
            </div>
            {honor && <Small>{honor}</Small>}
          </article>
        ))}
      </section>
    </PageLayout>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <List className={styles.bullets}>
      {items.map((item) => (
        <ListItem key={item}>{item}</ListItem>
      ))}
    </List>
  );
}

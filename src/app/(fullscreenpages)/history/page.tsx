// goatboat: d57279ed-a924-4c13-be7e-1de74ceacb13
import NextLink from "next/link";
import { CapsLabel, Lead, Title } from "@/components/typography";
import history from "./history.json";
import styles from "./page.module.css";

type Attempt = {
  name: string;
  era: string;
  date: string;
  shipped?: boolean;
  current?: boolean;
  url?: string;
  repo?: string;
  page?: string;
  stack: string[];
  summary: string;
};

const month = (date: string) =>
  new Date(`${date}-01T00:00:00Z`).toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });

/** The site's history as a beanstalk: today at the top, each attempt a branch off the stalk, its era marked where it starts. */
export default function HistoryPage() {
  const attempts = history.attempts as Attempt[];
  let side = 0;

  return (
    <div className={styles.page}>
      <div className={styles.flower}>
        <div aria-hidden className={styles.petals}>
          {Array.from({ length: 12 }, (_, i) => (
            <span key={i} />
          ))}
        </div>
        <header className={styles.intro}>
          <Title className={styles.title}>Every version of this site</Title>
          <Lead className={styles.lead}>Every try at programming a website or a blog since 2018, newest at the top. Point at a branch for what it was made of.</Lead>
        </header>
      </div>

      <ol className={styles.stalk}>
        {history.eras.map((era) => (
          <li key={era.id} className={styles.era}>
            <div className={styles.eraNode}>
              <CapsLabel className={styles.eraTitle}>{era.title}</CapsLabel>
              <span className={styles.eraYears}>{era.years}</span>
            </div>
            <ol className={styles.branches}>
              {attempts
                .filter((a) => a.era === era.id)
                .map((a) => (
                  <li key={a.name} className={styles.branch} data-side={side++ % 2 ? "left" : "right"} data-shipped={a.shipped ? "" : undefined} data-current={a.current ? "" : undefined}>
                    <div className={styles.leaf}>
                      {a.current || a.page ? (
                        <NextLink href={a.page ?? "/"} className={styles.name}>
                          {a.name}
                        </NextLink>
                      ) : a.url || a.repo ? (
                        <a href={a.url ?? a.repo} target="_blank" rel="noreferrer" className={styles.name}>
                          {a.name}
                        </a>
                      ) : (
                        <button type="button" className={styles.name}>
                          {a.name}
                        </button>
                      )}
                      {a.current && <span className={styles.here}>You are here</span>}
                      <div className={styles.details}>
                        <span className={styles.date}>{month(a.date)}</span>
                        <span className={styles.summary}>{a.summary}</span>
                        {a.stack.length > 0 && (
                          <ul className={styles.stack}>
                            {a.stack.map((s) => (
                              <li key={s}>{s}</li>
                            ))}
                          </ul>
                        )}
                        {a.repo && a.url && (
                          <a href={a.repo} target="_blank" rel="noreferrer" className={styles.repo}>
                            Source on GitHub
                          </a>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
            </ol>
          </li>
        ))}
      </ol>
    </div>
  );
}

// goatboat: 2717060e-d192-4a06-b5c4-608b9908c735
import NextLink from "next/link";
import { Bold, H2, List, ListItem, Paragraph } from "@/components/typography";
import { PageHeader } from "@/components/site/page-header";
import { PageLayout } from "@/components/site/page-layout";
import styles from "./page.module.css";

const REPO = "https://github.com/jaygriffinjay/jaygriff-v4/blob/main";

/** What you may do with the site's code and writing, in plain words, with links to the license files themselves. */
export default function LicensePage() {
  return (
    <PageLayout hideRelated hideToc>
      <PageHeader intro="What you can do with my code and my writing, in plain words. The license files are what count." />

      <H2>The short version</H2>
      <List>
        <ListItem>
          <Bold>Code is MIT.</Bold> Use it, copy it, change it, sell things made with it. Keep the copyright notice with it.
        </ListItem>
        <ListItem>
          <Bold>Writing and images are CC BY-NC-SA 4.0.</Bold> Share and adapt them for non-commercial purposes, credit me, and
          share what you make under the same license.
        </ListItem>
        <ListItem>
          <Bold>Code samples inside my writing are MIT,</Bold> like the rest of the code, so use them freely.
        </ListItem>
      </List>

      <H2>Why two licenses</H2>
      <Paragraph>
        Code is most useful when people can take it and build on it, so it gets the most permissive license there is. Writing is
        different: I'm happy for it to travel, as long as my name goes with it and nobody sells it as their own. Splitting the two
        keeps both true.
      </Paragraph>

      <H2>The license files</H2>
      <List>
        <ListItem>
          <a href={`${REPO}/LICENSE`} className={styles.link}>
            LICENSE
          </a>{" "}
          says what each license covers.
        </ListItem>
        <ListItem>
          <a href={`${REPO}/LICENSE-CODE`} className={styles.link}>
            LICENSE-CODE
          </a>{" "}
          is the MIT License.
        </ListItem>
        <ListItem>
          <a href={`${REPO}/LICENSE-CONTENT`} className={styles.link}>
            LICENSE-CONTENT
          </a>{" "}
          is the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
        </ListItem>
      </List>

      <H2>What isn't mine</H2>
      <Paragraph>These keep their own licenses, and nothing here changes that:</Paragraph>
      <List>
        <ListItem>
          The fonts:{" "}
          <a href={`${REPO}/src/app/fonts/Sekuya-OFL.txt`} className={styles.link}>
            Sekuya
          </a>{" "}
          and{" "}
          <a href={`${REPO}/src/app/fonts/JetBrainsMono-OFL.txt`} className={styles.link}>
            JetBrains Mono
          </a>
          , both under the SIL Open Font License.
        </ListItem>
        <ListItem>The logos of other tools and companies, shown only to name them.</ListItem>
        <ListItem>The open-source packages the site is built on, each under its own license.</ListItem>
      </List>

      <Paragraph>
        For anything not covered here, like using my writing commercially,{" "}
        <NextLink href="/contact" className={styles.link}>
          get in touch
        </NextLink>
        .
      </Paragraph>
    </PageLayout>
  );
}

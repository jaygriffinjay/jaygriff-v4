// goatboat: fb29872b-df86-4340-82d7-97b7ffcb6a4c
import Image from "next/image";
import NextLink from "next/link";
import { H2, Paragraph } from "@/components/typography";
import { PageHeader } from "@/components/site/page-header";
import { PageLayout } from "@/components/site/page-layout";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import styles from "./page.module.css";

const ABOUT_ME = [
  {
    question: "What's your background?",
    answer: (
      <>
        I have a bachelor's degree in agricultural economics, a
        master's degree in accounting, and I worked in public tax
        accounting before transitioning to software development. I've also
        worked as a professional mover and driver.
      </>
    ),
  },
  {
    question: "What kind of developer are you?",
    answer: (
      <>
        I build full-stack TypeScript webapps on Vite or Next.js. I also do lots of backend work: working with APIs and cloud services, performance optimization, data modelling, asset pipelines, and the framework and dev tooling I built. Most of it is on this site or linked from{" "}
        <NextLink href="/projects" className={styles.link}>
          projects
        </NextLink>
        .
      </>
    ),
  },
  {
    question: "What are you focused on right now?",
    answer: (
      <>
        Currently I'm spending significant time on this website — building
        new features, improving the framework, and writing. I'm also
        actively working on AI-native dev tools and workflows, AI-native apps,
        and data analysis apps.
      </>
    ),
  },
  {
    question: "What do you actually want to be doing?",
    answer: (
      <>
        I want to ship and run my own webapps end-to-end from conception to production. I also love working on this site, which is a content platform, documentation system, and testbed for webapps and larger-scale backends all at once.
      </>
    ),
  },
  {
    question: "Do you freelance?",
    answer: (
      <>
        Currently no. I'm looking for a full-time role, and I'm also
        interested in selling my own software products. I want to focus on those
        things right now, but maybe in the future.
      </>
    ),
  },
  {
    question: "What's your end goal?",
    answer: (
      <>
        I want to create my own software businesses to support my life and work
        indefinitely. I'd also love to work with talented developers and
        learn from them.
      </>
    ),
  },
  {
    question: "Will AI replace you?",
    answer: (
      <>
        I don't think AI will replace me. I think it has replaced some
        types of work though. AI is just like any other innovation: it has
        changed how we do things, made some things obsolete, and created new
        opportunities.
      </>
    ),
  },
  {
    question: "What are you excited to build next?",
    answer: (
      <>
        AI-adjacent apps. They can solve problems in ways we couldn't achieve
        even a few years ago. Many entire new categories of software are emerging. This is keeping me busy because it takes plenty of real work to build all this. Even with AI assistance, building good software still requires careful thought and effort.
      </>
    ),
  },
  {
    question: "What would you build with unlimited time?",
    answer: (
      <>
        With unlimited time I think I'd get bored of regular work and build
        tools for science. Either biology or space. So trying to get to the
        bottom of life or the universe.
      </>
    ),
  },
  {
    question: "Why should anyone care?",
    answer: <>{"¯\\_(ツ)_/¯"}</>,
  },
];

const ABOUT_SITE = [
  {
    question: "What is this site?",
    answer: (
      <>
        A custom-built web app that serves as both my workspace and publishing
        platform. It's the container for a lot of my other apps, because I
        can build them in this repo and then host and demo them here.
      </>
    ),
  },
  {
    question: "What's under the hood?",
    answer: (
      <>
        More than a website. There's a content pipeline that syncs markdown
        and TSX files into a database, which also models my projects and the
        tools I use, and an admin area for editing all of it. Several of my apps
        run inside this repo rather than being linked out to. So it's a
        publishing platform, a CMS, a portfolio, and a testbed for the framework
        I keep reusing — all at once, which is exactly why I keep working on it.
      </>
    ),
  },
  {
    question: "How long did this take to build?",
    answer: (
      <>
        This version of the site is fairly recent, but the framework and methods
        behind it have been refined over years of iteration.
      </>
    ),
  },
];

type Entry = { question: string; answer: React.ReactNode };

function Questions({ items }: { items: Entry[] }) {
  return (
    <Accordion multiple className={styles.accordion}>
      {items.map(({ question, answer }) => (
        <AccordionItem key={question} value={question} className={styles.item}>
          <AccordionTrigger className={styles.question}>{question}</AccordionTrigger>
          <AccordionContent className={styles.answer}>{answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export default function AboutPage() {
  return (
    <PageLayout hideRelated>
      <Image
        src="/images/me2.jpg"
        alt="Jay Griffin"
        width={200}
        height={200}
        priority
        className={styles.portrait}
      />
      <PageHeader className={styles.header} />

      <div className={styles.bio}>
        <Paragraph>
          I've been living inside computers since I was five.
        </Paragraph>
        <Paragraph>
          I remember being very curious about our family Windows PC growing
          up. I would navigate through the Start Menu like a maze, and I
          enjoyed playing Microsoft Paint, Pinball, and Solitaire.
        </Paragraph>
        <Paragraph>
          Over time I have realized something important about the many times I
          sat at a computer completely enamored. I realized that the source of
          my curiosity and persistence with using computers usually revolved
          around the mechanics of using them and how they work.
        </Paragraph>
        <Paragraph>
          Microsoft Paint is a good example of what I mean. You see, after all
          those years of playing Paint as a child, you might think I managed
          to produce at least a few decent pieces of artwork. You would be wrong. All I ever managed to create in Paint were artistic abominations.
        </Paragraph>
        <Paragraph>
          So what was I doing then? Well, I liked playing with the tools themselves more than I liked drawing pictures with them. I remember the spray paint and the paint bucket the most. I loved resizing the spray paint and just…
          spraying. I was very interested in how it randomly fills in pixels then eventually fills in perfectly.
        </Paragraph>
        <Paragraph>
          It's the same story
          with the paint bucket. Put two colors on the color picker. Right click to fill one color.
          Left click to fill the other. Do this over and over until everything is one color and
          everything is erased.
        </Paragraph>
        <Paragraph>
          Fast forward to today. I am a software developer still driven by
          that same core insight I felt as a child but didn't have the
          words for: computers are incredibly powerful tools that are fun to
          use. They can enable us to do incredible things perfectly, instantly,
          and at scale.
        </Paragraph>
        <Paragraph>
          Despite the power and ease of computers, it remains difficult to make something truly useful and impactful with them. I now work on software almost every single day trying to do that.
        </Paragraph>
      </div>

      <H2 className={styles.heading}>About me</H2>
      <Questions items={ABOUT_ME} />

      <H2 className={styles.heading}>About this site</H2>
      <Questions items={ABOUT_SITE} />
    </PageLayout>
  );
}

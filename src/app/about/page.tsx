// goatboat: fb29872b-df86-4340-82d7-97b7ffcb6a4c
import Image from "next/image";
import NextLink from "next/link";
import { Paragraph, Small } from "@/components/typography";
import { PageHeader } from "@/components/site/page-header";
import { PageLayout } from "@/components/site/page-layout";
import { type Question } from "@/components/site/question-list";
import { Faq } from "./faq";
import styles from "./page.module.css";

const ABOUT_ME: Question[] = [
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
        Currently I'm spending significant time on this website - building
        new features, improving the framework, and writing. I'm also
        actively working on AI-native dev tools and workflows, AI-native apps,
        and data analysis apps. My newest work often shows up first in{" "}
        <NextLink href="/notes" className={styles.link}>
          my notes
        </NextLink>
        .
      </>
    ),
  },
  {
    question: "What do you actually want to be doing?",
    answer: (
      <>
        I want to build apps end-to-end, from conception to production, and grow them into a software business that supports my life and work indefinitely. I’d also love to work with talented developers and learn from them. In the meantime, when I'm not working on my paid apps, I also like to work on my own software projects and experiments. 
      </>
    ),
  },
  {
    question: "Do you freelance?",
    answer: (
      <>
        Currently no. I'm looking for a full-time role, and I'm also
        interested in selling my own software products. I want to focus on those
        things right now, but maybe in the future. If you have a role in mind,
        my email and resume are on the{" "}
        <NextLink href="/contact" className={styles.link}>
          contact page
        </NextLink>
        .
      </>
    ),
  },
  {
    question: "How do I get in touch?",
    answer: (
      <>
        Email is best. It's on the{" "}
        <NextLink href="/contact" className={styles.link}>
          contact page
        </NextLink>
        , next to my resume, GitHub and LinkedIn.
      </>
    ),
  },
  {
    question: "What do you use to build software?",
    answer: (
      <>
        Languages, frameworks, editors, and everything else I reach for is
        listed in{" "}
        <NextLink href="/my-stack" className={styles.link}>
          my stack
        </NextLink>
        , along with what I actually use each one for and what I've moved on
        from.
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

const ABOUT_SITE: Question[] = [
  {
    question: "Where should I start?",
    answer: (
      <>
        Depends what you're after.{" "}
        <NextLink href="/posts" className={styles.link}>
          Posts
        </NextLink>{" "}
        are my writing.{" "}
        <NextLink href="/projects" className={styles.link}>
          Projects
        </NextLink>{" "}
        are the things I build, each with its own notes.{" "}
        <NextLink href="/notes" className={styles.link}>
          Notes
        </NextLink>{" "}
        lists every note and test across all of them, newest first, if you want
        to see how things are made.
      </>
    ),
  },
  {
    question: "What is this site?",
    answer: (
      <>
        A website that serves as both my workspace and publishing
        platform. I've always wanted my own corner of the internet where I have control over my data and I can do whatever I want. To learn more about the site itself, see the{" "}
        <NextLink href="/projects/jaygriff-v4" className={styles.link}>
          meta project page
        </NextLink>.
      </>
    ),
  },
  {
    question: "What's under the hood?",
    answer: (
      <>
        More than a website. I created and maintain a content database, CMS, API, MCP server, and admin interface in order to organize and manage my projects and notes. The backend powering this website is a separate project I call{" "}
        <NextLink href="/projects/goatboat" className={styles.link}>
          goatboat
        </NextLink>
        .
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

export default function AboutPage() {
  return (
    <PageLayout hideRelated hideToc>
      <div className={styles.top}>
        <Image
          src="/images/me2.jpg"
          alt="Jay Griffin"
          width={200}
          height={200}
          quality={100}
          priority
          className={styles.portrait}
        />
        <PageHeader className={styles.header} intro="A bit about how I got here, plus a Q&A for fun." />
      </div>

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
        <figure className={styles.painting}>
          <Image
            src="/images/paint3.png"
            alt="A Microsoft Paint drawing by Jay"
            width={538}
            height={372}
            // Paint art loses its hard edges to Next's WebP/AVIF re-encode, so serve the PNG as-is
            unoptimized
            // The largest thing on the page, so it shouldn't wait to load
            loading="eager"
            className={styles.paintingImage}
          />
          <figcaption>
            <Small>Exhibit A.</Small>
          </figcaption>
        </figure>
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
          Despite the power and ease of using computers, it remains difficult to make something truly useful and impactful with them. I now work on software almost every single day trying to do that.
        </Paragraph>
      </div>

      <Faq
        sections={[
          { heading: "About me", items: ABOUT_ME },
          { heading: "About this site", items: ABOUT_SITE },
        ]}
      />
    </PageLayout>
  );
}

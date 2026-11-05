// goatboat: fb29872b-df86-4340-82d7-97b7ffcb6a4c
import Image from "next/image";
import NextLink from "next/link";
import { Paragraph, Small } from "@/components/typography";
import { PageHeader } from "@/components/site/page-header";
import { PageLayout } from "@/components/site/page-layout";
import { PageTabs } from "@/components/site/page-tabs";
import { type Question } from "@/components/site/question-list";
import { Faq } from "./faq";
import styles from "./page.module.css";

const ABOUT_ME: Question[] = [
  {
    question: "Who are you?",
    answer: (
      <>
        I'm Jay, a software-developing person. This is my website, and that's a picture of me up there at the top of the page. I do other things too - like running, hiking, reading, and writing. 
      </>
    ),
  },
  {
    question: "What kind of development do you do?",
    answer: (
      <>
        I often build full-stack TypeScript apps, usually in the form of a website. To do this I work with many an API, cloud service, or JavaScript library. I also constantly worry about performance, security, and scalability, despite many of my apps' general lack of need for any of those things. Further, I often find myself wrangling data, whether that's gathering it, modeling it, analyzing it, or making it look pretty. If you want to see what I've made, check out my{" "}
        <NextLink href="/projects" className={styles.link}>
          projects
        </NextLink>
        .
      </>
    ),
  },
  {
    question: "What do you use to build software?",
    answer: (
      <>
        Many of the tools I use to make software are listed in{" "}
        <NextLink href="/my-stack" className={styles.link}>
          my stack
        </NextLink>, along with what I've moved on from.
      </>
    ),
  },
  {
    question: "What are you focused on right now?",
    answer: (
      <>
        Currently I'm spending significant time on{" "}
        <NextLink href="/projects/jaygriff-v4" className={styles.link}>
          this website
        </NextLink>
        . It's one of my most important tools for developing software because it helps me organize and publish my work. Alongside it I'm building{" "}
        <NextLink href="/projects/goatboat" className={styles.link}>
          goatboat
        </NextLink>
        , the backend that powers all my sites. When I'm not working on those, I frequently build lots of little tools and experiments. My newest work often shows up first in{" "}
        <NextLink href="/notes" className={styles.link}>
          my notes
        </NextLink>
        .
      </>
    ),
  },
  {
    question: "What are you focused on long term?",
    answer: (
      <>
        I want to create thoughtful, useful paid apps end-to-end, from conception to production, and have them support my life and work. Once said business equilibrium is reached, I'd like to continue developing my ideas and contributing to projects I find meaningful.
      </>
    ),
  },
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
    question: "Where should I start?",
    answer: (
      <>
        Depends on what you're after.{" "}
        <NextLink href="/posts" className={styles.link}>
          Posts
        </NextLink>{" "}
        is my writing.{" "}
        <NextLink href="/projects" className={styles.link}>
          Projects
        </NextLink>{" "}
        is the things I've made.{" "}
        <NextLink href="/notes" className={styles.link}>
          Notes
        </NextLink>{" "}
        is the knowledge base I maintain in order to help myself build software.
      </>
    ),
  },
  {
    question: "What's under the hood?",
    answer: (
      <>
        More than a website. The backend powering this website is a separate project I call{" "}
        <NextLink href="/projects/goatboat" className={styles.link}>
          goatboat
        </NextLink>
        . It's a content database, CMS, API, and MCP server that helps me manage the deluge of content generated from my work.
      </>
    ),
  },
  {
    question: "How long did this take to build?",
    answer: (
      <>
        This version of the site is fairly recent, but this site has seen many versions and the methods used to develop it have been refined over years of iteration.
      </>
    ),
  },
];

function Story() {
  return (
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
          to produce at least a few decent pieces of artwork. You would be wrong. Everything I ever made in Paint was a disaster.
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
          spraying. I was very interested in how it randomly filled in pixels until they all fit perfectly.
        </Paragraph>
        <Paragraph>
          It's the same story
          with the paint bucket. Put two colors on the color picker. Right click to fill one color.
          Left click to fill the other. Do this over and over until everything is one color and
          everything is erased.
        </Paragraph>
        <Paragraph>
          Fast forward to today. I am a software developer still driven by
          the same core insight I felt as a child but didn't fully recognize: computers are incredibly powerful tools that are fun to
          use. They can enable us to do incredible things perfectly, instantly,
          and at scale.
        </Paragraph>
        <Paragraph>
          Despite the power and ease of using computers, it remains difficult to make something truly useful and impactful with them. I now work on software almost every single day trying to do that.
        </Paragraph>
      </div>
  );
}

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
        <PageHeader className={styles.header} titleClassName={styles.title} intro="A bit about how I got here, plus a Q&A for fun." separator={false} />
      </div>

      <PageTabs
        listClassName={styles.tabList}
        tabClassName={styles.tab}
        tabs={[
          { id: "story-time", label: "Story Time", children: <Story /> },
          {
            id: "q-and-a",
            label: "Q&A",
            children: (
              <Faq
                sections={[
                  { heading: "About me", items: ABOUT_ME },
                  { heading: "About this site", items: ABOUT_SITE },
                ]}
              />
            ),
          },
        ]}
      />
    </PageLayout>
  );
}

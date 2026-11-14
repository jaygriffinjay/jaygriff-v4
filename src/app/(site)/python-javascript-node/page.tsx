// goatboat: 4c7450fa-818d-4159-a166-c9f2dd7ab1d4
import { CodeBlock } from "@/components/code-block/CodeBlock";
import { MarkdownRenderer } from "@/components/markdown/MarkdownRenderer";
import { PageHeader } from "@/components/site/page-header";
import { PageLayout } from "@/components/site/page-layout";
import { Bold, H2, H3, InlineCode, List, ListItem, Muted, Paragraph } from "@/components/typography";
import {
  backgroundFiles,
  beforeAfter,
  flaskFiles,
  flowFiles,
  nodeFiles,
  nodeVsBrowserFiles,
  pythonFiles,
  sideBySideFiles,
  websiteFiles,
  whereThingsRun,
} from "./examples";

const cheatSheet = `
| | Python | JavaScript in a browser | Node.js |
| --- | --- | --- | --- |
| The language | Python | JavaScript | JavaScript |
| Where it runs | A server, or your own computer | The visitor's browser | A server, or your own computer |
| Has a page to change | No | Yes (the DOM) | No |
| Reads files | Yes | Only ones the user picks | Yes |
| Makes webpages by | Filling in HTML templates (Flask, Django) | It is the code inside the webpage | Templates or JSON (Express and friends) |
| Packages | \`pip install\` | \`npm install\`, then bundled into the page | \`npm install\` |
| Run it with | \`python main.py\` | Open the HTML file | \`node main.js\` |
`;

/** A walk through Python, JavaScript and Node.js: where each one runs and what it can do. */
export default function PythonJavascriptNodePage() {
  return (
    <PageLayout>
      <PageHeader intro="Where Python, JavaScript and Node.js each run, what each one can do, and how they fit together, with working examples." />

      <H2>The short version</H2>
      <Paragraph>
        Python and JavaScript are programming languages. Node.js isn't a language: it's a way to run JavaScript outside
        a browser, on a computer with no screen and no page. The big difference between all of them isn't the syntax.
        It's <Bold>where the code runs</Bold> and <Bold>what it's allowed to touch</Bold>.
      </Paragraph>
      <CodeBlock files={[whereThingsRun]} lineNumbers={false} />
      <List>
        <ListItem>
          <Bold>The browser</Bold> runs HTML, CSS and JavaScript. Everything arrives from a server and runs on the
          visitor's own computer.
        </ListItem>
        <ListItem>
          <Bold>A server</Bold> is just a computer you control. Python or Node.js programs run there, with no page and
          no buttons, only a terminal.
        </ListItem>
        <ListItem>
          <Bold>JavaScript is the same language in both places.</Bold> What changes is the toolbox: a browser has a
          page to change, and Node.js has files and servers.
        </ListItem>
      </List>

      <H2>What runs in the browser</H2>
      <Paragraph>
        A website is a folder of files. The browser downloads them and does everything itself: HTML says what's on the
        page, CSS says how it looks, JavaScript says what it does. Click through the files in the explorer.
      </Paragraph>
      <CodeBlock files={websiteFiles} />
      <Paragraph>
        None of this needs Python or Node.js. You could double-click <InlineCode>index.html</InlineCode> and it works.
      </Paragraph>

      <H2>Python on a server</H2>
      <Paragraph>
        On its own, Python is just a program. There's no page and no buttons: it runs, prints text to a terminal, and
        stops. Here's a small project, and what you see when you run it.
      </Paragraph>
      <CodeBlock files={pythonFiles} />
      <Muted>
        A server is just a computer that runs programs like this one and answers requests from other computers. There's
        nothing special about the hardware.
      </Muted>

      <H2>Node.js on a server</H2>
      <Paragraph>
        Node.js is the same idea with JavaScript. There's still no page, just a terminal. Look at how little changes:{" "}
        <InlineCode>console.log</InlineCode> instead of <InlineCode>print</InlineCode>, and{" "}
        <InlineCode>function</InlineCode> instead of <InlineCode>def</InlineCode>. The output is identical.
      </Paragraph>
      <CodeBlock files={nodeFiles} />

      <H2>The same program in both</H2>
      <Paragraph>
        The same little program in Python and in JavaScript, with a cheat sheet for what lines up with what.
      </Paragraph>
      <CodeBlock files={sideBySideFiles} />

      <H2>How Python makes webpages</H2>
      <Paragraph>
        Flask is a Python library for building a web server. A browser asks it for a page, and Python answers. There
        are two ways Python and the page work together:
      </Paragraph>
      <List>
        <ListItem>
          <Bold>Templating.</Bold> The HTML has blanks like <InlineCode>{"{{ name }}"}</InlineCode>. Python fills them
          in and sends the finished page. The browser never sees the Python.
        </ListItem>
        <ListItem>
          <Bold>Requests.</Bold> JavaScript in the page asks Python for data with <InlineCode>fetch()</InlineCode> and
          gets an answer back, without reloading the page.
        </ListItem>
      </List>
      <CodeBlock files={flaskFiles} />

      <H2>Node.js versus the browser</H2>
      <Paragraph>
        Node.js and browser JavaScript are the same language with different toolboxes. Browsers have{" "}
        <InlineCode>document</InlineCode> and <InlineCode>window</InlineCode>. Node.js has the file system and can run
        a server. Each is missing what the other has, and for good reasons: a server has no page to change, and a
        browser shouldn't be able to read your files.
      </Paragraph>
      <CodeBlock files={nodeVsBrowserFiles} />

      <H2>Removing a background, three ways</H2>
      <Paragraph>
        A background remover is a good test: it can run in the browser, in Python, or in Node.js. The result is the
        same. What differs is <Bold>where the work happens</Bold>, and who has to get the photo to it.
      </Paragraph>

      <H3>Before and after</H3>
      <CodeBlock files={[beforeAfter]} lineNumbers={false} />

      <H3>The code in each place</H3>
      <CodeBlock files={backgroundFiles} />
      <List>
        <ListItem>
          <Bold>In the browser,</Bold> the work happens on the visitor's own computer. The photo never leaves it, and
          you pay for nothing. But the visitor's phone does the heavy lifting, and has to download the model first.
        </ListItem>
        <ListItem>
          <Bold>On a Python or Node.js server,</Bold> the work happens on your computer. It's consistent and fast, but
          the visitor has to send you the photo, and you pay for the server.
        </ListItem>
      </List>
      <Muted>
        These show the shape of each approach, not copy-and-paste code. Package names and options change, so check each
        library's docs before using one.
      </Muted>

      <H3>Getting the server's result back to the user</H3>
      <Paragraph>
        A server can't hand a file to someone's browser by itself. The browser has to ask. The page sends the photo with{" "}
        <InlineCode>fetch()</InlineCode>, the server does the work and answers with the new image, and the page shows
        it. The server side works the same in Python and in Node.js.
      </Paragraph>
      <CodeBlock files={flowFiles} />

      <H2>Cheat sheet</H2>
      <MarkdownRenderer source={cheatSheet} />
    </PageLayout>
  );
}

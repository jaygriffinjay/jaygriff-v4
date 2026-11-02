// goatboat: 2ae68835-c59e-4ca6-b60b-093c14faeb7d
import { H2, H3, InlineCode, List, ListItem, Paragraph } from "@/components/typography";
import { PageHeader } from "@/components/site/page-header";
import { PageLayout } from "@/components/site/page-layout";
import { CodeBlock } from "@/components/code-block/CodeBlock";
import {
  deepNesting,
  hugeExplorer,
  longFileNames,
  longIdentifiers,
  longJson,
  longStrings,
  manyFiles,
  manyLines,
  minified,
  oneLine,
  shellCommand,
  unicode,
  unknownLanguage,
} from "./samples";

const longIdentifier =
  "useAbstractSingletonProxyFactoryBeanNotificationPreferencesManagerWithRetryAndExponentialBackoff";
const longUrl =
  "https://example.com/api/v2/organizations/some-organization/workspaces/some-workspace/projects/some-project/environments/production/deployments?include=logs,metrics,traces&limit=1000";
const longPath =
  "src/components/really/deeply/nested/folder/structure/that/goes/on/forever/ComponentNumber12WithAVeryLongName.tsx";
const longHash = "sha512-AbCdEfGhIjKlMnOpQrStUvWxYz0123456789AbCdEfGhIjKlMnOpQrStUvWxYz0123456789==";

export default function CodeStressPage() {
  return (
    <PageLayout>
      <PageHeader />

      <H2>Inline code</H2>

      <H3>Long identifier mid-sentence</H3>
      <Paragraph>
        Call <InlineCode>{longIdentifier}</InlineCode> once per render and pass the result down.
      </Paragraph>

      <H3>Long URL</H3>
      <Paragraph>
        The endpoint is <InlineCode>{longUrl}</InlineCode>, which returns paginated results.
      </Paragraph>

      <H3>Long path and hash</H3>
      <Paragraph>
        Open <InlineCode>{longPath}</InlineCode> and compare its integrity hash{" "}
        <InlineCode>{longHash}</InlineCode> against the lockfile.
      </Paragraph>

      <H3>Many short ones in a row</H3>
      <Paragraph>
        <InlineCode>a</InlineCode> <InlineCode>b</InlineCode> <InlineCode>useState</InlineCode>{" "}
        <InlineCode>useEffect</InlineCode> <InlineCode>useMemo</InlineCode>{" "}
        <InlineCode>useCallback</InlineCode> <InlineCode>useRef</InlineCode>{" "}
        <InlineCode>useContext</InlineCode> <InlineCode>useReducer</InlineCode>{" "}
        <InlineCode>useLayoutEffect</InlineCode> <InlineCode>useTransition</InlineCode>{" "}
        <InlineCode>useDeferredValue</InlineCode> <InlineCode>useId</InlineCode>{" "}
        <InlineCode>useSyncExternalStore</InlineCode> <InlineCode>useOptimistic</InlineCode>{" "}
        <InlineCode>useActionState</InlineCode>
      </Paragraph>

      <H3>Whitespace, symbols, and unicode</H3>
      <Paragraph>
        <InlineCode>{"<div className={cn(\"a\", b && \"c\")} />"}</InlineCode>,{" "}
        <InlineCode>{"a   b    c     (multiple spaces)"}</InlineCode>,{" "}
        <InlineCode>こんにちは世界</InlineCode>, <InlineCode>👩‍💻🚀</InlineCode>,{" "}
        <InlineCode>{"=> !== ?? ||= &&= ..."}</InlineCode>
      </Paragraph>

      <H3>In a list</H3>
      <List>
        <ListItem>
          <InlineCode>{longIdentifier}</InlineCode>
        </ListItem>
        <ListItem>
          Set <InlineCode>{longUrl}</InlineCode> as the base URL.
        </ListItem>
      </List>

      <H3>
        In a heading: <InlineCode>{longIdentifier}</InlineCode>
      </H3>

      <H2>Code blocks</H2>

      <H3>Long identifiers and a long path</H3>
      <CodeBlock files={[longIdentifiers]} />

      <H3>Long strings (URL, base64, template)</H3>
      <CodeBlock files={[longStrings]} />

      <H3>Minified, one giant line</H3>
      <CodeBlock files={[minified]} />

      <H3>Deep nesting</H3>
      <CodeBlock files={[deepNesting]} />

      <H3>Unicode, emoji, tabs, trailing whitespace</H3>
      <CodeBlock files={[unicode]} />

      <H3>Long shell command</H3>
      <CodeBlock files={[shellCommand]} />

      <H3>Long JSON values</H3>
      <CodeBlock files={[longJson]} />

      <H3>Unknown language</H3>
      <CodeBlock files={[unknownLanguage]} />

      <H3>One character, no path</H3>
      <CodeBlock files={[oneLine]} />

      <H3>12 files with long names</H3>
      <CodeBlock files={manyFiles} />

      <H3>60 files in the explorer</H3>
      <CodeBlock files={hugeExplorer} />

      <H3>Very long file names in the explorer</H3>
      <CodeBlock files={longFileNames} />

      <H3>1,200 lines (four-digit line numbers)</H3>
      <CodeBlock files={[manyLines]} />
    </PageLayout>
  );
}

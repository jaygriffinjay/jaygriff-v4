import type { CodeFile } from "@/components/code-block/types";

export const longIdentifiers: CodeFile = {
  path: "src/features/account-settings/notifications/internal/useAbstractSingletonProxyFactoryBeanNotificationPreferencesManager.ts",
  content: `export function useAbstractSingletonProxyFactoryBeanNotificationPreferencesManagerWithRetryAndExponentialBackoff(
  userAccountNotificationPreferencesConfigurationOverridesByWorkspaceIdentifier: Record<string, NotificationPreferencesConfigurationOverride>,
) {
  const resolvedNotificationPreferencesConfigurationAfterApplyingWorkspaceLevelOverridesAndOrganizationDefaults = resolveNotificationPreferencesConfiguration(userAccountNotificationPreferencesConfigurationOverridesByWorkspaceIdentifier);
  return resolvedNotificationPreferencesConfigurationAfterApplyingWorkspaceLevelOverridesAndOrganizationDefaults;
}
`,
};

export const longStrings: CodeFile = {
  path: "config/secrets.example.ts",
  content: `export const DATABASE_URL = "postgresql://neondb_owner:npg_aVeryLongFakePasswordThatJustKeepsGoingAndGoing1234567890@ep-some-really-long-endpoint-name-a1b2c3d4.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
export const AVATAR_PLACEHOLDER = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";
export const ERROR_MESSAGE = \`Something went wrong while trying to synchronize the notification preferences for workspace \${workspaceId} and user \${userId}; please try again later or contact support with request id \${requestId}.\`;
`,
};

export const minified: CodeFile = {
  path: "public/vendor.min.js",
  content: `!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e="undefined"!=typeof globalThis?globalThis:e||self).Thing=t()}(this,function(){"use strict";var e={a:1,b:2,c:3},t=function(t){return Object.keys(e).map(function(n){return n+"="+e[n]+t}).join("&")};return{run:t,version:"1.0.0-alpha.123456789+build.abcdef0123456789"}});`,
};

export const deepNesting: CodeFile = {
  path: "src/pyramid.ts",
  content: `export function pyramid(a: unknown) {
  if (a) {
    if (Array.isArray(a)) {
      for (const b of a) {
        if (typeof b === "object" && b !== null) {
          for (const [key, value] of Object.entries(b)) {
            if (value) {
              try {
                if (typeof value === "function") {
                  return value(() => {
                    return new Promise((resolve) => {
                      setTimeout(() => {
                        resolve({ key, nested: { deeper: { deepest: { stillGoing: "yes, still going" } } } });
                      }, 0);
                    });
                  });
                }
              } catch {}
            }
          }
        }
      }
    }
  }
}
`,
};

export const unicode: CodeFile = {
  path: "src/i18n/strings.ts",
  content: `export const greetings = {
  ja: "こんにちは、世界！これは非常に長い日本語の文字列で、折り返しやスクロールの挙動を確認するためのものです。",
  zh: "你好，世界！这是一个很长的中文字符串，用来测试换行和滚动。",
  ar: "مرحبا بالعالم! هذا نص عربي طويل لاختبار الاتجاه من اليمين إلى اليسار",
  emoji: "🚀🔥✨👩‍💻👨‍👩‍👧‍👦🏳️‍🌈 combined emoji sequences and skin tones 👋🏽👋🏿",
  zalgo: "Z̷̢̛a̴͓͝l̸̰̎g̶̱̈o̵̦͑ text",
};
	// a line indented with a real tab character
const trailingWhitespace = true;      
`,
};

export const shellCommand: CodeFile = {
  path: "scripts/deploy.sh",
  content: `docker run --rm -it --name my-extremely-long-container-name-for-testing -e DATABASE_URL="$DATABASE_URL" -e NODE_ENV=production -v "$(pwd)/data:/app/data:ro" -p 3000:3000 --memory=2g --cpus=1.5 ghcr.io/someorganization/some-very-long-image-name:2026.10.10-sha-abcdef0123456789 npm run start -- --port 3000 --hostname 0.0.0.0
`,
};

export const longJson: CodeFile = {
  path: "package-lock-excerpt.json",
  content: `{
  "node_modules/@some-scope/some-extremely-long-package-name-that-nobody-should-ever-publish": {
    "version": "12.34.56-canary.20261010.abcdef0123456789",
    "resolved": "https://registry.npmjs.org/@some-scope/some-extremely-long-package-name-that-nobody-should-ever-publish/-/some-extremely-long-package-name-that-nobody-should-ever-publish-12.34.56.tgz",
    "integrity": "sha512-AbCdEfGhIjKlMnOpQrStUvWxYz0123456789AbCdEfGhIjKlMnOpQrStUvWxYz0123456789AbCdEfGhIjKlMnOpQrStUvWxYz=="
  }
}
`,
};

export const unknownLanguage: CodeFile = {
  path: "notes/README.weirdextension",
  content: "plain text with an unknown extension, which should fall back to no highlighting at all",
};

export const oneLine: CodeFile = {
  content: "x",
};

// 1,200 lines so line numbers hit four digits
export const manyLines: CodeFile = {
  path: "src/generated/constants.ts",
  content: Array.from(
    { length: 1200 },
    (_, i) => `export const GENERATED_CONSTANT_${String(i + 1).padStart(4, "0")} = ${i * 37};`,
  ).join("\n"),
};

const longName = (n: number) =>
  `src/components/really/deeply/nested/folder/structure/that/goes/on/forever/ComponentNumber${n}WithAVeryLongName.tsx`;

// enough long tabs to overflow the tab strip and the explorer
export const manyFiles: CodeFile[] = Array.from({ length: 12 }, (_, i) => ({
  path: longName(i + 1),
  content: `export function ComponentNumber${i + 1}WithAVeryLongName() {\n  return null;\n}\n`,
}));

const extensions = ["ts", "tsx", "css", "json", "md"];

// far more files than the explorer is tall
export const hugeExplorer: CodeFile[] = Array.from({ length: 60 }, (_, i) => {
  const extension = extensions[i % extensions.length];
  return {
    path: `src/module-${String(i + 1).padStart(2, "0")}/file-${i + 1}.${extension}`,
    content: `// file ${i + 1} of 60\n`,
  };
});

// the file names themselves are long, mixed with short ones, so truncation shows against normal rows
export const longFileNames: CodeFile[] = [
  { path: "a.ts", content: "export const a = 1;\n" },
  {
    path: "src/useAbstractSingletonProxyFactoryBeanNotificationPreferencesManagerWithRetryAndExponentialBackoff.ts",
    content: "export {};\n",
  },
  { path: "index.ts", content: "export * from \"./a\";\n" },
  {
    path: "2026-11-01-meeting-notes-about-the-quarterly-planning-session-final-final-v3-REALLY-final.md",
    content: "# Notes\n",
  },
  { path: "really_long_snake_case_file_name_with_no_hyphens_or_dots_until_the_very_end.py", content: "pass\n" },
  { path: "日本語のとても長いファイル名で折り返しと省略を確認する.ts", content: "export {};\n" },
  { path: "x.css", content: ".x {}\n" },
];

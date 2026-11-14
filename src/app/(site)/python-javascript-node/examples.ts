import type { CodeFile } from "@/components/code-block/types";

// Helpers that draw the ASCII diagrams, so every box is exactly as wide as it says
const width = (text: string) => [...text].length;
const padEnd = (text: string, to: number) => text + " ".repeat(Math.max(0, to - width(text)));
const center = (text: string, to: number) => {
  const total = Math.max(0, to - width(text));
  const before = Math.floor(total / 2);
  return " ".repeat(before) + text + " ".repeat(total - before);
};

/** A box `inner` characters wide with exactly `rows` lines of text in it. */
function box(inner: number, rows: number, lines: string[]) {
  const body = Array.from({ length: rows }, (_, i) => "│" + padEnd(" " + (lines[i] ?? ""), inner) + "│");
  return ["┌" + "─".repeat(inner) + "┐", ...body, "└" + "─".repeat(inner) + "┘"];
}

/** Two boxes with `gap` characters between them; `middle` puts text in the gap, by row (row 0 is the top border). */
function sideBySide(left: string[], right: string[], gap: number, middle: Record<number, string> = {}) {
  return left.map((line, i) => line + center(middle[i] ?? "", gap) + right[i]).join("\n");
}

/** Two columns of text, the left one `leftWidth` wide. */
const columns = (rows: [string, string][], leftWidth: number) =>
  rows.map(([left, right]) => (padEnd(left, leftWidth) + right).trimEnd()).join("\n");

const arrowRight = (gap: number) => "─".repeat(gap - 3) + "►";
const arrowLeft = (gap: number) => "◄" + "─".repeat(gap - 3);

// ─── The three worlds ───────────────────────────────────────────────────────

const whereThingsRunDiagram = sideBySide(
  box(26, 8, [
    "BROWSER  (the client)",
    "",
    "HTML  what's on the page",
    "CSS   how it looks",
    "JS    what it does",
    "",
    "Runs on YOUR computer",
  ]),
  box(22, 8, [
    "SERVER",
    "",
    "Python   (Flask)",
    "   or",
    "Node.js  (Express)",
    "",
    "Runs on a computer",
    "somewhere else",
  ]),
  14,
  { 4: "the internet", 5: "◄" + "─".repeat(12) + "►" },
);

export const whereThingsRun: CodeFile = {
  path: "where-things-run.txt",
  content: whereThingsRunDiagram,
};

// ─── A website: everything the browser runs ─────────────────────────────────

export const websiteFiles: CodeFile[] = [
  {
    path: "website/index.html",
    content: `<!DOCTYPE html>
<html>
  <head>
    <title>My first page</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <h1>Hello!</h1>
    <img src="images/cat.png" alt="A cat" />
    <button id="greet">Say hi</button>
    <p id="message"></p>

    <script src="script.js"></script>
  </body>
</html>`,
  },
  {
    path: "website/style.css",
    content: `body {
  font-family: sans-serif;
  text-align: center;
}

h1 {
  color: royalblue;
}

img {
  width: 200px;
}`,
  },
  {
    path: "website/script.js",
    content: `// Runs in the browser, on the visitor's computer, after the page loads
const button = document.querySelector("#greet");
const message = document.querySelector("#message");

button.addEventListener("click", () => {
  message.textContent = "Hi! You clicked the button.";
});`,
  },
  {
    path: "website/images/cat.png",
    content: ` /\\_/\\
( o.o )    Pretend this is a cat.png.
 > ^ <     Images are binary files, not text:
           the browser downloads them and draws them.`,
  },
  {
    path: "website/how-it-works.txt",
    content: [
      "1. The browser asks a server for index.html.",
      "",
      "2. It reads the HTML and finds three more things it needs:",
      "",
      "      style.css   ->  asks for it, applies the styles",
      "      script.js   ->  asks for it, runs it",
      "      cat.png     ->  asks for it, draws it",
      "",
      "3. The JavaScript can now change the page while you look at it.",
      "",
      "Everything in this folder ends up on the visitor's computer.",
      "No Python or Node.js is involved: this is a complete website.",
    ].join("\n"),
  },
];

// ─── Python and Node on their own ───────────────────────────────────────────

export const pythonFiles: CodeFile[] = [
  {
    path: "python-project/main.py",
    content: `from math_helpers import add, subtract, multiply, greet

print("Hello from Python!")
print(greet("Jay"))
print("2 + 3 =", add(2, 3))
print("10 - 4 =", subtract(10, 4))
print("6 x 7 =", multiply(6, 7))

# a list and a loop
for number in [1, 2, 3]:
    print("number:", number)`,
  },
  {
    path: "python-project/math_helpers.py",
    content: `def add(a, b):
    return a + b


def subtract(a, b):
    return a - b


def multiply(a, b):
    return a * b


def greet(name):
    return "Hello, " + name + "!"`,
  },
  {
    path: "python-project/terminal.txt",
    content: `$ python main.py
Hello from Python!
Hello, Jay!
2 + 3 = 5
10 - 4 = 6
6 x 7 = 42
number: 1
number: 2
number: 3`,
  },
];

export const nodeFiles: CodeFile[] = [
  {
    path: "node-project/main.js",
    content: `import { add, subtract, multiply, greet } from "./mathHelpers.js";

console.log("Hello from Node!");
console.log(greet("Jay"));
console.log("2 + 3 =", add(2, 3));
console.log("10 - 4 =", subtract(10, 4));
console.log("6 x 7 =", multiply(6, 7));

// an array and a loop
for (const number of [1, 2, 3]) {
  console.log("number:", number);
}`,
  },
  {
    path: "node-project/mathHelpers.js",
    content: `export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}

export function multiply(a, b) {
  return a * b;
}

export function greet(name) {
  return "Hello, " + name + "!";
}`,
  },
  {
    path: "node-project/package.json",
    content: `{
  "name": "node-project",
  "type": "module"
}`,
  },
  {
    path: "node-project/terminal.txt",
    content: `$ node main.js
Hello from Node!
Hello, Jay!
2 + 3 = 5
10 - 4 = 6
6 x 7 = 42
number: 1
number: 2
number: 3`,
  },
];

// ─── The same program, side by side ─────────────────────────────────────────

export const sideBySideFiles: CodeFile[] = [
  {
    path: "python/main.py",
    content: `def add(a, b):
    return a + b


name = "Jay"
numbers = [1, 2, 3]

print("Hello,", name)

for n in numbers:
    if n > 2:
        print(n, "is big")
    else:
        print(n, "is small")

print("2 + 3 =", add(2, 3))`,
  },
  {
    path: "node/main.js",
    content: `function add(a, b) {
  return a + b;
}

const name = "Jay";
const numbers = [1, 2, 3];

console.log("Hello,", name);

for (const n of numbers) {
  if (n > 2) {
    console.log(n, "is big");
  } else {
    console.log(n, "is small");
  }
}

console.log("2 + 3 =", add(2, 3));`,
  },
  {
    path: "compare.txt",
    content: columns(
      [
        ["Python", "JavaScript (Node.js or a browser)"],
        ["──────────────────────────────", "──────────────────────────────"],
        ['print("hi")', 'console.log("hi");'],
        ["# a comment", "// a comment"],
        ['name = "Jay"', 'const name = "Jay";'],
        ["numbers = [1, 2, 3]", "const numbers = [1, 2, 3];"],
        ["", ""],
        ["def add(a, b):", "function add(a, b) {"],
        ["    return a + b", "  return a + b;"],
        ["", "}"],
        ["", ""],
        ["for n in numbers:", "for (const n of numbers) {"],
        ["    print(n)", "  console.log(n);"],
        ["", "}"],
        ["", ""],
        ["if n > 2:", "if (n > 2) {"],
        ["    print(\"big\")", "  console.log(\"big\");"],
        ["else:", "} else {"],
        ["    print(\"small\")", "  console.log(\"small\");"],
        ["", "}"],
        ["", ""],
        ["True  False  None", "true  false  null"],
        ['f"Hi {name}"', "`Hi ${name}`"],
        ["", ""],
        ["Indentation is the structure", "Braces { } are the structure"],
      ],
      32,
    ),
  },
];

// ─── Python makes webpages with Flask ───────────────────────────────────────

export const flaskFiles: CodeFile[] = [
  {
    path: "flask-app/app.py",
    content: `from flask import Flask, render_template, request, jsonify

app = Flask(__name__)


@app.route("/")
def home():
    # Python fills in the blanks in templates/index.html
    return render_template("index.html", name="Jay", items=["apples", "bread", "milk"])


@app.route("/api/add")
def add():
    # Called by the JavaScript in the page: /api/add?a=2&b=3
    a = int(request.args["a"])
    b = int(request.args["b"])
    return jsonify(result=a + b)


if __name__ == "__main__":
    app.run(debug=True)`,
  },
  {
    path: "flask-app/templates/index.html",
    content: `<!DOCTYPE html>
<html>
  <head>
    <title>Hello {{ name }}</title>
    <link rel="stylesheet" href="{{ url_for('static', filename='style.css') }}" />
  </head>
  <body>
    <h1>Hello, {{ name }}!</h1>

    <ul>
      {% for item in items %}
        <li>{{ item }}</li>
      {% endfor %}
    </ul>

    <button id="add">What is 2 + 3?</button>
    <p id="answer"></p>

    <script src="{{ url_for('static', filename='script.js') }}"></script>
  </body>
</html>`,
  },
  {
    path: "flask-app/static/style.css",
    content: `body {
  font-family: sans-serif;
  text-align: center;
}`,
  },
  {
    path: "flask-app/static/script.js",
    content: `// Plain browser JavaScript. Flask serves it like any other file.
document.querySelector("#add").addEventListener("click", async () => {
  const response = await fetch("/api/add?a=2&b=3");
  const data = await response.json();

  document.querySelector("#answer").textContent = "The server says: " + data.result;
});`,
  },
  {
    path: "flask-app/how-it-works.txt",
    content: [
      " BROWSER                                      FLASK (Python)",
      " -------                                      --------------",
      "",
      " asks for the page",
      " GET /  ───────────────────────────────────►  home() runs",
      "                                              fills in index.html:",
      "                                                {{ name }}  ->  Jay",
      "                                                {% for %}   ->  3 <li> items",
      "        ◄───────────────────────────────────  sends back finished HTML",
      "",
      " draws the page, runs script.js",
      "",
      " you click the button",
      " GET /api/add?a=2&b=3  ────────────────────►  add() runs",
      "        ◄───────────────────────────────────  sends back {\"result\": 5}",
      "",
      " script.js puts the 5 on the page",
      "",
      "",
      " The browser never sees the Python, or the {{ }} blanks.",
      " It only gets the finished HTML.",
    ].join("\n"),
  },
];

// ─── Node versus the browser ────────────────────────────────────────────────

const nodeVsBrowserDiagram = sideBySide(
  box(34, 15, [
    "NODE.JS  (on a server)",
    "",
    "Same language: JavaScript",
    "",
    "CAN",
    "  read and write files",
    "  run a web server",
    "  talk to databases",
    "  keep secrets (API keys)",
    "",
    "CAN'T",
    "  see a page or a screen",
    "  use document or window",
    "  click, scroll, use a camera",
  ]),
  box(34, 15, [
    "BROWSER  (on your computer)",
    "",
    "Same language: JavaScript",
    "",
    "CAN",
    "  change the page (the DOM)",
    "  react to clicks and typing",
    "  use the camera, if you allow it",
    "  fetch() data from a server",
    "",
    "CAN'T",
    "  read your files on its own",
    "  run a web server",
    "  keep secrets: anyone can read",
    "  all the code it receives",
  ]),
  2,
);

export const nodeVsBrowserFiles: CodeFile[] = [
  { path: "node-vs-browser.txt", content: nodeVsBrowserDiagram },
  {
    path: "node-only.js",
    content: `// Works in Node.js. Fails in a browser.
import { readFile } from "node:fs/promises";

const text = await readFile("notes.txt", "utf8");
console.log(text);

// And this fails in Node.js, because there is no page:
console.log(document.title);
// ReferenceError: document is not defined`,
  },
  {
    path: "browser-only.js",
    content: `// Works in a browser. Fails in Node.js.
document.title = "Changed from JavaScript";
document.querySelector("h1").textContent = "Hello again";

// And a browser has no file system to read from:
// import { readFile } from "node:fs/promises";
// -> an error: the browser has nothing called "node:fs/promises"`,
  },
];

// ─── Removing a background ──────────────────────────────────────────────────

const portrait = (background: string) => [
  background.repeat(20),
  background.repeat(7) + "▄████▄" + background.repeat(7),
  background.repeat(7) + "██████" + background.repeat(7),
  background.repeat(7) + "▀████▀" + background.repeat(7),
  background.repeat(4) + "▄▄████████▄▄" + background.repeat(4),
  background.repeat(3) + "██████████████" + background.repeat(3),
  background.repeat(3) + "██████████████" + background.repeat(3),
];

const withBackground = portrait("░");
const withoutBackground = portrait("·");

export const beforeAfter: CodeFile = {
  path: "before-and-after.txt",
  content: [
    padEnd("photo.jpg", 32) + "photo.png",
    "",
    ...withBackground.map((line, i) => padEnd(line, 20) + (i === 4 ? "  ───────►  " : "            ") + withoutBackground[i]),
    "",
    padEnd("all one picture", 32) + "only the person is left",
    padEnd("", 32) + "(· means transparent)",
  ].join("\n"),
};

export const backgroundFiles: CodeFile[] = [
  {
    path: "in-the-browser/remove-bg.js",
    content: `// Runs in the visitor's browser. The photo never leaves their computer.
import { removeBackground } from "@imgly/background-removal";

const input = document.querySelector("#photo");
const output = document.querySelector("#result");

input.addEventListener("change", async () => {
  const file = input.files[0];
  const blob = await removeBackground(file);  // a PNG with a transparent background
  output.src = URL.createObjectURL(blob);     // show it on the page
});`,
  },
  {
    path: "on-a-python-server/remove_bg.py",
    content: `# Runs on a server, or your laptop.   pip install rembg
from rembg import remove

with open("photo.jpg", "rb") as f:
    original = f.read()

result = remove(original)  # the bytes of a PNG with a transparent background

with open("photo.png", "wb") as f:
    f.write(result)`,
  },
  {
    path: "on-a-node-server/removeBg.js",
    content: `// Runs on a server, or your laptop.   npm install @imgly/background-removal-node
import { readFile, writeFile } from "node:fs/promises";
import { removeBackground } from "@imgly/background-removal-node";

const original = new Blob([await readFile("photo.jpg")], { type: "image/jpeg" });
const result = await removeBackground(original);  // a PNG with a transparent background

await writeFile("photo.png", Buffer.from(await result.arrayBuffer()));`,
  },
];

const flowDiagram = sideBySide(
  box(23, 10, [
    "USER'S BROWSER",
    "",
    "1. picks photo.jpg",
    "   (with background)",
    "",
    "",
    "",
    "3. shows photo.png",
    "   (no background)",
  ]),
  box(24, 10, [
    "SERVER",
    "",
    "2. receives the file,",
    "   removes the",
    "   background",
    "   (Python or Node.js)",
  ]),
  20,
  {
    3: "POST /remove-bg",
    4: arrowRight(20),
    5: "(the photo)",
    8: "the finished PNG",
    9: arrowLeft(20),
  },
);

export const flowFiles: CodeFile[] = [
  { path: "flow.txt", content: flowDiagram },
  {
    path: "browser/client.js",
    content: `const form = document.querySelector("form");
const result = document.querySelector("#result");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  // 1. send the photo to the server
  const response = await fetch("/remove-bg", {
    method: "POST",
    body: new FormData(form),
  });

  // 3. the server sent a PNG back: show it
  const blob = await response.blob();
  result.src = URL.createObjectURL(blob);
});`,
  },
  {
    path: "python-server/server.py",
    content: `import io

from flask import Flask, request, send_file
from rembg import remove

app = Flask(__name__)


@app.post("/remove-bg")
def remove_bg():
    photo = request.files["photo"].read()  # 1. the uploaded file
    result = remove(photo)                 # 2. remove the background
    return send_file(io.BytesIO(result), mimetype="image/png")  # 3. send it back`,
  },
  {
    path: "node-server/server.js",
    content: `import express from "express";
import multer from "multer";
import { removeBackground } from "@imgly/background-removal-node";

const app = express();
const upload = multer(); // keeps uploaded files in memory

app.post("/remove-bg", upload.single("photo"), async (req, res) => {
  const photo = new Blob([req.file.buffer], { type: req.file.mimetype }); // 1. the uploaded file
  const result = await removeBackground(photo);                           // 2. remove the background
  res.type("image/png").send(Buffer.from(await result.arrayBuffer()));    // 3. send it back
});

app.listen(3000);`,
  },
];

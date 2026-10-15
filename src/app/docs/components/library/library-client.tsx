"use client";

import { useState } from "react";
import NextLink from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Bar, BarChart, XAxis } from "recharts";
import {
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  Paragraph,
  Text,
  Small,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Highlight,
  InlineCode,
  Blockquote,
  List,
  ListItem,
} from "@/components/typography";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import { Kbd } from "@/components/ui/kbd";
import { Label } from "@/components/ui/label";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Toaster } from "@/components/ui/sonner";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import styles from "./library-client.module.css";

const sections = [
  { id: "typography", label: "Typography" },
  { id: "buttons", label: "Buttons & badges" },
  { id: "forms", label: "Form controls" },
  { id: "display", label: "Data display" },
  { id: "feedback", label: "Feedback" },
  { id: "overlays", label: "Overlays & menus" },
  { id: "navigation", label: "Navigation" },
  { id: "layout", label: "Layout" },
];

const chartData = [
  { month: "Jan", posts: 3 },
  { month: "Feb", posts: 5 },
  { month: "Mar", posts: 2 },
  { month: "Apr", posts: 7 },
  { month: "May", posts: 4 },
];

const chartConfig = {
  posts: { label: "Posts", color: "var(--primary)" },
} satisfies ChartConfig;

const frameworks = ["Next.js", "Remix", "Astro", "SvelteKit", "Nuxt"];

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className={styles.section}>
      <H2 className={styles.sectionTitle}>{title}</H2>
      {children}
    </section>
  );
}

function Demo({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <div className={styles.demo}>
      <div className={styles.demoLabel}>{name}</div>
      {children}
    </div>
  );
}

export function LibraryClient({ header }: { header: React.ReactNode }) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const form = useForm({ defaultValues: { username: "" } });

  return (
    <>
      <NextLink href="/docs/components" className={styles.banner}>
        <span>← Back to the theme lab (color &amp; style experiments)</span>
      </NextLink>

      <div className={styles.intro}>{header}</div>

      <nav aria-label="Sections" className={styles.toc}>
        {sections.map((s) => (
          <NextLink key={s.id} href={`#${s.id}`} className={styles.tocLink}>
            {s.label}
          </NextLink>
        ))}
      </nav>

      <Section id="typography" title="Typography">
        <Demo name="H1 – H6">
          <H1>Heading one</H1>
          <H2>Heading two</H2>
          <H3>Heading three</H3>
          <H4>Heading four</H4>
          <H5>Heading five</H5>
          <H6>Heading six</H6>
        </Demo>
        <Demo name="Paragraph / Text / Small">
          <Paragraph>
            A paragraph of body text. It should be comfortable to read at length, with enough
            line height that long posts don&apos;t feel cramped.
          </Paragraph>
          <Text>Text is an inline span for body copy.</Text>
          <br />
          <Small>Small is for captions and meta lines.</Small>
        </Demo>
        <Demo name="Inline styles">
          <Paragraph>
            <Bold>Bold</Bold>, <Italic>italic</Italic>, <Underline>underline</Underline>,{" "}
            <Strikethrough>strikethrough</Strikethrough>, <Highlight>highlight</Highlight>, and{" "}
            <InlineCode>inline code</InlineCode>.
          </Paragraph>
        </Demo>
        <Demo name="Blockquote">
          <Blockquote>Simplicity is prerequisite for reliability.</Blockquote>
        </Demo>
        <Demo name="List / ListItem">
          <List>
            <ListItem>Unordered item one</ListItem>
            <ListItem>Unordered item two</ListItem>
          </List>
          <List ordered>
            <ListItem>Ordered item one</ListItem>
            <ListItem>Ordered item two</ListItem>
          </List>
        </Demo>
      </Section>

      <Section id="buttons" title="Buttons & badges">
        <Demo name="Button variants">
          <div className={styles.row}>
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
            <Button variant="destructive">Destructive</Button>
            <Button disabled>Disabled</Button>
          </div>
        </Demo>
        <Demo name="Button sizes">
          <div className={styles.row}>
            <Button size="sm">Small</Button>
            <Button>Default</Button>
            <Button size="lg">Large</Button>
          </div>
        </Demo>
        <Demo name="ButtonGroup">
          <ButtonGroup>
            <Button variant="outline">Left</Button>
            <Button variant="outline">Middle</Button>
            <Button variant="outline">Right</Button>
          </ButtonGroup>
        </Demo>
        <Demo name="Toggle / ToggleGroup">
          <div className={styles.row}>
            <Toggle aria-label="Toggle bold">Bold</Toggle>
            <ToggleGroup>
              <ToggleGroupItem value="left">Left</ToggleGroupItem>
              <ToggleGroupItem value="center">Center</ToggleGroupItem>
              <ToggleGroupItem value="right">Right</ToggleGroupItem>
            </ToggleGroup>
          </div>
        </Demo>
        <Demo name="Badge">
          <div className={styles.row}>
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </div>
        </Demo>
        <Demo name="Kbd">
          <div className={styles.row}>
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </div>
        </Demo>
        <Demo name="Spinner">
          <Spinner />
        </Demo>
      </Section>

      <Section id="forms" title="Form controls">
        <Demo name="Input / Label">
          <div className={styles.stack}>
            <Label htmlFor="lib-email">Email</Label>
            <Input id="lib-email" type="email" placeholder="you@example.com" />
            <Input placeholder="Disabled" disabled />
          </div>
        </Demo>
        <Demo name="Textarea">
          <div className={styles.stack}>
            <Textarea placeholder="Write something…" />
          </div>
        </Demo>
        <Demo name="InputGroup">
          <div className={styles.stack}>
            <InputGroup>
              <InputGroupAddon>https://</InputGroupAddon>
              <InputGroupInput placeholder="jaygriff.com" />
            </InputGroup>
          </div>
        </Demo>
        <Demo name="Field">
          <div className={styles.stack}>
            <Field>
              <FieldLabel htmlFor="lib-name">Name</FieldLabel>
              <Input id="lib-name" placeholder="Jay Griffin" />
              <FieldDescription>Shown on your posts.</FieldDescription>
            </Field>
          </div>
        </Demo>
        <Demo name="Form (react-hook-form)">
          <Form {...form}>
            <form className={styles.stack} onSubmit={form.handleSubmit(() => toast("Submitted"))}>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="jaygriff" {...field} />
                    </FormControl>
                    <FormDescription>Your public handle.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </Demo>
        <Demo name="NativeSelect">
          <NativeSelect defaultValue="posts">
            <NativeSelectOption value="posts">Posts</NativeSelectOption>
            <NativeSelectOption value="projects">Projects</NativeSelectOption>
          </NativeSelect>
        </Demo>
        <Demo name="Combobox">
          <Combobox items={frameworks}>
            <ComboboxInput placeholder="Pick a framework" />
            <ComboboxContent>
              <ComboboxEmpty>No results.</ComboboxEmpty>
              <ComboboxList>
                {(item: string) => (
                  <ComboboxItem key={item} value={item}>
                    {item}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </Demo>
        <Demo name="Select">
          <Select defaultValue="posts">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="posts">Posts</SelectItem>
              <SelectItem value="projects">Projects</SelectItem>
              <SelectItem value="notes">Notes</SelectItem>
            </SelectContent>
          </Select>
        </Demo>
        <Demo name="Checkbox / Switch">
          <div className={styles.row}>
            <div className={styles.inline}>
              <Checkbox id="lib-check" defaultChecked />
              <Label htmlFor="lib-check">Checkbox</Label>
            </div>
            <div className={styles.inline}>
              <Switch id="lib-switch" defaultChecked />
              <Label htmlFor="lib-switch">Switch</Label>
            </div>
          </div>
        </Demo>
        <Demo name="RadioGroup">
          <RadioGroup defaultValue="one">
            <div className={styles.inline}>
              <RadioGroupItem value="one" id="lib-r1" />
              <Label htmlFor="lib-r1">Option one</Label>
            </div>
            <div className={styles.inline}>
              <RadioGroupItem value="two" id="lib-r2" />
              <Label htmlFor="lib-r2">Option two</Label>
            </div>
          </RadioGroup>
        </Demo>
        <Demo name="Slider">
          <div className={styles.stack}>
            <Slider defaultValue={[40]} max={100} />
          </div>
        </Demo>
        <Demo name="InputOTP">
          <InputOTP maxLength={6}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </Demo>
        <Demo name="Calendar">
          <Calendar mode="single" selected={date} onSelect={setDate} />
        </Demo>
      </Section>

      <Section id="display" title="Data display">
        <Demo name="Card">
          <Card className={styles.card}>
            <CardHeader>
              <CardTitle>Card title</CardTitle>
              <CardDescription>A short description of the card.</CardDescription>
              <CardAction>
                <Badge variant="secondary">New</Badge>
              </CardAction>
            </CardHeader>
            <CardContent>
              <Paragraph>Card content goes here.</Paragraph>
            </CardContent>
            <CardFooter>
              <Button size="sm">Action</Button>
            </CardFooter>
          </Card>
        </Demo>
        <Demo name="Table">
          <Table>
            <TableCaption>Recent posts</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Words</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>How I learned to code</TableCell>
                <TableCell>Mar 1</TableCell>
                <TableCell>1,840</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>What I think about AI</TableCell>
                <TableCell>Feb 28</TableCell>
                <TableCell>1,210</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Demo>
        <Demo name="Avatar">
          <Avatar>
            <AvatarFallback>JG</AvatarFallback>
          </Avatar>
        </Demo>
        <Demo name="Item">
          <div className={styles.stack}>
            <Item variant="outline">
              <ItemContent>
                <ItemTitle>Locus</ItemTitle>
                <ItemDescription>A Chrome extension for launching bookmarks fast.</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button size="sm" variant="outline">
                  View
                </Button>
              </ItemActions>
            </Item>
          </div>
        </Demo>
        <Demo name="Empty">
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No posts yet</EmptyTitle>
              <EmptyDescription>Posts you publish will show up here.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        </Demo>
        <Demo name="Accordion">
          <Accordion>
            <AccordionItem value="a">
              <AccordionTrigger>What is this page?</AccordionTrigger>
              <AccordionContent>A reference of every component with the real theme.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="b">
              <AccordionTrigger>Where are the experiments?</AccordionTrigger>
              <AccordionContent>On the theme lab page, linked at the top.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </Demo>
        <Demo name="Collapsible">
          <Collapsible>
            <CollapsibleTrigger render={<Button variant="outline" size="sm" />}>Toggle details</CollapsibleTrigger>
            <CollapsibleContent>
              <Paragraph>Hidden details revealed.</Paragraph>
            </CollapsibleContent>
          </Collapsible>
        </Demo>
        <Demo name="Chart">
          <ChartContainer config={chartConfig} className={styles.chart}>
            <BarChart data={chartData}>
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <Bar dataKey="posts" fill="var(--color-posts)" radius={4} />
            </BarChart>
          </ChartContainer>
        </Demo>
      </Section>

      <Section id="feedback" title="Feedback">
        <Demo name="Alert">
          <div className={styles.stack}>
            <Alert>
              <AlertTitle>Heads up</AlertTitle>
              <AlertDescription>This is a default alert.</AlertDescription>
            </Alert>
            <Alert variant="destructive">
              <AlertTitle>Something went wrong</AlertTitle>
              <AlertDescription>This is a destructive alert.</AlertDescription>
            </Alert>
          </div>
        </Demo>
        <Demo name="Progress">
          <div className={styles.stack}>
            <Progress value={60} />
          </div>
        </Demo>
        <Demo name="Skeleton">
          <div className={styles.stack}>
            <Skeleton className={styles.box} />
          </div>
        </Demo>
        <Demo name="Sonner (toast)">
          <Button variant="outline" onClick={() => toast("Saved", { description: "Your changes were saved." })}>
            Show toast
          </Button>
          <Toaster />
        </Demo>
      </Section>

      <Section id="overlays" title="Overlays & menus">
        <Demo name="Dialog / AlertDialog / Sheet / Drawer">
          <div className={styles.row}>
            <Dialog>
              <DialogTrigger render={<Button variant="outline" />}>Dialog</DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Dialog title</DialogTitle>
                  <DialogDescription>A modal dialog.</DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            <AlertDialog>
              <AlertDialogTrigger render={<Button variant="outline" />}>Alert dialog</AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>This asks for confirmation.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Sheet>
              <SheetTrigger render={<Button variant="outline" />}>Sheet</SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Sheet title</SheetTitle>
                  <SheetDescription>A panel that slides in from the side.</SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
            <Drawer>
              <DrawerTrigger render={<Button variant="outline" />}>Drawer</DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Drawer title</DrawerTitle>
                  <DrawerDescription>A panel that slides up from the bottom.</DrawerDescription>
                </DrawerHeader>
              </DrawerContent>
            </Drawer>
          </div>
        </Demo>
        <Demo name="Popover / HoverCard / Tooltip">
          <div className={styles.row}>
            <Popover>
              <PopoverTrigger render={<Button variant="outline" />}>Popover</PopoverTrigger>
              <PopoverContent>
                <p className={styles.popoverText}>Popover content.</p>
              </PopoverContent>
            </Popover>
            <HoverCard>
              <HoverCardTrigger render={<Button variant="outline" />}>Hover card</HoverCardTrigger>
              <HoverCardContent>
                <p className={styles.popoverText}>Shows on hover.</p>
              </HoverCardContent>
            </HoverCard>
            <Tooltip>
              <TooltipTrigger render={<Button variant="outline" />}>Tooltip</TooltipTrigger>
              <TooltipContent>Tooltip text</TooltipContent>
            </Tooltip>
          </div>
        </Demo>
        <Demo name="DropdownMenu">
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" />}>Open menu</DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuLabel>Account</DropdownMenuLabel>
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Demo>
        <Demo name="ContextMenu">
          <ContextMenu>
            <ContextMenuTrigger className={styles.box}>Right-click here</ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem>Copy</ContextMenuItem>
              <ContextMenuItem>Paste</ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        </Demo>
        <Demo name="Menubar">
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger>File</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>New</MenubarItem>
                <MenubarItem>Open</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>Edit</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>Undo</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </Demo>
        <Demo name="Command">
          <Command className={styles.frame}>
            <CommandInput placeholder="Search…" />
            <CommandList>
              <CommandEmpty>No results.</CommandEmpty>
              <CommandGroup heading="Pages">
                <CommandItem>Home</CommandItem>
                <CommandItem>Projects</CommandItem>
                <CommandItem>Posts</CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </Demo>
      </Section>

      <Section id="navigation" title="Navigation">
        <Demo name="NavigationMenu">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Work</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <NavigationMenuLink href="/projects">Projects</NavigationMenuLink>
                  <NavigationMenuLink href="/posts">Posts</NavigationMenuLink>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/about">About</NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </Demo>
        <Demo name="Breadcrumb">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/docs/components">Components</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Library</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </Demo>
        <Demo name="Pagination">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </Demo>
        <Demo name="Tabs">
          <Tabs defaultValue="one">
            <TabsList>
              <TabsTrigger value="one">One</TabsTrigger>
              <TabsTrigger value="two">Two</TabsTrigger>
            </TabsList>
            <TabsContent value="one">
              <Paragraph>First tab.</Paragraph>
            </TabsContent>
            <TabsContent value="two">
              <Paragraph>Second tab.</Paragraph>
            </TabsContent>
          </Tabs>
        </Demo>
      </Section>

      <Section id="layout" title="Layout">
        <Demo name="Separator">
          <div className={styles.stack}>
            <Small>Above</Small>
            <Separator />
            <Small>Below</Small>
          </div>
        </Demo>
        <Demo name="AspectRatio">
          <div className={styles.frame}>
            <AspectRatio ratio={16 / 9}>
              <div className={styles.box}>16 : 9</div>
            </AspectRatio>
          </div>
        </Demo>
        <Demo name="ScrollArea">
          <ScrollArea className={styles.scroll}>
            {Array.from({ length: 20 }, (_, i) => (
              <p key={i}>Scrollable line {i + 1}</p>
            ))}
          </ScrollArea>
        </Demo>
        <Demo name="Resizable">
          <ResizablePanelGroup orientation="horizontal" className={styles.resizable}>
            <ResizablePanel defaultSize={50}>
              <div className={styles.box}>One</div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={50}>
              <div className={styles.box}>Two</div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </Demo>
        <Demo name="Carousel">
          <Carousel className={styles.carousel}>
            <CarouselContent>
              {[1, 2, 3].map((n) => (
                <CarouselItem key={n}>
                  <div className={styles.box}>Slide {n}</div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </Demo>
      </Section>
    </>
  );
}

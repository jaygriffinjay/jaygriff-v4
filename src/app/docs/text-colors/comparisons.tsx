"use client";

import { toast } from "sonner";
import { Bar, BarChart, XAxis } from "recharts";
import { H3, Paragraph, Small } from "@/components/typography";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import styles from "./page.module.css";

const chartData = [
  { month: "Jan", posts: 3 },
  { month: "Feb", posts: 5 },
  { month: "Mar", posts: 2 },
  { month: "Apr", posts: 7 },
];

const chartConfig = {
  posts: { label: "Posts", color: "var(--primary)" },
} satisfies ChartConfig;

const frameworks = ["Next.js", "Remix", "Astro", "SvelteKit"];

// Popups render in a portal outside the "after" column, so `after` is also passed to each popup.
function Pair({ name, note, children }: { name: string; note?: string; children: (after?: string) => React.ReactNode }) {
  return (
    <div className={styles.pair}>
      <div className={styles.pairName}>{name}</div>
      {note && <Small className={styles.pairNote}>{note}</Small>}
      <div className={styles.pairGrid}>
        <div className={styles.pairCell}>
          <span className={styles.columnLabel}>Before</span>
          {children()}
        </div>
        <div className={cn(styles.pairCell, styles.consolidated)}>
          <span className={styles.columnLabel}>After</span>
          {children(styles.consolidated)}
        </div>
      </div>
    </div>
  );
}

function Group({ token, change, children }: { token: string; change: string; children: React.ReactNode }) {
  return (
    <section className={styles.group}>
      <H3 className={styles.groupTitle}>{token}</H3>
      <Paragraph className={styles.groupChange}>{change}</Paragraph>
      <div className={styles.pairs}>{children}</div>
    </section>
  );
}

export function Comparisons() {
  return (
    <>
      <Group token="--card-foreground" change="#ebebeb → var(--foreground) (#c0c0c8)">
        <Pair name="Card">
          {() => (
            <Card>
              <CardHeader>
                <CardTitle>Card title</CardTitle>
                <CardDescription>Description stays muted.</CardDescription>
              </CardHeader>
              <CardContent>Card body text.</CardContent>
            </Card>
          )}
        </Pair>
        <Pair name="Alert (default)">
          {() => (
            <Alert>
              <AlertTitle>Heads up</AlertTitle>
              <AlertDescription>Alert body text.</AlertDescription>
            </Alert>
          )}
        </Pair>
      </Group>

      <Group token="--secondary-foreground" change="#e5e5e5 → var(--foreground) (#c0c0c8)">
        <Pair name="Button (secondary)">{() => <Button variant="secondary">Secondary button</Button>}</Pair>
        <Pair name="Badge (secondary)">{() => <Badge variant="secondary">Secondary badge</Badge>}</Pair>
      </Group>

      <Group
        token="--popover-foreground"
        change="#ebebeb → var(--foreground) (#c0c0c8). Click each trigger to open it."
      >
        <Pair name="Dialog">
          {(after) => (
            <Dialog>
              <DialogTrigger render={<Button variant="outline" />}>Open dialog</DialogTrigger>
              <DialogContent className={after}>
                <DialogHeader>
                  <DialogTitle>Dialog title</DialogTitle>
                  <DialogDescription>Description stays muted.</DialogDescription>
                </DialogHeader>
                Dialog body text.
              </DialogContent>
            </Dialog>
          )}
        </Pair>
        <Pair name="AlertDialog">
          {(after) => (
            <AlertDialog>
              <AlertDialogTrigger render={<Button variant="outline" />}>Open alert dialog</AlertDialogTrigger>
              <AlertDialogContent className={after}>
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
          )}
        </Pair>
        <Pair name="Sheet">
          {(after) => (
            <Sheet>
              <SheetTrigger render={<Button variant="outline" />}>Open sheet</SheetTrigger>
              <SheetContent className={after}>
                <SheetHeader>
                  <SheetTitle>Sheet title</SheetTitle>
                  <SheetDescription>A panel that slides in from the side.</SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          )}
        </Pair>
        <Pair name="Drawer">
          {(after) => (
            <Drawer>
              <DrawerTrigger render={<Button variant="outline" />}>Open drawer</DrawerTrigger>
              <DrawerContent className={after}>
                <DrawerHeader>
                  <DrawerTitle>Drawer title</DrawerTitle>
                  <DrawerDescription>A panel that slides up from the bottom.</DrawerDescription>
                </DrawerHeader>
              </DrawerContent>
            </Drawer>
          )}
        </Pair>
        <Pair name="Popover">
          {(after) => (
            <Popover>
              <PopoverTrigger render={<Button variant="outline" />}>Open popover</PopoverTrigger>
              <PopoverContent className={after}>Popover body text.</PopoverContent>
            </Popover>
          )}
        </Pair>
        <Pair name="HoverCard">
          {(after) => (
            <HoverCard>
              <HoverCardTrigger render={<Button variant="outline" />}>Hover me</HoverCardTrigger>
              <HoverCardContent className={after}>Hover card body text.</HoverCardContent>
            </HoverCard>
          )}
        </Pair>
        <Pair name="NavigationMenu">
          {(after) => (
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Work</NavigationMenuTrigger>
                  <NavigationMenuContent className={cn(styles.navContent, after)}>
                    <NavigationMenuLink href="#">Projects</NavigationMenuLink>
                    <NavigationMenuLink href="#">Posts</NavigationMenuLink>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          )}
        </Pair>
        <Pair name="Command">
          {() => (
            <Command className={styles.frame}>
              <CommandInput placeholder="Search…" />
              <CommandList>
                <CommandGroup heading="Pages">
                  <CommandItem>Home</CommandItem>
                  <CommandItem>Projects</CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          )}
        </Pair>
        <Pair name="Chart tooltip" note="Hover a bar.">
          {() => (
            <ChartContainer config={chartConfig} className={styles.chart}>
              <BarChart data={chartData}>
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="posts" fill="var(--color-posts)" radius={4} />
              </BarChart>
            </ChartContainer>
          )}
        </Pair>
        <Pair name="Toast (Sonner)" note="Before shows bottom-left, after shows bottom-right.">
          {(after) => {
            const id = after ? "after" : "before";
            return (
              <>
                <Button
                  variant="outline"
                  onClick={() => toast("Saved", { description: "Your changes were saved.", toasterId: id })}
                >
                  Show toast
                </Button>
                <Toaster id={id} position={after ? "bottom-right" : "bottom-left"} />
              </>
            );
          }}
        </Pair>
      </Group>

      <Group
        token="--popover-foreground + --accent-foreground"
        change="Menu text uses the popover token. The highlighted item uses --accent-foreground: #ffffff → var(--heading) (#d6d6dc). Open each menu and hover an item."
      >
        <Pair name="DropdownMenu" note="Also the breadcrumb “…” overflow menu on the live site.">
          {(after) => (
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="outline" />}>Open menu</DropdownMenuTrigger>
              <DropdownMenuContent className={after}>
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Account</DropdownMenuLabel>
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </Pair>
        <Pair name="ContextMenu">
          {(after) => (
            <ContextMenu>
              <ContextMenuTrigger className={styles.box}>Right-click here</ContextMenuTrigger>
              <ContextMenuContent className={after}>
                <ContextMenuItem>Copy</ContextMenuItem>
                <ContextMenuItem>Paste</ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          )}
        </Pair>
        <Pair name="Menubar">
          {(after) => (
            <Menubar>
              <MenubarMenu>
                <MenubarTrigger>File</MenubarTrigger>
                <MenubarContent className={after}>
                  <MenubarItem>New</MenubarItem>
                  <MenubarItem>Open</MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          )}
        </Pair>
        <Pair name="Select">
          {(after) => (
            <Select defaultValue="posts">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className={after}>
                <SelectItem value="posts">Posts</SelectItem>
                <SelectItem value="projects">Projects</SelectItem>
                <SelectItem value="notes">Notes</SelectItem>
              </SelectContent>
            </Select>
          )}
        </Pair>
        <Pair name="Combobox">
          {(after) => (
            <Combobox items={frameworks}>
              <ComboboxInput placeholder="Pick a framework" />
              <ComboboxContent className={after}>
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
          )}
        </Pair>
      </Group>
    </>
  );
}

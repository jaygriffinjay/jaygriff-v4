"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import NextLink from "next/link";
import { Maximize2, Minimize2, Pause, Play, RotateCcw, X } from "lucide-react";
import { Paragraph, Title } from "@/components/typography";
import { dismissHomeTagline } from "./infinite-feed-actions";
import { cn } from "@/lib/utils";
import styles from "./home-profile.module.css";

type SimulationMode = "formed" | "moving" | "paused" | "returning";

export function HomeProfileSimulation({ src }: { src: string }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const bannerHeight = useRef(0);
  const [expanded, setExpanded] = useState(false);
  const [mode, setMode] = useState<SimulationMode>("formed");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // The iframe sizes its wordmark to the collapsed banner, which stays fixed while the canvas grows
  const announce = useCallback(() => {
    if (stage.current && stage.current.dataset.expanded !== "true") {
      bannerHeight.current = stage.current.getBoundingClientRect().height;
    }
    frame.current?.contentWindow?.postMessage(
      { type: "jaygriff:artifact-host-controls", enabled: true, bannerHeight: bannerHeight.current },
      "*",
    );
  }, []);

  useEffect(() => {
    if (!mounted) return;
    announce();
    window.addEventListener("resize", announce);
    return () => window.removeEventListener("resize", announce);
  }, [announce, src, mounted]);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.source !== frame.current?.contentWindow) return;
      if (event.data?.type === "jaygriff:artifact-state") {
        if (["formed", "moving", "paused", "returning"].includes(event.data.mode)) {
          setMode(event.data.mode as SimulationMode);
        }
      }
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  useEffect(() => {
    if (!expanded || !stage.current) {
      stage.current?.style.removeProperty("--canvas-height");
      return;
    }

    const updateHeight = () => {
      const element = stage.current;
      if (!element) return;
      const top = element.getBoundingClientRect().top + window.scrollY;
      const height = Math.max(window.innerHeight, document.documentElement.scrollHeight - top);
      element.style.setProperty("--canvas-height", `${height}px`);
    };
    const observer = new ResizeObserver(updateHeight);
    observer.observe(document.documentElement);
    observer.observe(document.body);
    window.addEventListener("resize", updateHeight);
    updateHeight();
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, [expanded]);

  const sendCommand = (action: "play-pause" | "put-back") => {
    frame.current?.contentWindow?.postMessage({ type: "jaygriff:artifact-command", action }, "*");
  };

  // A reset is a reset: the particles go home and the canvas shrinks back, leaving only Play
  const putBack = () => {
    sendCommand("put-back");
    setExpanded(false);
  };

  // Put back and fullscreen only mean something once the particles are loose
  const showMore = mode === "moving" || mode === "paused";

  return (
    <div ref={stage} className={styles.stage} data-expanded={expanded ? "true" : undefined}>
      <iframe
        ref={frame}
        src={src}
        title="Jay Griffin particle wordmark"
        sandbox="allow-scripts"
        className={styles.simulation}
        onLoad={announce}
      />
      {mounted && createPortal(
        <div className={styles.controls} data-expanded={expanded ? "true" : undefined}>
          <div className={styles.group}>
            <button
              type="button"
              className={styles.button}
              aria-label={mode === "moving" ? "Pause" : "Play"}
              onClick={() => sendCommand("play-pause")}
            >
              {mode === "moving" ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
            </button>
            {showMore && (
              <>
                <button
                  type="button"
                  className={cn(styles.button, styles.more)}
                  aria-label="Put back"
                  onClick={putBack}
                >
                  <RotateCcw aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className={cn(styles.button, styles.more)}
                  aria-label={expanded ? "Shrink" : "Fullscreen"}
                  onClick={() => setExpanded(!expanded)}
                >
                  {expanded ? <Minimize2 aria-hidden="true" /> : <Maximize2 aria-hidden="true" />}
                </button>
              </>
            )}
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}

export function HomeProfile({ showTagline }: { showTagline: boolean }) {
  return (
    <section
      className={styles.profile}
      aria-label="Jay Griffin profile"
      data-home-banner
      data-tagline-dismissed={showTagline ? undefined : "true"}
    >
      {/* The wordmark in the banner is the visible name; this keeps the page's h1 */}
      <Title className={styles.srOnly}>Jay Griffin</Title>
      {showTagline && (
        <form action={dismissHomeTagline} className={styles.taglineMessage}>
          <Paragraph className={styles.tagline}>
            Welcome to my website where I do my work and publish it too! On here I document my
            development work, share my thoughts, and maybe even post some personal stuff.{" "}
            <NextLink href="/about" className={styles.learnMore}>
              More
            </NextLink>
          </Paragraph>
          <button
            type="submit"
            className={styles.dismissTagline}
            aria-label="Dismiss introduction"
            title="Dismiss introduction"
          >
            <X aria-hidden="true" />
          </button>
        </form>
      )}
    </section>
  );
}
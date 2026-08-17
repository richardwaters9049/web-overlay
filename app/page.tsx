'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import DonationOverlay from '../components/donation_overlay';
import BrowserOverlay from '../components/browser_overlay';

export default function Home() {
  const [showDonationOverlay, setShowDonationOverlay] =
    useState(false);

  const streamAreaRef =
    useRef<HTMLElement | null>(null);

  return (
    <main className="h-screen w-full bg-black px-8 py-16">
      <div className="relative mx-auto aspect-video w-full overflow-hidden bg-linear-to-tr from-green-700 to-green-900">

        {/* Background */}
        <div className="pointer-events-none absolute inset-0">

          {/* Red atmospheric glow */}
          <motion.div
            animate={{
              opacity: [0.12, 0.2, 0.12],
              scale: [1, 1.08, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute left-1/2 top-1/2 h-[700px] w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-950/30 blur-[180px]"
          />

          {/* Bottom red glow */}
          <motion.div
            animate={{
              opacity: [0.04, 0.1, 0.04],
              x: [-40, 40, -40],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute bottom-[-20%] right-[5%] h-[500px] w-[500px] rounded-full bg-red-900/20 blur-[160px]"
          />

          {/* Vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.9)_100%)]" />

          {/* CRT scanlines */}
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.8) 4px)',
            }}
          />

          {/* Film grain */}
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg viewBox=%220 0 180 180%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%22.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22 opacity=%22.8%22/%3E%3C/svg%3E")',
            }}
          />

        </div>


        {/* Stream area */}
        <section
          ref={streamAreaRef}
          className="absolute inset-0"
        >

          {/* OBS game capture */}


          {/* Browser overlay */}
          <div className="brows-container hidden">
            <BrowserOverlay
              src="https://example.com"
              url="example.com"
              width="46%"
              dragConstraints={streamAreaRef}
            />
          </div>


          {/* Donation overlay */}
          <AnimatePresence>
            {showDonationOverlay && (
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.92,
                  y: 30,
                }}
                animate={{
                  opacity: 0.95,
                  scale: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.94,
                  y: 20,
                }}
                transition={{
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="absolute inset-0 z-[80]"
              >
                <DonationOverlay />
              </motion.div>
            )}
          </AnimatePresence>

        </section>


        {/* Background R watermark */}
        <motion.div
          animate={{
            opacity: [0.015, 0.035, 0.015],
            scale: [0.98, 1.02, 0.98],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 select-none"
        >
          <span className="reaper-font text-[38rem] leading-none text-white">
            R
          </span>
        </motion.div>


        {/* Top left identity */}
        <div className="absolute left-10 top-9 z-30">

          <div className="flex items-center gap-5">

            {/* REAPER symbol */}
            <div className="relative flex h-16 w-16 items-center justify-center border border-white/20 bg-black/90">

              {/* Top left corner */}
              <div className="absolute left-0 top-0 h-3 w-3 border-l-2 border-t-2 border-red-600" />

              {/* Bottom right corner */}
              <div className="absolute bottom-0 right-0 h-3 w-3 border-b-2 border-r-2 border-red-600" />

              {/* R symbol */}
              <span className="reaper-font text-3xl text-white">
                R
              </span>

            </div>


            {/* Identity */}
            <div>

              {/* Live transmission */}
              <p className="font-mono text-[20px] uppercase tracking-[0.5em] text-red-600">
                LIVE TRANSMISSION
              </p>

              {/* REAPER name */}
              <h1 className="reaper-font mt-1 text-5xl text-white">
                REAPER
              </h1>

            </div>

          </div>

        </div>


        {/* Live indicator */}
        <motion.div
          animate={{
            opacity: [1, 0.55, 1],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute right-10 top-10 z-30 flex items-center gap-4"
        >

          {/* Signal label */}
          <span className="font-mono text-xs uppercase tracking-[0.35em] text-white/40">
            SIGNAL
          </span>

          {/* Live indicator light */}
          <span className="h-3 w-3 rounded-full bg-red-600 shadow-[0_0_18px_rgba(220,38,38,0.9)]" />

          {/* Live text */}
          <span className="font-mono text-sm font-bold tracking-[0.3em] text-red-600">
            LIVE
          </span>

        </motion.div>


        {/* Donate button */}
        <motion.button
          type="button"
          onClick={() =>
            setShowDonationOverlay(
              (current) => !current,
            )
          }
          whileHover={{
            scale: 1.04,
          }}
          whileTap={{
            scale: 0.96,
          }}
          className="absolute right-10 top-24 z-[90] border border-red-600/60 bg-black/90 px-5 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-red-600 transition-colors duration-300 hover:bg-red-600 hover:text-black hidden"
        >
          {showDonationOverlay
            ? 'CLOSE DONATIONS'
            : 'DONATE'}
        </motion.button>


        {/* Left system markings */}
        <div className="absolute bottom-36 left-10 top-32 z-20">

          <div className="relative h-full w-10">

            {/* Vertical line */}
            <div className="absolute left-0 top-0 h-full w-px bg-white/10" />

            {/* Active signal */}
            <motion.div
              animate={{
                height: ['18%', '38%', '22%'],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute left-0 top-[18%] w-px bg-red-600 shadow-[0_0_12px_rgba(220,38,38,0.8)]"
            />

            {/* System label */}
            <div className="absolute left-4 top-1/2 -rotate-90 origin-left whitespace-nowrap font-mono text-[9px] tracking-[0.45em] text-white/20">
              SIGNAL_ACTIVE
            </div>

          </div>

        </div>


        {/* Chat */}
        <aside className="absolute bottom-36 right-10 top-32 z-30 w-80 hidden">

          <div className="relative flex h-full flex-col">

            {/* Chat header */}
            <div className="border-b border-white/10 pb-4">

              <div className="flex items-center justify-between">

                {/* Chat title */}
                <p className="font-mono text-sm font-bold uppercase tracking-[0.3em] text-white">
                  CRYPT CHAT
                </p>

                {/* Chat count */}
                <span className="font-mono text-xs text-red-600">
                  666
                </span>

              </div>

              {/* Chat status */}
              <p className="mt-2 font-mono text-[10px] text-white/25">
                ENCRYPTED TRANSMISSION
              </p>

            </div>


            {/* Chat messages */}
            <div className="flex-1 space-y-7 overflow-hidden pt-6">

              <ChatMessage
                username="GraveDigger"
                message="What the hell was that?!"
              />

              <ChatMessage
                username="Crypt_K3yper"
                message="😂😂😂"
              />

              <ChatMessage
                username="TheLurker"
                message="He's going back in..."
              />

              <ChatMessage
                username="UncleBob"
                message="NOPE. Absolutely not."
              />

            </div>

          </div>

        </aside>


        {/* Bottom footer */}
        <div className="absolute bottom-0 left-0 right-0 z-40 h-32">

          {/* Footer gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/95 to-transparent" />

          {/* Footer content */}
          <div className="relative flex h-full items-end px-10 pb-7">

            {/* Follow section */}
            <div className="w-[25%]">

              {/* Follow label */}
              <p className="font-mono text-[15px] uppercase tracking-[0.45em] text-red-600">
                FOLLOW THE CRYPT
              </p>

              {/* REAPER name */}
              <p className="reaper-font mt-2 flex gap-1 text-2xl text-white">
                <span className="font-mono text-red-600">
                  @
                </span>

                REAPER

                <span className="font-mono text-red-600">
                  990
                </span>
              </p>

            </div>


            {/* Like and subscribe */}
            <div className="flex w-[35%] items-center justify-center">

              <LikeSubscribe />

            </div>


            {/* Reaper character */}
            <div className="relative flex h-24 w-[20%] items-end justify-center">

              {/* Character animation */}
              <motion.div
                initial={{
                  opacity: 0,
                  x: 100,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  duration: 1.3,
                  delay: 0.3,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="pointer-events-none absolute bottom-[-7px] left-1/2 z-50 -translate-x-1/2"
              >

                {/* Character floating animation */}
                <motion.div
                  animate={{
                    y: [0, -4, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="relative h-[260px] w-[225px]"
                >

                  {/* Reaper image */}
                  <Image
                    src="/reaper-char.png"
                    alt="REAPER"
                    fill
                    sizes="225px"
                    priority
                    className="object-contain object-bottom"
                  />

                </motion.div>

              </motion.div>

            </div>


            {/* Statistics */}
            <div className="flex w-[20%] items-center justify-end gap-8">

              {/* Viewers */}
              <Stat
                label="VIEWERS"
                value="666"
              />

              {/* Divider */}
              <div className="h-10 w-px bg-white/10" />

              {/* Followers */}
              <Stat
                label="FOLLOWERS"
                value="13,337"
              />

            </div>

          </div>

        </div>


        {/* Footer top border */}
        <div className="absolute bottom-28 left-10 right-10 z-50 h-px bg-white/10">

          {/* Footer separator */}

        </div>


        {/* Bottom left corner */}
        <Corner position="left" />


        {/* Bottom right corner */}
        <Corner position="right" />


        {/* Signal glitch */}
        <motion.div
          animate={{
            opacity: [0, 0, 0.2, 0, 0, 0],
            scaleX: [1, 1, 1.5, 1, 0.7, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="pointer-events-none absolute left-0 right-0 top-[42%] z-40 h-px bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.8)]"
        />

      </div>
    </main>
  );
}


function LikeSubscribe() {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 8,
        scale: 0.96,
      }}
      animate={{
        opacity: [0, 0, 1, 1, 0],
        y: [8, 8, 0, 0, -3],
        scale: [0.96, 0.96, 1, 1, 0.98],
      }}
      transition={{
        duration: 6,
        delay: 5,
        repeat: Infinity,
        repeatDelay: 20,
        times: [0, 0.15, 0.28, 0.75, 1],
        ease: [0.22, 1, 0.36, 1],
      }}
      className="pointer-events-none relative"
    >

      {/* Like and subscribe container */}
      <div className="relative min-w-[300px] border border-white/15 bg-black/95 px-7 py-3 shadow-[0_8px_35px_rgba(0,0,0,0.8)]">

        {/* Top red sweep */}
        <motion.div
          initial={{
            scaleX: 0,
            transformOrigin: 'left',
          }}
          animate={{
            scaleX: [0, 1, 1, 0],
          }}
          transition={{
            duration: 4.5,
            delay: 5.1,
            repeat: Infinity,
            repeatDelay: 20,
            times: [0, 0.25, 0.8, 1],
            ease: 'easeInOut',
          }}
          className="absolute left-0 top-0 h-px w-full bg-red-600"
        />

        {/* Left corner */}
        <div className="absolute left-0 top-0 h-3 w-3 border-l border-t border-red-600" />

        {/* Right corner */}
        <div className="absolute bottom-0 right-0 h-3 w-3 border-b border-r border-red-600" />

        {/* Transmission label */}
        <div className="flex items-center justify-center gap-3">

          {/* Left signal */}
          <span className="h-1 w-1 bg-red-600" />

          {/* Signal text */}
          <p className="font-mono text-[7px] font-bold uppercase tracking-[0.4em] text-red-600">
            SIGNAL INTERRUPTED
          </p>

          {/* Right signal */}
          <span className="h-1 w-1 bg-red-600" />

        </div>

        {/* Main message */}
        <motion.h2
          animate={{
            opacity: [0.85, 1, 0.85],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="mt-1 text-center font-mono text-base font-black tracking-[0.15em] text-white"
        >
          LIKE & SUBSCRIBE
        </motion.h2>

        {/* JOIN THE CRYPT */}
        <p className="mt-1 text-center font-mono text-[6px] uppercase tracking-[0.35em] text-white/25">
          JOIN THE CRYPT
        </p>

      </div>

    </motion.div>
  );
}


function ChatMessage({
  username,
  message,
}: {
  username: string;
  message: string;
}) {
  return (
    <div>

      {/* Username */}
      <div className="flex items-center gap-3">

        {/* Username indicator */}
        <span className="h-1.5 w-1.5 bg-red-600" />

        {/* Username */}
        <span className="font-mono text-xs font-bold text-white/80">
          {username}
        </span>

      </div>

      {/* Message */}
      <p className="mt-2 pl-4 font-mono text-xs leading-relaxed text-white/40">
        {message}
      </p>

    </div>
  );
}


function Stat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>

      {/* Statistic label */}
      <p className="font-mono text-[9px] uppercase tracking-[0.35em] text-white/25">
        {label}
      </p>

      {/* Statistic value */}
      <p className="mt-2 font-mono text-lg font-bold text-white">
        {value}
      </p>

    </div>
  );
}


function Corner({
  position,
}: {
  position: 'left' | 'right';
}) {
  const left =
    position === 'left';

  return (
    <div
      className={`absolute bottom-6 z-50 h-14 w-14 ${left
        ? 'left-6'
        : 'right-6'
        }`}
    >

      {/* Horizontal line */}
      <div
        className={`absolute bottom-0 h-px w-14 bg-white/20 ${left
          ? 'left-0'
          : 'right-0'
          }`}
      />

      {/* Vertical line */}
      <div
        className={`absolute bottom-0 h-14 w-px bg-white/20 ${left
          ? 'left-0'
          : 'right-0'
          }`}
      />

      {/* Red accent */}
      <div
        className={`absolute bottom-0 h-1.5 w-1.5 bg-red-600 ${left
          ? 'left-0'
          : 'right-0'
          }`}
      />

    </div>
  );
}
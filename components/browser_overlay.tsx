'use client';

import { motion } from 'framer-motion';

interface BrowserOverlayProps {
    src?: string;
    url?: string;
    width?: string;
    className?: string;
}

export default function BrowserOverlay({
    src = 'about:blank',
    url = 'localhost:3000',
    width = '46%',
    className = '',
}: BrowserOverlayProps) {
    return (
        <motion.div
            initial={{
                opacity: 0,
                scale: 0.96,
                y: 15,
            }}
            animate={{
                opacity: 1,
                scale: 1,
                y: 0,
            }}
            transition={{
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
            }}
            style={{
                width,
            }}
            className={`absolute left-[11%] top-[17%] z-30 overflow-hidden border border-white/15 bg-black shadow-[0_20px_60px_rgba(0,0,0,0.8)] ${className}`}
        >

            {/* Browser window */}
            <div className="relative">

                {/* Browser chrome */}
                <div className="flex h-8 items-center border-b border-white/10 bg-[#090909] px-3">

                    {/* Browser controls */}
                    <div className="flex items-center gap-1.5">

                        {/* Close */}
                        <span className="h-2 w-2 rounded-full bg-white/20" />

                        {/* Minimise */}
                        <span className="h-2 w-2 rounded-full bg-white/20" />

                        {/* Maximise */}
                        <span className="h-2 w-2 rounded-full bg-white/20" />

                    </div>


                    {/* Navigation controls */}
                    <div className="ml-4 flex items-center gap-3 text-white/25">

                        {/* Back */}
                        <span className="text-[11px]">
                            ‹
                        </span>

                        {/* Forward */}
                        <span className="text-[11px]">
                            ›
                        </span>

                        {/* Refresh */}
                        <span className="text-[10px]">
                            ↻
                        </span>

                    </div>


                    {/* Address bar */}
                    <div className="ml-4 flex h-5 flex-1 items-center border border-white/10 bg-black/60 px-3">

                        {/* Security indicator */}
                        <span className="mr-2 text-[8px] text-white/30">
                            ●
                        </span>

                        {/* URL */}
                        <span className="truncate font-mono text-[8px] tracking-wide text-white/40">
                            {url}
                        </span>

                    </div>


                    {/* Browser status */}
                    <div className="ml-3 flex items-center gap-2">

                        {/* Signal */}
                        <span className="h-1.5 w-1.5 rounded-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.8)]" />

                        {/* Status */}
                        <span className="font-mono text-[7px] uppercase tracking-[0.2em] text-white/25">
                            LIVE
                        </span>

                    </div>

                </div>


                {/* Browser content */}
                <div className="relative aspect-video w-full bg-black">

                    {/* Browser iframe */}
                    {src !== 'about:blank' ? (
                        <iframe
                            src={src}
                            title="Browser overlay"
                            className="absolute inset-0 h-full w-full border-0"
                            allow="autoplay; fullscreen; picture-in-picture"
                            allowFullScreen
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-black">

                            {/* Empty browser state */}
                            <div className="text-center">

                                {/* Browser icon */}
                                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center border border-white/10">

                                    {/* Browser symbol */}
                                    <span className="font-mono text-sm text-white/20">
                                        R
                                    </span>

                                </div>

                                {/* Browser status */}
                                <p className="font-mono text-[8px] uppercase tracking-[0.35em] text-white/25">
                                    BROWSER SOURCE
                                </p>

                                {/* Browser instruction */}
                                <p className="mt-2 font-mono text-[7px] uppercase tracking-[0.2em] text-white/10">
                                    AWAITING TRANSMISSION
                                </p>

                            </div>

                        </div>
                    )}


                    {/* Content overlay */}
                    <div className="pointer-events-none absolute inset-0">

                        {/* Scanlines */}
                        <div
                            className="absolute inset-0 opacity-[0.025]"
                            style={{
                                backgroundImage:
                                    'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.8) 4px)',
                            }}
                        />

                        {/* Vignette */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.25)_100%)]" />

                    </div>

                </div>


                {/* Browser bottom status */}
                <div className="flex h-5 items-center justify-between border-t border-white/10 bg-[#080808] px-3">

                    {/* Source */}
                    <span className="font-mono text-[6px] uppercase tracking-[0.3em] text-white/15">
                        EXTERNAL SOURCE
                    </span>

                    {/* Live status */}
                    <div className="flex items-center gap-2">

                        {/* Status indicator */}
                        <span className="h-1 w-1 bg-red-600" />

                        {/* Status */}
                        <span className="font-mono text-[6px] uppercase tracking-[0.25em] text-red-600/60">
                            CONNECTED
                        </span>

                    </div>

                </div>

            </div>

        </motion.div>
    );
}
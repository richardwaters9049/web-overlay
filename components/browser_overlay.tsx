'use client';

import {
    PointerEvent as ReactPointerEvent,
    useEffect,
    useRef,
    useState,
} from 'react';
import { motion } from 'framer-motion';

interface BrowserOverlayProps {
    src?: string;
    url?: string;
    width?: string;
    className?: string;
    dragConstraints?: React.RefObject<HTMLElement | null>;
}

type ResizeDirection =
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right';

interface Geometry {
    x: number;
    y: number;
    width: number;
    height: number;
}

export default function BrowserOverlay({
    src = 'about:blank',
    url = 'localhost:3000',
    width = '46%',
    className = '',
    dragConstraints,
}: BrowserOverlayProps) {
    const browserRef = useRef<HTMLDivElement | null>(null);

    const dragRef = useRef<{
        startX: number;
        startY: number;
        startGeometry: Geometry;
    } | null>(null);

    const resizeRef = useRef<{
        direction: ResizeDirection;
        startX: number;
        startY: number;
        startGeometry: Geometry;
    } | null>(null);

    const [locked, setLocked] = useState(false);

    const [geometry, setGeometry] =
        useState<Geometry | null>(null);

    const minimumWidth = 260;
    const chromeHeight = 52;
    const aspectRatio = 16 / 9;

    const getContainer = () => {
        return dragConstraints?.current ?? null;
    };

    const constrainGeometry = (
        next: Geometry,
    ): Geometry => {
        const container = getContainer();

        if (!container) {
            return next;
        }

        const bounds =
            container.getBoundingClientRect();

        const maxWidth = Math.max(
            minimumWidth,
            bounds.width,
        );

        const width = Math.min(
            Math.max(
                minimumWidth,
                next.width,
            ),
            maxWidth,
        );

        const height =
            width / aspectRatio +
            chromeHeight;

        const maxX = Math.max(
            0,
            bounds.width - width,
        );

        const maxY = Math.max(
            0,
            bounds.height - height,
        );

        return {
            x: Math.min(
                Math.max(0, next.x),
                maxX,
            ),
            y: Math.min(
                Math.max(0, next.y),
                maxY,
            ),
            width,
            height,
        };
    };

    useEffect(() => {
        const container =
            dragConstraints?.current;

        if (!container) {
            return;
        }

        const bounds =
            container.getBoundingClientRect();

        const initialWidth =
            bounds.width * 0.46;

        const initialHeight =
            initialWidth / aspectRatio +
            chromeHeight;

        setGeometry(
            constrainGeometry({
                x: bounds.width * 0.11,
                y: bounds.height * 0.17,
                width: initialWidth,
                height: initialHeight,
            }),
        );
    }, []);

    useEffect(() => {
        const handleWindowResize = () => {
            setGeometry((current) => {
                if (!current) {
                    return current;
                }

                return constrainGeometry(
                    current,
                );
            });
        };

        window.addEventListener(
            'resize',
            handleWindowResize,
        );

        return () => {
            window.removeEventListener(
                'resize',
                handleWindowResize,
            );
        };
    }, []);

    useEffect(() => {
        const handlePointerMove = (
            event: PointerEvent,
        ) => {
            if (dragRef.current) {
                const drag = dragRef.current;

                const deltaX =
                    event.clientX -
                    drag.startX;

                const deltaY =
                    event.clientY -
                    drag.startY;

                setGeometry(
                    constrainGeometry({
                        ...drag.startGeometry,
                        x:
                            drag.startGeometry.x +
                            deltaX,
                        y:
                            drag.startGeometry.y +
                            deltaY,
                    }),
                );

                return;
            }

            if (resizeRef.current) {
                const resize =
                    resizeRef.current;

                const deltaX =
                    event.clientX -
                    resize.startX;

                let newWidth =
                    resize.startGeometry.width;

                let newX =
                    resize.startGeometry.x;

                if (
                    resize.direction ===
                    'top-left' ||
                    resize.direction ===
                    'bottom-left'
                ) {
                    newWidth =
                        resize.startGeometry.width -
                        deltaX;

                    newX =
                        resize.startGeometry.x +
                        deltaX;
                } else {
                    newWidth =
                        resize.startGeometry.width +
                        deltaX;
                }

                const newHeight =
                    newWidth /
                    aspectRatio +
                    chromeHeight;

                let newY =
                    resize.startGeometry.y;

                if (
                    resize.direction ===
                    'top-left' ||
                    resize.direction ===
                    'top-right'
                ) {
                    newY =
                        resize.startGeometry.y +
                        resize.startGeometry.height -
                        newHeight;
                }

                setGeometry(
                    constrainGeometry({
                        x: newX,
                        y: newY,
                        width: newWidth,
                        height: newHeight,
                    }),
                );
            }
        };

        const handlePointerUp = () => {
            dragRef.current = null;
            resizeRef.current = null;

            document.body.style.userSelect =
                '';
            document.body.style.cursor =
                '';
        };

        window.addEventListener(
            'pointermove',
            handlePointerMove,
        );

        window.addEventListener(
            'pointerup',
            handlePointerUp,
        );

        window.addEventListener(
            'pointercancel',
            handlePointerUp,
        );

        return () => {
            window.removeEventListener(
                'pointermove',
                handlePointerMove,
            );

            window.removeEventListener(
                'pointerup',
                handlePointerUp,
            );

            window.removeEventListener(
                'pointercancel',
                handlePointerUp,
            );
        };
    }, []);

    const handleBrowserPointerDown = (
        event: ReactPointerEvent<HTMLDivElement>,
    ) => {
        if (locked) {
            return;
        }

        if (event.button !== 0) {
            return;
        }

        if (
            (event.target as HTMLElement).closest(
                '[data-browser-control]',
            )
        ) {
            return;
        }

        if (!geometry) {
            return;
        }

        event.preventDefault();

        dragRef.current = {
            startX: event.clientX,
            startY: event.clientY,
            startGeometry: geometry,
        };

        document.body.style.userSelect =
            'none';

        document.body.style.cursor =
            'grabbing';
    };

    const handleResizePointerDown = (
        event: ReactPointerEvent<HTMLDivElement>,
        direction: ResizeDirection,
    ) => {
        if (locked) {
            return;
        }

        if (!geometry) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        resizeRef.current = {
            direction,
            startX: event.clientX,
            startY: event.clientY,
            startGeometry: geometry,
        };

        document.body.style.userSelect =
            'none';

        document.body.style.cursor =
            direction ===
                'top-left' ||
                direction ===
                'bottom-right'
                ? 'nwse-resize'
                : 'nesw-resize';
    };

    const lockBrowser = () => {
        dragRef.current = null;
        resizeRef.current = null;

        document.body.style.userSelect =
            '';
        document.body.style.cursor =
            '';

        setLocked(true);
    };

    const unlockBrowser = () => {
        setLocked(false);
    };

    const currentWidth =
        geometry?.width ??
        width;

    const currentHeight =
        geometry?.height;

    return (
        <motion.div
            ref={browserRef}
            initial={{
                opacity: 0,
                scale: 0.96,
            }}
            animate={{
                opacity: 1,
                scale: 1,
            }}
            transition={{
                duration: 0.8,
                ease: [
                    0.22,
                    1,
                    0.36,
                    1,
                ],
            }}
            onPointerDown={
                handleBrowserPointerDown
            }
            style={{
                position: 'absolute',
                left: geometry?.x ?? '11%',
                top: geometry?.y ?? '17%',
                width: currentWidth,
                height: currentHeight,
                touchAction: 'none',
                userSelect: 'none',
            }}
            className={`z-30 overflow-visible border border-white/15 bg-black shadow-[0_20px_60px_rgba(0,0,0,0.8)] ${locked
                ? 'cursor-default'
                : 'cursor-grab active:cursor-grabbing'
                } ${className}`}
        >

            {/* Browser window */}

            <div className="relative h-full w-full">

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

                    {/* Navigation */}

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

                        {/* Security */}

                        <span className="mr-2 text-[8px] text-white/30">
                            ●
                        </span>

                        {/* URL */}

                        <span className="truncate font-mono text-[8px] tracking-wide text-white/40">
                            {url}
                        </span>

                    </div>

                    {/* Status */}

                    <div className="ml-3 flex items-center gap-2">

                        {/* Signal */}

                        <span className="h-1.5 w-1.5 rounded-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.8)]" />

                        {/* Live */}

                        <span className="font-mono text-[7px] uppercase tracking-[0.2em] text-white/25">
                            LIVE
                        </span>

                    </div>

                </div>

                {/* Browser content */}

                <div className="relative h-[calc(100%-52px)] w-full bg-black">

                    {/* Browser iframe */}

                    {src !==
                        'about:blank' ? (
                        <iframe
                            src={src}
                            title="Browser overlay"
                            draggable={false}
                            className="pointer-events-none absolute inset-0 h-full w-full border-0"
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

                {/* Browser status */}

                <div className="flex h-5 items-center justify-between border-t border-white/10 bg-[#080808] px-3">

                    {/* Source */}

                    <span className="font-mono text-[6px] uppercase tracking-[0.3em] text-white/15">
                        EXTERNAL SOURCE
                    </span>

                    {/* Connected */}

                    <div className="flex items-center gap-2">

                        <span className="h-1 w-1 bg-red-600" />

                        <span className="font-mono text-[6px] uppercase tracking-[0.25em] text-red-600/60">
                            CONNECTED
                        </span>

                    </div>

                </div>

                {/* Resize corners */}

                {!locked && (
                    <>

                        {/* Top left */}

                        <div
                            data-browser-control
                            onPointerDown={(
                                event,
                            ) =>
                                handleResizePointerDown(
                                    event,
                                    'top-left',
                                )
                            }
                            className="absolute -left-2 -top-2 z-50 h-6 w-6 cursor-nwse-resize"
                        >
                            <div className="absolute left-0 top-0 h-3 w-3 border-l-2 border-t-2 border-red-600 shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
                        </div>

                        {/* Top right */}

                        <div
                            data-browser-control
                            onPointerDown={(
                                event,
                            ) =>
                                handleResizePointerDown(
                                    event,
                                    'top-right',
                                )
                            }
                            className="absolute -right-2 -top-2 z-50 h-6 w-6 cursor-nesw-resize"
                        >
                            <div className="absolute right-0 top-0 h-3 w-3 border-r-2 border-t-2 border-red-600 shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
                        </div>

                        {/* Bottom left */}

                        <div
                            data-browser-control
                            onPointerDown={(
                                event,
                            ) =>
                                handleResizePointerDown(
                                    event,
                                    'bottom-left',
                                )
                            }
                            className="absolute -bottom-2 -left-2 z-50 h-6 w-6 cursor-nesw-resize"
                        >
                            <div className="absolute bottom-0 left-0 h-3 w-3 border-b-2 border-l-2 border-red-600 shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
                        </div>

                        {/* Bottom right */}

                        <div
                            data-browser-control
                            onPointerDown={(
                                event,
                            ) =>
                                handleResizePointerDown(
                                    event,
                                    'bottom-right',
                                )
                            }
                            className="absolute -bottom-2 -right-2 z-50 h-6 w-6 cursor-nwse-resize"
                        >
                            <div className="absolute bottom-0 right-0 h-3 w-3 border-b-2 border-r-2 border-red-600 shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
                        </div>

                    </>
                )}

                {/* Move and lock controls */}

                <div
                    data-browser-control
                    className="absolute -bottom-10 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-1 border border-white/10 bg-black/95 p-1 shadow-[0_10px_30px_rgba(0,0,0,0.7)]"
                >

                    {/* Move */}

                    <button
                        type="button"
                        data-browser-control
                        onPointerDown={(
                            event,
                        ) => {
                            event.stopPropagation();
                        }}
                        onClick={(
                            event,
                        ) => {
                            event.stopPropagation();

                            unlockBrowser();
                        }}
                        className={`px-4 py-1.5 font-mono text-[12px] font-bold hover:cursor-pointer uppercase tracking-[0.3em] transition-colors duration-200 ${!locked
                            ? 'bg-red-600 text-black'
                            : 'text-white/50 hover:text-red-600'
                            }`}
                    >
                        MOVE
                    </button>

                    {/* Lock */}

                    <button
                        type="button"
                        data-browser-control
                        onPointerDown={(
                            event,
                        ) => {
                            event.stopPropagation();
                        }}
                        onClick={(
                            event,
                        ) => {
                            event.stopPropagation();

                            lockBrowser();
                        }}
                        className={`px-4 py-1.5 font-mono text-[12px] font-bold hover:cursor-pointer uppercase tracking-[0.3em] transition-colors duration-200 ${locked
                            ? 'bg-red-600 text-black'
                            : 'text-white/50 hover:text-red-600'
                            }`}
                    >
                        {locked
                            ? 'LOCKED'
                            : 'LOCK'}
                    </button>

                </div>

            </div>

        </motion.div>
    );
}
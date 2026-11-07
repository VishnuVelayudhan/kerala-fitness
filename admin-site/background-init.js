document.addEventListener("DOMContentLoaded", function () {
    if (window.VANTA) {
        VANTA.GLOBE({
            el: "#bg-canvas",
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: 0xCCFF00,       /* Neon Lime */
            color2: 0xFFFFFF,      /* White accents */
            backgroundColor: 0x050505, /* Very Dark Grey/Black */
            size: 1.2
        });
    } else {
        console.error("Vanta.js not loaded");
    }
});

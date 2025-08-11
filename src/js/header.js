export function initHeaderMenu() {
    const mobileMenuPortrait = document.querySelector('[data-menu]');
    const mobileMenuLandscape = document.querySelector('[data-menu-landscape]');
    const header = document.querySelector('.header');
    const body = document.body;

    if (!mobileMenuPortrait || !mobileMenuLandscape || !header) {
        return;
    }

    const toggleMenu = (targetMenu, isOpen) => {
        if (!targetMenu) {
            return;
        }
        
        targetMenu.classList.toggle('is-open', isOpen);
        body.classList.toggle('no-scroll', isOpen);
        header.classList.toggle('no-border-bottom', isOpen);
        header.classList.toggle('is-menu-open', isOpen);
    };

    const findTargetMenu = () => {
        const isPortrait = window.matchMedia('(min-width: 768px) and (max-width: 1439px) and (orientation: portrait)').matches;
        const isLandscape = window.matchMedia('(min-width: 768px) and (max-width: 1439px) and (orientation: landscape)').matches;

        if (window.innerWidth <= 767 || isPortrait) {
            return mobileMenuPortrait;
        } else if (isLandscape) {
            return mobileMenuLandscape;
        } else {
            return null;
        }
    };
    
    body.addEventListener('click', (e) => {
        const openBtn = e.target.closest('[data-menu-open]');
        const closeBtn = e.target.closest('[data-menu-close]');
        const menuLink = e.target.closest('a');

        if (openBtn) {
            const targetMenu = findTargetMenu();
            if (targetMenu) {
                toggleMenu(targetMenu, true);
            }
        } else if (closeBtn || menuLink) {
            const targetMenu = findTargetMenu();
            if (targetMenu && targetMenu.classList.contains('is-open')) {
                toggleMenu(targetMenu, false);
            }
        }
    });

    window.addEventListener('keydown', e => {
        const targetMenu = findTargetMenu();
        if (e.key === 'Escape' && targetMenu && targetMenu.classList.contains('is-open')) {
            toggleMenu(targetMenu, false);
        }
    });

    window.addEventListener('resize', () => {
        const isPortrait = window.matchMedia('(min-width: 768px) and (max-width: 1439px) and (orientation: portrait)').matches;
        const isLandscape = window.matchMedia('(min-width: 768px) and (max-width: 1439px) and (orientation: landscape)').matches;
        
        const openPortraitMenu = mobileMenuPortrait.classList.contains('is-open');
        const openLandscapeMenu = mobileMenuLandscape.classList.contains('is-open');

        if (openPortraitMenu && (!isPortrait || window.innerWidth > 1439)) {
            toggleMenu(mobileMenuPortrait, false);
        }
        if (openLandscapeMenu && (!isLandscape || window.innerWidth > 1439)) {
            toggleMenu(mobileMenuLandscape, false);
        }
    });
}
export function initHeaderMenu() {
    const mobileMenuPortrait = document.querySelector('[data-menu]');
    const mobileMenuLandscape = document.querySelector('[data-menu-landscape]');
    const openMenuBtn = document.querySelector('[data-menu-open]');
    const closeMenuBtn = document.querySelector('[data-menu-close]');
    const header = document.querySelector('.header');
    const body = document.body;

    if (!mobileMenuPortrait || !mobileMenuLandscape || !openMenuBtn || !closeMenuBtn || !header) {
        return;
    }

    const toggleMenu = () => {
        const isPortrait = window.matchMedia('(min-width: 768px) and (max-width: 1439px) and (orientation: portrait)').matches;
        const isLandscape = window.matchMedia('(min-width: 768px) and (max-width: 1439px) and (orientation: landscape)').matches;
        
        let targetMenu;
        if (window.innerWidth <= 767 || isPortrait) {
            targetMenu = mobileMenuPortrait;
        } else if (isLandscape) {
            targetMenu = mobileMenuLandscape;
        } else {
            return;
        }
        
        const isOpen = targetMenu.classList.toggle('is-open');
        body.classList.toggle('no-scroll', isOpen);
        header.classList.toggle('no-border-bottom', isOpen);
        header.classList.toggle('is-menu-open', isOpen);
    };
    
    openMenuBtn.addEventListener('click', toggleMenu);
    closeMenuBtn.addEventListener('click', toggleMenu);

    const handleLinkClick = (e) => {
        if (e.target.closest('a')) {
            toggleMenu();
        }
    };
    mobileMenuPortrait.addEventListener('click', handleLinkClick);
    mobileMenuLandscape.addEventListener('click', handleLinkClick);

    window.addEventListener('keydown', e => {
        if (e.key === 'Escape' && (mobileMenuPortrait.classList.contains('is-open') || mobileMenuLandscape.classList.contains('is-open'))) {
            toggleMenu();
        }
    });

    window.addEventListener('resize', () => {
        if (mobileMenuPortrait.classList.contains('is-open') || mobileMenuLandscape.classList.contains('is-open')) {
            const isPortrait = window.matchMedia('(min-width: 768px) and (max-width: 1439px) and (orientation: portrait)').matches;
            const isLandscape = window.matchMedia('(min-width: 768px) and (max-width: 1439px) and (orientation: landscape)').matches;
            
            if (mobileMenuPortrait.classList.contains('is-open') && !isPortrait && (isLandscape || window.innerWidth > 1439)) {
                toggleMenu();
            }
            if (mobileMenuLandscape.classList.contains('is-open') && !isLandscape) {
                toggleMenu();
            }
        }
    });
}
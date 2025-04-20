document.addEventListener('DOMContentLoaded', () => {

    // Preloader Logic
    const preloader = document.getElementById('preloader');
    const letterAppearDuration = 2200; // ms (Longest animation delay 0.7s + duration 1.5s = 2.2s)
    const holdDuration = 300;         // ms (1 second hold)
    const transitionDuration = 600;    // ms (Duration of dispersal/logo appear)
    const finalFadeDelay = 500;       // ms (Slight delay before final fade out)

    window.addEventListener('load', () => {
        // Ensure preloader exists
        if (!preloader) return;

        const timeToStartStep2 = letterAppearDuration + holdDuration;
        const timeToStartFinalFade = timeToStartStep2 + transitionDuration + finalFadeDelay;

        // Function to hide and remove the preloader
        const hidePreloader = () => {
            if (preloader) {
                preloader.classList.add('hidden');
                preloader.addEventListener('transitionend', (event) => {
                    // Ensure we're reacting to the opacity transition on the preloader itself
                    if (event.target === preloader && event.propertyName === 'opacity' && preloader.parentNode) {
                         preloader.parentNode.removeChild(preloader);
                    }
                }, { once: true });
            }
        };

        // 1. Wait for initial animation + hold, then trigger step 2
        setTimeout(() => {
            if (preloader) {
                 preloader.classList.add('step-2');
            }
        }, timeToStartStep2);

        // 2. Wait for step 2 transition + delay, then trigger final fade out
        setTimeout(hidePreloader, timeToStartFinalFade);

    }); // End window.load

    // Мобильное меню (бургер)
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    burger.addEventListener('click', () => {
        // Toggle Nav
        nav.classList.toggle('nav-active');

        // Animate Links
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });

        // Burger Animation
        burger.classList.toggle('toggle');
    });

    // Закрытие меню при клике на ссылку (для мобильных)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('nav-active')) {
                nav.classList.remove('nav-active');
                burger.classList.remove('toggle');
                 navLinks.forEach(link => link.style.animation = ''); // Сброс анимации
            }
        });
    });

    // Плавная прокрутка (уже есть через CSS `scroll-behavior: smooth;`, но можно добавить для большей совместимости)
    // --- Опционально ---

    // Анимация появления элементов при скролле
    const revealItems = document.querySelectorAll('.reveal-item'); // Select new class

    const revealElement = (entries, observer) => { // Renamed function for clarity
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });
    };

    const itemObserver = new IntersectionObserver(revealElement, { // Renamed observer
        root: null,
        threshold: 0.1, // Adjust threshold as needed
    });

    revealItems.forEach(item => { // Iterate over new nodelist
        itemObserver.observe(item); // Observe each item
    });


    // Подсветка активного пункта меню при скролле
    const sections = document.querySelectorAll('.section'); // Keep this for menu highlighting
    const navLinksAnchors = document.querySelectorAll('.nav-links a');
    const headerHeight = document.querySelector('.header').offsetHeight;

    const highlightMenu = () => {
        let scrollY = window.pageYOffset;
        let currentSection = "";

        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 50; // Добавляем небольшой отступ
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                 currentSection = sectionId;
            }
        });

        // Особый случай для hero секции (если она есть) или верхней части страницы
        const heroSection = document.querySelector('.hero');
         if (heroSection && scrollY < heroSection.offsetHeight - headerHeight - 50) {
             currentSection = ""; // Нет активной секции вверху
         }

        navLinksAnchors.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            // Проверяем, что href не пустой и содержит #
            if (href && href.includes('#') && href.split('#')[1] === currentSection) {
                link.classList.add('active');
            } else if (!currentSection && href === '#') {
                 // Если мы наверху и ссылка ведет на # (главная), подсвечиваем ее (если такая есть)
                 // link.classList.add('active');
            }
        });

         // Если мы в самом низу и секция контактов последняя
         const contactSection = document.getElementById('contact');
         if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50 && contactSection) { // Почти достигли низа
            navLinksAnchors.forEach(link => link.classList.remove('active'));
            const contactLink = document.querySelector('.nav-links a[href="#contact"]');
            if (contactLink) contactLink.classList.add('active');
         }
    };

    window.addEventListener('scroll', highlightMenu);
    window.addEventListener('load', highlightMenu); // Вызываем при загрузке на случай, если страница загрузилась не вверху

    // Collapsible code blocks
    const codeHeaders = document.querySelectorAll('.code-header');

    codeHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const codeShowcase = header.closest('.code-showcase');
            if (codeShowcase) {
                codeShowcase.classList.toggle('collapsed');
            }
        });
    });

}); 
(function () {
        // Hamburger menu functionality
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');
        const navLinksItems = document.querySelectorAll('.nav-link');

        function toggleMenu() {
                hamburger.classList.toggle('active');
                navLinks.classList.toggle('active');
        }

        hamburger.addEventListener('click', toggleMenu);

        // Close menu when clicking a nav link
        navLinksItems.forEach(link => {
                link.addEventListener('click', () => {
                        hamburger.classList.remove('active');
                        navLinks.classList.remove('active');
                });
        });

        window.addEventListener('load', () => {
                const characters = '01????????RAKTIM';
                const fontSize = 25;
                let canvas = document.getElementById('matrix-canvas');
                if (!canvas) {
                        console.error('matrix-canvas not found');
                        return;
                }
                let ctx = canvas.getContext('2d');
                let columns;
                let drops = [];

                function initCanvasAndDrops() {
                        const dpr = window.devicePixelRatio || 1;
                        canvas.width = Math.floor(window.innerWidth * dpr);
                        canvas.height = Math.floor(window.innerHeight * dpr);
                        canvas.style.width = window.innerWidth + 'px';
                        canvas.style.height = window.innerHeight + 'px';

                        ctx = canvas.getContext('2d');
                        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

                        columns = Math.floor(window.innerWidth / fontSize);
                        drops = [];

                        for (let i = 0; i < columns; i++) {
                                if (Math.random() < 0.3) {
                                        const drop = {
                                                x: i * fontSize,
                                                y: Math.random() * -window.innerHeight,
                                                speed: Math.random() * 2,
                                                opacity: Math.random() * 0.3 + 0.7,
                                                trail: [],
                                                changeCounter: 0
                                        };

                                        const trailLength = Math.floor(Math.random() * 18) + 10;
                                        for (let j = 0; j < trailLength; j++) {
                                                drop.trail.push(characters[Math.floor(Math.random() * characters.length)]);
                                        }

                                        drops.push(drop);
                                }
                        }
                }

                function drawMatrix() {
                        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
                        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

                        drops.forEach((drop) => {
                                drop.changeCounter++;

                                if (drop.changeCounter > 2) {
                                        for (let i = 0; i < drop.trail.length; i++) {
                                                if (Math.random() > 0.9) {
                                                        drop.trail[i] = characters[Math.floor(Math.random() * characters.length)];
                                                }
                                        }
                                        drop.changeCounter = 0;
                                }

                                drop.trail.forEach((char, charIndex) => {
                                        const y = drop.y + charIndex * fontSize;

                                        if (y > 0 && y < window.innerHeight + fontSize) {
                                                const fadeLevel = 1 - (charIndex / drop.trail.length);

                                                if (charIndex === 0) {
                                                        ctx.fillStyle = `rgba(255, 255, 255, ${drop.opacity * 0.95})`;
                                                        // ctx.shadowBlur = 20;
                                                        ctx.shadowColor = '#00FF41';
                                                } else if (charIndex === 1) {
                                                        ctx.fillStyle = `rgba(200, 255, 200, ${drop.opacity * 0.9})`;
                                                        // ctx.shadowBlur = 12;
                                                        ctx.shadowColor = '#00FF41';
                                                } else {
                                                        const brightness = 160 + Math.floor(fadeLevel * 95);
                                                        ctx.fillStyle = `rgba(0, ${brightness}, 50, ${drop.opacity * fadeLevel * 0.95})`;
                                                        // ctx.shadowBlur = 6;
                                                        ctx.shadowColor = '#00FF41';
                                                }

                                                ctx.font = `${fontSize}px 'Courier New', monospace`;
                                                ctx.fillText(char, drop.x, y);
                                                ctx.shadowBlur = 0;
                                        }
                                });

                                drop.y += drop.speed;

                                if (drop.y - drop.trail.length * fontSize > window.innerHeight) {
                                        drop.y = Math.random() * -400 - 100;
                                        drop.speed = Math.random() * 2;
                                        drop.opacity = Math.random() * 0.3 + 0.7;

                                        const trailLength = Math.floor(Math.random() * 18) + 10;
                                        drop.trail = [];
                                        for (let j = 0; j < trailLength; j++) {
                                                drop.trail.push(characters[Math.floor(Math.random() * characters.length)]);
                                        }
                                }
                        });

                        requestAnimationFrame(drawMatrix);
                }

                initCanvasAndDrops();
                drawMatrix();

                let resizeTimeout;
                window.addEventListener('resize', () => {
                        clearTimeout(resizeTimeout);
                        resizeTimeout = setTimeout(initCanvasAndDrops, 120);
                });

                // Enhanced smooth scrolling
                document.querySelectorAll('.nav-link').forEach(link => {
                        link.addEventListener('click', (e) => {
                                e.preventDefault();
                                const targetId = link.getAttribute('href');
                                const targetSection = document.querySelector(targetId);

                                if (targetSection) {
                                        // Remove active class from all links
                                        document.querySelectorAll('.nav-link').forEach(l => {
                                                l.classList.remove('active-link');
                                        });
                                        // Add active class to clicked link
                                        link.classList.add('active-link');

                                        const offsetTop = targetSection.offsetTop;
                                        const navHeight = document.getElementById('navbar').offsetHeight;
                                        const offset = targetId === '#home' ? 0 : offsetTop - navHeight;

                                        window.scrollTo({
                                                top: offset,
                                                behavior: 'smooth'
                                        });

                                        // Update URL without jumping
                                        window.history.pushState(null, '', targetId);
                                }
                        });
                });

                // Highlight active section while scrolling
                const sections = document.querySelectorAll('section[id]');
                window.addEventListener('scroll', () => {
                        const scrollY = window.pageYOffset;
                        const navHeight = document.getElementById('navbar').offsetHeight;

                        sections.forEach(section => {
                                const sectionTop = section.offsetTop - navHeight - 100;
                                const sectionBottom = sectionTop + section.offsetHeight;
                                const sectionId = section.getAttribute('id');

                                if (scrollY > sectionTop && scrollY <= sectionBottom) {
                                        document.querySelector(`.nav-link[href="#${sectionId}"]`)
                                                ?.classList.add('active-link');
                                } else {
                                        document.querySelector(`.nav-link[href="#${sectionId}"]`)
                                                ?.classList.remove('active-link');
                                }
                        });
                });

                const observerOptions = {
                        threshold: 0.2,
                        rootMargin: '0px 0px -100px 0px'
                };

                const observer = new IntersectionObserver((entries) => {
                        entries.forEach(entry => {
                                if (entry.isIntersecting) {
                                        entry.target.style.opacity = '1';
                                        entry.target.style.transform = 'translateY(0)';
                                }
                        });
                }, observerOptions);

                document.querySelectorAll('.project-card:not(.hidden), .about-text').forEach(el => {
                        el.style.opacity = '0';
                        el.style.transform = 'translateY(30px)';
                        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                        observer.observe(el);
                });

                // Handle See More / See Less functionality for projects
                const toggleBtn = document.getElementById('toggle-projects');
                const hiddenCards = document.querySelectorAll('.project-card.hidden');
                let isExpanded = false;

                if (toggleBtn) {
                        toggleBtn.addEventListener('click', () => {
                                isExpanded = !isExpanded;

                                if (isExpanded) {
                                        // Show cards
                                        toggleBtn.textContent = 'See less';
                                        hiddenCards.forEach((card, index) => {
                                                setTimeout(() => {
                                                        card.style.display = 'block';
                                                        // Force reflow
                                                        void card.offsetWidth;
                                                        card.classList.add('show');
                                                }, index * 100);
                                        });
                                } else {
                                        // Hide cards
                                        toggleBtn.textContent = 'See more';
                                        Array.from(hiddenCards).reverse().forEach((card, index) => {
                                                setTimeout(() => {
                                                        card.classList.remove('show');
                                                        setTimeout(() => {
                                                                card.style.display = 'none';
                                                        }, 500); // Match animation duration
                                                }, index * 100);
                                        });
                                }
                        });
                }
        });
})();

document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. XỬ LÝ MENU NAVIGATION & HAMBURGER
    // ==========================================
    const navItems = document.querySelectorAll('.nav-item');
    const navButtons = document.querySelectorAll('.button');
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.nav');

    // Hover cho PC
    navItems.forEach(item => {
        let timeoutId;
        item.addEventListener('mouseenter', () => {
            if (window.innerWidth > 768) {
                clearTimeout(timeoutId);
                navItems.forEach(otherItem => {
                    if (otherItem !== item) otherItem.classList.remove('active');
                });
                item.classList.add('active');
            }
        });

        item.addEventListener('mouseleave', () => {
            if (window.innerWidth > 768) {
                timeoutId = setTimeout(() => {
                    item.classList.remove('active');
                }, 250);
            }
        });
    });

    // Click Hamburger (Mobile)
    if (hamburger && nav) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            nav.classList.toggle('open');
        });
    }

    // Click Accordion Menu (Mobile)
    navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const parentItem = btn.parentElement;
                
                navItems.forEach(item => {
                    if (item !== parentItem) item.classList.remove('active');
                });
                
                parentItem.classList.toggle('active');
            }
        });
    });

    // ==========================================
    // 2. XỬ LÝ SLIDER POSTER (Kèm kiểm tra tồn tại)
    // ==========================================
    const slider = document.getElementById('posterSlider');
    
    // CHỈ CHẠY CODE SLIDER NẾU TRANG CÓ CHỨA SLIDER (Ví dụ trang index)
    if (slider) {
        const track = slider.querySelector('.slider-track');
        const slides = Array.from(track.children);
        const dots = slider.querySelectorAll('.dot');

        let currentIndex = 0;
        let isDragging = false;
        let startPos = 0;
        let currentTranslate = 0;
        let prevTranslate = 0;
        let animationID = 0;
        let autoSlideTimer = null;

        const slideColors = ['#3d2314', '#ff6088', '#258436'];

        function startAutoSlide() {
            stopAutoSlide();
            autoSlideTimer = setInterval(() => {
                currentIndex = (currentIndex + 1) % slides.length;
                updateSliderPosition();
            }, 3500);
        }

        function stopAutoSlide() {
            if (autoSlideTimer) clearInterval(autoSlideTimer);
        }

        function updateSliderPosition() {
            currentTranslate = currentIndex * -slider.clientWidth;
            prevTranslate = currentTranslate;
            track.style.transform = `translateX(${currentTranslate}px)`;
            
            slider.style.backgroundColor = slideColors[currentIndex];
            
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateSliderPosition();
                startAutoSlide();
            });
        });

        // Xử lý vuốt
        function getPositionX(event) {
            return event.type.includes('mouse') ? event.clientX : event.touches[0].clientX;
        }

        function touchStart(index) {
            return function(event) {
                stopAutoSlide();
                isDragging = true;
                startPos = getPositionX(event);
                animationID = requestAnimationFrame(animation);
                track.style.transition = 'none';
            }
        }

        function touchMove(event) {
            if (isDragging) {
                const currentPosition = getPositionX(event);
                const diff = currentPosition - startPos;
                currentTranslate = prevTranslate + diff;
            }
        }

        function touchEnd() {
            if (!isDragging) return;
            isDragging = false;
            cancelAnimationFrame(animationID);

            const movedBy = currentTranslate - prevTranslate;
            if (movedBy < -80 && currentIndex < slides.length - 1) currentIndex += 1;
            if (movedBy > 80 && currentIndex > 0) currentIndex -= 1;

            track.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
            updateSliderPosition();
            startAutoSlide();
        }

        function animation() {
            track.style.transform = `translateX(${currentTranslate}px)`;
            if (isDragging) requestAnimationFrame(animation);
        }

        slides.forEach((slide, index) => {
            slide.addEventListener('mousedown', touchStart(index));
            slide.addEventListener('mousemove', touchMove);
            slide.addEventListener('mouseup', touchEnd);
            slide.addEventListener('mouseleave', () => { if (isDragging) touchEnd(); });

            // Touch events cho điện thoại
            slide.addEventListener('touchstart', touchStart(index), {passive: true});
            slide.addEventListener('touchmove', touchMove, {passive: true});
            slide.addEventListener('touchend', touchEnd);
        });

        startAutoSlide();
        window.addEventListener('resize', updateSliderPosition);
    }
});

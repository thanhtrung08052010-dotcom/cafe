document.addEventListener("DOMContentLoaded", () => {
    // Lấy tất cả các mục có chứa menu xổ xuống
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        let timeoutId;

        // Khi chuột đi vào thẻ li (bao gồm cả nút và panel)
        item.addEventListener('mouseenter', () => {
            // Chỉ kích hoạt hover nếu là màn hình máy tính (> 768px)
            if (window.innerWidth > 768) {
                clearTimeout(timeoutId);
                navItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                item.classList.add('active');
            }
        });

        // Khi chuột rời khỏi thẻ li (rời khỏi cả nút và panel)
        item.addEventListener('mouseleave', () => {
            // Chờ 250 mili-giây (0.25s) trước khi đóng panel
            timeoutId = setTimeout(() => {
                item.classList.remove('active');
            }, 250); // Có thể thay đổi con số 250 này để nhanh/chậm hơn
        });
    });
});
// --- XỬ LÝ SLIDER KHỦNG CHẠY TỰ ĐỘNG 2S + KÉO/VUỐT CHUỘT ---
const slider = document.getElementById('posterSlider');
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

// Tự động chuyển slide sau mỗi 2 giây (2000ms)
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

// Cập nhật vị trí hiển thị slide
function updateSliderPosition() {
    currentTranslate = currentIndex * -slider.clientWidth;
    prevTranslate = currentTranslate;
    track.style.transform = `translateX(${currentTranslate}px)`;
    
    // Cập nhật trạng thái chấm tròn (Dots)
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });
}

// Bắt sự kiện Dots click
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentIndex = index;
        updateSliderPosition();
        startAutoSlide();
    });
});

// --- XỬ LÝ VUỐT/KÉO CHUỘT (DRAG & TOUCH) ---
function getPositionX(event) {
    return event.type.includes('mouse') ? event.clientX : event.touches[0].clientX;
}

function touchStart(index) {
    return function(event) {
        stopAutoSlide();
        isDragging = true;
        startPos = getPositionX(event);
        animationID = requestAnimationFrame(animation);
        track.style.transition = 'none'; // Bỏ animation mượt tạm thời khi đang kéo
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

    // Ngưỡng vuốt qua slide (nếu kéo quá 80px sẽ đổi slide)
    if (movedBy < -80 && currentIndex < slides.length - 1) {
        currentIndex += 1;
    }
    if (movedBy > 80 && currentIndex > 0) {
        currentIndex -= 1;
    }

    track.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
    updateSliderPosition();
    startAutoSlide();
}

function animation() {
    setSliderPosition();
    if (isDragging) requestAnimationFrame(animation);
}

function setSliderPosition() {
    track.style.transform = `translateX(${currentTranslate}px)`;
}

// Gắn sự kiện vuốt chuột & cảm ứng màn hình
slides.forEach((slide, index) => {
    // Chuột (PC)
    slide.addEventListener('mousedown', touchStart(index));
    slide.addEventListener('mousemove', touchMove);
    slide.addEventListener('mouseup', touchEnd);
    slide.addEventListener('mouseleave', () => {
        if (isDragging) touchEnd();
    });

    // Cảm ứng (Điện thoại / Tablet)
    slide.addEventListener('touchstart', touchStart(index));
    slide.addEventListener('touchmove', touchMove);
    slide.addEventListener('touchend', touchEnd);
});

// Khởi chạy slider ban đầu
startAutoSlide();

// Cập nhật kích thước khi resize màn hình
window.addEventListener('resize', updateSliderPosition);

// Thêm danh sách màu nền tương ứng với từng poster (thay mã màu theo ảnh của bạn)
const slideColors = [
    '#3d2314',
    '#ff6088', // Màu dải nền cho Poster 2 (Nâu Cà phê)
    '#258436'  // Màu dải nền cho Poster 3 (Xanh lục/Đen)
];

// Cập nhật lại hàm updateSliderPosition
function updateSliderPosition() {
    currentTranslate = currentIndex * -slider.clientWidth;
    prevTranslate = currentTranslate;
    track.style.transform = `translateX(${currentTranslate}px)`;
    
    // Đổi màu nền dải 2 bên theo slide hiện tại
    slider.style.backgroundColor = slideColors[currentIndex];
    
    // Cập nhật trạng thái dots
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });
}

// --- XỬ LÝ HAMBURGER MENU CHO MOBILE ---
const hamburger = document.querySelector('.hamburger');
const nav = document.querySelector('.nav');
const navItems = document.querySelectorAll('.nav-item');
const navButtons = document.querySelectorAll('.button');

// Click vào hamburger để mở/đóng menu tổng và biến thành dấu X
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    nav.classList.toggle('open');
});

// Chuyển Hover thành Click đối với mobile
navButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Chỉ áp dụng logic click accordion trên màn hình Mobile (< 768px)
        if (window.innerWidth <= 768) {
            e.preventDefault(); // Tránh bị cuộn trang khi bấm
            const parentItem = btn.parentElement;
            
            // Đóng các panel đang mở khác
            navItems.forEach(item => {
                if (item !== parentItem) {
                    item.classList.remove('active');
                }
            });
            
            // Mở/Đóng panel hiện tại
            parentItem.classList.toggle('active');
        }
    });
});document.addEventListener("DOMContentLoaded", () => {
    // Lấy tất cả các mục có chứa menu xổ xuống
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        let timeoutId;

        // Khi chuột đi vào thẻ li (bao gồm cả nút và panel)
        item.addEventListener('mouseenter', () => {
            // Hủy lệnh đóng (nếu có) do người dùng lỡ tay trượt chuột ra rồi quay lại
            clearTimeout(timeoutId);
            
            // Đóng các panel khác nếu đang mở
            navItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });

            // Thêm class 'active' để hiện panel và đổi màu nút
            item.classList.add('active');
        });

        // Khi chuột rời khỏi thẻ li (rời khỏi cả nút và panel)
        item.addEventListener('mouseleave', () => {
            // Chờ 250 mili-giây (0.25s) trước khi đóng panel
            timeoutId = setTimeout(() => {
                item.classList.remove('active');
            }, 250); // Có thể thay đổi con số 250 này để nhanh/chậm hơn
        });
    });
});
// --- XỬ LÝ SLIDER KHỦNG CHẠY TỰ ĐỘNG 2S + KÉO/VUỐT CHUỘT ---
const slider = document.getElementById('posterSlider');
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

// Tự động chuyển slide sau mỗi 2 giây (2000ms)
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

// Cập nhật vị trí hiển thị slide
function updateSliderPosition() {
    currentTranslate = currentIndex * -slider.clientWidth;
    prevTranslate = currentTranslate;
    track.style.transform = `translateX(${currentTranslate}px)`;
    
    // Cập nhật trạng thái chấm tròn (Dots)
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });
}

// Bắt sự kiện Dots click
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentIndex = index;
        updateSliderPosition();
        startAutoSlide();
    });
});

// --- XỬ LÝ VUỐT/KÉO CHUỘT (DRAG & TOUCH) ---
function getPositionX(event) {
    return event.type.includes('mouse') ? event.clientX : event.touches[0].clientX;
}

function touchStart(index) {
    return function(event) {
        stopAutoSlide();
        isDragging = true;
        startPos = getPositionX(event);
        animationID = requestAnimationFrame(animation);
        track.style.transition = 'none'; // Bỏ animation mượt tạm thời khi đang kéo
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

    // Ngưỡng vuốt qua slide (nếu kéo quá 80px sẽ đổi slide)
    if (movedBy < -80 && currentIndex < slides.length - 1) {
        currentIndex += 1;
    }
    if (movedBy > 80 && currentIndex > 0) {
        currentIndex -= 1;
    }

    track.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
    updateSliderPosition();
    startAutoSlide();
}

function animation() {
    setSliderPosition();
    if (isDragging) requestAnimationFrame(animation);
}

function setSliderPosition() {
    track.style.transform = `translateX(${currentTranslate}px)`;
}

// Gắn sự kiện vuốt chuột & cảm ứng màn hình
slides.forEach((slide, index) => {
    // Chuột (PC)
    slide.addEventListener('mousedown', touchStart(index));
    slide.addEventListener('mousemove', touchMove);
    slide.addEventListener('mouseup', touchEnd);
    slide.addEventListener('mouseleave', () => {
        if (isDragging) touchEnd();
    });

    // Cảm ứng (Điện thoại / Tablet)
    slide.addEventListener('touchstart', touchStart(index));
    slide.addEventListener('touchmove', touchMove);
    slide.addEventListener('touchend', touchEnd);
});

// Khởi chạy slider ban đầu
startAutoSlide();

// Cập nhật kích thước khi resize màn hình
window.addEventListener('resize', updateSliderPosition);

// Thêm danh sách màu nền tương ứng với từng poster (thay mã màu theo ảnh của bạn)
const slideColors = [
    '#3d2314',
    '#ff6088', // Màu dải nền cho Poster 2 (Nâu Cà phê)
    '#258436'  // Màu dải nền cho Poster 3 (Xanh lục/Đen)
];

// Cập nhật lại hàm updateSliderPosition
function updateSliderPosition() {
    currentTranslate = currentIndex * -slider.clientWidth;
    prevTranslate = currentTranslate;
    track.style.transform = `translateX(${currentTranslate}px)`;
    
    // Đổi màu nền dải 2 bên theo slide hiện tại
    slider.style.backgroundColor = slideColors[currentIndex];
    
    // Cập nhật trạng thái dots
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });
}

// --- XỬ LÝ HAMBURGER MENU CHO MOBILE ---
const hamburger = document.querySelector('.hamburger');
const nav = document.querySelector('.nav');
const navItems = document.querySelectorAll('.nav-item');
const navButtons = document.querySelectorAll('.button');

// Click vào hamburger để mở/đóng menu tổng và biến thành dấu X
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    nav.classList.toggle('open');
});

// Chuyển Hover thành Click đối với mobile
navButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Chỉ áp dụng logic click accordion trên màn hình Mobile (< 768px)
        if (window.innerWidth <= 768) {
            e.preventDefault(); // Tránh bị cuộn trang khi bấm
            const parentItem = btn.parentElement;
            
            // Đóng các panel đang mở khác
            navItems.forEach(item => {
                if (item !== parentItem) {
                    item.classList.remove('active');
                }
            });
            
            // Mở/Đóng panel hiện tại
            parentItem.classList.toggle('active');
        }
    });
});

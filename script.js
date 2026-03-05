document.addEventListener('DOMContentLoaded', () => {

    /* --- Mobile Menu Toggle --- */
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');

    mobileBtn.addEventListener('click', () => {
        mobileNav.classList.toggle('active');

        // Simple hamburger animation
        const spans = mobileBtn.querySelectorAll('span');
        if (mobileNav.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -7px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Close menu when clicking a link
    document.querySelectorAll('.mobile-nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            const spans = mobileBtn.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });


    /* --- Calculator Logic --- */
    const calcBtn = document.getElementById('calc-btn');
    const productType = document.getElementById('product-type');
    const materialType = document.getElementById('material-type');
    const sizeLength = document.getElementById('size-length');
    const finalPriceDisplay = document.getElementById('final-price');

    // Base prices dictionary
    const basePrices = {
        'pipe': 500,     // Base price per meter
        'hood': 8000,    // Base price per item
        'gutter': 1000,  // Base price per meter/item
        'cap': 3000      // Base price per item
    };

    // Material multipliers
    const materialMultipliers = {
        'galvanized': 1.0,  // Standard
        'poly': 1.3,        // +30% for polymer coating
        'stainless': 2.5    // +150% for stainless steel
    };

    calcBtn.addEventListener('click', () => {
        // Simple animation to make it feel "calculating"
        finalPriceDisplay.style.opacity = 0.5;
        finalPriceDisplay.innerText = "...";

        setTimeout(() => {
            const product = productType.value;
            const material = materialType.value;
            let amount = parseFloat(sizeLength.value);

            if (isNaN(amount) || amount < 1) amount = 1;

            const basePrice = basePrices[product];
            const multiplier = materialMultipliers[material];

            // For pipe and gutter, length matters. For hood and cap, its usually per piece.
            let total = 0;
            if (product === 'pipe' || product === 'gutter') {
                total = basePrice * multiplier * amount;
            } else {
                // Treats 'amount' as quantity of hoods/caps
                total = basePrice * multiplier * amount;
            }

            // Format number with spaces
            finalPriceDisplay.innerText = Math.round(total).toLocaleString('ru-RU');
            finalPriceDisplay.style.opacity = 1;

            // Add a little pop animation
            finalPriceDisplay.style.transform = 'scale(1.1)';
            setTimeout(() => {
                finalPriceDisplay.style.transform = 'scale(1)';
            }, 200);

        }, 400); // 400ms fake delay
    });


    /* --- Background Sparks Animation (Canvas) --- */
    const canvas = document.getElementById('sparksCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');

        let width, height;
        let particles = [];

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = document.querySelector('.hero').offsetHeight;
        }

        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() {
                // Spawn particles mostly from the bottom/center (like a grinder)
                this.x = (window.innerWidth / 2) + (Math.random() * 200 - 100);
                this.y = height + 10;

                // Explode upwards and outwards
                this.vx = (Math.random() - 0.5) * 8;
                this.vy = (Math.random() * -10) - 5;

                this.size = Math.random() * 3 + 1;
                this.life = 1;
                this.decay = Math.random() * 0.02 + 0.01;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Gravity
                this.vy += 0.2;

                this.life -= this.decay;
            }

            draw() {
                ctx.beginPath();
                // Orange/Yellow sparks
                ctx.fillStyle = `rgba(255, ${Math.floor(100 + Math.random() * 100)}, 0, ${this.life})`;
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);

            // Periodically add new sparks to simulate welding/grinding bursts
            if (Math.random() > 0.8) {
                for (let i = 0; i < 5; i++) {
                    particles.push(new Particle());
                }
            }

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                if (particles[i].life <= 0 || particles[i].y > height + 20) {
                    particles.splice(i, 1);
                    i--;
                }
            }

            requestAnimationFrame(animate);
        }

        animate();
    }

    /* --- Before/After Slider Logic --- */
    const sliderInput = document.querySelector('.slider-input');
    const sliderAfter = document.querySelector('.slider-image-after');
    const sliderResizer = document.querySelector('.slider-resizer');

    if (sliderInput) {
        // Initial setup
        updateSlider(sliderInput.value);

        sliderInput.addEventListener('input', (e) => {
            updateSlider(e.target.value);
        });

        function updateSlider(val) {
            // Update clippath for the "after" image
            sliderAfter.style.clipPath = `polygon(${val}% 0, 100% 0, 100% 100%, ${val}% 100%)`;

            // Move the visible handle/resizer line
            sliderResizer.style.left = `${val}%`;
        }
    }
});

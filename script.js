// Sample product data
const products = [
    {
        id: 1,
        title: "Wireless Bluetooth Headphones",
        price: 79.99,
        originalPrice: 99.99,
        image: "image/headphone.jpg",
        rating: 4.5,
        badge: "Bestseller"
    },
    {
        id: 2,
        title: "Smart Watch with Fitness Tracker",
        price: 129.99,
        originalPrice: 159.99,
        image: "image/watch.webp",
        rating: 4.2,
        badge: "Sale"
    },
    {
        id: 3,
        title: "Portable Bluetooth Speaker",
        price: 49.99,
        originalPrice: 69.99,
        image: "image/bluetooth.avif",
        rating: 4.7,
        badge: "New"
    },
    {
        id: 4,
        title: "4K Ultra HD Smart TV",
        price: 599.99,
        originalPrice: 799.99,
        image: "image/tv.jpg",
        rating: 4.8,
        badge: "Limited"
    },
    {
        id: 5,
        title: "Gaming Laptop with RGB Keyboard",
        price: 1299.99,
        originalPrice: 1499.99,
        image: "image/laptop.webp",
        rating: 4.9,
        badge: "Hot"
    },
    {
        id: 6,
        title: "Wireless Charging Pad",
        price: 29.99,
        originalPrice: 39.99,
        image: "image/pad.jpg",
        rating: 4.3,
        badge: null
    },
    {
        id: 7,
        title: "Noise Cancelling Headphones",
        price: 199.99,
        originalPrice: 249.99,
        image: "image/noise.jpg",
        rating: 4.6,
        badge: "Premium"
    },
    {
        id: 8,
        title: "Smartphone with Triple Camera",
        price: 699.99,
        originalPrice: 799.99,
        image: "image/mobile.avif",
        rating: 4.7,
        badge: "Popular"
    }
];
const productGrid = document.getElementById('product-grid');
const cartIcon = document.getElementById('cart-icon');
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const closeCart = document.getElementById('close-cart');
const cartItems = document.getElementById('cart-items');
const cartCount = document.querySelector('.cart-count');
const totalPrice = document.querySelector('.total-price');
const checkoutBtn = document.querySelector('.checkout-btn');
const paymentModal = document.getElementById('payment-modal');
const paymentForm = document.getElementById('payment-form');
const menuBtn = document.getElementById('menu-btn');
const navbar = document.querySelector('.navbar');
let cart = [];
function init() {
    renderProducts();
    setupEventListeners();
    startCountdown();
}
function renderProducts() {
    productGrid.innerHTML = '';
    
    products.forEach(product => {
        const discount = ((product.originalPrice - product.price) / product.originalPrice) * 100;
        const productEl = document.createElement('div');
        productEl.classList.add('product-card');
        productEl.innerHTML = `
            ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            <div class="product-image">
                <img src="${product.image}" alt="${product.title}">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <div class="product-price">
                    <span class="current-price">$${product.price.toFixed(2)}</span>
                    <span class="original-price">$${product.originalPrice.toFixed(2)}</span>
                    <span class="discount">${discount}% OFF</span>
                </div>
                <div class="product-rating">
                    ${renderRating(product.rating)}
                    <span>(${product.rating})</span>
                </div>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        `;
        
        productGrid.appendChild(productEl);
    });
}
function renderRating(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i === fullStars + 1 && hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    
    return stars;
}
function setupEventListeners() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            addToCart(productId);
        }
        if (e.target.classList.contains('quantity-btn')) {
            const cartItemId = parseInt(e.target.closest('.cart-item').getAttribute('data-id'));
            const isIncrease = e.target.classList.contains('increase');
            updateQuantity(cartItemId, isIncrease);
        }
        if (e.target.classList.contains('remove-item')) {
            const cartItemId = parseInt(e.target.closest('.cart-item').getAttribute('data-id'));
            removeFromCart(cartItemId);
        }
    });
    cartIcon.addEventListener('click', function(e) {
        e.preventDefault();
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
    });
    closeCart.addEventListener('click', function() {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
    });
    cartOverlay.addEventListener('click', function() {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
        paymentModal.classList.remove('active');
    });
    checkoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (cart.length > 0) {
            paymentModal.classList.add('active');
            cartOverlay.classList.add('active');
        }
    });
    paymentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Payment successful! Thank you for your purchase.');
        cart = [];
        updateCart();
        paymentModal.classList.remove('active');
        cartOverlay.classList.remove('active');
        cartSidebar.classList.remove('active');
    });
    menuBtn.addEventListener('click', function() {
        navbar.classList.toggle('active');
    });
}
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCart();
    const feedback = document.createElement('div');
    feedback.classList.add('feedback');
    feedback.textContent = 'Added to cart!';
    document.body.appendChild(feedback);
    
    setTimeout(() => {
        feedback.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        feedback.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(feedback);
        }, 300);
    }, 2000);
}
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}
function updateQuantity(productId, isIncrease) {
    const item = cart.find(item => item.id === productId);
    
    if (isIncrease) {
        item.quantity += 1;
    } else {
        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            removeFromCart(productId);
            return;
        }
    }
    
    updateCart();
}
function updateCart() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
            </div>
        `;
    } else {
        cartItems.innerHTML = '';
        
        cart.forEach(item => {
            const cartItemEl = document.createElement('div');
            cartItemEl.classList.add('cart-item');
            cartItemEl.setAttribute('data-id', item.id);
            cartItemEl.innerHTML = `
                <div class="cart-item-img">
                    <img src="${item.image}" alt="${item.title}">
                </div>
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.title}</h4>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn increase">+</button>
                    </div>
                    <div class="remove-item">Remove</div>
                </div>
            `;
            
            cartItems.appendChild(cartItemEl);
        });
    }
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalPrice.textContent = `$${total.toFixed(2)}`;
}
function startCountdown() {
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    const endTime = new Date();
    endTime.setHours(endTime.getHours() + 24);
    
    function updateCountdown() {
        const now = new Date();
        const diff = endTime - now;
        
        if (diff <= 0) {
            clearInterval(countdownInterval);
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';
            return;
        }
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        hoursEl.textContent = hours.toString().padStart(2, '0');
        minutesEl.textContent = minutes.toString().padStart(2, '0');
        secondsEl.textContent = seconds.toString().padStart(2, '0');
    }
    
    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);
}
document.addEventListener('DOMContentLoaded', init);
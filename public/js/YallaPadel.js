let cart = [];
let products = [];

function loadCart() {
    const savedCart = localStorage.getItem('padelCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartDisplay();
    }
}

function saveCart() {
    localStorage.setItem('padelCart', JSON.stringify(cart));
}

async function loadProducts() {
    try {
        const response = await fetch('/products');
        const data = await response.json();

        if (data.success) {
            products = data.products;
            displayProducts();
        } else {
            console.error('Failed to load products:', data.message);
        }
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

function displayProducts() {
    const grid = document.getElementById('productGrid');
    if (!grid) return;

    grid.innerHTML = '';

    for (let i = 0; i < products.length; i++) {
        const p = products[i];
        const outOfStockClass = p.inStock === false ? 'out-of-stock' : '';
        const stockBadge = p.inStock === false ? '<div class="stock-badge out" style="margin-bottom:10px;">OUT OF STOCK</div>' : '';
        const disabledAttr = p.inStock === false ? 'disabled' : '';

        let optionsHtml = '';
        if (p.hasOptions && p.inStock !== false) {
            optionsHtml = `
                <div class="options-group">
                    <label class="options-label">Size:</label>
                    <select id="size_${p._id}" class="size-select">
                        ${p.sizes.map(s => `<option value="${s}">${s}</option>`).join('')}
                    </select>
                </div>
                <div class="options-group">
                    <label class="options-label">Color:</label>
                    <select id="color_${p._id}" class="color-select">
                        ${p.colors.map(c => `<option value="${c}">${c}</option>`).join('')}
                    </select>
                </div>
            `;
        }

        grid.innerHTML += `
            <div class="product-card ${outOfStockClass}" data-id="${p._id}">
                <div class="card-image">
                    <img src="${p.image}" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='/images/placeholder.png'">
                </div>
                <div class="card-content">
                    ${stockBadge}
                    <h3 class="product-title">${p.name}</h3>
                    <div class="product-price">${p.price.toLocaleString()} <span>EGP</span></div>
                    <p class="product-desc">${p.desc}</p>
                    ${optionsHtml}
                    <div class="quantity-selector">
                        <button class="qty-btn" onclick="changeQty('${p._id}', -1)" ${disabledAttr}>-</button>
                        <input type="number" id="qty_${p._id}" class="qty-input" value="1" min="1" readonly>
                        <button class="qty-btn" onclick="changeQty('${p._id}', 1)" ${disabledAttr}>+</button>
                    </div>
                    <button class="btn-action" onclick="addToCart('${p._id}')" ${disabledAttr}>ADD TO CART</button>
                </div>
            </div>
        `;
    }
}

function changeQty(productId, delta) {
    let qtyInput = document.getElementById(`qty_${productId}`);
    if (qtyInput) {
        let newVal = parseInt(qtyInput.value) + delta;
        if (newVal >= 1) qtyInput.value = newVal;
    }
}

function addToCart(productId) {
    const product = products.find(p => p._id === productId);
    if (!product || product.inStock === false) {
        alert('This item is out of stock!');
        return;
    }

    let qty = parseInt(document.getElementById(`qty_${productId}`).value);
    let options = null;

    if (product.hasOptions) {
        const size = document.getElementById(`size_${productId}`)?.value || 'M';
        const color = document.getElementById(`color_${productId}`)?.value || 'Black';
        options = `Size: ${size}, Color: ${color}`;
    }

    const cartItem = {
        id: product._id,
        name: product.name,
        price: product.price,
        quantity: qty,
        options: options
    };

    const existingIndex = cart.findIndex(item =>
        item.id === cartItem.id && JSON.stringify(item.options) === JSON.stringify(cartItem.options)
    );

    if (existingIndex !== -1) {
        cart[existingIndex].quantity += cartItem.quantity;
    } else {
        cart.push(cartItem);
    }

    saveCart();
    updateCartDisplay();
    toggleCart();
    document.getElementById(`qty_${productId}`).value = 1;
}

function updateCartDisplay() {
    const cartItemsDiv = document.getElementById('cartItems');
    const cartTotalSpan = document.getElementById('cartTotal');
    const cartCountSpan = document.getElementById('cartCount');

    let total = 0;
    let itemCount = 0;

    if (!cartItemsDiv) return;

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p style="text-align: center; color: #64748b;">Your cart is empty</p>';
        if (cartTotalSpan) cartTotalSpan.innerText = '0';
        if (cartCountSpan) cartCountSpan.innerText = '0';
        return;
    }

    let itemsHtml = '';
    for (let i = 0; i < cart.length; i++) {
        const item = cart[i];
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        itemCount += item.quantity;

        itemsHtml += `
            <div class="cart-item">
                <div class="cart-item-title">${item.name}</div>
                ${item.options ? `<div class="cart-item-details">${item.options}</div>` : ''}
                <div class="cart-item-details">Quantity: ${item.quantity}</div>
                <div class="cart-item-price">${itemTotal.toLocaleString()} EGP</div>
                <button class="qty-btn" style="margin-top:8px;width:auto;padding:4px 12px;" onclick="removeFromCart(${i})">Remove</button>
            </div>
        `;
    }

    cartItemsDiv.innerHTML = itemsHtml;
    if (cartTotalSpan) cartTotalSpan.innerText = total.toLocaleString();
    if (cartCountSpan) cartCountSpan.innerText = itemCount;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartDisplay();
}

function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('overlay');
    if (sidebar) sidebar.classList.toggle('open');
    if (overlay) overlay.classList.toggle('show');
}

function proceedToCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty.');
        return;
    }
    localStorage.setItem('padelCart', JSON.stringify(cart));
    window.location.href = '/products/checkout';
}

loadCart();
loadProducts();
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, set, get, onValue, remove } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// Firebase Config (Corrected)
const firebaseConfig = {
    apiKey: "AIzaSyD__Hv5SV1u55q8CehrR9BcVy8hmiInMEo",
    authDomain: "chsw-project.firebaseapp.com",
    databaseURL: "https://chsw-project-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "chsw-project",
    storageBucket: "chsw-project.appspot.com",
    messagingSenderId: "293389196076",
    appId: "1:293389196076:web:2737dee56906049d1d2a89",
    measurementId: "G-FMG7C33M8F"
};

// Initialize
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const userId = "user1"; // static for testing

// Save cart
function saveCart(cart) {
    const cartObj = {};
    cart.forEach((item, index) => {
        cartObj[index] = item;
    });
    set(ref(db, 'carts/' + userId), cartObj);
}

// Load when DOM Ready
document.addEventListener("DOMContentLoaded", function () {

    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", function () {
            const product = this.parentElement;
            const id = product.dataset.id;
            const name = product.dataset.name;
            const price = parseFloat(product.dataset.price);

            get(ref(db, 'carts/' + userId)).then(snapshot => {
                let cartData = snapshot.val() || {};
                let cart = Object.values(cartData);

                let existing = cart.find(item => item.id === id);
                if (existing) existing.qty++;
                else cart.push({ id, name, price, qty: 1 });

                saveCart(cart);
            });
        });
    });

    if (document.getElementById("cart-container")) {
        onValue(ref(db, 'carts/' + userId), snapshot => {
            let cartData = snapshot.val() || {};
            let cart = Object.values(cartData);
            displayCart(cart);
        });
    }
});

// Display Cart
function displayCart(cart) {
    let container = document.getElementById("cart-container");
    container.innerHTML = "";
    let total = 0;
    cart.forEach(item => {
        let div = document.createElement("div");
        div.innerHTML = `${item.name} (x${item.qty}) - ₹${item.price * item.qty} <button onclick="removeItem('${item.id}')">Remove</button>`;
        container.appendChild(div);
        total += item.price * item.qty;
    });
    document.getElementById("total-price").innerText = total;
}

// Remove Item
window.removeItem = function(id) {
    get(ref(db, 'carts/' + userId)).then(snapshot => {
        let cartData = snapshot.val() || {};
        let cart = Object.values(cartData);
        cart = cart.filter(item => item.id !== id);
        saveCart(cart);
    });
}

// Clear Cart
if (document.getElementById("clear-cart")) {
    document.getElementById("clear-cart").addEventListener("click", function () {
        remove(ref(db, 'carts/' + userId));
    });
}

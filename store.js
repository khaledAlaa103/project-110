
let inventory = JSON.parse(localStorage.getItem("inventory")) || [];
let orders = JSON.parse(localStorage.getItem("orders")) || [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// (login) 

function adminLogin() {
    let pass = prompt("Enter Admin Password");
    if (pass == "1234") {
        window.location = "dashboard.html";
    } else {
        alert("Wrong Password");
    }
}

function saveCustomer() {
    let name = document.getElementById("name").value;
    let phone = document.getElementById("phone").value;
    let address = document.getElementById("address").value;

    if (!name || !phone || !address) {
        alert("Enter all fields");
        return;
    }

    localStorage.setItem("customer", JSON.stringify({
        name: name,
        phone: phone,
        address: address
    }));

    window.location = "categories.html";
}

//(categories & products)

function goCategory(cat) {
    localStorage.setItem("category", cat);
    window.location = "products.html";
}

function showProducts() {
    let currentCat = localStorage.getItem("category");
    let data = "";

    inventory.forEach((p, i) => {
        if (p.category == currentCat) {
            data += `
            <div class="card" onclick="viewProduct(${i})">
                <img src="${p.img}">
                <h3>${p.name}</h3>
                <p>Price : ${p.price}</p>
                <p>After Discount : ${p.price - (p.price * (p.discount || 0) / 100)}</p>
                <p>Discount : ${p.discount || 0}%</p>
                <p>Stock : ${p.qty}</p>
                <button onclick="addToCart(${i}); event.stopPropagation()">Add To Cart</button>
            </div>`;
        }
    });

    document.getElementById("products").innerHTML = data;
}



function searchProduct() {
    let value = document.getElementById("search").value.toLowerCase();
    let data = "";

    inventory.forEach((p, i) => {
        if (p.name.toLowerCase().includes(value)) {
            data += `
            <div class="card" onclick="viewProduct(${i})">
                <img src="${p.img}">
                <h3>${p.name}</h3>
                <p>${p.price}</p>
                <button onclick="addToCart(${i}); event.stopPropagation()">Add</button>
            </div>`;
        }
    });

    document.getElementById("products").innerHTML = data;
}




// (productDetails) 

function viewProduct(i) {
    localStorage.setItem("selectedProduct", JSON.stringify(inventory[i]));
    window.location = "productDetails.html";
}

function showProductDetails() {
    let p = JSON.parse(localStorage.getItem("selectedProduct"));
    if (!p) return;

    let data = `
    <div class="card" style="width:300px;margin:auto">
        <img src="${p.img}" style="height:200px">
        <h2>${p.name}</h2>
        <p><b>Price:</b> ${p.price}</p>
        <p><b>Discount:</b> ${p.discount || 0}%</p>
        <p><b>Price After Discount:</b> ${p.price - (p.price * (p.discount || 0) / 100)}</p>
        <p><b>Available:</b> ${p.qty}</p>
        <p><b>Category:</b> ${p.category}</p>
        <p><b>Description:</b></p>
        <p>${p.description || "No description"}</p>
        <p><b>RAM:</b> ${p.ram || "-"}</p>
        <p><b>Storage:</b> ${p.storage || "-"}</p>
        <p><b>Battery:</b> ${p.battery || "-"}</p>
    </div>`;

    document.getElementById("details").innerHTML = data;
}

// (Cart)

function addToCart(i) {
    let product = inventory[i];

    if (product.qty <= 0) {
        alert("Out of stock");
        return;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let index = cart.findIndex(p => p.id == product.id);

    if (index != -1) {
        let currentQty = cart[index].cartQty || 1;
        if (currentQty >= product.qty) {
            alert("Max stock reached");
            return;
        }
        cart[index].cartQty = currentQty + 1;
    } else {
        product.cartQty = 1;
        cart.push(product);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart!");
}


function showCart() {
    let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    let total = 0;
    let totalItems = 0;
    let data = "";

    cartItems.forEach((p, i) => {

        let qty = p.cartQty || 1;
        let finalPrice = p.price - (p.price * (p.discount || 0) / 100);
        total += Number(finalPrice) * qty;
        totalItems += qty;

        data += `
        <div class="card">
            <h3>${p.name}</h3>

            <p>Price : ${p.price}</p>
            <p>Discount : ${p.discount || 0}%</p>
            <p>After Discount : ${finalPrice}</p>

            <p>Quantity : ${qty}</p>

            <p>Total : ${Number(finalPrice) * qty}</p>

            <button onclick="removeCart(${i})">Remove</button>
        </div>`;
    });

    document.getElementById("cart").innerHTML = data;

    document.getElementById("total").innerHTML = total;

    document.getElementById("itemsCount").innerHTML = totalItems;
}




function removeCart(i) {
    let cartItems = JSON.parse(localStorage.getItem("cart"));
    cartItems.splice(i, 1);
    localStorage.setItem("cart", JSON.stringify(cartItems));
    showCart();
}

function confirmBuy() {
    let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    let customer = JSON.parse(localStorage.getItem("customer"));

    if (cartItems.length === 0) {
        alert("Cart is empty");
        return;
    }

    cartItems.forEach(item => {
        let index = inventory.findIndex(p => p.id == item.id);
        if (index != -1 && inventory[index].qty > 0) {
            inventory[index].qty--;
            orders.push({
                customer: customer ? customer.name : "Guest",
                product: item.name,
                price: item.price,
                profit: inventory[index].profit,
                date: new Date().toLocaleString()
            });
        }
    });

    localStorage.setItem("orders", JSON.stringify(orders));
    localStorage.setItem("inventory", JSON.stringify(inventory));
    localStorage.removeItem("cart");

    alert("Purchase successful!");
    window.location = "categories.html";
}

//(dashboard)

function showDashboard() {
    let ordersList = JSON.parse(localStorage.getItem("orders")) || [];
    let totalProfit = 0;
    let data = "";

    ordersList.forEach((o, i) => {
        totalProfit += Number(o.profit);
        data += `
        <tr>
            <td>${o.customer}</td>
            <td>${o.product}</td>
            <td>${o.price}</td>
            <td>${o.profit}</td>
            <td>${o.date}</td>
            <td><button onclick="returnProduct(${i})">Return</button></td>
            <td><button onclick="deleteOrder(${i})">Delete</button></td>
        </tr>`;
    });

    document.getElementById("orders").innerHTML = data;
    document.getElementById("profit").innerHTML = totalProfit;

    let inv = "";
    inventory.forEach((p, i) => {
        inv += `
        <tr>
            <td><img src="${p.img}" width="50"></td>
            <td>${p.name}</td>
            <td>${p.price}</td>
            <td>${p.profit}</td>
            <td><input type="number" value="${p.qty}" onchange="editQty(${i},this.value)"></td>
            <td><button onclick="deleteProduct(${i})">Delete</button></td>
        </tr>`;
    });

    document.getElementById("inventory").innerHTML = inv;
}

function addProduct() {
    let name = document.getElementById("pname").value;
    let price = document.getElementById("pprice").value;
    let profit = document.getElementById("pprofit").value;
    let discount = document.getElementById("pdiscount").value || 0;
    let cat = document.getElementById("pcat").value;
    let file = document.getElementById("pimg").files[0];

//  --------------------
    let desc = document.getElementById("pdesc").value;
    let ram = document.getElementById("pram").value;
    let storage = document.getElementById("pstorage").value;
    let battery = document.getElementById("pbattery").value;

    if (!name || !price || !profit || !cat || !file) {
        alert("Fill all fields");
        return;
    }

    let reader = new FileReader();

    reader.onload = function (e) {
        let img = e.target.result;
        inventory.push({
            id: Date.now(),
            name: name,
            price: Number(price),
            profit: Number(profit),
            discount: Number(discount),
            qty: 0,
            category: cat,
            img: img,
            description: desc,
            ram: ram,
            storage: storage,
            battery: battery
        });

        localStorage.setItem("inventory", JSON.stringify(inventory));
        showDashboard();
        resetAddProductForm();
    };
    reader.readAsDataURL(file);
}

function returnProduct(i) {
    let order = orders[i];
    let index = inventory.findIndex(p => p.name == order.product);
    if (index != -1) {
        inventory[index].qty++;
    }
    orders.splice(i, 1);
    saveAndRefreshDashboard();
}

function deleteOrder(i) {
    orders.splice(i, 1);
    saveAndRefreshDashboard();
}

function editQty(i, value) {
    inventory[i].qty = Number(value);
    localStorage.setItem("inventory", JSON.stringify(inventory));
}

function deleteProduct(i) {
    inventory.splice(i, 1);
    saveAndRefreshDashboard();
}

function toggleFields() {
    let cat = document.getElementById("pcat").value;
    let fields = document.getElementById("mobileFields");
    if (fields) {
        fields.style.display = (cat === "mobile") ? "block" : "none";
    }
}

// save and refresh dashboard

function saveAndRefreshDashboard() {
    localStorage.setItem("orders", JSON.stringify(orders));
    localStorage.setItem("inventory", JSON.stringify(inventory));
    showDashboard();
}

function resetAddProductForm() {
    const fields = [
        "pname",
        "pprice",
        "pprofit",
        "pdiscount",
        "pcat",
        "pimg",
        "pdesc",
        "pram",
        "pstorage",
        "pbattery"
    ];
    fields.forEach(id => {
        let el = document.getElementById(id);
        if (el) el.value = "";
    });
}

//== Validation 

// not a string Fields 

const textFields = [
    "name",
    "address",
    "pname",
    "pdesc",

];

textFields.forEach(id => {
    let el = document.getElementById(id);

    if (el) {
        el.addEventListener("input", function () {
             
            if (/[^A-Za-z]/.test(this.value)) {
                alert("Only letters allowed in this field");
            }

            this.value = this.value.replace(/[^A-Za-z]/g, '');
            
        });
    }
});

// not a number

const numberFields = [
    "phone",
    "pprice",
    "pprofit"
    
];

numberFields.forEach(id => {
    let el = document.getElementById(id);

    if (el) {
        el.addEventListener("input", function () {

            // لو المستخدم كتب حروف
            if (/[^0-9]/.test(this.value)) {
                alert("Only numbers allowed in this field");
            }

            // حذف أي حروف
            this.value = this.value.replace(/[^0-9]/g, '');

        });
    }
});

function goCart() { window.location = "cart.html"; }
function backHome() { window.location = "login.html"; }

let inventory = JSON.parse(localStorage.getItem("inventory")) || []
let orders = JSON.parse(localStorage.getItem("orders")) || []

function adminLogin(){
let pass = prompt("Enter Admin Password")
if(pass=="1234"){
window.location="dashboard.html"
}else{
alert("Wrong Password")
}
}

function saveCustomer(){

let name=document.getElementById("name").value
let phone=document.getElementById("phone").value
let address=document.getElementById("address").value

if(!name || !phone || !address){
alert("Enter all fields")
return
}

localStorage.setItem("customer",JSON.stringify({
name:name,
phone:phone,
address:address
}))

window.location="categories.html"
}

function goCategory(cat){
localStorage.setItem("category",cat)
window.location="products.html"
}

function showProducts(){

let inventory = JSON.parse(localStorage.getItem("inventory"))
let cat = localStorage.getItem("category")

let data=""

inventory.forEach((p,i)=>{

if(p.category==cat){

data+=`
<div class="card" onclick="viewProduct(${i})">
<img src="${p.img}">
<h3>${p.name}</h3>
<p>Price : ${p.price}</p>
<p>Stock : ${p.qty}</p>
<button onclick="addToCart(${i});event.stopPropagation()">Add To Cart</button>
</div>
`

}

})

document.getElementById("products").innerHTML=data
}

function addToCart(i){

let inventory = JSON.parse(localStorage.getItem("inventory"))

if(inventory[i].qty<=0){
alert("Out of stock")
return
}

let cart = JSON.parse(localStorage.getItem("cart")) || []

cart.push(inventory[i])

localStorage.setItem("cart",JSON.stringify(cart))
}

function showCart(){

let cart = JSON.parse(localStorage.getItem("cart")) || []

let total=0
let data=""

cart.forEach((p,i)=>{

total+=Number(p.price)

data+=`
<div class="card">
<h3>${p.name}</h3>
<p>${p.price}</p>
<button onclick="removeCart(${i})">Remove</button>
</div>
`

})

document.getElementById("cart").innerHTML=data
document.getElementById("total").innerHTML=total
}

function removeCart(i){

let cart = JSON.parse(localStorage.getItem("cart"))
cart.splice(i,1)

localStorage.setItem("cart",JSON.stringify(cart))

showCart()
}

function confirmBuy(){

let cart = JSON.parse(localStorage.getItem("cart")) || []
let orders = JSON.parse(localStorage.getItem("orders")) || []
let inventory = JSON.parse(localStorage.getItem("inventory"))
let customer = JSON.parse(localStorage.getItem("customer"))

cart.forEach(item=>{

let index = inventory.findIndex(p=>p.id==item.id)

if(inventory[index].qty>0){

inventory[index].qty--

orders.push({
customer:customer.name,
product:item.name,
price:item.price,
profit:inventory[index].profit,
date:new Date().toLocaleString()
})

}

})

localStorage.setItem("orders",JSON.stringify(orders))
localStorage.setItem("inventory",JSON.stringify(inventory))

localStorage.removeItem("cart")

window.location="categories.html"
}

function showDashboard(){

let orders = JSON.parse(localStorage.getItem("orders")) || []
let inventory = JSON.parse(localStorage.getItem("inventory"))

let totalProfit=0
let data=""

orders.forEach((o,i)=>{

totalProfit+=Number(o.profit)

data+=`
<tr>
<td>${o.customer}</td>
<td>${o.product}</td>
<td>${o.price}</td>
<td>${o.profit}</td>
<td>${o.date}</td>
<td><button onclick="returnProduct(${i})">Return</button></td>
<td><button onclick="deleteOrder(${i})">Delete</button></td>
</tr>
`

})

document.getElementById("orders").innerHTML=data
document.getElementById("profit").innerHTML=totalProfit

let inv=""

inventory.forEach((p,i)=>{

inv+=`
<tr>
<td><img src="${p.img}" width="50"></td>
<td>${p.name}</td>
<td>${p.price}</td>
<td>${p.profit}</td>
<td><input value="${p.qty}" onchange="editQty(${i},this.value)"></td>
<td><button onclick="deleteProduct(${i})">Delete</button></td>
</tr>
`

})

document.getElementById("inventory").innerHTML=inv
}

function returnProduct(i){

let orders = JSON.parse(localStorage.getItem("orders"))
let inventory = JSON.parse(localStorage.getItem("inventory"))

let order = orders[i]

let index = inventory.findIndex(p=>p.name==order.product)

if(index!=-1){
inventory[index].qty++
}

orders.splice(i,1)

localStorage.setItem("orders",JSON.stringify(orders))
localStorage.setItem("inventory",JSON.stringify(inventory))

showDashboard()
}

function deleteOrder(i){

let orders = JSON.parse(localStorage.getItem("orders"))

orders.splice(i,1)

localStorage.setItem("orders",JSON.stringify(orders))

showDashboard()
}

function editQty(i,value){

let inventory = JSON.parse(localStorage.getItem("inventory"))

inventory[i].qty = Number(value)

localStorage.setItem("inventory",JSON.stringify(inventory))
}

function deleteProduct(i){

let inventory = JSON.parse(localStorage.getItem("inventory"))

inventory.splice(i,1)

localStorage.setItem("inventory",JSON.stringify(inventory))

showDashboard()
}

function addProduct(){

let name = document.getElementById("pname").value
let price = document.getElementById("pprice").value
let profit = document.getElementById("pprofit").value
let cat = document.getElementById("pcat").value
let file = document.getElementById("pimg").files[0]

if(!name || !price || !profit || !cat || !file){
alert("Fill all fields")
return
}

let reader = new FileReader()

reader.onload = function(e){

let img = e.target.result

let inventory = JSON.parse(localStorage.getItem("inventory")) || []

inventory.push({
id:Date.now(),
name:name,
price:Number(price),
profit:Number(profit),
qty:0,
category:cat,
img:img
})

localStorage.setItem("inventory",JSON.stringify(inventory))

showDashboard()

document.getElementById("pname").value=""
document.getElementById("pprice").value=""
document.getElementById("pprofit").value=""
document.getElementById("pcat").value=""
document.getElementById("pimg").value=""

}

reader.readAsDataURL(file)
}

function searchProduct(){

let value=document.getElementById("search").value.toLowerCase()

let inventory = JSON.parse(localStorage.getItem("inventory"))

let data=""

inventory.forEach((p,i)=>{

if(p.name.toLowerCase().includes(value)){

data+=`
<div class="card">
<img src="${p.img}">
<h3>${p.name}</h3>
<p>${p.price}</p>
<button onclick="addToCart(${i})">Add</button>
</div>
`

}

})

document.getElementById("products").innerHTML=data
}

function goCart(){
window.location="cart.html"
}

function backHome(){
window.location="login.html"
}

function viewProduct(i){

let inventory = JSON.parse(localStorage.getItem("inventory"))

localStorage.setItem("selectedProduct", JSON.stringify(inventory[i]))

window.location = "productDetails.html"

}

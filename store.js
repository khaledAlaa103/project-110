let title = document.getElementById("title");
let price = document.getElementById("price");
let Taxes = document.getElementById("Taxes");
let Ads = document.getElementById("Ads");
let Discount = document.getElementById("Discount");
let total = document.querySelector(".price small");
let count = document.getElementById("count");
let category = document.getElementById("category");
let submit = document.getElementById("submit");

let mood = "create";
let tmp;


// get total التوال

function getTotal() {
    if (price.value !== "") {
        let result = (+price.value + +Taxes.value + +Ads.value) - +Discount.value;
        total.innerHTML = result;
        total.style.background = "#040";
    } else {
        total.innerHTML = "";
        total.style.background = "#a00d02";
    }
}


// data storage حفظ البيانات

let dataPro;

if (localStorage.product != null) {
    dataPro = JSON.parse(localStorage.product);
} else {
    dataPro = [];
}


// create / update  الاضافه وتعديل المنتجات

submit.onclick = function () {

    let newPro = {
        title: title.value.toLowerCase(),
        price: price.value,
        Taxes: Taxes.value,
        Ads: Ads.value,
        Discount: Discount.value,
        total: total.innerHTML,
        count: count.value,
        category: category.value.toLowerCase(),
    };

    // validation بسيطة
    
    if (title.value === "" || price.value === "") {
        alert("Please enter title and price");
        return;
    }

    if (mood === "create") {

        if (newPro.count > 1) {
            for (let i = 0; i < newPro.count; i++) {
                dataPro.push({ ...newPro });
            }
        } else {
            dataPro.push(newPro);
        }

    } else {
        dataPro[tmp] = newPro;
        mood = "create";
        submit.innerHTML = "Add Product";
        count.style.display = "block";
    }

    localStorage.setItem("product", JSON.stringify(dataPro));

    clearData();
    readData();
};

// clear inputs مسح البيانات 

function clearData() {
    title.value = "";
    price.value = "";
    Taxes.value = "";
    Ads.value = "";
    Discount.value = "";
    total.innerHTML = "";
    count.value = "";
    category.value = "";
}


// read data قراءه البيانات

function readData() {
    getTotal();
    let table = "";

    for (let i = 0; i < dataPro.length; i++) {
        table += `
        <tr>
        <td>${i + 1}</td>
        <td>${dataPro[i].title}</td>
        <td>${dataPro[i].price}</td>
        <td>${dataPro[i].Taxes}</td>
        <td>${dataPro[i].Ads}</td>
        <td>${dataPro[i].Discount}</td>
        <td>${dataPro[i].total}</td>
        <td>${dataPro[i].category}</td>
        <td><button onclick="updateData(${i})">Update</button></td>
        <td><button onclick="deleteData(${i})">Delete</button></td>
        </tr>`;
    }

    document.getElementById("tbody").innerHTML = table;

    let btnDelete = document.getElementById("deleteAll");

    if (dataPro.length > 0) {
        btnDelete.innerHTML = `
        <button onclick="deleteAll()">Delete All (${dataPro.length})</button>`;
    } else {
        btnDelete.innerHTML = "";
    }
}

readData();


// delete

function deleteData(i) {
    dataPro.splice(i, 1);
    localStorage.product = JSON.stringify(dataPro);
    readData();
}

function deleteAll() {
    localStorage.clear();
    dataPro = [];
    readData();
}


// update

function updateData(i) {
    title.value = dataPro[i].title;
    price.value = dataPro[i].price;
    Taxes.value = dataPro[i].Taxes;
    Ads.value = dataPro[i].Ads;
    Discount.value = dataPro[i].Discount;
    category.value = dataPro[i].category;

    getTotal();

    count.style.display = "none";
    submit.innerHTML = "Update";

    mood = "update";
    tmp = i;

    scroll({
        top: 0,
        behavior: "smooth",
    });
}


// search

let search = document.getElementById("search");
let searchMood = "title";

function getSearchMood(id) {
    if (id === "searchtitle") {
        searchMood = "title";
    } else {
        searchMood = "category";
    }

    search.placeholder = "Search By " + searchMood;
    search.focus();
    search.value = "";
}

function searchData(value) {
    let table = "";
    let searchValue = value.toLowerCase();

    for (let i = 0; i < dataPro.length; i++) {

        if (
            (searchMood === "title" && dataPro[i].title.includes(searchValue)) ||
            (searchMood === "category" && dataPro[i].category.includes(searchValue))
        ) {
            table += `
            <tr>
            <td>${i + 1}</td>
            <td>${dataPro[i].title}</td>
            <td>${dataPro[i].price}</td>
            <td>${dataPro[i].Taxes}</td>
            <td>${dataPro[i].Ads}</td>
            <td>${dataPro[i].Discount}</td>
            <td>${dataPro[i].total}</td>
            <td>${dataPro[i].category}</td>
            <td><button onclick="updateData(${i})">Update</button></td>
            <td><button onclick="deleteData(${i})">Delete</button></td>
            </tr>`;
        }
    }

    document.getElementById("tbody").innerHTML = table;
}
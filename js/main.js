import { Product } from "./model.js";
import { optionSelect, renderProducts, renderCart } from "./controller.js";

let productList = [];
const BASE_URL = "https://62397874043817a543e3056a.mockapi.io";
const renderProduct = async () => {
  try {
    const response = await axios({
      url: `${BASE_URL}/Shopping`,
      method: "GET",
    });
    const listOfProducts = response.data.map((product) => {
      return new Product(
        product.id,
        product.name,
        product.price,
        product.description,
        product.image,
        product.type
      );
    });
    productList = listOfProducts;
    document.getElementById("filter").onchange = (e) => {
      return renderProducts(optionSelect(listOfProducts, e.target.value));
    };
    renderProducts(listOfProducts, "none");
  } catch (error) {
    console.log(error);
  }
};

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let addToCart = (id) => {
  if (cart.some((item) => item.id == id)) {
    cart = cart.map((itm) => {
      let old = itm.numberOfUnits;
      if (itm.id == id) {
        old++;
      }
      return {
        ...itm,
        numberOfUnits: old,
      };
    });
  } else {
    const item = productList.find((item) => item.id == id);
    cart.push({ ...item, numberOfUnits: 1 });
  }
  updateCart();
};

let changeNumberOfUnits = (action, id) => {
  cart = cart
    .map((item) => {
      let old = item.numberOfUnits;
      if (item.id == id) {
        if (action == "add") {
          old++;
        } else {
          old--;
        }
      }
      return {
        ...item,
        numberOfUnits: old,
      };
    })
    .filter((item) => item.numberOfUnits > 0);
  updateCart();
};

const renderSubTotal = () => {
  let totalPrice = 0;
  cart.forEach((item) => {
    totalPrice += item.price * item.numberOfUnits;
  });
  console.log(totalPrice);
  document.querySelector(".list").innerHTML = `<p>Tổng Tiền</p>
    <span>${totalPrice}$</span>
    <button>Thanh Toán</button>`;
};

const removeItem = (id) => {
  console.log(id);
  cart = cart.filter((item) => {
    return item.id != id;
  });
  updateCart();
};

function updateCart() {
  renderProduct();
  renderCart(cart);
  renderSubTotal();
  localStorage.setItem("cart", JSON.stringify(cart));
}
updateCart();
function layThongTinSanPham() {
  var tenSp = document.getElementById("TenSP").value;
  var giaSp = document.getElementById("GiaSP").value;
  var HinhSp = document.getElementById("HinhSP").value;
  var moTaSp = document.getElementById("moTaSP").value;
  var typeSP = document.getElementById("typeSP").value;
  return {
    image: HinhSp,

    name: tenSp,
    price: giaSp,
    description: moTaSp,
    type: typeSP,
  };
}
// thêm sản phẩm

document.getElementById("btn-themSP").addEventListener("click", function () {
  var sanPhamThemMoi = layThongTinSanPham();
  axios({
    url: `${BASE_URL}/Shopping`,
    method: "POST",
    data: sanPhamThemMoi,
  })
    .then(function (res) {
      console.log("created", res);
      hienThiDanhSach();
    })
    .catch(function (err) {
      console.log("created err", err);
    });
});
function xoaSanPham(id) {
  axios({
    url: `${BASE_URL}/Shopping/${id}`,
    method: "DELETE",
  })
    .then(function (res) {
      console.log("delete", res);
      cart = cart.filter((item) => item.id != id);
      updateCart();
    })
    .catch(function (err) {
      console.log("delete err", err);
    });
}

document.getElementById("btn-capNhatSP").addEventListener("click", function () {
  var sanPhamCapNhat = layThongTinSanPham();
  axios({
    url: `${BASE_URL}/Shopping/${idCapNhatSanPham}`,
    method: "PUT",
    data: sanPhamCapNhat,
  });
});
var idCapNhatSanPham = null;
function layThongTinChiTiet(id) {
  idCapNhatSanPham = id;
  $("#myModal").modal("show");
  axios({
    url: `${BASE_URL}/Shopping/${id}`,
    method: "GET",
  })
    .then(function (res) {
      console.log("layThongTinChiTiet", res);
      let sanPham = res.data;
      document.getElementById("TenSP").value = sanPham.name;
      document.getElementById("GiaSP").value = sanPham.price;
      document.getElementById("HinhSP").value = sanPham.image;
      document.getElementById("moTaSP").value = sanPham.description;
      document.getElementById("typeSP").value = sanPham.type;

      hienThiDanhSach();
    })
    .catch(function (err) {
      console.log("layThongTinChiTiet err", err);
    });
}
document.getElementById("btn-capNhatSP").addEventListener("click", function () {
  var sanPhamCapNhat = layThongTinSanPham();
  axios({
    url: `${BASE_URL}/Shopping/${idCapNhatSanPham}`,
    method: "PUT",
    data: sanPhamCapNhat,
  });
});

window.layThongTinChiTiet = layThongTinChiTiet;
window.xoaSanPham = xoaSanPham;
window.addToCart = addToCart;
window.removeItem = removeItem;
window.changeNumberOfUnits = changeNumberOfUnits;

import { Product } from "./model.js";
import { optionSelect, renderProducts, renderCart } from "./controller.js";

let productList = [];
const renderProduct = async () => {
  try {
    const response = await axios({
      url: "https://62397874043817a543e3056a.mockapi.io/Shopping",
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
window.addToCart = addToCart;
window.removeItem = removeItem;
window.changeNumberOfUnits = changeNumberOfUnits;

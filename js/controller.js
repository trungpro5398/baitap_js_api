export const renderProducts = (products) => {
  let contentHTML = "";
  products.forEach((product) => {
    contentHTML += `<div class="col">
    <div class="item">
      <img src="${product.image}" alt="" />
      <p>
       ${product.description}
      </p>
      <button class="cart" onclick="addToCart(${product.id})">Cart</button>
    </div>
  </div>`;
  });
  document.querySelector(".row").innerHTML = contentHTML;
};

export const optionSelect = (products, state) => {
  if (state === "none") return products;
  const finalProducts = products.filter((product) => {
    return product.type === state;
  });
  console.log(finalProducts);
  return finalProducts;
};

export const renderCart = (products) => {
  let contentHTML = "";
  products.forEach((product) => {
    contentHTML += `<tr>
    <td><img src="${product.image}" alt="" /></td>
    <td>${product.name}</td>
    <td>${product.price}</td>
    <td>${product.numberOfUnits}<button
    onclick="changeNumberOfUnits('minus',${product.id})"
    >-</button>
    <button
    onclick="changeNumberOfUnits('add',${product.id})"
    >+</button></td>
    <td>
    ${product.price * product.numberOfUnits}
    <button
    onclick="removeItem(${product.id})"
    >x</button>
    </td>
    
</tr>`;
  });
  document.querySelector(".tbody").innerHTML = contentHTML;
};

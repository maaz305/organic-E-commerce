/* =========================================================
   MAAZ FARMS - MAIN JAVASCRIPT
   ========================================================= */


/* =========================================================
   MOBILE NAVIGATION
   ========================================================= */

const menu = document.querySelector(".menu");
const links = document.querySelector(".links");

if (menu && links) {

  menu.addEventListener("click", () => {

    const isOpen =
      links.classList.toggle("open");

    menu.setAttribute(
      "aria-expanded",
      isOpen ? "true" : "false"
    );

  });

}


/* =========================================================
   DATA / LOCAL STORAGE HELPERS
   ========================================================= */

function readStore(key, fallback) {

  try {

    const value =
      localStorage.getItem(key);

    return value
      ? JSON.parse(value)
      : fallback;

  }

  catch (error) {

    return fallback;

  }

}


function writeStore(key, value) {

  localStorage.setItem(
    key,
    JSON.stringify(value)
  );

}


/* ---------- CART ---------- */

function gc() {

  return readStore(
    "organicCart",
    {}
  );

}


function sc(cart) {

  writeStore(
    "organicCart",
    cart
  );

  updateCartCount();

}


/* ---------- USERS ---------- */

function getUsers() {

  return readStore(
    "farmUsers",
    []
  );

}


function saveUsers(users) {

  writeStore(
    "farmUsers",
    users
  );

}


/* ---------- SESSION ---------- */

function getSession() {

  return readStore(
    "farmSession",
    null
  );

}


function setSession(session) {

  if (session) {

    writeStore(
      "farmSession",
      session
    );

  }

  else {

    localStorage.removeItem(
      "farmSession"
    );

  }

  updateAccountNav();

}


/* ---------- ORDERS ---------- */

function getOrders() {

  return readStore(
    "farmOrders",
    []
  );

}


function saveOrders(orders) {

  writeStore(
    "farmOrders",
    orders
  );

}


/* ---------- ENQUIRIES ---------- */

function getEnquiries() {

  return readStore(
    "farmEnquiries",
    []
  );

}


function saveEnquiries(enquiries) {

  writeStore(
    "farmEnquiries",
    enquiries
  );

}


/* =========================================================
   DEMO USERS
   ========================================================= */

function seedUsers() {

  const users =
    getUsers();


  if (
    !users.some(
      user =>
        user.email ===
        "buyer@demo.com"
    )
  ) {

    users.push({

      id: "BUYER-DEMO",

      role: "buyer",

      name: "Demo Buyer",

      email: "buyer@demo.com",

      password: "buyer123",

      phone: "9876543210",

      address:
        "Kurnool, Andhra Pradesh"

    });

  }


  if (
    !users.some(
      user =>
        user.email ===
        "farmer@demo.com"
    )
  ) {

    users.push({

      id: "FARMER-DEMO",

      role: "farmer",

      name: "Demo Farmer",

      email:
        "farmer@demo.com",

      password:
        "farmer123",

      phone:
        "9876501234",

      farmName:
        "Maaz Farms",

      location:
        "Kurnool, Andhra Pradesh"

    });

  }


  saveUsers(users);

}


seedUsers();



/* =========================================================
   ACCOUNT NAVIGATION
   ========================================================= */

function updateAccountNav() {

  const session =
    getSession();


  document
    .querySelectorAll(
      "[data-account-link]"
    )
    .forEach(link => {


      /* NOT LOGGED IN */

      if (!session) {

        link.href =
          "login.html";

        link.textContent =
          "👤 Login";

        return;

      }


      /* FARMER */

      if (
        session.role ===
        "farmer"
      ) {

        link.href =
          "farmer-dashboard.html";

        link.textContent =
          "🧑‍🌾 Farmer";

      }


      /* BUYER */

      else {

        link.href =
          "buyer-profile.html";

        link.textContent =
          "👤 Profile";

      }

    });

}


updateAccountNav();



/* =========================================================
   CART
   ========================================================= */

function updateCartCount() {

  const cart =
    gc();


  const count =
    Object.values(cart)
      .reduce(
        (total, quantity) =>
          total +
          Number(quantity || 0),
        0
      );


  document
    .querySelectorAll(
      "[data-cart-count]"
    )
    .forEach(element => {

      element.textContent =
        count;

    });

}


/* Keep old function name available */

function ucc() {

  updateCartCount();

}


/* ---------- ADD PRODUCT ---------- */

function add(id) {

  if (!id) {
    return;
  }


  const cart =
    gc();


  cart[id] =
    (Number(cart[id]) || 0) + 1;


  sc(cart);

}


/* ---------- ADD BUTTON ---------- */

document.addEventListener(
  "click",
  event => {

    const button =
      event.target.closest(
        "[data-add]"
      );


    if (!button) {
      return;
    }


    const productId =
      button.dataset.add;


    if (!productId) {
      return;
    }


    add(productId);


    const originalText =
      button.textContent;


    button.textContent =
      "Added ✓";


    button.disabled =
      true;


    setTimeout(
      () => {

        button.textContent =
          originalText || "Add +";

        button.disabled =
          false;

      },
      800
    );

  }
);



/* =========================================================
   CART PAGE RENDERING
   ========================================================= */

function render() {

  const box =
    document.getElementById(
      "cartItems"
    );


  if (
    !box ||
    !window.PRODUCTS
  ) {

    return;

  }


  const cart =
    gc();


  const ids =
    Object.keys(cart)
      .filter(
        id =>
          Number(cart[id]) > 0
      );


  let subtotal = 0;


  /* ---------- EMPTY CART ---------- */

  if (!ids.length) {

    box.innerHTML = `

      <div
        class="empty-state"
        style="padding:45px;"
      >

        <div
          style="
            font-size:2.4rem;
            margin-bottom:8px;
          "
        >
          🛒
        </div>

        <h3>
          Your cart is empty
        </h3>

        <p>
          Shop fresh organic produce.
        </p>

        <br>

        <a
          class="btn primary"
          href="shop.html"
        >
          Go to Shop
        </a>

      </div>

    `;

  }


  /* ---------- CART PRODUCTS ---------- */

  else {

    box.innerHTML =
      ids
        .map(id => {


          const product =
            window.PRODUCTS.find(
              item =>
                item.id === id
            );


          const quantity =
            Number(cart[id]) || 0;


          if (!product) {

            return "";

          }


          subtotal +=
            product.price *
            quantity;


          return `

            <div class="crow">

              <div class="cicon">

                <img
                  src="${product.image}"
                  alt="${product.name}"
                  onerror="
                    this.onerror=null;
                    this.src='assets/photos/hero.svg';
                  "
                >

              </div>


              <div>

                <b>
                  ${product.name}
                </b>

                <div class="meta">

                  ₹${product.price}
                  /
                  ${product.unit}

                </div>

              </div>


              <div class="qty">

                <button
                  type="button"
                  onclick="cq('${id}', -1)"
                  aria-label="Decrease quantity"
                >
                  −
                </button>


                <b>
                  ${quantity}
                </b>


                <button
                  type="button"
                  onclick="cq('${id}', 1)"
                  aria-label="Increase quantity"
                >
                  +
                </button>

              </div>


              <button
                type="button"
                class="remove"
                onclick="rm('${id}')"
              >
                Remove
              </button>

            </div>

          `;

        })
        .join("");

  }



  /* ---------- DELIVERY ---------- */

  const delivery =
    subtotal >= 500 ||
    subtotal === 0
      ? 0
      : 40;



  /* ---------- TOTALS ---------- */

  const subtotalElement =
    document.getElementById(
      "subtotal"
    );

  const deliveryElement =
    document.getElementById(
      "delivery"
    );

  const totalElement =
    document.getElementById(
      "total"
    );


  if (subtotalElement) {

    subtotalElement.textContent =
      "₹" + subtotal;

  }


  if (deliveryElement) {

    deliveryElement.textContent =
      delivery
        ? "₹" + delivery
        : "FREE";

  }


  if (totalElement) {

    totalElement.textContent =
      "₹" +
      (subtotal + delivery);

  }

}



/* ---------- CHANGE QUANTITY ---------- */

function cq(id, change) {

  const cart =
    gc();


  cart[id] =
    (Number(cart[id]) || 0) +
    change;


  if (
    cart[id] <= 0
  ) {

    delete cart[id];

  }


  sc(cart);

  render();

}



/* ---------- REMOVE PRODUCT ---------- */

function rm(id) {

  const cart =
    gc();


  delete cart[id];


  sc(cart);

  render();

}


updateCartCount();

render();



/* =========================================================
   CONTACT / ENQUIRY FORM
   ========================================================= */

const enquiryForm =
  document.getElementById(
    "enquiryForm"
  );


if (enquiryForm) {

  enquiryForm.addEventListener(
    "submit",
    event => {

      event.preventDefault();


      const phone =
        document
          .getElementById("phone")
          .value
          .trim();


      const email =
        document
          .getElementById("email")
          .value
          .trim()
          .toLowerCase();



      /* PHONE VALIDATION */

      if (
        !/^[6-9]\d{9}$/.test(
          phone
        )
      ) {

        alert(
          "Enter a valid 10-digit Indian mobile number."
        );

        return;

      }



      /* EMAIL VALIDATION */

      if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(
          email
        )
      ) {

        alert(
          "Enter a valid email."
        );

        return;

      }



      const entry = {

        id:
          "ENQ" +
          Date.now()
            .toString()
            .slice(-7),

        name:
          document
            .getElementById("name")
            ?.value
            ?.trim() ||
          "Visitor",

        phone,

        email,

        subject:
          document
            .getElementById(
              "subject"
            )
            ?.value ||
          "General",

        message:
          document
            .getElementById(
              "message"
            )
            ?.value
            ?.trim() ||
          "",

        date:
          new Date()
            .toISOString()

      };


      const enquiries =
        getEnquiries();


      enquiries.unshift(
        entry
      );


      saveEnquiries(
        enquiries
      );


      const success =
        document.getElementById(
          "enquirySuccess"
        );


      if (success) {

        success.style.display =
          "block";

      }


      enquiryForm.reset();

    }
  );

}



/* =========================================================
   BUYER / FARMER ROLE SELECTION
   ========================================================= */

let selectedRole =
  "buyer";


function setRole(role) {

  if (
    role !== "buyer" &&
    role !== "farmer"
  ) {

    role =
      "buyer";

  }


  selectedRole =
    role;


  /* ROLE BUTTONS */

  document
    .querySelectorAll(
      "[data-role-tab]"
    )
    .forEach(button => {

      button.classList.toggle(
        "active",
        button.dataset.roleTab ===
          role
      );

    });



  /* SIGNUP ROLE INPUT */

  const roleInput =
    document.getElementById(
      "signupRole"
    );


  if (roleInput) {

    roleInput.value =
      role;

  }



  /* FARMER-ONLY FIELDS */

  document
    .querySelectorAll(
      "[data-farmer-only]"
    )
    .forEach(element => {

      const show =
        role === "farmer";


      element.style.display =
        show
          ? "grid"
          : "none";


      const input =
        element.querySelector(
          "input, select, textarea"
        );


      if (input) {

        input.required =
          show;

      }

    });

}



document
  .querySelectorAll(
    "[data-role-tab]"
  )
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        setRole(
          button.dataset.roleTab
        );

      }
    );

  });


setRole("buyer");



/* =========================================================
   LOGIN
   ========================================================= */

const loginForm =
  document.getElementById(
    "loginForm"
  );


if (loginForm) {

  loginForm.addEventListener(
    "submit",
    event => {

      event.preventDefault();


      const email =
        document
          .getElementById(
            "loginEmail"
          )
          .value
          .trim()
          .toLowerCase();


      const password =
        document
          .getElementById(
            "loginPassword"
          )
          .value;


      const user =
        getUsers().find(
          item =>

            item.email
              .toLowerCase() ===
              email &&

            item.password ===
              password &&

            item.role ===
              selectedRole
        );


      const error =
        document.getElementById(
          "loginError"
        );


      if (!user) {

        if (error) {

          error.textContent =
            "Incorrect email/password or wrong account type.";

          error.style.display =
            "block";

        }

        return;

      }


      if (error) {

        error.style.display =
          "none";

      }


      setSession({

        id:
          user.id,

        role:
          user.role,

        name:
          user.name,

        email:
          user.email

      });


      location.href =
        user.role === "farmer"
          ? "farmer-dashboard.html"
          : "buyer-profile.html";

    }
  );

}



/* =========================================================
   SIGNUP
   ========================================================= */

const signupForm =
  document.getElementById(
    "signupForm"
  );


if (signupForm) {

  signupForm.addEventListener(
    "submit",
    event => {

      event.preventDefault();


      const role =
        document
          .getElementById(
            "signupRole"
          )
          .value;


      const name =
        document
          .getElementById(
            "signupName"
          )
          .value
          .trim();


      const email =
        document
          .getElementById(
            "signupEmail"
          )
          .value
          .trim()
          .toLowerCase();


      const phone =
        document
          .getElementById(
            "signupPhone"
          )
          .value
          .trim();


      const password =
        document
          .getElementById(
            "signupPassword"
          )
          .value;



      /* NAME */

      if (
        name.length < 2
      ) {

        alert(
          "Enter your full name."
        );

        return;

      }



      /* EMAIL */

      if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(
          email
        )
      ) {

        alert(
          "Enter a valid email."
        );

        return;

      }



      /* PHONE */

      if (
        !/^[6-9]\d{9}$/.test(
          phone
        )
      ) {

        alert(
          "Enter a valid 10-digit Indian mobile number."
        );

        return;

      }



      /* PASSWORD */

      if (
        password.length < 6
      ) {

        alert(
          "Password must contain at least 6 characters."
        );

        return;

      }



      const users =
        getUsers();



      /* DUPLICATE EMAIL */

      if (
        users.some(
          user =>
            user.email
              .toLowerCase() ===
            email
        )
      ) {

        alert(
          "An account with this email already exists."
        );

        return;

      }



      const user = {

        id:
          (
            role === "farmer"
              ? "F"
              : "B"
          ) +
          Date.now(),

        role,

        name,

        email,

        phone,

        password

      };



      /* ---------- FARMER ---------- */

      if (
        role === "farmer"
      ) {

        const farmName =
          document
            .getElementById(
              "farmName"
            )
            ?.value
            .trim();


        const farmLocation =
          document
            .getElementById(
              "farmLocation"
            )
            ?.value
            .trim();


        if (!farmName) {

          alert(
            "Enter your farm name."
          );

          return;

        }


        if (!farmLocation) {

          alert(
            "Enter your farm location."
          );

          return;

        }


        user.farmName =
          farmName;

        user.location =
          farmLocation;

      }



      /* ---------- BUYER ---------- */

      else {

        user.address =
          "";

      }



      users.push(
        user
      );


      saveUsers(
        users
      );


      setSession({

        id:
          user.id,

        role:
          user.role,

        name:
          user.name,

        email:
          user.email

      });


      location.href =
        role === "farmer"
          ? "farmer-dashboard.html"
          : "buyer-profile.html";

    }
  );

}



/* =========================================================
   LOGOUT
   ========================================================= */

function logout() {

  setSession(null);

  location.href =
    "login.html";

}



/* =========================================================
   BUYER PROFILE
   ========================================================= */

function renderBuyerProfile() {

  const root =
    document.getElementById(
      "buyerProfile"
    );


  if (!root) {

    return;

  }


  const session =
    getSession();


  /* PROTECT BUYER PAGE */

  if (
    !session ||
    session.role !== "buyer"
  ) {

    location.href =
      "login.html";

    return;

  }



  const user =
    getUsers().find(
      item =>
        item.id ===
        session.id
    ) ||
    session;



  /* PROFILE DATA */

  document
    .querySelectorAll(
      "[data-profile-name]"
    )
    .forEach(element => {

      element.textContent =
        user.name ||
        "Buyer";

    });


  document
    .querySelectorAll(
      "[data-profile-email]"
    )
    .forEach(element => {

      element.textContent =
        user.email ||
        "-";

    });


  document
    .querySelectorAll(
      "[data-profile-phone]"
    )
    .forEach(element => {

      element.textContent =
        user.phone ||
        "-";

    });


  document
    .querySelectorAll(
      "[data-profile-address]"
    )
    .forEach(element => {

      element.textContent =
        user.address ||
        "Not added";

    });



  /* BUYER ORDERS */

  const orders =
    getOrders().filter(
      order =>

        order.buyerId ===
          session.id ||

        order.email ===
          session.email
    );


  const ordersBox =
    document.getElementById(
      "buyerOrders"
    );


  const count =
    document.getElementById(
      "buyerOrderCount"
    );


  const spend =
    document.getElementById(
      "buyerSpend"
    );


  if (count) {

    count.textContent =
      orders.length;

  }


  if (spend) {

    const amount =
      orders.reduce(
        (total, order) =>
          total +
          Number(
            order.total || 0
          ),
        0
      );


    spend.textContent =
      "₹" + amount;

  }



  if (!ordersBox) {

    return;

  }



  /* NO ORDERS */

  if (!orders.length) {

    ordersBox.innerHTML = `

      <div class="empty-state">

        No orders yet.

        <a
          href="shop.html"
          style="
            color:var(--green);
            font-weight:800;
          "
        >
          Start shopping →
        </a>

      </div>

    `;

    return;

  }



  /* DISPLAY ORDERS */

  ordersBox.innerHTML =
    orders
      .map(order => {

        const status =
          order.status ||
          "Placed";


        const statusClass =
          status === "Pending"
            ? "pending"
            : "paid";


        return `

          <div class="order-item">

            <div>

              <b>
                ${order.id}
              </b>

              <div class="meta">

                ${
                  order.date
                    ? new Date(
                        order.date
                      ).toLocaleString()
                    : ""
                }

                •

                ${
                  order.paymentLabel ||
                  order.payment ||
                  "Payment"
                }

              </div>


              <div class="meta">

                ${
                  order.itemCount || 0
                }
                item(s)

                •

                ₹${order.total || 0}

              </div>

            </div>


            <span
              class="
                status
                ${statusClass}
              "
            >
              ${status}
            </span>

          </div>

        `;

      })
      .join("");

}


renderBuyerProfile();



/* =========================================================
   FARMER DASHBOARD
   ========================================================= */

function renderFarmerDashboard() {

  const root =
    document.getElementById(
      "farmerDashboard"
    );


  if (!root) {

    return;

  }


  const session =
    getSession();


  /* PROTECT FARMER PAGE */

  if (
    !session ||
    session.role !== "farmer"
  ) {

    location.href =
      "login.html";

    return;

  }



  const user =
    getUsers().find(
      item =>
        item.id ===
        session.id
    ) ||
    session;



  /* FARMER DETAILS */

  document
    .querySelectorAll(
      "[data-farmer-name]"
    )
    .forEach(element => {

      element.textContent =
        user.name ||
        "Farmer";

    });


  document
    .querySelectorAll(
      "[data-farm-name]"
    )
    .forEach(element => {

      element.textContent =
        user.farmName ||
        "Maaz Farms";

    });


  document
    .querySelectorAll(
      "[data-farmer-email]"
    )
    .forEach(element => {

      element.textContent =
        user.email ||
        "-";

    });


  document
    .querySelectorAll(
      "[data-farmer-phone]"
    )
    .forEach(element => {

      element.textContent =
        user.phone ||
        "-";

    });


  document
    .querySelectorAll(
      "[data-farm-location]"
    )
    .forEach(element => {

      element.textContent =
        user.location ||
        "Kurnool, Andhra Pradesh";

    });



  const orders =
    getOrders();


  const enquiries =
    getEnquiries();



  /* DASHBOARD COUNTERS */

  const orderCount =
    document.getElementById(
      "farmerOrderCount"
    );


  const revenue =
    document.getElementById(
      "farmerRevenue"
    );


  const enquiryCount =
    document.getElementById(
      "farmerEnquiryCount"
    );


  if (orderCount) {

    orderCount.textContent =
      orders.length;

  }


  if (revenue) {

    const amount =
      orders.reduce(
        (total, order) =>
          total +
          Number(
            order.total || 0
          ),
        0
      );


    revenue.textContent =
      "₹" + amount;

  }


  if (enquiryCount) {

    enquiryCount.textContent =
      enquiries.length;

  }



  /* ---------- ORDERS ---------- */

  const orderBox =
    document.getElementById(
      "farmerOrders"
    );


  if (orderBox) {

    if (!orders.length) {

      orderBox.innerHTML =
        '<div class="empty-state">No customer orders yet.</div>';

    }

    else {

      orderBox.innerHTML =
        orders
          .slice(0, 10)
          .map(order => {

            const status =
              order.status ||
              "Placed";


            const statusClass =
              status === "Pending"
                ? "pending"
                : "paid";


            return `

              <div class="order-item">

                <div>

                  <b>
                    ${order.id}
                  </b>

                  <div class="meta">

                    ${
                      order.name ||
                      "Buyer"
                    }

                    •

                    ${
                      order.phone ||
                      ""
                    }

                  </div>

                  <div class="meta">

                    ₹${
                      order.total ||
                      0
                    }

                    •

                    ${
                      order.paymentLabel ||
                      order.payment ||
                      ""
                    }

                  </div>

                </div>


                <span
                  class="
                    status
                    ${statusClass}
                  "
                >
                  ${status}
                </span>

              </div>

            `;

          })
          .join("");

    }

  }



  /* ---------- ENQUIRIES ---------- */

  const enquiryBox =
    document.getElementById(
      "farmerEnquiries"
    );


  if (enquiryBox) {

    if (!enquiries.length) {

      enquiryBox.innerHTML =
        '<div class="empty-state">No enquiries yet.</div>';

    }

    else {

      enquiryBox.innerHTML =
        enquiries
          .slice(0, 8)
          .map(enquiry => `

            <div class="enquiry-item">

              <div>

                <b>
                  ${
                    enquiry.subject ||
                    "Enquiry"
                  }
                </b>

                <div class="meta">

                  ${
                    enquiry.name ||
                    ""
                  }

                  •

                  ${
                    enquiry.phone ||
                    ""
                  }

                </div>

                <div class="meta">

                  ${
                    enquiry.message ||
                    ""
                  }

                </div>

              </div>

              <span class="status">
                New
              </span>

            </div>

          `)
          .join("");

    }

  }



  /* ---------- INVENTORY ---------- */

  const inventoryBox =
    document.getElementById(
      "farmerInventory"
    );


  if (
    inventoryBox &&
    window.PRODUCTS
  ) {

    inventoryBox.innerHTML =
      window.PRODUCTS
        .map(product => `

          <div class="inventory-item">

            <div>

              <b>
                ${product.name}
              </b>

              <div class="meta">

                ₹${product.price}
                /
                ${product.unit}

              </div>

            </div>


            <span class="status">
              In Stock
            </span>

          </div>

        `)
        .join("");

  }

}


renderFarmerDashboard();



/* =========================================================
   CHECKOUT TOTALS
   ========================================================= */

function currentTotals() {

  if (
    !window.PRODUCTS
  ) {

    return {

      subtotal: 0,

      delivery: 0,

      total: 0,

      itemCount: 0

    };

  }


  const cart =
    gc();


  let subtotal = 0;

  let itemCount = 0;


  Object
    .keys(cart)
    .forEach(id => {

      const product =
        window.PRODUCTS.find(
          item =>
            item.id === id
        );


      if (product) {

        const quantity =
          Number(
            cart[id]
          ) || 0;


        subtotal +=
          product.price *
          quantity;


        itemCount +=
          quantity;

      }

    });



  const delivery =
    subtotal >= 500 ||
    subtotal === 0
      ? 0
      : 40;


  return {

    subtotal,

    delivery,

    total:
      subtotal +
      delivery,

    itemCount

  };

}



/* =========================================================
   PAYMENT METHOD
   ========================================================= */

function paymentChanged() {

  const selected =
    document.querySelector(
      'input[name="paymentMethod"]:checked'
    );


  if (!selected) {

    return;

  }


  const method =
    selected.value;


  document
    .querySelectorAll(
      "[data-payment-panel]"
    )
    .forEach(panel => {

      panel.classList.toggle(
        "hidden",
        panel.dataset.paymentPanel !==
          method
      );

    });

}



document
  .querySelectorAll(
    'input[name="paymentMethod"]'
  )
  .forEach(radio => {

    radio.addEventListener(
      "change",
      paymentChanged
    );

  });


paymentChanged();



/* =========================================================
   CHECKOUT PREFILL
   ========================================================= */

function prefillCheckout() {

  const form =
    document.getElementById(
      "checkoutForm"
    );


  if (!form) {

    return;

  }


  const session =
    getSession();


  const note =
    document.getElementById(
      "checkoutLoginNote"
    );



  /* ---------- NOT LOGGED IN ---------- */

  if (!session) {

    if (note) {

      note.innerHTML = `

        🔐 Please

        <a
          href="login.html"
          style="
            font-weight:900;
            color:var(--green);
          "
        >
          login as a Buyer
        </a>

        before placing your order.

      `;

      note.style.display =
        "block";

    }

    return;

  }



  /* ---------- FARMER LOGIN ---------- */

  if (
    session.role !==
    "buyer"
  ) {

    if (note) {

      note.textContent =
        "Farmer accounts cannot place buyer orders. Please login with a Buyer account.";

      note.style.display =
        "block";

    }

    return;

  }



  /* ---------- BUYER ---------- */

  const user =
    getUsers().find(
      item =>
        item.id ===
        session.id
    ) || {};


  const name =
    document.getElementById(
      "checkoutName"
    );


  const phone =
    document.getElementById(
      "checkoutPhone"
    );


  const email =
    document.getElementById(
      "checkoutEmail"
    );


  const address =
    document.getElementById(
      "checkoutAddress"
    );


  if (name) {

    name.value =
      user.name || "";

  }


  if (phone) {

    phone.value =
      user.phone || "";

  }


  if (email) {

    email.value =
      user.email || "";

  }


  if (address) {

    address.value =
      user.address || "";

  }


  if (note) {

    note.style.display =
      "none";

  }

}


prefillCheckout();



/* =========================================================
   CHECKOUT / PLACE ORDER
   ========================================================= */

const checkoutForm =
  document.getElementById(
    "checkoutForm"
  );


if (checkoutForm) {

  checkoutForm.addEventListener(
    "submit",
    event => {

      event.preventDefault();


      const session =
        getSession();



      /* ---------- BUYER LOGIN REQUIRED ---------- */

      if (
        !session ||
        session.role !==
          "buyer"
      ) {

        alert(
          "Please login with a Buyer account before checkout."
        );


        location.href =
          "login.html";

        return;

      }



      /* ---------- CART CHECK ---------- */

      const cart =
        gc();


      if (
        !Object.keys(cart).length
      ) {

        alert(
          "Your cart is empty."
        );

        return;

      }



      const name =
        document
          .getElementById(
            "checkoutName"
          )
          .value
          .trim();


      const email =
        document
          .getElementById(
            "checkoutEmail"
          )
          .value
          .trim()
          .toLowerCase();


      const phone =
        document
          .getElementById(
            "checkoutPhone"
          )
          .value
          .trim();


      const address =
        document
          .getElementById(
            "checkoutAddress"
          )
          .value
          .trim();



      /* ---------- NAME ---------- */

      if (
        name.length < 2
      ) {

        alert(
          "Enter your full name."
        );

        return;

      }



      /* ---------- EMAIL ---------- */

      if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(
          email
        )
      ) {

        alert(
          "Enter a valid email."
        );

        return;

      }



      /* ---------- PHONE ---------- */

      if (
        !/^[6-9]\d{9}$/.test(
          phone
        )
      ) {

        alert(
          "Enter a valid 10-digit Indian mobile number."
        );

        return;

      }



      /* ---------- ADDRESS ---------- */

      if (
        address.length < 8
      ) {

        alert(
          "Enter your complete delivery address."
        );

        return;

      }



      /* ---------- PAYMENT METHOD ---------- */

      const paymentRadio =
        document.querySelector(
          'input[name="paymentMethod"]:checked'
        );


      if (!paymentRadio) {

        alert(
          "Select a payment method."
        );

        return;

      }


      const method =
        paymentRadio.value;



      /* ---------- UPI ---------- */

      if (
        method === "upi"
      ) {

        const upi =
          document
            .getElementById(
              "upiId"
            )
            ?.value
            .trim();


        if (
          !upi ||
          !/^[\w.-]+@[\w.-]+$/.test(
            upi
          )
        ) {

          alert(
            "Enter a valid UPI ID, for example name@upi."
          );

          return;

        }

      }



      /* ---------- CARD ---------- */

      if (
        method === "card"
      ) {

        const cardName =
          document
            .getElementById(
              "cardName"
            )
            ?.value
            .trim();


        const cardNumber =
          (
            document
              .getElementById(
                "cardNumber"
              )
              ?.value ||
            ""
          )
            .replace(
              /\s/g,
              ""
            );


        const expiry =
          document
            .getElementById(
              "cardExpiry"
            )
            ?.value
            .trim();


        const cvv =
          document
            .getElementById(
              "cardCvv"
            )
            ?.value
            .trim();


        if (!cardName) {

          alert(
            "Enter the name on the card."
          );

          return;

        }


        if (
          !/^\d{16}$/.test(
            cardNumber
          )
        ) {

          alert(
            "Enter a valid demo 16-digit card number."
          );

          return;

        }


        if (
          !/^(0[1-9]|1[0-2])\/\d{2}$/.test(
            expiry
          )
        ) {

          alert(
            "Enter expiry in MM/YY format."
          );

          return;

        }


        if (
          !/^\d{3,4}$/.test(
            cvv
          )
        ) {

          alert(
            "Enter a valid demo CVV."
          );

          return;

        }

      }



      /* ---------- NET BANKING ---------- */

      if (
        method ===
        "netbanking"
      ) {

        const bank =
          document
            .getElementById(
              "bankName"
            )
            ?.value;


        if (!bank) {

          alert(
            "Select a bank."
          );

          return;

        }

      }



      /* ---------- PAYMENT LABELS ---------- */

      const labels = {

        cod:
          "Cash on Delivery",

        upi:
          "UPI",

        card:
          "Debit / Credit Card",

        netbanking:
          "Net Banking"

      };



      const totals =
        currentTotals();



      /* ---------- ORDER ---------- */

      const order = {

        id:
          "MF" +
          Date.now()
            .toString()
            .slice(-8),

        buyerId:
          session.id,

        name,

        email,

        phone,

        address,

        payment:
          method,

        paymentLabel:
          labels[method] ||
          method,

        subtotal:
          totals.subtotal,

        delivery:
          totals.delivery,

        total:
          totals.total,

        itemCount:
          totals.itemCount,

        status:
          method === "cod"
            ? "Pending"
            : "Paid (Demo)",

        date:
          new Date()
            .toISOString(),

        cart: {
          ...cart
        }

      };



      /* ---------- SAVE ORDER ---------- */

      const orders =
        getOrders();


      orders.unshift(
        order
      );


      saveOrders(
        orders
      );



      /* ---------- UPDATE BUYER ADDRESS ---------- */

      const users =
        getUsers();


      const buyerIndex =
        users.findIndex(
          user =>
            user.id ===
            session.id
        );


      if (
        buyerIndex !== -1
      ) {

        users[buyerIndex].name =
          name;

        users[buyerIndex].phone =
          phone;

        users[buyerIndex].address =
          address;


        saveUsers(
          users
        );

      }



      /* ---------- CLEAR CART ---------- */

      localStorage.removeItem(
        "organicCart"
      );


      updateCartCount();



      /* ---------- SUCCESS MESSAGE ---------- */

      const success =
        document.getElementById(
          "checkoutSuccess"
        );


      if (success) {

        success.innerHTML = `

          ✅ Order placed successfully.

          <br>

          Order ID:
          <b>${order.id}</b>

          <br>

          Payment:
          <b>${order.paymentLabel}</b>

          •

          Total:
          <b>₹${totals.total}</b>

        `;


        success.style.display =
          "block";

      }



      checkoutForm.reset();

      paymentChanged();


      window.scrollTo({

        top: 0,

        behavior: "smooth"

      });

    }
  );

}



/* =========================================================
   HOME PAGE 3D CAROUSEL
   Changes automatically every 3 seconds
   ========================================================= */

(function initMaazHero3D() {

  const carousel =
    document.querySelector(
      "[data-hero-carousel]"
    );


  if (!carousel) {

    return;

  }


  const slides =
    [
      ...carousel.querySelectorAll(
        ".hero-3d-slide"
      )
    ];


  const dots =
    [
      ...carousel.querySelectorAll(
        ".hero-3d-dots span"
      )
    ];


  if (
    slides.length < 2
  ) {

    return;

  }


  let current =
    0;


  let timer =
    null;



  function paint() {

    const total =
      slides.length;


    slides.forEach(
      (slide, index) => {

        slide.classList.remove(
          "is-active",
          "is-left",
          "is-right",
          "is-hidden"
        );


        const delta =
          (
            index -
            current +
            total
          ) %
          total;


        if (
          delta === 0
        ) {

          slide.classList.add(
            "is-active"
          );

        }


        else if (
          delta === 1
        ) {

          slide.classList.add(
            "is-right"
          );

        }


        else if (
          delta ===
          total - 1
        ) {

          slide.classList.add(
            "is-left"
          );

        }


        else {

          slide.classList.add(
            "is-hidden"
          );

        }

      }
    );


    dots.forEach(
      (dot, index) => {

        dot.classList.toggle(
          "active",
          index === current
        );

      }
    );

  }



  function startCarousel() {

    if (timer) {

      clearInterval(
        timer
      );

    }


    timer =
      setInterval(
        () => {

          current =
            (
              current + 1
            ) %
            slides.length;


          paint();

        },
        3000
      );

  }



  /* DOT CLICK SUPPORT */

  dots.forEach(
    (dot, index) => {

      dot.style.cursor =
        "pointer";


      dot.addEventListener(
        "click",
        () => {

          current =
            index;

          paint();

          startCarousel();

        }
      );

    }
  );



  paint();

  startCarousel();

})();
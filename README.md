# doanReact — E-Shopper Frontend

An e-commerce frontend built with **React and JavaScript**, integrating a REST API to display products, manage members' products, update accounts, and interact with blog posts. The application also implements shopping carts, a wishlist, and browser storage persistence.

This personal frontend project provides practical experience and portfolio material for React internships and freelance work. Key implementation areas include **product CRUD with multiple image uploads**, **form validation**, **comments and replies**, **blog ratings**, and **state management with Context and Redux Toolkit**.

> Verification scope: the descriptions below were checked directly against the source code at commit [`62a7dc0`](https://github.com/PhanHoang12/doanReact/commit/62a7dc0a1e287c5317b321d29c3fed4fafdac5d3). API interactions require a separate Laravel backend, which is not included in this repository. The build and tests currently have the issues documented under [Verification results](#verification-results), so complete browser workflows have not yet been verified.

## Features implemented in the source code

### 1. Product listing and details

- The home page calls `GET /product`, reads `res.data.data`, and handles responses containing either an array or an object. Each product card displays its first image, name, price, a details link, and actions to add it to the cart or wishlist.
- The details page reads the product ID from the URL using `useParams`, calls `GET /product/detail/:id`, and displays product information, price, web ID, New/Sale status, company information, and description.
- Image lists are parsed from JSON strings when needed. Users can select a thumbnail to change the main image and enter a quantity before adding the product to the cart.
- The home page's add-to-cart action uses Redux, while the details page uses Context and a different storage key. Both flows are documented separately below.

**Source:** [Home.js](src/component/Home/Home.js), [ProductDetail.js](src/component/Product/ProductDetail.js).

### 2. Registration, login, and account updates

- Registration collects a name, email, password, phone number, address, and avatar. The form validates required fields, email format, `png/jpg/jpeg` file extensions, and a 1 MB file size limit. `FileReader` converts the avatar to a Data URL for submission with the registration data.
- Login validates the email and password, sends `POST /login` with `level: 0`, displays API validation errors, and stores the returned `Auth` data and token in `localStorage` on success before navigating to the home page.
- The account page is prefilled from `auth`, with the email field set to read-only. Users can submit their name, password, phone number, address, and avatar to `POST /user/update/:id` with a Bearer token. The response updates the account information stored in the browser.
- The header checks for a token when the route changes to display either the login or account menu. Logout calls `localStorage.clear()` and navigates to the login page, also removing saved cart and wishlist data.

**Source:** [Register.js](src/component/member/Register.js), [Login.js](src/component/member/Login.js), [Account.js](src/component/member/Account.js), [Head.js](src/component/layout/Head.js).

### 3. Personal product management: list, create, update, and delete

This feature group demonstrates form handling, API integration, and file uploads:

- **List:** fetches the member's products through `GET /user/my-product` and renders a table with IDs, names, images, prices, and edit/delete actions.
- **Create:** loads category and brand options from the API. Users enter a name, price, company, category, brand, status, discount percentage, and description. The discount field appears when Sale is selected and resets to `0` when New is selected.
- **Image validation:** the create form allows up to 3 images, checks `png/jpg/jpeg` extensions, and applies a 1 MB limit per file. Product data and images are submitted using `FormData`, with files under `file[]`.
- **Update:** loads a product by ID and fills the form, displaying existing images with checkboxes for removal. Updates submit the `avatarCheckBox[]` removal list alongside new `file[]` uploads and validate that the remaining image count does not exceed 3. The form currently requires at least one new image, even for text-only changes.
- **Delete:** requests confirmation with `window.confirm`, calls the deletion endpoint, and refreshes the displayed list from the API response. The current request uses `GET /user/product/delete/:id`.
- Product management requests include a Bearer token. Create/update forms display API validation errors and navigate to `/my-product` on success.

**Source:** [MyProduct.js](src/component/Product/MyProduct.js), [AddProduct.js](src/component/Product/AddProduct.js), [EditProduct .js](src/component/Product/EditProduct%20.js).

### 4. Shopping carts and checkout screen

There are currently **two separate cart implementations**, which are not synchronized:

| Flow | Storage and shared state | Implemented behavior |
| --- | --- | --- |
| Product details → `/product/cart` | `localStorage.Cart` stores a `{ productId: quantity }` object; `CartContext` shares the total quantity with the header | Adds quantities from the details page; fetches product information through `POST /product/cart`; supports increment/decrement actions, a minimum of 1 when decrementing, deletion with confirmation, line totals, and a cart total |
| Home page → `/checkout` | Redux Toolkit stores `items` and `cartCount`, restored from and persisted to `localStorage.ReduxCart` | Dispatches `addToCart`, adjusts quantities with `cong`/`tru`, updates the header's Checkout counter, refetches product information when `items` changes, and calculates totals from prices and quantities |

The checkout summary adds a **fixed $2 tax** and displays free shipping. The shopper information forms, shipping address fields, and payment method checkboxes are currently UI elements; order submission, order history storage, and payment gateway integration are not implemented.

**Source:** [CartContext.js](src/context/CartContext.js), [Cart.js](src/component/Product/Cart.js), [cartSlice.js](src/redux/cartSlice.js), [Checkout.js](src/component/Product/Checkout.js).

### 5. Wishlist

- Stores an array of product IDs in `localStorage.Wishlist`, using `includes` to prevent duplicate IDs.
- The `/wishlist` page fetches products from the API and filters them by the saved IDs.
- Removing an item updates the displayed list, `localStorage`, and the header counter through `WishlistContext`.

**Source:** [Home.js](src/component/Home/Home.js), [Wishlist.js](src/component/Product/Wishlist.js), [WishlistContext.js](src/context/WishlistContext.js).

### 6. Blog posts, comments, replies, and star ratings

- The blog list calls `GET /blog` and displays titles, images, descriptions, author IDs, dates and times formatted with `vi-VN`, and links to post details. The details page calls `GET /blog/detail/:id` and renders HTML content returned by the API.
- `BlogDetail` is split into `CommentSection`, `CommentItem`, and `Rate` components to separate display and interaction responsibilities.
- Posting a comment requires a token and `auth` data; users who are not logged in are redirected to the login page. Comments that are empty after `trim()` are rejected before submission.
- Top-level comments use `id_comment = 0`; replies store the parent comment's ID. The UI displays one level of replies beneath each top-level comment and provides an inline reply form for the selected comment.
- After a successful `POST /blog/comment/:id`, the returned comment is appended to state and the form is cleared without reloading the page.
- `Rate` fetches ratings through `GET /blog/rate/:id`, calculates the average using `reduce`, and displays the vote count. When a logged-in user selects a star rating, the component submits a `POST` request and fetches the ratings again to update the UI.

**Source:** [Blog.js](src/component/Blog/Blog.js), [BlogDetail.js](src/component/Blog/BlogDetail.js), [CommentSection.js](src/component/Blog/CommentSection.js), [CommentItem.js](src/component/Blog/CommentItem.js), [Rate.js](src/component/Blog/Rate.js).

## Skills demonstrated by the implementation

| Skill | Evidence in the code |
| --- | --- |
| REST API integration | Shared Axios instance in [API.js](src/api/API.js); components fetch data, handle responses, update state, and attach Bearer tokens to requests requiring an account |
| Interactive forms | Controlled inputs, field-specific error objects, email/file checks, and a discount field driven by product status in [AddProduct.js](src/component/Product/AddProduct.js) |
| Multiple image uploads | `FormData`, `file[]`, a list of existing images to remove, and remaining-image count calculations in [EditProduct .js](src/component/Product/EditProduct%20.js) |
| Component organization | Shared layout components; `BlogDetail` passes data and callbacks to comment/rating components; [MemberLeft.js](src/component/member/MemberLeft.js) is reused across member pages |
| Shared and persistent state | Context for cart/wishlist counters, Redux Toolkit for the home/checkout cart flow, and `localStorage` to restore data after a page reload |
| JavaScript data handling | Normalizing objects and arrays, parsing image JSON, filtering wishlist items, grouping comments by parent ID, and calculating average ratings and monetary totals |
| Application routing | Routes in [index.js](src/index.js), `useParams` for IDs, `useNavigate` after actions, and `NavLink` for screen navigation |

The commit history records the features being added in stages and provides concrete material for discussing the development process in interviews:

- [`ff64bbc`](https://github.com/PhanHoang12/doanReact/commit/ff64bbc): blog listing and details.
- [`9725e6f`](https://github.com/PhanHoang12/doanReact/commit/9725e6f), [`da31876`](https://github.com/PhanHoang12/doanReact/commit/da31876): login/registration and comments.
- [`8ce1e30`](https://github.com/PhanHoang12/doanReact/commit/8ce1e30): ratings, account updates, and personal products.
- [`9637920`](https://github.com/PhanHoang12/doanReact/commit/9637920), [`a49fc17`](https://github.com/PhanHoang12/doanReact/commit/a49fc17): product listing, creation, and editing.
- [`60e8b64`](https://github.com/PhanHoang12/doanReact/commit/60e8b64), [`2649ec3`](https://github.com/PhanHoang12/doanReact/commit/2649ec3): cart functionality, quantity changes, and removal.
- [`62a7dc0`](https://github.com/PhanHoang12/doanReact/commit/62a7dc0): wishlist and Redux integration.

### Implementation scope and template attribution

The interface uses the **E-Shopper** HTML/CSS template, with Themeum credited in [Foot.js](src/component/layout/Foot.js). The `frontend/` directory contains the reference HTML pages and template assets; the React application lives in `src/` and uses static assets from `public/`.

The programming work available for review includes the React logic, API integration, validation, image handling, routing, and state management referenced above. The Laravel backend and original interface design are outside this scope. The source and commit history provide specific examples the author can use to explain independent implementation and problem-solving to recruiters or clients.

## Technology and structure

Versions below reflect [package.json](package.json); exact resolved versions are recorded in [package-lock.json](package-lock.json).

| Technology | Declared version | Purpose |
| --- | --- | --- |
| React / React DOM | `^19.3.0` | Components, hooks, and UI rendering |
| React Router DOM | `^7.18.4` | Routing and URL parameters |
| Redux Toolkit / React Redux | `^2.13.0` / `^9.3.0` | Cart state for the home/checkout flow |
| Axios | `^1.20.0` | HTTP requests to the Laravel API |
| react-simple-star-rating | `^5.1.7` | Star rating UI |
| react-scripts | `5.0.1` | Create React App development, build, and test commands |
| Bootstrap, Font Awesome, E-Shopper CSS | Static files in `public/` | Layout, icons, and styling |

```text
doanReact/
├── frontend/                 # Reference HTML/CSS/JS and template images
├── public/                   # index.html, CSS, fonts, images, and static JS
├── src/
│   ├── api/API.js            # Axios instance and backend address
│   ├── component/
│   │   ├── Home/             # Product listing
│   │   ├── Product/          # CRUD, details, carts, checkout, wishlist
│   │   ├── member/           # Login, registration, account updates
│   │   ├── Blog/             # Posts, comments, replies, ratings
│   │   └── layout/           # Header, footer, sidebar
│   ├── context/              # Cart and Wishlist counters
│   ├── redux/                # Store and cart slice
│   ├── App.js                # Shared layout receiving content via children
│   └── index.js              # Router and providers
├── package.json
├── package-lock.json
└── README.md
```

## Pages and routes

The following routes are declared in [src/index.js](src/index.js). Some template menu items still use `.html` links; the corresponding React routes can be opened directly during verification.

| Route | Content |
| --- | --- |
| `/` | Product listing, Redux add-to-cart action, and wishlist action |
| `/product/detail/:id` | Product details, main image selection, and Context add-to-cart action |
| `/product/cart` | Context cart: quantities, removal, and totals |
| `/checkout` | Redux cart, order summary, and checkout UI |
| `/wishlist` | Saved favorite products |
| `/member/login-register` | Login and registration forms |
| `/account` | Account updates |
| `/my-product` | Member's product list |
| `/user/product/add` | Product creation |
| `/user/product/edit/:id` | Product and image editing |
| `/blog` | Blog listing |
| `/blog/detail/:id` | Post content, comments/replies, and ratings |

## Setup and backend connection

### Frontend

Git, Node.js, and npm are required. The installed React Router dependency requires Node.js 20 or later. The documentation verification environment was **Node.js 22.20.0, npm 11.19.0, and Windows PowerShell**.

```bash
git clone https://github.com/PhanHoang12/doanReact.git
cd doanReact
npm ci
npm start
```

`npm ci` uses the existing lockfile. The development server defaults to `http://localhost:3000`. If PowerShell blocks `npm.ps1`, use `npm.cmd` in place of `npm`.

### Backend and uploaded images

[src/api/API.js](src/api/API.js) currently has a hardcoded backend address:

```js
baseURL: 'http://localhost/laravel8/public/api'
```

A separate Laravel backend must provide the endpoints below and allow frontend API requests through CORS. This repository does not include that backend's database, migrations, sample accounts, or setup instructions.

Uploaded images are referenced directly under `http://localhost/laravel8/public/upload/`, using `product/{id_user}/{filename}`, `Blog/image/{filename}`, and `user/avatar/{filename}`. To use another host, update both `baseURL` and the image URLs in the components; there is currently no shared environment-variable configuration for these addresses.

### API contract used by the frontend

This inventory is based on requests in the source code, not backend test results.

| Method | Endpoint (relative to `baseURL`) | Data / purpose |
| --- | --- | --- |
| `GET` | `/product`, `/product/detail/:id` | Product listing / details in `data` |
| `POST` | `/product/cart` | Sends an ID → quantity object; receives product information in `data` |
| `GET` | `/category-brand` | Receives `category` and `brand` lists |
| `POST` | `/register`, `/login` | Registration / login; the login flow reads `Auth` and `token` |
| `POST` | `/user/update/:id` | Account updates with a Bearer token |
| `GET` | `/user/my-product`, `/user/product/:id` | Product list / editing data with a Bearer token |
| `POST` | `/user/product/add`, `/user/product/update/:id` | `FormData` and a Bearer token; form errors are read from `errors` |
| `GET` | `/user/product/delete/:id` | Product deletion with a Bearer token |
| `GET` | `/blog`, `/blog/detail/:id` | List in `blog.data`; details in `data`, including `comment` |
| `POST` | `/blog/comment/:id` | Content, user ID, parent ID, avatar, and a Bearer token; receives the new comment in `data` |
| `GET`, `POST` | `/blog/rate/:id` | Fetches ratings / submits `user_id`, `blog_id`, and `rate` with a Bearer token |

## Verification results

Checked on **16 November 2026**, with application source unchanged from `62a7dc0` and dependencies already installed in the workspace:

| Command | Observed result |
| --- | --- |
| `npm.cmd run build` | **Failed:** `Attempted import error: 'React' is not exported from 'react' (imported as 'React').` Login, Register, and Rate use a named `React` import that needs to be corrected before further build verification. |
| `$env:CI = 'true'; npm.cmd test -- --watchAll=false --runInBand` | **Failed:** Jest cannot resolve `react-router/dom` from `react-router-dom/dist/index.js`; 1 test suite fails before any tests execute. |

[App.test.js](src/App.test.js) still contains the starter test looking for “learn react,” which does not match the current interface and does not wrap the component in the providers the application uses. There are no feature tests for product CRUD, carts, or comments. End-to-end testing with the backend, responsive checks on devices, and a public demo have not been verified; runtime screenshots are not included in this documentation.

## Current limitations and next steps

- Fix the build and Jest setup, and replace the starter test with relevant feature tests.
- Consolidate `Cart` and `ReduxCart` into one state source. Currently, adding from the home page does not populate `/product/cart`, and adding from product details does not populate `/checkout`.
- Complete order submission and payment handling. The Redux cart has no remove action; checkout forms and payment choices are not connected to order processing.
- Add route protection for member pages and synchronize in-memory state on logout. The header currently checks only for token presence; `localStorage.clear()` does not reset the Redux cart or the wishlist counter held in memory.
- Improve quantity, price, and discount validation; add loading states, empty-cart states, and visible network error messages. Many request errors are currently logged only to the console.
- Implement search, category/brand filtering, product comparison, and blog pagination; these currently remain template UI. Contact/404 pages exist in the HTML template but are not declared as React routes.
- Centralize API/image URL configuration, complete menu navigation, test mobile layouts, and add screenshots and a demo once the application runs reliably.

## Author and attribution

- GitHub: [PhanHoang12](https://github.com/PhanHoang12).
- Interface template: E-Shopper, with Themeum credited in the footer; retain attribution when using the template assets.
- This repository currently has no separate `LICENSE` file.

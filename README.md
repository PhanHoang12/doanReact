# doanReact — E-Shopper Frontend

Ứng dụng bán hàng viết bằng **React và JavaScript**, tích hợp REST API để hiển thị sản phẩm, quản lý sản phẩm của thành viên, cập nhật tài khoản và tương tác với blog. Dự án còn triển khai giỏ hàng, danh sách yêu thích và lưu trạng thái trên trình duyệt.

Đây là đồ án frontend cá nhân phục vụ thực hành và giới thiệu năng lực khi ứng tuyển thực tập hoặc nhận việc freelance React. Những phần đáng xem trong mã nguồn gồm **CRUD sản phẩm có upload nhiều ảnh**, **form có kiểm tra dữ liệu**, **bình luận/phản hồi**, **đánh giá bài viết** và **quản lý trạng thái bằng Context/Redux Toolkit**.

> Phạm vi xác minh: mô tả dưới đây được đối chiếu trực tiếp với mã nguồn tại commit [`62a7dc0`](https://github.com/PhanHoang12/doanReact/commit/62a7dc0a1e287c5317b321d29c3fed4fafdac5d3). Các luồng gọi API cần backend Laravel riêng; repository này không chứa ứng dụng Laravel. Build và test hiện còn lỗi được ghi ở phần [Kết quả kiểm tra](#kết-quả-kiểm-tra), vì vậy chưa có xác nhận chạy thành công toàn bộ luồng trên trình duyệt.

## Chức năng đã có trong mã nguồn

### 1. Danh sách và chi tiết sản phẩm

- Trang chủ gọi `GET /product`, nhận danh sách từ `res.data.data` và xử lý cả trường hợp dữ liệu là mảng hoặc object. Mỗi thẻ hiển thị ảnh đầu tiên, tên, giá, liên kết chi tiết và thao tác thêm vào giỏ hàng/wishlist.
- Trang chi tiết lấy ID từ URL bằng `useParams`, gọi `GET /product/detail/:id`, hiển thị thông tin sản phẩm, giá, mã web, trạng thái New/Sale, thông tin công ty và mô tả.
- Danh sách ảnh được chuyển từ chuỗi JSON khi cần. Người dùng chọn ảnh nhỏ để đổi ảnh chính và nhập số lượng trước khi thêm vào giỏ hàng.
- Nút thêm giỏ trên trang chủ dùng Redux; nút ở trang chi tiết dùng Context và một khóa lưu trữ khác. Hai luồng này được giải thích riêng bên dưới.

**Mã nguồn:** [Home.js](src/component/Home/Home.js), [ProductDetail.js](src/component/Product/ProductDetail.js).

### 2. Đăng ký, đăng nhập và cập nhật tài khoản

- Đăng ký gồm tên, email, mật khẩu, điện thoại, địa chỉ và avatar. Form kiểm tra trường bắt buộc, định dạng email, đuôi ảnh `png/jpg/jpeg` và giới hạn dung lượng 1 MB. `FileReader` chuyển avatar sang Data URL để gửi cùng dữ liệu đăng ký.
- Đăng nhập kiểm tra email/mật khẩu, gửi `POST /login` với `level: 0`, hiển thị lỗi từ API và lưu `Auth`/token vào `localStorage` khi thành công, sau đó chuyển về trang chủ.
- Trang tài khoản điền sẵn dữ liệu từ `auth`; email ở chế độ chỉ đọc. Người dùng có thể gửi tên, mật khẩu, điện thoại, địa chỉ và avatar tới `POST /user/update/:id` với Bearer token. Phản hồi được dùng để cập nhật thông tin lưu trên trình duyệt.
- Header kiểm tra token khi đường dẫn thay đổi để hiển thị menu đăng nhập hoặc tài khoản. Đăng xuất gọi `localStorage.clear()` và chuyển về trang đăng nhập; việc này cũng xóa dữ liệu giỏ hàng/wishlist đã lưu.

**Mã nguồn:** [Register.js](src/component/member/Register.js), [Login.js](src/component/member/Login.js), [Account.js](src/component/member/Account.js), [Head.js](src/component/layout/Head.js).

### 3. Quản lý sản phẩm cá nhân: xem, thêm, sửa, xóa

Đây là nhóm chức năng thể hiện rõ cách xử lý form, dữ liệu API và file upload:

- **Xem:** lấy sản phẩm của thành viên qua `GET /user/my-product`, hiển thị bảng gồm ID, tên, ảnh, giá và thao tác sửa/xóa.
- **Thêm:** tải category/brand từ API để tạo các lựa chọn; nhập tên, giá, công ty, danh mục, thương hiệu, trạng thái, mức sale và chi tiết. Trường phần trăm sale xuất hiện khi chọn Sale và được đặt về `0` khi chọn New.
- **Kiểm tra ảnh:** form thêm cho chọn tối đa 3 ảnh, kiểm tra đuôi `png/jpg/jpeg` và giới hạn mỗi file 1 MB. Dữ liệu và ảnh được gửi bằng `FormData`, các file dùng trường `file[]`.
- **Sửa:** lấy dữ liệu theo ID và điền vào form; hiển thị ảnh cũ để chọn xóa bằng checkbox. Khi cập nhật, gửi danh sách `avatarCheckBox[]` cùng `file[]` mới và kiểm tra tổng số ảnh còn lại không vượt quá 3. Form hiện yêu cầu ít nhất một ảnh mới ngay cả khi chỉ muốn sửa thông tin chữ.
- **Xóa:** hỏi xác nhận bằng `window.confirm`, gọi endpoint xóa rồi cập nhật lại danh sách từ phản hồi của API. Endpoint hiện được gọi bằng `GET /user/product/delete/:id`.
- Các request quản lý sản phẩm gửi Bearer token. Form thêm/sửa có phần hiển thị lỗi validation từ phản hồi API và chuyển về `/my-product` khi thành công.

**Mã nguồn:** [MyProduct.js](src/component/Product/MyProduct.js), [AddProduct.js](src/component/Product/AddProduct.js), [EditProduct .js](src/component/Product/EditProduct%20.js).

### 4. Giỏ hàng và màn hình checkout

Hiện có **hai cách triển khai giỏ hàng cùng tồn tại**, chưa đồng bộ với nhau:

| Luồng | Cách lưu và chia sẻ state | Hành vi có trong mã nguồn |
| --- | --- | --- |
| Chi tiết sản phẩm → `/product/cart` | `localStorage.Cart` lưu object `{ productId: quantity }`; `CartContext` chia sẻ tổng số lượng cho header | Thêm số lượng từ trang chi tiết; lấy thông tin sản phẩm qua `POST /product/cart`; tăng/giảm số lượng, giữ tối thiểu 1 khi bấm giảm, xác nhận xóa, tính thành tiền từng dòng và tổng giỏ |
| Trang chủ → `/checkout` | Redux Toolkit lưu `items` và `cartCount`; khôi phục/lưu bằng `localStorage.ReduxCart` | Dispatch `addToCart`, tăng/giảm qua `cong`/`tru`, cập nhật bộ đếm Checkout trên header; gọi lại API khi `items` đổi; tính tổng tiền từ giá và số lượng |

Ở checkout, phần tổng kết cộng thêm **$2 thuế cố định**, phí vận chuyển hiển thị Free. Biểu mẫu thông tin người mua, địa chỉ giao hàng và checkbox phương thức thanh toán hiện là giao diện; chưa có xử lý gửi đơn hàng, lưu lịch sử đơn hoặc tích hợp cổng thanh toán.

**Mã nguồn:** [CartContext.js](src/context/CartContext.js), [Cart.js](src/component/Product/Cart.js), [cartSlice.js](src/redux/cartSlice.js), [Checkout.js](src/component/Product/Checkout.js).

### 5. Danh sách yêu thích

- Lưu mảng ID trong `localStorage.Wishlist`; kiểm tra `includes` để tránh thêm trùng ID.
- Trang `/wishlist` lấy danh sách sản phẩm từ API rồi lọc theo những ID đã lưu.
- Xóa một mục sẽ cập nhật cả danh sách đang hiển thị, `localStorage` và bộ đếm ở header thông qua `WishlistContext`.

**Mã nguồn:** [Home.js](src/component/Home/Home.js), [Wishlist.js](src/component/Product/Wishlist.js), [WishlistContext.js](src/context/WishlistContext.js).

### 6. Blog, bình luận/phản hồi và đánh giá sao

- Danh sách blog gọi `GET /blog`, hiển thị tiêu đề, ảnh, mô tả, ID tác giả, ngày/giờ theo `vi-VN` và liên kết chi tiết. Chi tiết gọi `GET /blog/detail/:id` và render nội dung HTML từ API.
- `BlogDetail` được tách thành các phần `CommentSection`, `CommentItem` và `Rate` để chia trách nhiệm hiển thị và xử lý tương tác.
- Bình luận yêu cầu token và thông tin `auth`; người chưa đăng nhập được chuyển tới trang đăng nhập. Nội dung trống sau `trim()` bị chặn trước khi gửi.
- Bình luận gốc có `id_comment = 0`; phản hồi mang ID bình luận cha. Giao diện hiển thị một cấp phản hồi dưới bình luận gốc, có form trả lời ngay tại mục được chọn.
- Sau `POST /blog/comment/:id` thành công, phản hồi mới được nối vào state và form được làm trống, không tải lại toàn trang.
- `Rate` lấy danh sách đánh giá qua `GET /blog/rate/:id`, tính điểm trung bình bằng `reduce` và hiển thị số lượt đánh giá. Khi người đã đăng nhập chọn sao, component gửi `POST` và tải lại danh sách đánh giá để cập nhật giao diện.

**Mã nguồn:** [Blog.js](src/component/Blog/Blog.js), [BlogDetail.js](src/component/Blog/BlogDetail.js), [CommentSection.js](src/component/Blog/CommentSection.js), [CommentItem.js](src/component/Blog/CommentItem.js), [Rate.js](src/component/Blog/Rate.js).

## Năng lực thể hiện qua triển khai

| Năng lực | Dẫn chứng có thể kiểm tra trong code |
| --- | --- |
| Tích hợp REST API | Axios instance dùng chung tại [API.js](src/api/API.js); các component lấy dữ liệu, xử lý phản hồi, cập nhật state và gửi Bearer token ở request cần tài khoản |
| Xây dựng form có tương tác | Controlled inputs, object lỗi theo từng trường, kiểm tra email/file, trường sale thay đổi theo trạng thái trong [AddProduct.js](src/component/Product/AddProduct.js) |
| Xử lý upload nhiều ảnh | Dùng `FormData`, `file[]`, danh sách ảnh cũ cần xóa và phép tính số ảnh còn lại trong [EditProduct .js](src/component/Product/EditProduct%20.js) |
| Tổ chức component | Tách layout dùng chung; `BlogDetail` truyền dữ liệu và callback cho các component bình luận/đánh giá; [MemberLeft.js](src/component/member/MemberLeft.js) dùng lại trong các trang thành viên |
| Chia sẻ và lưu trạng thái | Context cho bộ đếm giỏ/wishlist, Redux Toolkit cho luồng giỏ ở trang chủ/checkout, `localStorage` để khôi phục dữ liệu khi tải lại |
| Xử lý dữ liệu JavaScript | Chuẩn hóa danh sách object/mảng, parse ảnh JSON, lọc wishlist, nhóm bình luận theo ID cha, tính trung bình đánh giá và tổng tiền |
| Điều hướng ứng dụng | Khai báo route trong [index.js](src/index.js), dùng `useParams` lấy ID, `useNavigate` chuyển trang sau thao tác và `NavLink` liên kết các màn hình |

Lịch sử commit cho thấy các phần được bổ sung theo từng bước, có thể dùng để trao đổi về quá trình triển khai khi phỏng vấn:

- [`ff64bbc`](https://github.com/PhanHoang12/doanReact/commit/ff64bbc): blog và chi tiết blog.
- [`9725e6f`](https://github.com/PhanHoang12/doanReact/commit/9725e6f), [`da31876`](https://github.com/PhanHoang12/doanReact/commit/da31876): đăng nhập/đăng ký và bình luận.
- [`8ce1e30`](https://github.com/PhanHoang12/doanReact/commit/8ce1e30): đánh giá, cập nhật thành viên và sản phẩm cá nhân.
- [`9637920`](https://github.com/PhanHoang12/doanReact/commit/9637920), [`a49fc17`](https://github.com/PhanHoang12/doanReact/commit/a49fc17): hiển thị, thêm và sửa sản phẩm.
- [`60e8b64`](https://github.com/PhanHoang12/doanReact/commit/60e8b64), [`2649ec3`](https://github.com/PhanHoang12/doanReact/commit/2649ec3): giỏ hàng, tăng/giảm và xóa.
- [`62a7dc0`](https://github.com/PhanHoang12/doanReact/commit/62a7dc0): wishlist và tích hợp Redux.

### Phạm vi triển khai và giao diện tham khảo

Giao diện sử dụng bộ HTML/CSS **E-Shopper**, có dòng ghi nguồn thiết kế Themeum trong [Foot.js](src/component/layout/Foot.js). Thư mục `frontend/` chứa các trang HTML và tài nguyên mẫu; phần ứng dụng React nằm ở `src/`, sử dụng tài nguyên tĩnh trong `public/`.

Phần có thể đánh giá về lập trình trong repository là logic React, kết nối API, validation, xử lý ảnh, điều hướng và quản lý state được dẫn chứng ở trên. Backend Laravel và thiết kế giao diện gốc nằm ngoài phạm vi này. Mã nguồn và lịch sử commit cung cấp nội dung cụ thể để tác giả trình bày cách tự triển khai và giải quyết vấn đề khi trao đổi với nhà tuyển dụng hoặc khách hàng.

## Công nghệ và cấu trúc

Các phiên bản dưới đây theo [package.json](package.json); phiên bản cài đặt cụ thể được lưu trong [package-lock.json](package-lock.json).

| Công nghệ | Phiên bản khai báo | Vai trò |
| --- | --- | --- |
| React / React DOM | `^19.3.0` | Component, hooks và render giao diện |
| React Router DOM | `^7.18.4` | Điều hướng và URL có tham số |
| Redux Toolkit / React Redux | `^2.13.0` / `^9.3.0` | State giỏ hàng cho trang chủ/checkout |
| Axios | `^1.20.0` | Gửi HTTP request tới API Laravel |
| react-simple-star-rating | `^5.1.7` | Giao diện đánh giá sao |
| react-scripts | `5.0.1` | Lệnh phát triển, build và test của Create React App |
| Bootstrap, Font Awesome, CSS E-Shopper | File tĩnh trong `public/` | Bố cục, biểu tượng và giao diện |

```text
doanReact/
├── frontend/                 # HTML/CSS/JS và ảnh giao diện tham khảo
├── public/                   # index.html, CSS, font, ảnh và JS tĩnh
├── src/
│   ├── api/API.js            # Axios instance và địa chỉ backend
│   ├── component/
│   │   ├── Home/             # Danh sách sản phẩm
│   │   ├── Product/          # CRUD, chi tiết, giỏ, checkout, wishlist
│   │   ├── member/           # Đăng nhập, đăng ký, cập nhật tài khoản
│   │   ├── Blog/             # Bài viết, bình luận, phản hồi, đánh giá
│   │   └── layout/           # Header, footer, menu bên trái
│   ├── context/              # Bộ đếm Cart và Wishlist
│   ├── redux/                # Store và cart slice
│   ├── App.js                # Layout dùng chung, nhận nội dung qua children
│   └── index.js              # Router và các provider
├── package.json
├── package-lock.json
└── README.md
```

## Các trang / đường dẫn

Các đường dẫn sau được khai báo thực tế trong [src/index.js](src/index.js). Một số menu mẫu vẫn dùng liên kết `.html`; khi kiểm tra có thể truy cập trực tiếp route React tương ứng.

| Đường dẫn | Nội dung |
| --- | --- |
| `/` | Danh sách sản phẩm, thêm vào giỏ Redux và wishlist |
| `/product/detail/:id` | Chi tiết, đổi ảnh chính, thêm vào giỏ Context |
| `/product/cart` | Giỏ Context: số lượng, xóa, thành tiền |
| `/checkout` | Giỏ Redux, tổng kết tiền và giao diện checkout |
| `/wishlist` | Danh sách sản phẩm yêu thích |
| `/member/login-register` | Hai form đăng nhập và đăng ký |
| `/account` | Cập nhật tài khoản |
| `/my-product` | Danh sách sản phẩm của thành viên |
| `/user/product/add` | Thêm sản phẩm |
| `/user/product/edit/:id` | Sửa sản phẩm và ảnh |
| `/blog` | Danh sách bài viết |
| `/blog/detail/:id` | Nội dung bài, bình luận/phản hồi và đánh giá |

## Cài đặt và kết nối backend

### Frontend

Cần Git, Node.js và npm. Dependency React Router đang cài yêu cầu Node.js từ 20 trở lên. Môi trường thực hiện kiểm tra tài liệu: **Node.js 22.20.0, npm 11.19.0, Windows PowerShell**.

```bash
git clone https://github.com/PhanHoang12/doanReact.git
cd doanReact
npm ci
npm start
```

`npm ci` dùng lockfile có sẵn. Dev server mặc định ở `http://localhost:3000`. Trên PowerShell chặn thực thi `npm.ps1`, dùng `npm.cmd` thay cho `npm`.

### Backend và ảnh upload

[src/api/API.js](src/api/API.js) đang đặt cố định:

```js
baseURL: 'http://localhost/laravel8/public/api'
```

Cần một backend Laravel riêng cung cấp các endpoint bên dưới và cho phép frontend gọi API qua CORS. Repo không kèm database, migration, tài khoản mẫu hoặc hướng dẫn khởi tạo backend đó.

Ảnh upload được tham chiếu trực tiếp tới `http://localhost/laravel8/public/upload/` theo các thư mục `product/{id_user}/{filename}`, `Blog/image/{filename}` và `user/avatar/{filename}`. Nếu dùng host khác, cần sửa cả `baseURL` lẫn URL ảnh trong các component; hiện chưa có biến môi trường để cấu hình chung.

### API contract được frontend sử dụng

Đây là danh sách request đọc từ code, chưa phải kết quả kiểm thử backend.

| Phương thức | Endpoint (sau `baseURL`) | Dữ liệu / mục đích |
| --- | --- | --- |
| `GET` | `/product`, `/product/detail/:id` | Danh sách / chi tiết sản phẩm trong `data` |
| `POST` | `/product/cart` | Gửi object ID → số lượng, nhận thông tin sản phẩm trong `data` |
| `GET` | `/category-brand` | Nhận hai danh sách `category` và `brand` |
| `POST` | `/register`, `/login` | Đăng ký / đăng nhập; luồng login đọc `Auth` và `token` |
| `POST` | `/user/update/:id` | Cập nhật tài khoản với Bearer token |
| `GET` | `/user/my-product`, `/user/product/:id` | Danh sách / dữ liệu sửa sản phẩm với Bearer token |
| `POST` | `/user/product/add`, `/user/product/update/:id` | `FormData` và Bearer token; lỗi form đọc từ `errors` |
| `GET` | `/user/product/delete/:id` | Xóa sản phẩm với Bearer token |
| `GET` | `/blog`, `/blog/detail/:id` | Danh sách trong `blog.data`; chi tiết trong `data`, gồm `comment` |
| `POST` | `/blog/comment/:id` | Nội dung, ID người dùng, ID cha, avatar và Bearer token; nhận bình luận mới trong `data` |
| `GET`, `POST` | `/blog/rate/:id` | Lấy đánh giá / gửi `user_id`, `blog_id`, `rate` với Bearer token |

## Kết quả kiểm tra

Kiểm tra ngày **16/11/2026**, trên mã nguồn ứng dụng không thay đổi so với `62a7dc0`, với các dependency sẵn có trong workspace:

| Lệnh | Kết quả thực tế |
| --- | --- |
| `npm.cmd run build` | **Chưa thành công:** `Attempted import error: 'React' is not exported from 'react' (imported as 'React').` Các file Login, Register và Rate có cách import named `React` cần được sửa trước khi kiểm tra tiếp. |
| `$env:CI = 'true'; npm.cmd test -- --watchAll=false --runInBand` | **Chưa thành công:** Jest không tìm được module `react-router/dom` từ `react-router-dom/dist/index.js`; 1 test suite lỗi trước khi chạy test. |

[App.test.js](src/App.test.js) vẫn là test mẫu tìm chữ “learn react”, chưa phù hợp giao diện hiện tại và chưa bọc các provider mà ứng dụng sử dụng. Repo chưa có test nghiệp vụ cho CRUD, giỏ hàng hoặc bình luận. Chưa thực hiện kiểm thử end-to-end với backend, kiểm tra responsive trên thiết bị hay xác minh demo công khai; tài liệu này không kèm ảnh chụp runtime.

## Giới hạn hiện tại và hướng phát triển

- Sửa lỗi build và môi trường Jest, thay test mẫu bằng các kiểm tra nghiệp vụ phù hợp.
- Hợp nhất `Cart` và `ReduxCart` thành một nguồn state. Hiện thêm từ trang chủ không đưa sản phẩm vào `/product/cart`, và thêm từ chi tiết không đưa sản phẩm vào `/checkout`.
- Hoàn thiện đặt hàng/thanh toán. Redux cart chưa có action xóa; biểu mẫu checkout và phương thức thanh toán chưa nối nghiệp vụ.
- Bổ sung bảo vệ route thành viên và đồng bộ state khi đăng xuất. Hiện header chỉ kiểm tra sự có mặt của token; `localStorage.clear()` chưa reset Redux cart và bộ đếm wishlist đang giữ trong bộ nhớ.
- Cải thiện validation số lượng, giá và phần trăm sale; thêm trạng thái loading, giỏ trống và thông báo lỗi mạng trên giao diện. Nhiều lỗi request hiện chỉ được ghi ra console.
- Nối nghiệp vụ cho tìm kiếm, lọc danh mục/brand, so sánh sản phẩm và phân trang blog; các phần này hiện là giao diện mẫu. Contact/404 có trong bộ HTML nhưng chưa được khai báo thành route React.
- Đưa API/URL ảnh về cấu hình chung, hoàn thiện liên kết menu, kiểm tra mobile, bổ sung ảnh chụp và demo sau khi chạy ổn định.

## Tác giả và ghi nguồn

- GitHub: [PhanHoang12](https://github.com/PhanHoang12).
- Giao diện tham khảo: E-Shopper, có ghi nguồn Themeum trong footer; giữ phần ghi nguồn khi sử dụng tài nguyên mẫu.
- Repository hiện chưa có file `LICENSE` riêng.

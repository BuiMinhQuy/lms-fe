# Quy Trình Thanh Toán - PayOS và Chuyển Khoản Ngân Hàng

## Tổng Quan

Tài liệu này mô tả quy trình thực hiện chức năng thanh toán cho hệ thống LMS, bao gồm 2 phương thức:
1. **Thanh toán qua PayOS** (Cổng thanh toán trực tuyến)
2. **Thanh toán chuyển khoản ngân hàng** (Bank Transfer)

---

## 1. Thanh Toán Qua PayOS

### 1.1. Tổng Quan PayOS

PayOS là cổng thanh toán đa kênh tại Việt Nam, hỗ trợ:
- Thanh toán qua QR Code
- Thanh toán qua thẻ ngân hàng
- Thanh toán qua ví điện tử (MoMo, ZaloPay, VNPay, v.v.)
- Webhook để xác nhận thanh toán tự động

### 1.2. Quy Trình Thanh Toán PayOS

#### Bước 1: Đăng Ký Tài Khoản PayOS
1. Truy cập: https://payos.vn/
2. Đăng ký tài khoản doanh nghiệp
3. Xác thực thông tin và ký hợp đồng
4. Nhận **Client ID**, **API Key**, và **Checksum Key**

#### Bước 2: Cài Đặt Backend

**2.1. Cài đặt PayOS SDK:**
```bash
npm install @payos/node
```

**2.2. Tạo file cấu hình PayOS:**
```typescript
// config/payos.config.ts
export const payosConfig = {
  clientId: process.env.PAYOS_CLIENT_ID,
  apiKey: process.env.PAYOS_API_KEY,
  checksumKey: process.env.PAYOS_CHECKSUM_KEY,
};
```

**2.3. Tạo API endpoint tạo payment link:**
```typescript
// api/payment/payos/create-payment.ts
import PayOS from '@payos/node';
import { payosConfig } from '@/config/payos.config';

const payOS = new PayOS(
  payosConfig.clientId,
  payosConfig.apiKey,
  payosConfig.checksumKey
);

export async function createPayOSPayment(orderData: {
  orderCode: number;
  amount: number;
  description: string;
  returnUrl: string;
  cancelUrl: string;
}) {
  try {
    const paymentLink = await payOS.createPaymentLink({
      orderCode: orderData.orderCode,
      amount: orderData.amount,
      description: orderData.description,
      returnUrl: orderData.returnUrl,
      cancelUrl: orderData.cancelUrl,
    });
    
    return paymentLink;
  } catch (error) {
    throw error;
  }
}
```

**2.4. Tạo API endpoint xử lý webhook:**
```typescript
// api/payment/payos/webhook.ts
import PayOS from '@payos/node';
import { payosConfig } from '@/config/payos.config';

const payOS = new PayOS(
  payosConfig.clientId,
  payosConfig.apiKey,
  payosConfig.checksumKey
);

export async function handlePayOSWebhook(webhookData: any) {
  try {
    // Xác thực webhook
    const isValid = payOS.verifyPaymentWebhookData(webhookData);
    
    if (!isValid) {
      throw new Error('Invalid webhook data');
    }
    
    // Xử lý thanh toán thành công
    if (webhookData.data.status === 'PAID') {
      // Cập nhật order trong database
      await updateOrderStatus(webhookData.data.orderCode, 'PAID');
      
      // Gửi email xác nhận
      await sendPaymentConfirmationEmail(webhookData.data.orderCode);
      
      // Cấp quyền truy cập khóa học
      await grantCourseAccess(webhookData.data.orderCode);
    }
    
    return { success: true };
  } catch (error) {
    throw error;
  }
}
```

#### Bước 3: Cài Đặt Frontend

**3.1. Thêm API endpoint vào Redux:**
```typescript
// redux/features/orders/ordersApi.ts
createPayOSPayment: builder.mutation({
  query: (orderData) => ({
    url: "payment/payos/create",
    method: "POST",
    body: orderData,
    credentials: "include" as const,
  }),
}),
```

**3.2. Tạo component thanh toán PayOS:**
```typescript
// app/components/Payment/PayOSPayment.tsx
import { useCreatePayOSPaymentMutation } from "@/redux/features/orders/ordersApi";
import { useEffect } from "react";

const PayOSPayment = ({ courseId, amount, courseName }) => {
  const [createPayOSPayment, { data: paymentData }] = useCreatePayOSPaymentMutation();
  
  const handlePayOSPayment = async () => {
    const orderCode = Date.now(); // Tạo order code unique
    
    try {
      const result = await createPayOSPayment({
        orderCode,
        amount: amount * 100, // Chuyển sang đơn vị xu (VND)
        description: `Thanh toán khóa học: ${courseName}`,
        returnUrl: `${window.location.origin}/payment/success?orderCode=${orderCode}`,
        cancelUrl: `${window.location.origin}/payment/cancel`,
      }).unwrap();
      
      // Chuyển hướng đến trang thanh toán PayOS
      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      }
    } catch (error) {
      console.error('Payment error:', error);
    }
  };
  
  return (
    <button onClick={handlePayOSPayment}>
      Thanh toán qua PayOS
    </button>
  );
};
```

**3.3. Tạo trang xử lý kết quả thanh toán:**
```typescript
// app/payment/success/page.tsx
'use client';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const orderCode = searchParams.get('orderCode');
  
  useEffect(() => {
    if (orderCode) {
      // Kiểm tra trạng thái thanh toán
      // Cập nhật UI
    }
  }, [orderCode]);
  
  return (
    <div>
      <h1>Thanh toán thành công!</h1>
      <p>Mã đơn hàng: {orderCode}</p>
    </div>
  );
}
```

### 1.3. Luồng Thanh Toán PayOS

```
1. User chọn khóa học và click "Thanh toán"
   ↓
2. Frontend gọi API tạo payment link
   ↓
3. Backend tạo order và payment link từ PayOS
   ↓
4. Frontend redirect user đến trang thanh toán PayOS
   ↓
5. User thanh toán trên PayOS (QR, thẻ, ví điện tử)
   ↓
6. PayOS gửi webhook về backend
   ↓
7. Backend xác thực và cập nhật order status
   ↓
8. Backend cấp quyền truy cập khóa học
   ↓
9. User được redirect về trang success
   ↓
10. Frontend hiển thị thông báo và cấp quyền truy cập
```

---

## 2. Thanh Toán Chuyển Khoản Ngân Hàng

### 2.1. Tổng Quan

Thanh toán chuyển khoản ngân hàng là phương thức thanh toán thủ công, yêu cầu:
- User chuyển khoản trực tiếp vào tài khoản ngân hàng
- Admin xác nhận thanh toán thủ công
- Hệ thống cấp quyền truy cập sau khi xác nhận

### 2.2. Quy Trình Thanh Toán Chuyển Khoản

#### Bước 1: Cấu Hình Thông Tin Ngân Hàng

**1.1. Tạo model lưu thông tin ngân hàng:**
```typescript
// models/BankAccount.ts
export interface BankAccount {
  bankName: string;        // Tên ngân hàng
  accountNumber: string;   // Số tài khoản
  accountHolder: string;   // Chủ tài khoản
  branch: string;         // Chi nhánh
  qrCode?: string;        // QR Code chuyển khoản
}
```

**1.2. Tạo API endpoint lấy thông tin ngân hàng:**
```typescript
// api/bank-account/get.ts
export async function getBankAccount() {
  // Lấy thông tin ngân hàng từ database hoặc config
  return {
    bankName: "Ngân hàng ABC",
    accountNumber: "1234567890",
    accountHolder: "CÔNG TY TNHH LMS",
    branch: "Chi nhánh Hà Nội",
    qrCode: "/images/bank-qr.png"
  };
}
```

#### Bước 2: Tạo Order Chờ Xác Nhận

**2.1. Tạo model Order:**
```typescript
// models/Order.ts
export interface Order {
  _id: string;
  userId: string;
  courseId: string;
  amount: number;
  paymentMethod: 'BANK_TRANSFER' | 'PAYOS' | 'STRIPE';
  status: 'PENDING' | 'PAID' | 'CANCELLED';
  transactionCode?: string;  // Mã giao dịch chuyển khoản
  createdAt: Date;
  paidAt?: Date;
}
```

**2.2. Tạo API endpoint tạo order chuyển khoản:**
```typescript
// api/orders/create-bank-transfer.ts
export async function createBankTransferOrder(orderData: {
  userId: string;
  courseId: string;
  amount: number;
}) {
  // Tạo order với status PENDING
  const order = await Order.create({
    ...orderData,
    paymentMethod: 'BANK_TRANSFER',
    status: 'PENDING',
  });
  
  return order;
}
```

#### Bước 3: Frontend - Hiển Thị Thông Tin Chuyển Khoản

**3.1. Tạo component hiển thị thông tin chuyển khoản:**
```typescript
// app/components/Payment/BankTransferPayment.tsx
import { useCreateBankTransferOrderMutation } from "@/redux/features/orders/ordersApi";
import { useState } from "react";
import QRCode from "react-qr-code";

const BankTransferPayment = ({ courseId, amount, courseName }) => {
  const [createOrder, { data: orderData }] = useCreateBankTransferOrderMutation();
  const [transactionCode, setTransactionCode] = useState("");
  const [showInstructions, setShowInstructions] = useState(false);
  
  const handleCreateOrder = async () => {
    try {
      const order = await createOrder({
        courseId,
        amount,
      }).unwrap();
      
      setShowInstructions(true);
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };
  
  const handleSubmitTransaction = async () => {
    // Gửi mã giao dịch lên server để admin xác nhận
    // await submitTransactionCode(orderData._id, transactionCode);
  };
  
  return (
    <div>
      {!showInstructions ? (
        <button onClick={handleCreateOrder}>
          Xác nhận thanh toán chuyển khoản
        </button>
      ) : (
        <div>
          <h2>Thông tin chuyển khoản</h2>
          <div>
            <p><strong>Số tài khoản:</strong> 1234567890</p>
            <p><strong>Chủ tài khoản:</strong> CÔNG TY TNHH LMS</p>
            <p><strong>Ngân hàng:</strong> Ngân hàng ABC</p>
            <p><strong>Chi nhánh:</strong> Chi nhánh Hà Nội</p>
            <p><strong>Số tiền:</strong> {formatVND(amount)}</p>
            <p><strong>Nội dung chuyển khoản:</strong> {orderData?._id}</p>
          </div>
          
          <div>
            <h3>QR Code chuyển khoản</h3>
            <QRCode value={`bank://transfer?account=1234567890&amount=${amount}&content=${orderData?._id}`} />
          </div>
          
          <div>
            <h3>Sau khi chuyển khoản</h3>
            <p>Vui lòng nhập mã giao dịch (nếu có) để chúng tôi xác nhận nhanh hơn:</p>
            <input
              type="text"
              value={transactionCode}
              onChange={(e) => setTransactionCode(e.target.value)}
              placeholder="Nhập mã giao dịch"
            />
            <button onClick={handleSubmitTransaction}>
              Gửi mã giao dịch
            </button>
          </div>
          
          <div>
            <p><strong>Lưu ý:</strong></p>
            <ul>
              <li>Vui lòng chuyển khoản đúng số tiền: {formatVND(amount)}</li>
              <li>Nội dung chuyển khoản phải chứa mã đơn hàng: {orderData?._id}</li>
              <li>Thời gian xử lý: 1-2 giờ làm việc</li>
              <li>Bạn sẽ nhận được email xác nhận khi thanh toán được xác nhận</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
```

#### Bước 4: Backend - Xác Nhận Thanh Toán (Admin)

**4.1. Tạo API endpoint admin xác nhận thanh toán:**
```typescript
// api/admin/orders/confirm-payment.ts
export async function confirmBankTransferPayment(orderId: string, adminId: string) {
  // Kiểm tra quyền admin
  const admin = await User.findById(adminId);
  if (!admin || admin.role !== 'admin') {
    throw new Error('Unauthorized');
  }
  
  // Cập nhật order status
  const order = await Order.findByIdAndUpdate(
    orderId,
    {
      status: 'PAID',
      paidAt: new Date(),
    },
    { new: true }
  );
  
  // Cấp quyền truy cập khóa học
  await User.findByIdAndUpdate(order.userId, {
    $push: { courses: order.courseId }
  });
  
  // Gửi email xác nhận
  await sendPaymentConfirmationEmail(order.userId, order);
  
  // Gửi notification
  await sendNotification(order.userId, {
    title: 'Thanh toán đã được xác nhận',
    message: `Đơn hàng ${orderId} đã được xác nhận. Bạn có thể truy cập khóa học ngay bây giờ.`
  });
  
  return order;
}
```

**4.2. Tạo trang admin quản lý orders:**
```typescript
// app/admin/orders/page.tsx
const AdminOrdersPage = () => {
  const { data: orders } = useGetAllOrdersQuery({});
  const [confirmPayment] = useConfirmBankTransferPaymentMutation();
  
  const handleConfirmPayment = async (orderId: string) => {
    if (confirm('Xác nhận thanh toán cho đơn hàng này?')) {
      await confirmPayment(orderId);
    }
  };
  
  return (
    <div>
      <h1>Quản lý đơn hàng</h1>
      <table>
        <thead>
          <tr>
            <th>Mã đơn hàng</th>
            <th>Khóa học</th>
            <th>Số tiền</th>
            <th>Phương thức</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {orders?.map(order => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.courseName}</td>
              <td>{formatVND(order.amount)}</td>
              <td>{order.paymentMethod}</td>
              <td>{order.status}</td>
              <td>
                {order.status === 'PENDING' && order.paymentMethod === 'BANK_TRANSFER' && (
                  <button onClick={() => handleConfirmPayment(order._id)}>
                    Xác nhận thanh toán
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
```

### 2.3. Luồng Thanh Toán Chuyển Khoản

```
1. User chọn khóa học và chọn "Thanh toán chuyển khoản"
   ↓
2. Frontend tạo order với status PENDING
   ↓
3. Frontend hiển thị thông tin tài khoản ngân hàng và QR Code
   ↓
4. User chuyển khoản vào tài khoản ngân hàng
   ↓
5. User nhập mã giao dịch (tùy chọn)
   ↓
6. Admin kiểm tra tài khoản và xác nhận thanh toán
   ↓
7. Backend cập nhật order status = PAID
   ↓
8. Backend cấp quyền truy cập khóa học
   ↓
9. Gửi email và notification cho user
   ↓
10. User có thể truy cập khóa học
```

---

## 3. So Sánh Hai Phương Thức

| Tiêu chí | PayOS | Chuyển Khoản Ngân Hàng |
|----------|-------|------------------------|
| Tốc độ xử lý | Tự động, ngay lập tức | Thủ công, 1-2 giờ |
| Xác nhận | Tự động qua webhook | Thủ công bởi admin |
| Tiện lợi | Cao (QR, thẻ, ví điện tử) | Trung bình (cần app ngân hàng) |
| Phí giao dịch | Có (theo PayOS) | Không (tùy ngân hàng) |
| Bảo mật | Cao | Cao |
| Phù hợp | Thanh toán nhanh | Thanh toán số tiền lớn |

---

## 4. Checklist Triển Khai

### PayOS
- [ ] Đăng ký tài khoản PayOS
- [ ] Lấy Client ID, API Key, Checksum Key
- [ ] Cài đặt PayOS SDK trên backend
- [ ] Tạo API endpoint tạo payment link
- [ ] Tạo API endpoint xử lý webhook
- [ ] Tạo component thanh toán PayOS trên frontend
- [ ] Tạo trang success/cancel
- [ ] Test thanh toán thử nghiệm
- [ ] Cấu hình webhook URL trên PayOS dashboard

### Chuyển Khoản Ngân Hàng
- [ ] Thu thập thông tin tài khoản ngân hàng
- [ ] Tạo model Order với payment method
- [ ] Tạo API endpoint tạo order chuyển khoản
- [ ] Tạo component hiển thị thông tin chuyển khoản
- [ ] Tạo QR Code chuyển khoản
- [ ] Tạo trang admin quản lý orders
- [ ] Tạo API endpoint xác nhận thanh toán
- [ ] Tạo notification system
- [ ] Test quy trình end-to-end

---

## 5. Tài Liệu Tham Khảo

- PayOS Documentation: https://payos.vn/docs/
- PayOS API Reference: https://payos.vn/docs/api-reference/
- PayOS Webhook Guide: https://payos.vn/docs/webhook/

---

## 6. Lưu Ý Quan Trọng

1. **Bảo mật**: Luôn lưu trữ API keys trong biến môi trường, không commit vào git
2. **Webhook**: Đảm bảo webhook URL là HTTPS và có thể truy cập công khai
3. **Xác thực**: Luôn xác thực webhook data trước khi xử lý
4. **Idempotency**: Xử lý trường hợp webhook bị gửi nhiều lần
5. **Error Handling**: Xử lý lỗi đầy đủ và ghi log để debug
6. **Testing**: Test kỹ với PayOS sandbox trước khi deploy production



/**
 * Format số tiền sang định dạng VND (Việt Nam Đồng)
 * @param amount - Số tiền cần format (có thể là số hoặc string)
 * @param showCurrency - Có hiển thị ký hiệu "đ" hay không (mặc định: true)
 * @returns String đã được format (ví dụ: "1.000.000 đ" hoặc "1.000.000")
 */
export const formatVND = (amount: number | string | undefined | null, showCurrency: boolean = true): string => {
    if (amount === undefined || amount === null || amount === "") {
        return showCurrency ? "0 đ" : "0";
    }

    // Chuyển đổi sang number nếu là string
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;

    // Kiểm tra nếu không phải là số hợp lệ
    if (isNaN(numAmount)) {
        return showCurrency ? "0 đ" : "0";
    }

    // Format số với dấu chấm phân cách hàng nghìn
    const formatted = new Intl.NumberFormat("vi-VN").format(numAmount);

    return showCurrency ? `${formatted} đ` : formatted;
};

/**
 * Format số với dấu chấm phân cách hàng nghìn (không có ký hiệu đ)
 * @param value - Giá trị cần format (string hoặc number)
 * @returns String đã được format (ví dụ: "100.000")
 */
export const formatNumberWithDots = (value: string | number | undefined | null): string => {
    if (value === undefined || value === null || value === "") {
        return "";
    }

    // Loại bỏ tất cả các ký tự không phải số
    const numericValue = String(value).replace(/[^\d]/g, "");

    if (numericValue === "") {
        return "";
    }

    // Format với dấu chấm phân cách hàng nghìn
    return new Intl.NumberFormat("vi-VN").format(parseInt(numericValue));
};

/**
 * Chuyển đổi giá trị đã format về số thuần (loại bỏ dấu chấm)
 * @param formattedValue - Giá trị đã format (ví dụ: "100.000")
 * @returns Số thuần (ví dụ: 100000)
 */
export const parseFormattedNumber = (formattedValue: string): number => {
    if (!formattedValue) return 0;
    // Loại bỏ tất cả các ký tự không phải số
    const numericString = formattedValue.replace(/[^\d]/g, "");
    return numericString === "" ? 0 : parseInt(numericString, 10);
};

/**
 * Chuyển đổi từ USD sang VND (tỷ giá mặc định: 1 USD = 25,000 VND)
 * @param usdAmount - Số tiền USD
 * @param exchangeRate - Tỷ giá (mặc định: 25000)
 * @returns Số tiền VND
 */
export const convertUSDToVND = (usdAmount: number, exchangeRate: number = 25000): number => {
    return Math.round(usdAmount * exchangeRate);
};

/**
 * Format số tiền VND từ USD
 * @param usdAmount - Số tiền USD
 * @param exchangeRate - Tỷ giá (mặc định: 25000)
 * @param showCurrency - Có hiển thị ký hiệu "đ" hay không
 * @returns String đã được format
 */
export const formatUSDToVND = (
    usdAmount: number,
    exchangeRate: number = 25000,
    showCurrency: boolean = true
): string => {
    const vndAmount = convertUSDToVND(usdAmount, exchangeRate);
    return formatVND(vndAmount, showCurrency);
};


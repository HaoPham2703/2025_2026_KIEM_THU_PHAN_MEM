#include <iostream>
#include <string>

using namespace std;

int f1(int x) {
    if (x > 10) {
        return 2 * x;
    } else if (x > 0) {
        return -x;
    } else {
        return 2 * x;
    }
}

int main(int argc, char* argv[]) {
    // Kiểm tra xem người dùng có nhập tham số dòng lệnh hay không
    if (argc < 2) {
        cout << "Vui long nhap tham so x" << endl;
        return 1;
    }

    // Chuyển đổi tham số dòng lệnh từ chuỗi sang số nguyên
    int x = stoi(argv[1]);

    // Gọi hàm f1 và in kết quả
    cout << f1(x) << endl;

    return 0;
}
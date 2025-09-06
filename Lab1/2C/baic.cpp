#include <iostream>
using namespace std;

int f2(int x) {
    if (x < 10)
        return 2 * x;
    else if (x < 2)   // dead code: điều kiện này sẽ không bao giờ chạy
                            // Chỉ được xét khi x >= 10. Nhưng khi đã x >= 10 thì x < 2 luôn sai.
                             //⇒ Nhánh này không bao giờ được thực thi → dead code.
        return -x;
    else
        return 2 * x;
}

int main(int argc, char* argv[]) {
    if (argc < 2) {
        cout << "Vui long nhap tham so x" << endl;
        return 1;
    }

    int x = stoi(argv[1]);
    cout << f2(x) << endl;
    return 0;
}
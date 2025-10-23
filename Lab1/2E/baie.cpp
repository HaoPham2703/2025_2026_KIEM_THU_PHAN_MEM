#include <iostream>
#include <cstdlib> // để dùng atoi
using namespace std;

int findMax(int num1, int num2, int num3) {
    int max = 0;
    if ((num1 > num2) && (num1 > num3))
        max = num1;
    if ((num2 > num1) && (num2 > num3))
        max = num2;
    if ((num3 > num1) && (num3 > num2))
        max = num3;
    return max;
}

int main(int argc, char* argv[]) {
    if (argc != 4) {
        cout << "Usage: " << argv[0] << " num1 num2 num3" << endl;
        return 1;
    }

    // Chuyển tham số chuỗi sang số nguyên
    int a = atoi(argv[1]);
    int b = atoi(argv[2]);
    int c = atoi(argv[3]);

    int maxVal = findMax(a, b, c);
    cout << "So lon nhat la: " << maxVal << endl;

    return 0;
}
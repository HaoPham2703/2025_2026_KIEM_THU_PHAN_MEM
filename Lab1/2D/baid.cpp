


#include <iostream>
#include <cmath>
using namespace std;

int f3(int x) {
    if (log(x * x * cos(x)) < 3 * x)
        return 2 * x;
    else
        return 2 * x;
}

int main(int argc, char* argv[]) {
    if (argc < 2) {
        cout << "Vui long nhap tham so x" << endl;
        return 1;
    }

    int x = stoi(argv[1]);
    cout << f3(x) << endl;
    return 0;
}

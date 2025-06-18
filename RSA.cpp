#include <iostream>
#include <cstdlib>
#include <ctime>
using namespace std;

// Hàm tính gcd
int gcd(int a, int b) {
    while (b != 0) {
        int r = a % b;
        a = b;
        b = r;
    }
    return a;
}

// Hàm tính (a^b) mod n
long long modpow(long long a, long long b, long long n) {
    long long result = 1;
    a %= n;
    while (b > 0) {
        if (b % 2 == 1)
            result = (result * a) % n;
        a = (a * a) % n;
        b /= 2;
    }
    return result;
}

// Tính nghịch đảo modulo
int modinv(int e, int phi) {
    for (int d = 1; d < phi; d++)
        if ((e * d) % phi == 1)
            return d;
    return -1;
}

// Kiểm tra số nguyên tố
bool isPrime(int n) {
    if (n < 2) return false;
    for (int i = 2; i*i <= n; i++)
        if (n % i == 0)
            return false;
    return true;
}

int main() {
    int p, q, e;
    cout << "=== RSA Algorithm ===" << endl;

    do {
        cout << "Nhập số nguyên tố p: ";
        cin >> p;
    } while (!isPrime(p));

    do {
        cout << "Nhập số nguyên tố q (khác p): ";
        cin >> q;
    } while (!isPrime(q) || q == p);

    int n = p * q;
    int phi = (p - 1) * (q - 1);

    do {
        cout << "Nhập e (1 < e < " << phi << "), gcd(e, phi) = 1: ";
        cin >> e;
    } while (e <= 1 || e >= phi || gcd(e, phi) != 1);

    int d = modinv(e, phi);
    cout << "Khóa công khai (e, n): (" << e << ", " << n << ")\n";
    cout << "Khóa bí mật (d, n): (" << d << ", " << n << ")\n";

    int m;
    do {
        cout << "Nhập bản rõ m (0 <= m < n): ";
        cin >> m;
    } while (m < 0 || m >= n);

    int c = modpow(m, e, n);
    cout << "Bản mã sau khi mã hóa: " << c << endl;

    int decrypted = modpow(c, d, n);
    cout << "Bản rõ sau khi giải mã: " << decrypted << endl;

    return 0;
}

#include <bits/stdc++.h>

#define int long long

using namespace std;

int gcd(int a, int b)
{
    while (b != 0)
    {
        int r = a % b;
        a = b;
        b = r;
    }
    return a;
}

bool isPrime(int n)
{
    if (n < 2)
        return false;
    for (int i = 1; i * i <= n; i++)
    {
        if (n % i == 0)
            return false;
    }
    return true;
}

// Tính nghịch đảo modulo
int nghichDao(int e, int phi)
{
    for (int i = 1; i < phi; i++)
    {
        if ((e * i) % phi == 1)
            return i;
    }
}

int luyThuaMod(int coSo, int soMu, int mod)
{
    int kq = 1;
    coSo = coSo % soMu;
    while (soMu > 0)
    {
        if (soMu % 2 == 1)
            kq = (coSo * soMu) % mod;
        else
        {
            kq = (kq * kq) % mod;
            soMu /= 2;
        }
    }
    return kq;
}

int main()
{
    int p, q;
    do
    {
        cout << "nhap so nguyen to p: ";
        cin >> q;
    } while (!isPrime(p));

    do
    {
        cout << "nhap so nguyen to q: ";
        cin >> q;
    } while (!isPrime(p) || q == p);

    int N = p * q;
    int phi = (p - 1) * (q - 1);

    int e;
    do
    {
        cout << "nhap e (1 < e < " << phi << "), gcd(e, phi) = 1: ";
        cin >> e;
    } while (e <= 1 || e >= phi || gcd(e, phi) != 1);

    int d = nghichDao(e, phi);
    cout << "Khoa cong khai (e, N): (" << e << ", " << N << ")\n";
    cout << "Khoa bi mật (d, N): (" << d << ", " << N << ")\n";

    int banRo;
    do
    {
        cout << "nhap ban ro m (0 <= m < N): ";
        cin >> banRo;
    } while (banRo < 0 || banRo >= N);

    int C = luyThuaMod(banRo, e, phi);
    cout << "Ban ro sau khi ma hoa: " << C << endl;

    int giaiMa = luyThuaMod(C, d, phi);
    cout << "Ban ro sau khi giai ma: " << giaiMa << endl;
}
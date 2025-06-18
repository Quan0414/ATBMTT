#include <bits/stdc++.h>
#define int long long
using namespace std;

bool isPrime(int n)
{
    if (n<2) return false;
    for(int i = 2; i*i <= n; i++)
    {
        if(n % i == 0) return false;
    }
    return true;
}

int luyThuaMod(int a, int b, int mod)
{
    int kq = 1;
    a %= mod; // Giảm a về mod
    while(b>0)
    {
        if(b%2 == 1)
        {
            kq = (kq*a) % mod;
        }
        a = (a*a) % mod;
        b /= 2;
    }
    return kq;
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


signed main()
{
    int q; 
    do
    {
        cout<<"nhap so nguyen to q: ";
        cin>>q;        
    } while(!isPrime(q));

    int g;
    do
    {
        cout<<"nhap so nguyen to g (1 < g < " << q << "): : ";
        cin>>q;        
    } while(!isPrime(q));

    int x = rand() % (q - 2) + 1;
    
    int h = luyThuaMod(g, x, q);
    cout << "Public key (q, g, h): (" << q << ", " << g << ", " << h << ")\n";
    cout << "Private key x: " << x << endl;

    int m;
    do
    {
        cout << "Nhap thong diep m (0 <= m < " << q << "): ";
        cin >> m;
    } while(m < 0 || m >= q);

    srand(time(0));
    int k = rand() % (q - 2) + 1;
    int p = luyThuaMod(g, k, q);
    int s = luyThuaMod(h, k, q);
    int c = (s * m) % q;
    cout << "Ciphertext: (" << p << ", " << c << ")\n";

    int s_inv = nghichDao(s, q);

    int decrypted = (c * s_inv) % q;
    cout << "Ban ro sau khi giai ma: " << decrypted << endl;
    
}
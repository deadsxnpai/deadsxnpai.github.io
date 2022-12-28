#include <iostream>
                using namespace std;
                
                int main()
                {
                setlocale(0, "");
                double num;
                int k;
                    
                cout << "Введите произвольное число: \n";
                num = 15;
                    
                if (num < 10) {  // Если введенное число меньше 10.
                    cout << "Это число меньше 10." << endl;
                    k = 1;
                } else if (num == 10) {
                    cout << "Это число равно 10." << endl;
                    k = 2;
                } else {  // иначе
                    cout << "Это число больше 10." << endl;
                    k = 3;
                }
            
                    cout << "k = " << k << endl;
                    return 0;
                }
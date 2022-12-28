#include <iostream>
            using namespace std;
            
            int main()
            {
                setlocale(0, "");
                double num = 11;
            
                if (num < 10) { // Если введенное число меньше 10.
                    cout << "Это число меньше 10." << endl;
                } else { // иначе
                    cout << "Это число больше либо равно 10." << endl;
                }
                return 0;
            }
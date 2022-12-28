#include <iostream>
                #include <string>
                
                int main()
                {
                    std::string students[10] = {
                        "Иванов", "Петров", "Сидоров",
                        "Ахмедов", "Ерошкин", "Выхин",
                        "Андеев", "Вин Дизель", "Картошкин", "Чубайс"
                    };  
                    for (int i = 0; i < 10; i++) {
                        std::cout << students[i] << std::endl;
                    }
                
                    return 0;
                }
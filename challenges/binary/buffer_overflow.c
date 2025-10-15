<<<<<<< HEAD
#include <stdio.h>
#include <string.h>

void win() {
    printf("flag{binary_medium}\n");
}

void vuln() {
    char buf[64];
    printf("Enter your input: ");
    gets(buf);
}

int main() {
    vuln();
    return 0;
}
=======
#include <stdio.h>
#include <string.h>

void win() {
    printf("flag{binary_medium}\n");
}

void vuln() {
    char buf[64];
    printf("Enter your input: ");
    gets(buf);
}

int main() {
    vuln();
    return 0;
}
>>>>>>> 6cd235d1aad7beabbda8b99226829b9b92fef45b

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

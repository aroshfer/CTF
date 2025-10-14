#include <stdio.h>
#include <stdlib.h>

void print_flag() {
    printf("flag{binary_hard}\n");
}

int main() {
    char buf[64];
    printf("Enter your input: ");
    fgets(buf, 64, stdin);
    printf(buf);
    return 0;
}

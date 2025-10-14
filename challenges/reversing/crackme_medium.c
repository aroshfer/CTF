#include <stdio.h>
#include <string.h>

int main() {
    char input[32];
    printf("Enter the password: ");
    scanf("%31s", input);
    if (strcmp(input, "letmein123") == 0) {
        printf("flag{reversing_medium}\n");
    } else {
        printf("Wrong password.\n");
    }
    return 0;
}

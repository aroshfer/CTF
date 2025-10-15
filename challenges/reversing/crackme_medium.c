<<<<<<< HEAD
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
=======
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
>>>>>>> 6cd235d1aad7beabbda8b99226829b9b92fef45b

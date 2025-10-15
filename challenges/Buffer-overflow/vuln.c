<<<<<<< HEAD
// vuln.c
// Beginner stack buffer overflow challenge (educational)
// This version suppresses the -Wstringop-overflow warning locally.

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

void print_banner(void){
    puts("==== Stack Beginner - Overflow 1 ====");
    puts("Welcome to the lab. Provide your input when prompted.");
    puts("--------------------------------------");
}

void print_flag(void){
    FILE *f = fopen("/flag.txt", "r");
    if (!f) {
        puts("flag not found");
        return;
    }
    char buf[256];
    if (fgets(buf, sizeof(buf), f)) {
        printf("FLAG: %s\n", buf);
    }
    fclose(f);
}

void vuln(void){
    char buffer[64];
    ssize_t n;

    puts("Enter your name:");

    /* suppress the specific overflow warning around this intentional read */
    #pragma GCC diagnostic push
    #pragma GCC diagnostic ignored "-Wstringop-overflow"
    n = read(STDIN_FILENO, buffer, 1024);  /* intentionally larger than buffer for CTF lab */
    #pragma GCC diagnostic pop

    /* read() does not NUL-terminate; ensure NUL if input fits */
    if (n > 0) {
        if (n < (ssize_t)sizeof(buffer)) buffer[n] = '\0';
        else buffer[sizeof(buffer) - 1] = '\0'; /* place a NUL in-bounds (keeps printf safe) */
    } else {
        buffer[0] = '\0';
    }

    printf("Hello, %s\n", buffer);
}

int main(void){
    /* make stdout unbuffered for nicer interactive behaviour in CTF contexts */
    setvbuf(stdout, NULL, _IONBF, 0);
    print_banner();
    vuln();
    puts("Goodbye.");
    return 0;
}
=======
// vuln.c
// Beginner stack buffer overflow challenge (educational)
// This version suppresses the -Wstringop-overflow warning locally.

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

void print_banner(void){
    puts("==== Stack Beginner - Overflow 1 ====");
    puts("Welcome to the lab. Provide your input when prompted.");
    puts("--------------------------------------");
}

void print_flag(void){
    FILE *f = fopen("/flag.txt", "r");
    if (!f) {
        puts("flag not found");
        return;
    }
    char buf[256];
    if (fgets(buf, sizeof(buf), f)) {
        printf("FLAG: %s\n", buf);
    }
    fclose(f);
}

void vuln(void){
    char buffer[64];
    ssize_t n;

    puts("Enter your name:");

    /* suppress the specific overflow warning around this intentional read */
    #pragma GCC diagnostic push
    #pragma GCC diagnostic ignored "-Wstringop-overflow"
    n = read(STDIN_FILENO, buffer, 1024);  /* intentionally larger than buffer for CTF lab */
    #pragma GCC diagnostic pop

    /* read() does not NUL-terminate; ensure NUL if input fits */
    if (n > 0) {
        if (n < (ssize_t)sizeof(buffer)) buffer[n] = '\0';
        else buffer[sizeof(buffer) - 1] = '\0'; /* place a NUL in-bounds (keeps printf safe) */
    } else {
        buffer[0] = '\0';
    }

    printf("Hello, %s\n", buffer);
}

int main(void){
    /* make stdout unbuffered for nicer interactive behaviour in CTF contexts */
    setvbuf(stdout, NULL, _IONBF, 0);
    print_banner();
    vuln();
    puts("Goodbye.");
    return 0;
}
>>>>>>> 6cd235d1aad7beabbda8b99226829b9b92fef45b

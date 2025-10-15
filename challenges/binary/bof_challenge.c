<<<<<<< HEAD
// Simple buffer overflow demo — expects <=64 bytes, will print flag when return overwritten.
#include <stdio.h>
#include <string.h>

void win(){
    printf("Well done! flag{bin_bof_@llbin}\n");
}

void vuln(){
    char buf[64];
    printf("Enter data: ");
    fgets(buf, 256, stdin); // intentionally vulnerable
    printf("You entered: %s\n", buf);
}

int main(){
    setbuf(stdout, NULL);
    vuln();
    return 0;
}
=======
// Simple buffer overflow demo — expects <=64 bytes, will print flag when return overwritten.
#include <stdio.h>
#include <string.h>

void win(){
    printf("Well done! flag{bin_bof_@llbin}\n");
}

void vuln(){
    char buf[64];
    printf("Enter data: ");
    fgets(buf, 256, stdin); // intentionally vulnerable
    printf("You entered: %s\n", buf);
}

int main(){
    setbuf(stdout, NULL);
    vuln();
    return 0;
}
>>>>>>> 6cd235d1aad7beabbda8b99226829b9b92fef45b

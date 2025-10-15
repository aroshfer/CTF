# Makefile - build vuln binary (CTF mode)
CC = gcc
CFLAGS = -Wall -Wextra -g -fno-stack-protector -z execstack -no-pie

all: vuln

vuln: vuln.c
	$(CC) $(CFLAGS) -o vuln vuln.c

clean:
	rm -f vuln

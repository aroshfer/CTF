import hashlib

# Find two different strings with the same MD5 hash.
# Submit both strings to get the flag.

def check_collision(a, b):
    if a != b and hashlib.md5(a.encode()).hexdigest() == hashlib.md5(b.encode()).hexdigest():
        print("flag{crypto_hard_$c@ll3ng3}")
    else:
        print("Try again.")

# Example usage:
# check_collision('string1', 'string2')

<<<<<<< HEAD
def f(x):
    return ''.join([chr(ord(c)^42) for c in x])

enc = "O]Z\\Z]Z^_\\Z]Z\\"
print("Enter the key:")
key = input()
if f(key) == enc:
    print("flag{reversing_hard}")
else:
    print("Try again.")
=======
def f(x):
    return ''.join([chr(ord(c)^42) for c in x])

enc = "O]Z\\Z]Z^_\\Z]Z\\"
print("Enter the key:")
key = input()
if f(key) == enc:
    print("flag{reversing_hard}")
else:
    print("Try again.")
>>>>>>> 6cd235d1aad7beabbda8b99226829b9b92fef45b

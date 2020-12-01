import sys

def fizzbuzz(max_int):
    ans = str()
    for i in range(max_int+1):
        if i % 3 == 0 and i % 5 == 0:
            ans = ans + "fizzbuzz"
            continue
        elif i % 3 == 0:
            ans = ans + "fizz"
            continue
        elif i % 5 == 0:
            ans = ans + "buzz"
            continue
        ans = ans + str(i)
    return ans

if __name__ == '__main__':
    if len(sys.argv) > 1:
        print(fizzbuzz(int(sys.argv[1])))
    else:
        print(fizzbuzz(100))
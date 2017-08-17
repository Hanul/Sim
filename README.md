# Sim
JavaScript로 컴파일되는 심플한 언어
* 키워드가 극히 적음 (단 8개 - `let`, `true`, `false`, `undef`, `if`, `else`, `for`, `in`)
* 문자열은 무조건 `'`으로 감싸며 `"`는 쓰지 않음
* 라인의 끝에는 `;`를 쓰지 않음
* `,`를 쓰지 않음
* 탭으로 코드 블럭 표현
* [SON 표현식](https://github.com/Hanul/SON) 사용

## let
```sim
let a = 123
let b = 'abc'
let c = true
let array = [1 2 3]
c = false
```

## if / else
```sim
if a == 1
    console.log('a is 1.')
else
    console.log('a is not 1.')
```

## true / false
```sim
a = false
if a == true
    console.log('a is true.')
```

## for / in
```
for a == true
    console.log('a is true?')
for a in 1 ~ 10
    console.log(a)
for value in array
    console.log(value)
for index value in array
    console.log(index value)
for name value in data
    console.log(name value)
```

## 함수
```sim
let func = (a b c)
    a + b + c

console.log(func(1 2 3) + 3)
```

끝! 다 배웠습니다.

## 기타
### [SON 표현식](https://github.com/Hanul/SON)
대입 연산자(`=`) 이후 아무런 내용이 없으면 그 아래 줄부터 SON 표현식이 시작됩니다.
```
let son =
	a 123
	b 'abc'
	c true

son.d = false
```

### 내장함수
Sim에는 단 1개의 내장함수만 있습니다.
#### import
```
let module = import('module.sim')
let js_module = import('module.js')
```

### 객체
[SON 표현식](https://github.com/Hanul/SON)을 사용해서 쉽게 객체를 만들 수 있습니다.
```
let object =
	a 123
	b 'abc'
	c true
```

## 예제
피보나치 수열
```
let fib = (n)
    if n <= 2
        1
    else
        fib(n - 1) + fib(n - 2)
```
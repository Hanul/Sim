# Sim
JavaScript로 컴파일되는 심플한 언어
* 키워드가 극히 적음 (단 8개 - `let`, `true`, `false`, `undef`, `if`, `else`, `for`, `in`)
* 문자열은 무조건 `'`으로 감싸며 `"`는 쓰지 않음
* 라인의 끝에는 `;`를 쓰지 않음
* 탭으로 코드 블럭 표현
* [SON 표현식](https://github.com/Hanul/SON) 사용

## let
```sim
let a = 123
let b = 'abc'
let c = true
let array = [1, 2, 3]
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
```sim
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
let func = (a, b, c)
    a + b + c

console.log(func(1, 2, 3) + 3)
```

## [SON 표현식](https://github.com/Hanul/SON)
대입 연산자(`=`) 이후 아무런 내용이 없으면 그 아래 줄부터 SON 표현식이 시작됩니다. 이를 통해 쉽게 객체를 생성할 수 있습니다.
```sim
let son =
	a 123
	b 'abc'
	c true

son.d = false
```

## import
`import`는 Sim에 존재하는 유일한 내장함수입니다.
```sim
let module = import('module.sim')
let js_module = import('module.js')
```

## 주석
```sim
# 안녕하세요. 주석입니다.
let a = 1
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

## 라이센스
[MIT](LICENSE)

## 작성자
[Young Jae Sim](https://github.com/Hanul)
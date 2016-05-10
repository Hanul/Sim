# Sim
JavaScript로 컴파일되는 심플한 언어
* 키워드가 극히 적음 (7개)
* 문자열은 무조건 `'`으로 감싸며 `"`는 쓰지 않음
* 라인의 끝에는 `;`를 쓰지 않음
* 코드 블럭은 맨 앞에 탭 필수

## var
```sim
var a = 123
var b = 'abc'
var c = true
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
for name value in json
    console.log(name value)
```

## 함수
```sim
var func = (a b c)
    a + b + c

console.log(func(1 2 3) + 3)
```

끝! 다 배웠습니다.

## 기타
### JSON
JSON 표현식은 JavaScript의 그것과 완전히 동일하나, `,` 대신에 줄바꿈을 합니다.
```sim
var json = {
    a : 123
    b : 'abc'
    c : true
}

json.d = false
```

### 내장함수
Sim에는 단 2개의 내장함수만 있습니다.
#### import
```
var module = import('module.sim')
var js_module = import('module.js')
```
#### copy
```
var array2 = copy(array)
var object2 = copy(object)
```

### 객체
JSON 표현식을 사용해서 쉽게 객체를 만들 수 있습니다.
```
var object = {}
object.a = 123
object.b = 'abc'
object.c = true
```

### 클래스?
Sim에는 클래스가 없습니다. 그냥 객체를 복사하면 됩니다.
```
var object2 = copy(object)
```

## 예제
피보나치 수열
```
var fib = (n)
    if n <= 2
        1
    else
        fib(n - 1) + fib(n - 2)
```
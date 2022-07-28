# miniurl

## 사용법
42 로그인 후 url 서비스 이용 가능
1. 브라우저에서 miniurl2.herokuapp.com/login 으로 이동 후 42 로그인
2. jwt 토큰 복사
3. 포스트맨 이용

## 포스트맨 사용법
>헤더에 Authorization: Bearer [jwt] 추가 후 이용

### url 서비스
- `GET miniurl2.herokuapp.com/url/all`
	- url 목록 확인

- `POST miniurl2.herokuapp.com/url`
	```json
	{
		"url": "https://github.com"
	}
	```
	- body에 줄이고 싶은 url 추가해서 POST 요청 보내면 짧아진 url 리턴
	- http로 시작하는 형식만 가능

- shortened url 주소창에 입력하면 원본 주소로 리다이렉트

### user 서비스
`GET miniurl2.herokuapp.com/users/all`
- 전체 유저 목록 확인

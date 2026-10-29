# factory-scratch

A throwaway repository the factory kit is proven on. The code is a small
message gateway: a rate limiter, a text formatter, signed tokens and an
outbound sender. Nothing here runs anywhere.

## Gửi tin

Mỗi người nhận có giới hạn số tin trong một khoảng thời gian (`src/ratelimit.js`).

## Định dạng

`squash` gộp khoảng trắng; `truncate` cắt chữ mà không tách emoji.

## Token

`src/auth/token.js` ký `<người nhận>.<hết hạn>.<hmac>` bằng khoá của gateway.

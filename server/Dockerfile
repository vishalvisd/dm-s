FROM golang:1.22-alpine  AS builder
RUN apk add build-base
WORKDIR /src
COPY . .
RUN go mod download
RUN CGO_ENABLED=1 GOOS=linux go build -o /app -a -ldflags '-linkmode external -extldflags "-static"' .

FROM debian:buster-slim
COPY --from=builder /app /app
EXPOSE 8080

ENTRYPOINT ["/app"]

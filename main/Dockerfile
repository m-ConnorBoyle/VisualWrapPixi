# Start from the official Golang image to build our binary.
FROM golang:1.16 as builder

# Set the working directory inside the container.
WORKDIR /app

# Copy the source code from the current directory to the Working Directory inside the container.
COPY . .

# Build the Go app (adjust the path to your source files as necessary).
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o myapp .

# Start a new stage from scratch for a smaller, final image.
FROM alpine:latest  
RUN apk --no-cache add ca-certificates

# Set the working directory inside the container.
WORKDIR /root/

# Copy the pre-built binary file from the previous stage.
COPY --from=builder /app/myapp .

# Copy static files.
COPY --from=builder /app/static /root/static

# Expose the port the app runs on.
EXPOSE 8080

# Command to run the executable.
CMD ["./myapp"]

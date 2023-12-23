package main

import (
    "net/http"
    "log"
    "os"
    "strings"
)

func main() {
    // Serve the main HTML page
    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        if r.URL.Path != "/" {
            http.NotFound(w, r)
            return
        }

        html, err := os.ReadFile("static/html/index.html")
        if err != nil {
            http.Error(w, "Could not read template", http.StatusInternalServerError)
            return
        }
        w.Write(html)
    })

    // Custom handler for static files to set correct Content-Type
    staticHandler := http.StripPrefix("/static/", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        // Setting Content-Type for .js and .css files
        if strings.HasSuffix(r.URL.Path, ".js") {
            w.Header().Set("Content-Type", "application/javascript")
        } else if strings.HasSuffix(r.URL.Path, ".css") {
            w.Header().Set("Content-Type", "text/css")
        } else if strings.HasSuffix(r.URL.Path, ".woff2") {
            w.Header().Set("Content-Type", "font/woff2")
        } else if strings.HasSuffix(r.URL.Path, ".otf") {
            w.Header().Set("Content-Type", "font/otf")
        }

        // Serve file only if it's not a JS, CSS, or font file
        // Or if the correct Content-Type has been set
        http.FileServer(http.Dir("static")).ServeHTTP(w, r)
    }))

    http.Handle("/static/", staticHandler)

    // Start the server
    log.Println("Server started at http://localhost:8080")
    err := http.ListenAndServe(":8080", nil)
    if err != nil {
        log.Fatal("ListenAndServe: ", err)
    }
}

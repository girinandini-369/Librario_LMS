package com.librario.controller;

import com.librario.model.Book;
import com.librario.repository.BookRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/books")
public class BookController {

    private final BookRepository bookRepository;

    public BookController(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    // Both ADMIN and MEMBER can view books
    @GetMapping
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    // ADMIN only - enforced in SecurityConfig
    @PostMapping
    public ResponseEntity<?> addBook(@RequestBody Book book) {
        if (book.getTitle() == null || book.getAuthor() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Title and author are required"));
        }
        Book saved = bookRepository.save(book);
        return ResponseEntity.ok(saved);
    }

    // ADMIN only - enforced in SecurityConfig
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBook(@PathVariable Long id) {
        if (!bookRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        bookRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Book deleted"));
    }
}

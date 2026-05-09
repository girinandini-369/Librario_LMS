package com.librario.controller;

import com.librario.model.Transaction;
import com.librario.repository.TransactionRepository;
import com.librario.repository.UserRepository;
import com.librario.security.JwtUtil;
import com.librario.service.TransactionService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public TransactionController(TransactionService transactionService,
                                  TransactionRepository transactionRepository,
                                  UserRepository userRepository,
                                  JwtUtil jwtUtil) {
        this.transactionService = transactionService;
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    // Issue a book - member issues book to themselves
    @PostMapping("/issue")
    public ResponseEntity<?> issueBook(@RequestBody Map<String, Long> request, HttpServletRequest httpRequest) {
        try {
            Long bookId = request.get("bookId");
            Long userId = getUserIdFromRequest(httpRequest);
            Transaction t = transactionService.issueBook(userId, bookId);
            return ResponseEntity.ok(t);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // Return a book
    @PostMapping("/return")
    public ResponseEntity<?> returnBook(@RequestBody Map<String, Long> request, HttpServletRequest httpRequest) {
        try {
            Long bookId = request.get("bookId");
            Long userId = getUserIdFromRequest(httpRequest);
            Transaction t = transactionService.returnBook(userId, bookId);
            return ResponseEntity.ok(t);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // View my transactions (member sees own, admin sees all)
    @GetMapping("/my")
    public ResponseEntity<?> myTransactions(HttpServletRequest httpRequest) {
        Long userId = getUserIdFromRequest(httpRequest);
        List<Transaction> list = transactionRepository.findByUserId(userId);
        return ResponseEntity.ok(list);
    }

    // ADMIN: view all active (not returned) transactions
    @GetMapping("/active")
    public ResponseEntity<?> activeTransactions(HttpServletRequest httpRequest) {
        String role = getRoleFromRequest(httpRequest);
        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(403).body(Map.of("message", "Access denied"));
        }
        return ResponseEntity.ok(transactionRepository.findByReturnDateIsNull());
    }

    // Helper: extract user id from JWT
    private Long getUserIdFromRequest(HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        String email = jwtUtil.getEmailFromToken(token);
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
    }

    private String getRoleFromRequest(HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        return jwtUtil.getRoleFromToken(token);
    }
}

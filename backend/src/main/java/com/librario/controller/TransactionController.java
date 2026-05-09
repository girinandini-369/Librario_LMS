package com.librario.controller;

import com.librario.model.Transaction;
import com.librario.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "*")
public class TransactionController {
    @Autowired
    private TransactionService transactionService;

    @PostMapping("/issue")
    public Transaction issueBook(@RequestBody Map<String, Long> request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return transactionService.issueBook(email, request.get("bookId"));
    }

    @PostMapping("/return")
    public Transaction returnBook(@RequestBody Map<String, Long> request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return transactionService.returnBook(email, request.get("bookId"));
    }

    @GetMapping("/my-books")
    public java.util.List<Transaction> getMyBooks() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return transactionService.getActiveTransactions(email);
    }
}

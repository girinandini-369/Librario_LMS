package com.librario.service;

import com.librario.model.Book;
import com.librario.model.Transaction;
import com.librario.model.User;
import com.librario.repository.BookRepository;
import com.librario.repository.TransactionRepository;
import com.librario.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
public class TransactionService {
    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private UserRepository userRepository;

    private static final int DUE_DAYS = 14;
    private static final double FINE_PER_DAY = 5.0;

    @Transactional
    public Transaction issueBook(String email, Long bookId) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Book book = bookRepository.findById(bookId).orElseThrow();

        if (book.getAvailableCopies() <= 0) {
            throw new RuntimeException("No copies available");
        }

        book.setAvailableCopies(book.getAvailableCopies() - 1);
        bookRepository.save(book);

        Transaction transaction = new Transaction();
        transaction.setUser(user);
        transaction.setBook(book);
        transaction.setIssueDate(LocalDate.now());
        
        return transactionRepository.save(transaction);
    }

    @Transactional
    public Transaction returnBook(String email, Long bookId) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Transaction transaction = transactionRepository.findByUserIdAndBookIdAndReturnDateIsNull(user.getId(), bookId)
                .orElseThrow(() -> new RuntimeException("No active transaction found"));

        transaction.setReturnDate(LocalDate.now());
        
        // Calculate Fine
        long daysBetween = ChronoUnit.DAYS.between(transaction.getIssueDate(), transaction.getReturnDate());
        if (daysBetween > DUE_DAYS) {
            transaction.setFine((daysBetween - DUE_DAYS) * FINE_PER_DAY);
        }

        // Increment copies
        Book book = transaction.getBook();
        book.setAvailableCopies(book.getAvailableCopies() + 1);
        bookRepository.save(book);

        return transactionRepository.save(transaction);
    }

    @Transactional(readOnly = true)
    public List<Transaction> getActiveTransactions(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        return transactionRepository.findByUserIdAndReturnDateIsNull(user.getId());
    }
}

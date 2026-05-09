package com.librario.service;

import com.librario.model.Book;
import com.librario.model.Transaction;
import com.librario.model.User;
import com.librario.repository.BookRepository;
import com.librario.repository.TransactionRepository;
import com.librario.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

@Service
public class TransactionService {

    // 14-day borrow limit, Rs.5 per day fine
    private static final int MAX_BORROW_DAYS = 14;
    private static final BigDecimal FINE_PER_DAY = new BigDecimal("5.00");

    private final TransactionRepository transactionRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    public TransactionService(TransactionRepository transactionRepository,
                               BookRepository bookRepository,
                               UserRepository userRepository) {
        this.transactionRepository = transactionRepository;
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
    }

    public Transaction issueBook(Long userId, Long bookId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        if (book.getAvailableCopies() < 1) {
            throw new RuntimeException("No copies available");
        }

        // Check if user already has this book
        Optional<Transaction> existing = transactionRepository
                .findByUserIdAndBookIdAndReturnDateIsNull(userId, bookId);
        if (existing.isPresent()) {
            throw new RuntimeException("You have already issued this book");
        }

        book.setAvailableCopies(book.getAvailableCopies() - 1);
        bookRepository.save(book);

        Transaction t = new Transaction();
        t.setUser(user);
        t.setBook(book);
        t.setIssueDate(LocalDate.now());

        return transactionRepository.save(t);
    }

    public Transaction returnBook(Long userId, Long bookId) {
        Transaction t = transactionRepository
                .findByUserIdAndBookIdAndReturnDateIsNull(userId, bookId)
                .orElseThrow(() -> new RuntimeException("No active transaction found for this book"));

        LocalDate today = LocalDate.now();
        t.setReturnDate(today);

        // Calculate fine
        long daysHeld = ChronoUnit.DAYS.between(t.getIssueDate(), today);
        if (daysHeld > MAX_BORROW_DAYS) {
            long overdueDays = daysHeld - MAX_BORROW_DAYS;
            t.setFine(FINE_PER_DAY.multiply(new BigDecimal(overdueDays)));
        }

        // Increase available copies
        Book book = t.getBook();
        book.setAvailableCopies(book.getAvailableCopies() + 1);
        bookRepository.save(book);

        return transactionRepository.save(t);
    }
}

package com.librario.repository;

import com.librario.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByUserId(Long userId);
    Optional<Transaction> findByUserIdAndBookIdAndReturnDateIsNull(Long userId, Long bookId);
    List<Transaction> findByReturnDateIsNull();
}

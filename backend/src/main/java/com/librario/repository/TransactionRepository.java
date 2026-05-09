package com.librario.repository;

import com.librario.model.Transaction;
import com.librario.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByUser(User user);
    List<Transaction> findByUserIdAndReturnDateIsNull(Long userId);
    Optional<Transaction> findByUserIdAndBookIdAndReturnDateIsNull(Long userId, Long bookId);
    void deleteByUserId(Long userId);
}

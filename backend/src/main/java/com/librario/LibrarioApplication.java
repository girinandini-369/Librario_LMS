package com.librario;

import com.librario.model.Book;
import com.librario.model.User;
import com.librario.repository.BookRepository;
import com.librario.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class LibrarioApplication {
    public static void main(String[] args) {
        SpringApplication.run(LibrarioApplication.class, args);
    }

    @Bean
    public CommandLineRunner initDatabase(
            UserRepository userRepository, 
            BookRepository bookRepository, 
            PasswordEncoder passwordEncoder) {
        return args -> {
            // Initialize Admin
            if (userRepository.findByEmail("admin@librario.com").isEmpty()) {
                User admin = new User();
                admin.setName("Librarian Admin");
                admin.setEmail("admin@librario.com");
                admin.setPassword(passwordEncoder.encode("password123"));
                admin.setRole(User.Role.ADMIN);
                userRepository.save(admin);
                System.out.println("[INIT] Created default Admin: admin@librario.com / password123");
            } else {
                userRepository.findByEmail("admin@librario.com").ifPresent(user -> {
                    if (user.getPassword() == null || user.getPassword().length() < 60) {
                        user.setPassword(passwordEncoder.encode("password123"));
                        userRepository.save(user);
                        System.out.println("[INIT] Fixed admin@librario.com password hash");
                    }
                });
            }

            // Initialize Member
            if (userRepository.findByEmail("john@member.com").isEmpty()) {
                User member = new User();
                member.setName("John Doe");
                member.setEmail("john@member.com");
                member.setPassword(passwordEncoder.encode("password123"));
                member.setRole(User.Role.MEMBER);
                userRepository.save(member);
                System.out.println("[INIT] Created default Member: john@member.com / password123");
            } else {
                userRepository.findByEmail("john@member.com").ifPresent(user -> {
                    if (user.getPassword() == null || user.getPassword().length() < 60) {
                        user.setPassword(passwordEncoder.encode("password123"));
                        userRepository.save(user);
                        System.out.println("[INIT] Fixed john@member.com password hash");
                    }
                });
            }

            // Initialize default Books if empty
            if (bookRepository.count() == 0) {
                bookRepository.save(new Book(null, "The Great Gatsby", "F. Scott Fitzgerald", 5));
                bookRepository.save(new Book(null, "1984", "George Orwell", 3));
                bookRepository.save(new Book(null, "To Kill a Mockingbird", "Harper Lee", 2));
                System.out.println("[INIT] Populated default books library");
            }
        };
    }
}



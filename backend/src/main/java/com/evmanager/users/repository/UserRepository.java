package com.evmanager.users.repository;

import com.evmanager.users.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Optional<User> findByUsernameOrEmail(String username, String email);
    @org.springframework.data.jpa.repository.Query("SELECT u FROM User u WHERE u.role.roleName = :roleName")
    org.springframework.data.domain.Page<User> findByRoleName(@org.springframework.data.repository.query.Param("roleName") String roleName, org.springframework.data.domain.Pageable pageable);
}

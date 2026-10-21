package com.notestack.security;

import com.notestack.entity.User;
import com.notestack.entity.UserStatus;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

public class UserPrincipal implements UserDetails {

    private final Long id;
    private final String name;
    private final String email;
    private final String password;
    private final String college;
    private final String department;
    private final Integer year;
    private final UserStatus status;
    private final Collection<? extends GrantedAuthority> authorities;

    public UserPrincipal(Long id, String name, String email, String password, String college,
                         String department, Integer year, UserStatus status,
                         Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.college = college;
        this.department = department;
        this.year = year;
        this.status = status;
        this.authorities = authorities;
    }

    public static UserPrincipal create(User user) {
        String roleName = user.getRole() != null ? user.getRole().name() : "STUDENT";
        if (roleName.startsWith("ROLE_")) {
            roleName = roleName.substring(5);
        }
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + roleName);
        return new UserPrincipal(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPassword(),
                user.getCollege(),
                user.getDepartment(),
                user.getYear(),
                user.getStatus(),
                Collections.singletonList(authority)
        );
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getCollege() { return college; }
    public String getDepartment() { return department; }
    public Integer getYear() { return year; }

    @Override
    public String getUsername() { return email; }

    @Override
    public String getPassword() { return password; }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() { return authorities; }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return status != UserStatus.BANNED; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return status == UserStatus.ACTIVE; }
}

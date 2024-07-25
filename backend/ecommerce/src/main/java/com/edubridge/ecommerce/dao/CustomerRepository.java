package com.edubridge.ecommerce.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.edubridge.ecommerce.entity.Customer;


@RepositoryRestResource
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Customer findByEmailAndPassword(String theEmail, String thePassword);
    Customer findByEmail(String theEmail);
}
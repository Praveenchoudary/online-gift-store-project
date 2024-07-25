package com.edubridge.ecommerce.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.edubridge.ecommerce.dao.CustomerRepository;
import com.edubridge.ecommerce.entity.Customer;

@Service
public class CustomerService {
	@Autowired
    private CustomerRepository customerRepository;
	
	public Customer login(String email, String password) {
		return customerRepository.findByEmailAndPassword(email, password);
	}
	
	public Customer findCustomerByEmail(String email) {
		return customerRepository.findByEmail(email);
	}
}
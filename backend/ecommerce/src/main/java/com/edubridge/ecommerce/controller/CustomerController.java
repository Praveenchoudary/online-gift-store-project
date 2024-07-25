package com.edubridge.ecommerce.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.edubridge.ecommerce.dto.CustomerResponse;
import com.edubridge.ecommerce.entity.Customer;
import com.edubridge.ecommerce.service.CustomerService;

@CrossOrigin("http://localhost:4200")
@RestController
@RequestMapping("/api/customers")
public class CustomerController {
	
	@Autowired
	private CustomerService customerService;
	
	@PostMapping("/login")
	public CustomerResponse login(@RequestBody Customer customer) {
		 Customer c = customerService.login(customer.getEmail(), customer.getPassword());
		 
		 CustomerResponse cr = null;
		 
		 if(c != null) {
			 cr = new CustomerResponse();
			 cr.setFirstName(c.getFirstName());
			 cr.setLastName(c.getLastName());
			 cr.setEmail(c.getEmail());
			 cr.setMobile(c.getMobile());
		 }
		 
		 return cr;
	}
	
	@GetMapping("/search/{email}")
	public Customer customerDetails(@PathVariable String email) {
		return customerService.findCustomerByEmail(email);
	}
}
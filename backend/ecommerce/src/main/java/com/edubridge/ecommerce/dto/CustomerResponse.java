package com.edubridge.ecommerce.dto;

import lombok.Data;

@Data
public class CustomerResponse {
	String firstName;
	String lastName;
	String email;
	Long mobile;
}

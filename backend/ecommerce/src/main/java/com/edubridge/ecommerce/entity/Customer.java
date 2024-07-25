package com.edubridge.ecommerce.entity;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "customer")
public class Customer {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long id;

	@Column(name = "first_name")
	private String firstName;

	@Column(name = "last_name")
	private String lastName;

	@Column(name = "email")
	private String email;

	@Column(name = "password")
	private String password;

	@Column(name = "mobile")
	private Long mobile;

	@OneToMany(mappedBy = "customer", cascade = CascadeType.ALL)
	private Set<Order> orders = new HashSet<>();

	public void add(Order order) {

		if (order != null) {

			if (orders == null) {
				orders = new HashSet<>();
			}

			orders.add(order);
			order.setCustomer(this);
		}
	}

}
package com.HenoTrade.ventaHeno.service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.persistence.autoconfigure.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = "com.HenoTrade.ventaHeno")
@EntityScan(basePackages = "com.HenoTrade.ventaHeno.Entity")
@EnableJpaRepositories(basePackages = "com.HenoTrade.ventaHeno.Repository")

public class VentaHenoApplication {

	public static void main(String[] args) {
		SpringApplication.run(VentaHenoApplication.class, args);
	}
	//prueba

}

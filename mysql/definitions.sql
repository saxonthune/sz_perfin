DROP TABLE IF EXISTS `snapshot`;
DROP TABLE IF EXISTS `tran`;
DROP TABLE IF EXISTS `acct`;
DROP TABLE IF EXISTS `atype`;
DROP TABLE IF EXISTS `tcat`;

	
CREATE TABLE `atype` (
	`atype_id` int AUTO_INCREMENT,
	`name` VARCHAR(255) NOT NULL,
	PRIMARY KEY (atype_id)
) ENGINE=InnoDB;

CREATE TABLE `acct` (
	`acct_id` int AUTO_INCREMENT,
	`atype_id` int,
	`name` VARCHAR(255) UNIQUE NOT NULL,
	`open_date` date,
	`dscr` TEXT,
	`bal` dec(11,2) DEFAULT 0,
	`closed` BOOL DEFAULT 0,
	`credit` BOOL DEFAULT 0,
	FOREIGN KEY (atype_id) REFERENCES `atype` (atype_id)
		ON DELETE RESTRICT ON UPDATE CASCADE, 
	PRIMARY KEY (acct_id)
) ENGINE=InnoDB;

CREATE TABLE `tcat` (
	`tcat_id` int AUTO_INCREMENT,
	`name` VARCHAR(30),
	PRIMARY KEY (tcat_id)
) ENGINE=InnoDB;


CREATE TABLE `tran` (
	tran_id int AUTO_INCREMENT,
	acct_id int,
	tcat_id int,
	`tran_date` date NOT NULL,
	`amt` dec(11,2) DEFAULT 0,
	`memo` VARCHAR(255),
	FOREIGN KEY (acct_id) REFERENCES `acct` (acct_id)
		ON DELETE RESTRICT ON UPDATE CASCADE,
	FOREIGN KEY (tcat_id) REFERENCES `tcat` (tcat_id)
		ON DELETE RESTRICT ON UPDATE CASCADE,
	PRIMARY KEY (tran_id)
) ENGINE=InnoDB;
	
CREATE TABLE `snapshot` (
	`snapshot_id` int AUTO_INCREMENT,
	`acct_id` int,
	`snapshot_date` date NOT NULL,
	`bal_calc` dec(11,2) NOT NULL,
	`bal_input` dec(11,2) NOT NULL,
	FOREIGN KEY (acct_id) REFERENCES `acct` (acct_id)
		ON DELETE RESTRICT ON UPDATE CASCADE,
	PRIMARY KEY (snapshot_id)
) ENGINE=InnoDB;

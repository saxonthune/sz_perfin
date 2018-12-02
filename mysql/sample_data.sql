--- Sample data for database  ---
INSERT INTO acct (name, open_date, dscr, bal, credit, atype_id) VALUES 
	('Wells Fargo', '2014-05-04', "Main checking account", 4534.00, 0, 1),
	('Chase Reserve', '2016-01-02', "3x travel points", 3124.00, 1, 4),
	('Charles Schwab ETF', '2010-02-02', "Blue chip", 12554.34, 0, 3);

INSERT INTO tran (acct_id, tcat_id, tran_date, amt, memo) VALUES
	(2, 1, '2018-01-01', 23.40, "Groceries"),
	(1, 5, '2018-03-28', 42.00, "Electricity"),
	(3, 6, '2018-11-11', 162.00, "Snapshot adjustment");
	
INSERT INTO snapshot (acct_id, snapshot_date, bal_new, bal_old, bal_dif) VALUES
	(3, '2018-11-11', 200.00, 38.00, 162.00);

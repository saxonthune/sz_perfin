var acct = {
	dispAll : "SELECT a.acct_id AS `ID`, a.name AS `Name`, t.name AS `Type`, a.bal AS `Balance` FROM acct a JOIN atype t ON a.atype_id = t.atype_id ORDER BY Name",
	getSingle : "SELECT * FROM acct WHERE acct_id = ?",
	insRow : "INSERT INTO acct (atype_id, name, open_date, dscr, bal, credit) VALUES (?,?,?,?,?,?)",
	delRow : "DELETE * FROM acct a WHERE a.acct_id = ?",
};
var acct_details = {
	acct: "SELECT * FROM acct WHERE acct_id = ?",
	dispAll : "SELECT t.tran_id AS `ID`, t.tran_date AS `Date`, c.name AS `Category`, t.amt AS `Amount`, t.memo AS `Memo` " +
				"FROM tran t JOIN tcat c ON t.tcat_id = c.tcat_id " +
				"WHERE t.acct_id = ? ORDER BY `Date` DESC"
};
var tran = {
	dispAll : "SELECT t.tran_id AS `ID`, a.name AS `Account`, c.name AS `Category`, t.amt AS `Amount`, t.memo AS `Memo` FROM tran t JOIN acct a ON t.acct_id = a.acct_id JOIN tcat c ON t.tcat_id = c.tcat_id ORDER BY `ID`",
	insRow : "INSERT INTO tran (acct_id, tcat_id, tran_date, amt, memo) VALUES (?,?,?,?,?)",
	delRow : "DELETE FROM tran WHERE tran_id = ?"
}; 
var tcat = {
	dispAll : "SELECT tcat_id AS `ID`, name AS `Name` FROM tcat",  
	insRow : "INSERT INTO tcat (name) VALUES (?)",
	delRow : "DELETE FROM tcat WHERE tcat_id = ?",
	updateRow : "UPDATE tcat SET name = ? WHERE tcat_id = ?"
};

module.exports.tran = tran;
module.exports.acct = acct;
module.exports.acct_details = acct_details;
module.exports.tcat = tcat;


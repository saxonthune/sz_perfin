## About

sz\_perfin \([saxon.zone](http://saxon.zone) **per**sonal **fin**ance server\) is a web-based personal finance management system using nodeJS and MySQL.  This project was created as a lightweight, open-source alternative to software such as Mint and You Need a Budget.   

## Installation

Installation is fairly straightfoward.
- First, create a MySQL database and user matching the specification in `/nodeserver/dbinfo.js` \(the default database name and user can be changed, and the default password should be changed\).  Then, run the queries in `/mysql/definitions.sql` to create the tables. Optionally, use `/mysql/sample_data.sql` to create sample accounts, transactions, and category names.  
- Second, run `npm install` in `/nodeserver` to install the necessary packages.  
- Finally, use `node /nodeserver/sz_perfin.js [port]` to start the server; the default port is `13325`.

That's It! The server can be accessed via `http://localhost:port`.
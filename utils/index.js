import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

// const connection = await mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   database: "axara2",
//   password:'',
//   port:'3306'
// });

const connection = await mysql.createConnection({
  host: "68.178.163.247",
  user: "devusr_wowfyuser",
  database: "devusr_doutya_website",
  password:'###Wowfy123',
  port:'3306',
});

export const db = drizzle(connection);

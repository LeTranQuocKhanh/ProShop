import bcrypt from "bcryptjs";

const users = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: true,
  },
  {
    name: "Khanh Pon",
    email: "namkhanh@example.com",
    password: bcrypt.hashSync("123456", 10),
  },
  {
    name: "Nguyen Thu",
    email: "nguyenthu@example.com",
    password: bcrypt.hashSync("123456", 10),
  },
];

export default users;

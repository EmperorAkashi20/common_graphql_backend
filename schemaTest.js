import { User } from "./db/models";

export async function createUserTest() {
  const user = await User.create({
    name: "Sahil Khan",
    email: "meesahil7@gmail.com",
    password: "password",
    phoneNumber: 1234567890,
    gender: "male",
    dateOfBirth: "01-01-1998",
    timeOfBirth: 1697606592077,
  });

  console.log(user);
}

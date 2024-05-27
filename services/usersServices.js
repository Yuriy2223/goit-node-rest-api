import User from "../models/user.js";

export async function registerUser(email) {
  return User.findOne({ email });
}

export async function createUser(email, passwordHash) {
  return User.create({ email, password: passwordHash });
}

export async function tokenUser(id, token) {
  return User.findByIdAndUpdate({ _id: id }, token, {
    new: true,
  });
}

export async function findUser(_id) {
  return User.findById({ _id });
}

export async function subscriptionUser(id, body) {
  return User.findByIdAndUpdate({ _id: id }, body, {
    new: true,
  });
}

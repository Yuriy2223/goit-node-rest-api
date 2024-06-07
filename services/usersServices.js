import User from "../models/user.js";

export async function registerUser(email) {
  return User.findOne({ email });
}

export async function createUser(
  email,
  passwordHash,
  avatarURL,
  verificationToken
) {
  return User.create({
    email,
    password: passwordHash,
    avatarURL,
    verificationToken,
  });
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

export async function updateAvatar(id, avatarURL) {
  return User.findByIdAndUpdate({ _id: id }, { avatarURL }, { new: true });
}

export async function findUserByToken(verificationToken) {
  return User.findOne({ verificationToken });
}

export async function setVerificationToken(Id, verificationToken) {
  return User.findByIdAndUpdate(Id, { verificationToken });
}

import fs from 'fs';
import path from 'path';

const __dirname = path.resolve();

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/users.json`)
);

export function getUsers(_, res) {
  res
    .status(200)
    .json({ status: 'success', message: 'Users found', data: users });
}

export function addUser(req, res) {
  const id = users[users.length - 1]._id + 1;
  const newUser = Object.assign({ _id: id }, req.body);
  users.push(newUser);
  fs.writeFileSync(
    `${__dirname}/dev-data/data/users.json`,
    JSON.stringify(users)
  );
  res
    .status(201)
    .json({ status: 'success', message: 'User added', data: newUser });
}

export function getUser(req, res) {
  const { id } = req.params;
  const user = users.find((user) => user._id === id);
  if (!user) {
    res.status(404).json({ status: 'fail', message: 'User not found' });
  } else {
    res
      .status(200)
      .json({ status: 'success', message: 'User found', data: { user } });
  }
}

export function updateUser(req, res) {
  const { id } = req.params;
  const user = users.find((user) => user.id === id);
  if (!user) {
    res.status(404).json({ status: 'fail', message: 'User not found' });
  } else {
    res.status(200).json({
      status: 'success',
      message: 'User updated',
      data: { user: req.user },
    });
  }
}

export function deleteUser(req, res) {
  const { id } = req.params;
  const user = users.find((user) => user.id === id);
  if (!user) {
    res.status(404).json({ status: 'fail', message: 'User not found' });
  } else {
    res.status(200).json({
      status: 'success',
      message: 'User deleted',
      data: { user: req.user },
    });
  }
}

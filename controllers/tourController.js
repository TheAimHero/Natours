import fs from 'fs';
import path from 'path';

const __dirname = path.resolve();

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8')
);

export function getTours(_, res) {
  res
    .status(200)
    .json({ status: 'success', results: tours.length, data: { tours } });
}

export function addTour(req, res) {
  const _id = tours[tours.length - 1]._id + 1;
  const newTour = Object.assign({ _id }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours.json`,
    JSON.stringify(tours),
    (err) => {
      if (err) throw err;
      res.status(201).json({ status: 'success', data: { tour: newTour } });
    }
  );
}

export function patchTour(_, res) {
  res
    .status(200)
    .json({ status: 'success', message: 'Patched tour', data: {} });
}

export function deleteTour(_, res) {
  res
    .status(200)
    .json({ status: 'success', message: 'Deleted tour', data: null });
}

export function getTour(req, res) {
  const id = req.params.id * 1;
  const tour = tours[id];
  res.status(200).json({ status: 'success', data: { tour } });
}

export function checkId(req, res, next, val) {
  if (val > tours.length - 1 || val < 0) {
    return res.status(400).json({ status: 'fail', message: 'Invalid id' });
  }
  next();
}

export function checkBody(req, res, next) {
  const checkArr = ['name', 'price'];
  checkArr.forEach((param) => {
    if (!req.body[param]) {
      return res
        .status(400)
        .json({ status: 'fail', message: `Missing ${param}. Bad request` });
    }
  });

  next();
}

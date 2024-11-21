import { Router } from 'express';
import { customers } from '../fake-db/customer.data';
import { Customers } from '../models';

const router = Router();

// helpfunctions --------
router.get('/fillCustomers', async (req, res) => {
  try {
    await Customers.insertMany(customers);
    res.status(200).send({ message: 'Datenbank erfolgreich befüllt' });
  } catch (error) {
    console.error('Fehler beim Befüllen der Datenbank:', error);
    res.status(500).send({ message: 'Fehler beim Befüllen der Datenbank', error });
  }
});

router.get('/fillUsers', async (req, res) => {
  try {
    await Customers.insertMany(customers);
    res.status(200).send({ message: 'Datenbank erfolgreich befüllt' });
  } catch (error) {
    console.error('Fehler beim Befüllen der Datenbank:', error);
    res.status(500).send({ message: 'Fehler beim Befüllen der Datenbank', error });
  }
});
// helpfunctions ----------

// Route: GET /api/customers
router.get('/customers', async (req, res) => {
  let filter = (req.query.filter as string) || '';
  const pageSize = Number(req.query.pageSize) || 5;
  const pageIndex = Number(req.query.pageIndex) || 0;
  const sortField = (req.query.sortField as string) || '_id';
  const sortDirection = (req.query.sortDirection as 'asc' | 'desc') || 'desc';
  const filterArr = splitFilter(filter);
  const $and = filterArr.map((word) => ({
    $or: [
      { firstName: { $regex: word, $options: 'i' } },
      { lastName: { $regex: word, $options: 'i' } },
      { email: { $regex: word, $options: 'i' } },
      { street: { $regex: word, $options: 'i' } }
    ]
  }));

  try {
    // Baue die Query auf
    const filteredCustomers = await Customers.find({ $and })
      .limit(pageSize)
      .skip(pageSize * pageIndex)
      .sort({ [sortField]: sortDirection });

    const totalLength = await Customers.countDocuments({ $and });
    res.send({ customers: filteredCustomers, totalLength });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Error while customer fetching' });
    return;
  }
});

function splitFilter(filterValue: string) {
  return filterValue.split(' ');
}

// Route: GET /api/customers/:id
router.get('/customers/:id', async (req, res) => {
  let customer = await Customers.findById(req.params.id);
  if (customer) {
    res.send(customer);
    return;
  }
  res.status(404).send({ error: 'Error customer not found' });
});

// Route: POST /api/customers
router.post('/customers', async (req, res) => {
  const customer = new Customers(req.body);
  try {
    const newCustomer = await customer.save();
    res.send({ status: 'OK', profilPicSrc: newCustomer.profilPicSrc, _id: newCustomer._id });
    return;
  } catch (error) {
    console.log(error);
    res.send({ status: 'Error' });
    return;
  }
});

// Route: DELETE /api/customers/:id
router.delete('/customers/:id', async (req, res) => {
  const customerId = req.params.id;
  try {
    await Customers.findOneAndDelete({ _id: `${customerId}` });
    res.send({ status: 'OK' });
    return;
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.send({ status: 'Error' });
    return;
  }
});

// Route: PUT /api/customers
router.put('/customers', async (req, res) => {
  const editedCustomer = req.body;
  try {
    await Customers.findOneAndUpdate({ _id: `${editedCustomer._id}` }, editedCustomer);
    res.send({ status: 'OK' });
    return;
  } catch (error) {
    console.error('Error updating customer:', error);
    res.send({ status: 'Error' });
    return;
  }
});

// Route: Post /api/login
// router.post('/login', async (req, res) => {
//   const userLogin = new Customers(req.body);
//   try {
//     const user = await Customers.findOne({ email: userLogin.email, password: userLogin.password });
//     res.send(user);
//   } catch (error) {
//     console.log('Not Worked In');

//     console.log(error);
//     res.send({ status: 'Error' });
//   }
// });

// Exportieren des Routers
export default router;

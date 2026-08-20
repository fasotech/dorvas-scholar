
import mongoose from 'mongoose';
const uri = 'mongodb+srv://adielasam2015_db_user:gR8eKPBq60EWSpwV@cluster0.5gwwyyh.mongodb.net/';
async function run() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
    const db = mongoose.connection.db;
    const users = db.collection('users');
    const user = await users.findOne({ email: 'adielasam2015@gmail.com' });
    if (user) {
      console.log('User found:', user);
    } else {
      console.log('User not found. Inserting...');
      await users.insertOne({
        email: 'adielasam2015@gmail.com',
        displayName: 'Adiela Sam',
        role: 'admin',
        profileType: 'Administrator',
        isActive: true
      });
      console.log('Admin user inserted successfully.');
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
  }
}
run();

